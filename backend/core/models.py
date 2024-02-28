from django.db import models
from utils.model_abstracts import AbstractBaseModel
from django_extensions.db.models import (
    TimeStampedModel,
    ActivatorModel)

# Create your models here.
class Creador(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, primary_key=True)
    logo = models.ImageField(upload_to='creadores/logos/', null=True, blank=True)
    support_link = models.URLField(max_length=200, null=True, blank=True)
    support_type = models.PositiveSmallIntegerField(choices=[(0, ''),(1, 'Gmail'), (2, 'Whatsapp'), (3, 'Instagram'), (4, 'Facebook')], default=0, null=True, blank=True)

