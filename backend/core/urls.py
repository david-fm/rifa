from django.urls import path
from .views import ModifyCreador

urlpatterns = [
    path('edit/', ModifyCreador.as_view(), name='modify_creador'),
]