from django.contrib import admin
from .models import Creador, Campania, Premios, Ofertas, Reserva
# Register your models here.

admin.site.register(Creador)
admin.site.register(Campania)
admin.site.register(Premios)
admin.site.register(Ofertas)
admin.site.register(Reserva)