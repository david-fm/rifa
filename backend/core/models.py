from django.db import models
from utils.model_abstracts import AbstractBaseModel
from django_extensions.db.models import (
    TimeStampedModel,
    ActivatorModel)

from django.db.models import CheckConstraint, Q, F

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.user.id, filename)

def campaign_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<campaign_name>/<filename>
    return "user_{0}/{1}/{2}".format(instance.creador.user.id, instance.nombre, filename)

# Create your models here.
class Creador(models.Model):
    
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, primary_key=True, blank=True)
    # User is the base user model from django
    logo = models.ImageField(upload_to=user_directory_path, null=True, blank=True)
    # The logo of the creator
    support_link = models.URLField(max_length=200, null=True, blank=True)
    # The link to the support page of the creator where it can be found


class Campania(TimeStampedModel):
    creador = models.ForeignKey(Creador, on_delete=models.CASCADE)
    # The creator of the campaign

    nombre = models.CharField(max_length=100)
    # The name of the campaign

    reglamento = models.TextField()
    # The rules of the campaign

    foto = models.ImageField(upload_to=campaign_directory_path)
    # The photo of the campaign

    precio_ticket = models.DecimalField(max_digits=9, decimal_places=2)
    # The price of the ticket

    cantidad_tickets = models.IntegerField()
    # The amount of tickets available

    max_reservas = models.IntegerField(default=cantidad_tickets)
    # The maximum amount of reservations allowed per user

    tickets_necesarios = models.IntegerField()
    # The amount of tickets needed to end the campaign

    ranking_activo = models.BooleanField()
    # If the ranking is active

    info_ranking = models.TextField()
    # The information of the ranking

    num_visibles = models.BooleanField()
    # If the user can select the tickets number

    class Meta:
        constraints = [
            CheckConstraint(
                # Test that the price is greater than 0
                check=Q(precio_ticket__gte=0),
                name='campania_precio_no_negativo'
            ),
            CheckConstraint(
                # Test that the amount of tickets is greater than 0
                check=Q(cantidad_tickets__gte=0),
                name='campania_cantidad_no_negativa'
            ),
            CheckConstraint(
                # Test that the amount of tickets needed is greater than 0
                check=Q(tickets_necesarios__gte=0),
                name='campania_tickets_necesarios_no_negativos'
            ),
            CheckConstraint(
                # Test that the amount of tickets needed is less than the amount of tickets
                check=Q(tickets_necesarios__lte=F('cantidad_tickets')),
                name='campania_tickets_necesarios_menor_o_igual_tickets'
            ),
            CheckConstraint(
                # Test that the amount of tickets needed is less than max_reservas
                check=Q(tickets_necesarios__lte=F('max_reservas')),
                name='campania_tickets_necesarios_menor_o_igual_max_reservas'
            )
        ]


class Premios(models.Model):
    campania = models.ForeignKey(Campania, on_delete=models.CASCADE)
    # The campaign of the prize

    nombre = models.CharField(max_length=100)
    # The name of the prize

class Ofertas(models.Model):
    campania = models.ForeignKey(Campania, on_delete=models.CASCADE)
    # The campaign of the offer
    
    cada = models.IntegerField()
    # The amount of tickets needed to get the offer

    precio = models.DecimalField(max_digits=9, decimal_places=2)
    # The price of the offer

    class Meta:
        unique_together = ('campania', 'cada')
        # Offers are unique per campaign

        constraints = [
            CheckConstraint(
                # Test that the price is greater than 0
                check=Q(precio__gte=0),
                name='precio_no_negativo'
            ),
            CheckConstraint(
                # Test that the amount of tickets needed is greater than 0
                check=Q(cada__gte=0),
                name='cada_no_negativo'
            ),
            CheckConstraint(
                # Test that the amount of tickets needed is less than the amount of tickets
                check=Q(cada__lte=F('campania__cantidad_tickets')),
                name='cada_menor_o_igual_tickets'
            ),
            CheckConstraint(
                # Test that cada is less than max_reservas
                check=Q(cada__lte=F('campania__max_reservas')),
                name='cada_menor_o_igual_max_reservas'
            )
        ]


class Reserva(TimeStampedModel):
    campania = models.ForeignKey(Campania, on_delete=models.CASCADE)
    # The campaign of the reservation

    usuario = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    # The user of the reservation

    id_ticket = models.IntegerField()


    def __str__(self):
        return f'{self.usuario.username} - {self.campania.nombre} - {self.cantidad}'

    class Meta:
        unique_together = ('campania', 'id_ticket')
        # Tickets are unique per campaign

        constraints = [
            
            CheckConstraint(
                # Test that the id_ticket is greater than 0
                check=Q(id_ticket__gte=0),
                name='cantidad_no_negativa'
            ),
            CheckConstraint(
                # Test that the id_ticket is less or equal than the amount of tickets
                check=Q(id_ticket__lte=F('campania__cantidad_tickets')),
                name='cantidad_menor_o_igual_tickets'
            )
        ]
