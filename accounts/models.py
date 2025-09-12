from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='teacher')

    def is_admin(self):
        return self.role == 'admin'

    def is_teacher(self):
        return self.role == 'teacher'
