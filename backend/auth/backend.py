from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import check_password

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        
        try:
            user = UserModel.objects.get(email=username)
            pwd_valid = check_password(password, user.password)
            
            if not pwd_valid:
                user = None
                
        except UserModel.DoesNotExist:
            user = None
        
        return user
