from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django_extensions.db.models import TimeStampedModel
# Create your models here.

class User(AbstractBaseUser, TimeStampedModel):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100)