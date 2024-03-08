from django.urls import path
from .views import ModifyCreador, Rifa, UserDashboard, RifaDetail, BuyTicket

urlpatterns = [
    path('edit/', ModifyCreador.as_view(), name='modify_creador'),
    path('rifa/', Rifa.as_view(), name='rifa'),
    path('dashboard/', UserDashboard.as_view(), name='dashboard'),
    path('rifas/<uuid:id>/', RifaDetail.as_view(), name='rifa_detail'),
    path('rifa/buy/', BuyTicket.as_view(), name='buy_ticket')
]