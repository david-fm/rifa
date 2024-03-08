import uuid
from django.db import models

class AbstractBaseModel(models.Model):
    """Base model that includes a UUID as the primary key"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)

    class Meta:
        abstract = True

