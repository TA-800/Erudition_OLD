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

import json

# Create your views here.
@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'course-list': 'courses/',
        'module-list': 'modules/',
    }
    return Response(api_urls)

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

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def courseList(request):

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
            print(e.args[0])
            return Response({"detail": f"{e.args[0]}"}, status=400)

@api_view(['GET', 'PUT', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def moduleList(request, course_code):
    # GET MODULES
    if request.method == 'GET':
        modules = Module.objects.filter(
            module_user=User.objects.get(username=request.user),
            module_course=Course.objects.get(id=course_code)
        )
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)
    # UPDATE MODULE
    elif request.method == 'PUT':
        try:
            delta = request.data["delta"]
            text = request.data["text"]
            # The module to update
            module = Module.objects.get(id=course_code)
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
                module_course=Course.objects.get(id=course_code),
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
            module = Module.objects.get(id=course_code)
            module.delete()
            return Response({"detail": "Module deleted"}, status=200)
        except Exception as e:
            return Response({"detail": f"{e.args[0]}"}, status=400)



@api_view(['GET'])
def assignmentList(request):
    assignments = Assignment.objects.all()
    serializer = AssignmentSerializer(assignments, many=True)
    return Response(serializer.data)