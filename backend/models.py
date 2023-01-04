from django.contrib.auth.models import AbstractUser
from django.db import models

from django.utils import timezone

# Create your models here.
class User(AbstractUser):
    #username, first_name, last_name ...
    # avatar = models.ImageField(upload_to='avatars', blank=True)
    is_public = models.BooleanField(default=True)
    

class Course(models.Model):
    course_user = models.ManyToManyField(User, blank=True, related_name="courses")
    course_code = models.CharField(max_length=8, unique=True) # COMP101
    course_name = models.CharField(max_length=64) # Data Structures in Python
    course_description = models.TextField(blank=True)
    course_instructor = models.CharField(max_length=64) # "Dr. John Smith"
    course_instructor_contact = models.CharField(max_length=100) # "johnsmith@gmail.com"
    course_instructor_office_hours = models.CharField(max_length=100) # "Monday 10:00-11:00"

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
    assignment_name = models.CharField(max_length=64) # "Assignment 1"
    assignment_description = models.TextField(blank=True)
    assignment_due_date = models.DateTimeField() # "2021-09-30 23:59:59"
    assignment_completed = models.BooleanField(default=False)
    assignment_priority = models.BooleanField(default=True) # True = High (assignment, exam/quiz, project), False = Low (to-do, reminder, reading)

    def __str__(self):
        return f"{self.assignment_course}: {self.assignment_name}"
    
    def days_left(self):
        """Returns the number of days left until the due date."""
        days = (self.assignment_due_date - timezone.now()).days
        hours = (self.assignment_due_date - timezone.now()).seconds // 3600
        return f"{days} days left" if days > 0 else f"{hours} hours left" if hours > 0 else "Overdue"

     

