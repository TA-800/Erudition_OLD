from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

from .models import *
from .serializers import *

from dateutil.relativedelta import relativedelta
import json
import pytz
from django.http import QueryDict


# Create your views here.
@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'course-list': 'courses/',
        'module-list': 'modules/',
    }
    return Response(api_urls)

@api_view(['GET', 'PUT', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def userProfile(request, id):
    try:
        if request.method == "GET":
            # Get the user profile
            user = User.objects.get(id=id)
            # Serialize the data
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=200)
        elif request.method == "POST":
            # # Get the user
            user = User.objects.get(id=id)
            # # # Get the data from the request
            data = request.POST
            avatar = request.FILES.get('avatar')
            # # # Update the user
            user.first_name = data['first'] or user.first_name
            user.last_name = data['last'] or user.last_name
            
            user.avatar = avatar or user.avatar
            user.field = data['field'] or user.field
            user.year = data['year']
            user.save()
            # Update university of the user
            # If data['university'] is an array, then the user is enrolled in already existing universities,
            # otherwise, the user is enrolled in a new university, which should be created

            # Remove the user from all universities
            universities = University.objects.filter(university_user=user)
            for university in universities:
                university.university_user.remove(user)
            try:
                u = json.loads(data["unis"])
                # Add the user to the existing universities
                for university in u:
                    university = University.objects.get(id=university['id'])
                    university.university_user.add(user)
            except:
                u = data["unis"]
                # Add the new university
                new_university = University(university_name=u)
                new_university.save()
                # Add the user to the new university
                new_university.university_user.add(user)
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=200)
    except Exception as e:
        return Response({"detail": f"{e.args[0]}"}, status=400)

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def university(request):
    if request.method == "GET":
        try:
            # Get a list of all universities that the user is enrolled in
            universities = University.objects.filter(university_user=request.user)
            # Serialize the data
            serializer = UniversitySerializer(universities, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def allUniversities(request):
    if request.method == "GET":
        try:
            # Get a list of all universities
            universities = University.objects.all()
            # Serialize the data
            serializer = UniversitySerializer(universities, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)

@api_view(['POST'])
def register(request):
    data = json.loads(request.body)
    try:
        user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
        )
        user.save()
        return Response({"detail": "User created"}, status=201)
    except Exception as e:
        return Response({"detail": f"{e.args[0]}"})

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def courseList(request, course_id):

    # GET COURSES
    if request.method == 'GET':
        courses = Course.objects.filter(course_user=
            User.objects.get(username=request.user)
        )
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
    # CREATE COURSE
    elif request.method == 'POST':
        try:
            # Throw an error if course code is empty
            if request.data["course_code"] == "":
                raise Exception("Course code cannot be empty")
            course = Course(
                course_code=request.data["course_code"],
                course_name=request.data["course_name"],
                course_description=request.data["course_description"],
                course_instructor=request.data["course_instructor"],
                course_instructor_contact=request.data["course_instructor_contact"],
                course_instructor_office_hours=request.data["course_instructor_office_hours"],
            )
            course.save()
            course.course_user.add(User.objects.get(username=request.user))
            serializer = CourseSerializer(course, many=False)
            return Response(serializer.data, status=201)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)
    # DELETE COURSE
    elif request.method == "DELETE":
        try:
            # Get id of course to delete, then remove the user from the course's many to many field
            course = Course.objects.get(id=course_id)
            course.course_user.remove(User.objects.get(username=request.user))
            # If the user is the last user in the course, delete the course
            if course.course_user.count() == 0:
                course.delete()
            return Response({"detail": "Course deleted"}, status=200)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)


@api_view(['GET', 'PUT', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def moduleList(request, course_id):
    # GET MODULES
    if request.method == 'GET':
        modules = Module.objects.filter(
            module_user=User.objects.get(username=request.user),
            module_course=Course.objects.get(id=course_id)
        )
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)
    # UPDATE MODULE
    elif request.method == 'PUT':
        try:
            delta = request.data["delta"]
            text = request.data["text"]
            # The module to update
            module = Module.objects.get(id=course_id)
            # Update the module
            module.module_notesDelta=delta
            module.module_notes=text
            module.save()
            # Return updated module
            serializer = ModuleSerializer(module, many=False)
            return Response(serializer.data)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"})
    # CREATE MODULE
    elif request.method == "POST":
        try:
            module = Module(
                module_user=User.objects.get(username=request.user),
                module_course=Course.objects.get(id=course_id),
                module_name=request.data["title"],
                module_notesDelta=request.data["delta"],
                module_notes=request.data["text"]
            )
            print(module.module_notesDelta)
            module.save()
            serializer = ModuleSerializer(module, many=False)
            return Response(serializer.data, status=201)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)
    # DELETE MODULE
    elif request.method == "DELETE":
        # course code in this case is the module id to delete
        try:
            module = Module.objects.get(id=course_id)
            module.delete()
            return Response({"detail": "Module deleted"}, status=200)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)


