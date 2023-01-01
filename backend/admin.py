from django.contrib import admin
from .models import User, Course, Module, Assignment

# Register your models here.
admin.site.register(User)
admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Assignment)