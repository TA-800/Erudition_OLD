from django.contrib.auth.models import AbstractUser
from django.db import models

from django.utils import timezone

# Create your models here.
class User(AbstractUser):
    #username, first_name, last_name ...
    # avatar = models.ImageField(upload_to='avatars', blank=True)
    is_public = models.BooleanField(default=True)


# blank = True -> optional, blank = False -> required.

class University(models.Model):
    # User can be in multiple universities (double degree, etc.)
    university_user = models.ManyToManyField(User, blank=True, related_name="universities")
    university_name = models.CharField(max_length=82, blank=False)

    def __str__(self):
        return f"{self.university_name}"

class Course(models.Model):
    # A course can only belong to one university. Courses with same name can exist in different universities.
    course_university = models.ForeignKey(University, default=1, null=False, on_delete=models.CASCADE, related_name="courses")
    course_user = models.ManyToManyField(User, blank=True, related_name="courses")
    course_code = models.CharField(max_length=8, unique=True) # COMP101
    course_name = models.CharField(max_length=64, blank=False) # Data Structures in Python
    course_description = models.TextField(blank=True)
    course_instructor = models.CharField(max_length=64, blank=True) # "Dr. John Smith"
    course_instructor_contact = models.CharField(max_length=100, blank=True) # "johnsmith@gmail.com"
    course_instructor_office_hours = models.CharField(max_length=100, blank=True) # "Monday 10:00-11:00"

    def __str__(self):
        return f"{self.course_code}: {self.course_name}"

class Module(models.Model):
    module_course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules") # COMP101
    module_user = models.ForeignKey(User, on_delete=models.CASCADE) # "ta800"
    module_name = models.CharField(max_length=64) # Introduction to Data Structures
    module_notes = models.TextField(blank=True)
    module_notesDelta = models.TextField(blank=True)

    def __str__(self):
        return f"{self.module_course.course_code}: {self.module_name}"
    

class Assignment(models.Model):
    assignment_course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="assignments") # COMP101
    assignment_user = models.ForeignKey(User, on_delete=models.CASCADE) # "ta800"
    assignment_name = models.CharField(max_length=64, blank=False) # "Assignment 1"
    assignment_description = models.TextField(blank=True)
    assignment_due_date = models.DateTimeField(blank=False) # "2021-09-30 23:59:59"
    assignment_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.assignment_course}: {self.assignment_name}"

class Discussion(models.Model):
    # A discussion can only belong to one university. Discussions with same name can exist in different universities.
    # A discussion can span multiple courses.
    discussion_university = models.ForeignKey(University, blank=False, on_delete=models.CASCADE, related_name="university_discussions")
    discussion_courses = models.ManyToManyField(Course, blank=True, related_name="course_discussions")
    discussion_author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="as_author_discussions")
    discussion_users = models.ManyToManyField(User, blank=True, related_name="user_discussions")
    discussion_title = models.CharField(max_length=64, blank=False)
    discussion_desc = models.TextField(blank=True)
    discussion_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.discussion_title}: " + ", ".join([course.course_code for course in self.discussion_courses.all()])


class Comment(models.Model):
    # A comment can only belong to one discussion. Comments with same text can exist in different discussions.
    comment_discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name="comments")
    comment_author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    comment_text = models.TextField(blank=False)
    comment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.comment_discussion}: {self.comment_text}"
