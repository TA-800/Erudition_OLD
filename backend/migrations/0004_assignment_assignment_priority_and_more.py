# Generated by Django 4.1.3 on 2022-12-29 21:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_course_course_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='assignment_priority',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='assignment',
            name='assignment_user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='module',
            name='module_user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='assignment',
            name='assignment_course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='backend.course'),
        ),
        migrations.RemoveField(
            model_name='course',
            name='course_user',
        ),
        migrations.AlterField(
            model_name='module',
            name='module_course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modules', to='backend.course'),
        ),
        migrations.AddField(
            model_name='course',
            name='course_user',
            field=models.ManyToManyField(blank=True, related_name='courses', to=settings.AUTH_USER_MODEL),
        ),
    ]
