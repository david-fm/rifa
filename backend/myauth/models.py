from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin, BaseUserManager
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib import auth
from django.apps import apps
from django_extensions.db.models import TimeStampedModel
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from django.core.mail import send_mail

# Create your models here.

class MyUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        # Lookup the real model class from the global app registry so this
        # manager method can be used in migrations. This is fine because
        # managers are by definition working on the real model.
        
        user = self.model( email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


phone_regex = RegexValidator(regex=r'^\+\d{8,15}$', message="El numero de telefono debe estar en el formato: '+999999999'")

class MyUser(AbstractBaseUser, TimeStampedModel, PermissionsMixin):
    """
    A fully featured User model with admin-compliant permissions that uses a full-length email field as the main feature"""

    username_validator = UnicodeUsernameValidator()

    email = models.EmailField(
        _("email address"),  
        unique=True, 
        max_length=255,
        error_messages={
            "unique": _("A user with that email already exists."),
        },
    )
    phone = models.CharField(
        max_length=16, 
        validators=[phone_regex], 
        blank=True,
        default=''
    )
    username = models.CharField(
        _("username"),
        max_length=150,
        blank=True,
        null=True,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )

    objects = MyUserManager()

    USERNAME_FIELD = "email"

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)
    
    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        return self.is_staff
    
    def has_module_perms(self, app_label):
        return self.is_staff
    

    
