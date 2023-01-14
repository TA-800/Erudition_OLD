from rest_framework import serializers
from .models import *
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    # Add a field to the serializer that is not in the model
    # This field calculates the number of days left until the assignment is due
    course_code = serializers.SerializerMethodField()
    days_left = serializers.SerializerMethodField()
    

    class Meta:
        model = Assignment
        fields = '__all__'

    def get_course_code(self, obj):
        return obj.assignment_course.course_code

    def get_days_left(self, obj):
        today = datetime.now(timezone.utc)
        due_date = obj.assignment_due_date
        days_left = (due_date - today).days
        return days_left

class DiscussionSerializer(serializers.ModelSerializer):
    # Add a field to the serializer that is not in the model
    comment_count = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    courses = serializers.SerializerMethodField()

    class Meta:
        model = Discussion
        fields = '__all__'

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_author_name(self, obj):
        return obj.discussion_author.username
    
    def get_courses(self, obj):
        return obj.discussion_courses.all().values_list('course_code', flat=True)

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

        
