# Generated by Django 4.1.3 on 2023-02-05 21:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0022_user_field_user_year'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='course_code',
            field=models.CharField(max_length=15, unique=True),
        ),
        migrations.RemoveField(
            model_name='course',
            name='course_user',
        ),
        migrations.AddField(
            model_name='course',
            name='course_user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_courses', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
