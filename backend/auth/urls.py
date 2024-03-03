from django.urls import path
from .views import LoginAuthToken,  Register
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', LoginAuthToken.as_view(), name='token_obtain_pair'),
]