@api_view(['GET', "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def assignmentList(request, course_id):
    # GET ASSIGNMENTS
    if request.method == "GET":
        try:
            assignments = Assignment.objects.filter(assignment_user=User.objects.get(username=request.user))
            # Retrieve all assignments if course_id is 0
            if (course_id != 0):
                assignments = assignments.filter(assignment_course=Course.objects.get(id=course_id))
            assignments.order_by("-assignment_due_date")
            serializer = AssignmentSerializer(assignments, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)
    # CREATE ASSIGNMENT
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            if data["auto_amount"] == 0:
                assignment = Assignment(
                    assignment_course=Course.objects.get(id=course_id),
                    assignment_user=User.objects.get(username=request.user),
                    assignment_name=data["name"],
                    assignment_description=data["desc"],
                    assignment_due_date=pytz.utc.localize(datetime.strptime(data["due_date"], "%a, %d %b %Y %H:%M:%S %Z")),
                )
                assignment.save()
                serializer = AssignmentSerializer(assignment, many=False)
                return Response(serializer.data, status=201)
            else:
                assignments = []
                for i in range(int(data["auto_amount"])):
                    # freq = 1 -> daily, freq = 2 -> weekly, freq = 3 -> monthly
                    increment_timeObject = relativedelta(days=i) if data["auto_freq"] == "1" else relativedelta(weeks=i) if data["auto_freq"] == "2" else relativedelta(months=i)
                    assignment = Assignment(
                        assignment_course=Course.objects.get(id=course_id),
                        assignment_user=User.objects.get(username=request.user),
                        assignment_name=f"{data['name']} {i+1}",
                        assignment_description=data["desc"],
                        assignment_due_date=pytz.utc.localize(datetime.strptime(data["due_date"], "%a, %d %b %Y %H:%M:%S %Z") + increment_timeObject),
                    )
                    assignment.save()
                    assignments.append(assignment)
                serializer = AssignmentSerializer(assignments, many=True)
                return Response(serializer.data, status=201)

        except Exception as e:
            print(e.args[0])
            return Response({"detail": f"{e.args[0]}"}, status=400)
    # UPDATE ASSIGNMENT
    elif request.method == "PUT":
        try:
            assignments = []
            # Go through the array of assignment ids to delete
            data = json.loads(request.body)
            for id in data["assignments"]:
                assignment = Assignment.objects.get(id=id)
                assignment.assignment_completed = (not assignment.assignment_completed)
                assignment.save()
                assignments.append(assignment)
            serializer = AssignmentSerializer(assignments, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)
    # DELETE ASSIGNMENT
    elif request.method == "DELETE":
        try:
            data = json.loads(request.body)
            # Go through the array of assignment ids to delete
            for id in data["assignments"]:
                assignment = Assignment.objects.get(id=id)
                assignment.delete()
            return Response({"detail": "Assignments deleted"}, status=200)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)

# DISCUSSIONS

@api_view(["GET", "POST", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def discussions(request, id):
    # GET DISCUSSIONS FROM THE SAME UNIVERSITY
    try:
        if request.method == "GET":
            if id == 0:
                # Get all of the discussions from the same university as the user
                discussions = Discussion.objects.filter(
                    discussion_university__in=University.objects.filter(
                        university_user=User.objects.get(username=request.user)
                    )
                )
                serializer = DiscussionSerializer(discussions, many=True)
                return Response(serializer.data, status=200)
            else:
                discussion = Discussion.objects.get(id=id)
                comments = Comment.objects.filter(comment_discussion=discussion)
                # Create a object to be serialized that contains the discussion and the comments
                thread = {
                    "discussion": DiscussionSerializer(discussion, many=False).data,
                    "comments": CommentSerializer(comments, many=True).data
                }
                return Response(thread, status=200)
        # UPDATE DISCUSSION (comments only)
        elif request.method == "PUT":
            data = json.loads(request.body)
            discussion = Discussion.objects.get(id=id)
            user = User.objects.get(username=request.user)
            comment = Comment(
                comment_discussion=discussion,
                comment_author=user,
                comment_text=data["content"]
            )
            comment.save()
            # Add the user to the discussion's list of users
            discussion.discussion_users.add(user)
            serializer = CommentSerializer(comment, many=False)
            return Response(serializer.data, status=201)
        # LIKE DISCUSSION
        elif request.method == "PATCH":
            discussion = Discussion.objects.get(id=id)
            user = User.objects.get(username=request.user)
            # If the user is already in the discussion's list of users, remove them
            if user in discussion.discussion_liked_users.all():
                discussion.discussion_liked_users.remove(user)
            # Otherwise, add them
            else:
                discussion.discussion_liked_users.add(user)
            discussion.save()
            serializer = DiscussionSerializer(discussion, many=False)
            return Response(serializer.data, status=200)
        # CREATE DISCUSSION
        elif request.method == "POST":
            data = json.loads(request.body)
            # In this case, the id is the university id to which the discussion belongs
            discussion = Discussion(
                discussion_university=University.objects.get(id=id),
                discussion_author=User.objects.get(username=request.user),
                discussion_title=data["title"],
                discussion_desc=data["desc"]
            )
            discussion.save()
            for course_id in data["courses"]:
                discussion.discussion_courses.add(Course.objects.get(id=course_id))
            serializer = DiscussionSerializer(discussion, many=False)
            return Response(serializer.data, status=201)
        # DELETE DISCUSSION
        elif request.method == "DELETE":
            discussion = Discussion.objects.get(id=id)
            discussion.delete()
            return Response({"detail": "Discussion deleted"}, status=200)
    except Exception as e:
        return Response({"detail": f"{e.args[0]}"}, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def comments(request, id):
    try:
        if request.method == "DELETE":
            comment = Comment.objects.get(id=id)
            comment.delete()
            return Response({"detail": "Comment deleted"}, status=200)
    except Exception as e:
        return Response({"detail": f"{e.args[0]}"}, status=400)