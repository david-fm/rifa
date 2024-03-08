from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django_extensions.db.models import TimeStampedModel
from django.core.validators import RegexValidator
# Create your models here.


phone_regex = RegexValidator(regex=r'^\+\d{8,15}$', message="El numero de telefono debe estar en el formato: '+999999999'")

class User(AbstractBaseUser, TimeStampedModel):
    
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=16, validators=[phone_regex], blank=True, default='')
    username = models.CharField(max_length=100)