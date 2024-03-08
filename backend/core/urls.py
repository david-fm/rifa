from django.urls import path
from .views import ModifyCreador, Rifa, UserDashboard

urlpatterns = [
    path('edit/', ModifyCreador.as_view(), name='modify_creador'),
    path('rifa/', Rifa.as_view(), name='rifa'),
    path('dashboard/', UserDashboard.as_view(), name='dashboard'),
]