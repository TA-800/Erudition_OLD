# Generated by Django 4.1.3 on 2023-01-04 06:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_rename_module_notesformatted_module_module_notesdelta'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='course_code',
            field=models.CharField(max_length=8, unique=True),
        ),
    ]