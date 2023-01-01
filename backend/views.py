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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def courseList(request):

    courses = Course.objects.filter(course_user=
        User.objects.get(username=request.user)
    )
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def moduleList(request, course_code):
    if request.method == 'GET':
        modules = Module.objects.filter(
            module_user=User.objects.get(username=request.user),
            module_course=Course.objects.get(id=course_code)
        )
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
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


@api_view(['GET'])
def assignmentList(request):
    assignments = Assignment.objects.all()
    serializer = AssignmentSerializer(assignments, many=True)
    return Response(serializer.data)