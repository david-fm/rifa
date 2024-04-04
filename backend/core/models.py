from django.db import models
from utils.model_abstracts import AbstractBaseModel
from django_extensions.db.models import (
    TimeStampedModel,
    ActivatorModel)
from django.conf import settings

from django.dispatch import receiver

from django.db.models import CheckConstraint, Q, F, Count
from django_resized import ResizedImageField
from django.contrib.auth import get_user_model


User = get_user_model()

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.user.id, filename)

def campaign_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<campaign_name>/<filename>
    return "user_{0}/{1}/{2}".format(instance.creador.user.id, instance.nombre, filename)

# Create your models here.
class Creador(models.Model):
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        primary_key=True, 
        blank=True)
    
    # User is the base user model from django
    logo = ResizedImageField(upload_to=user_directory_path, null=True, blank=True, size=[200, 200],crop=['middle', 'center'])
    # The logo of the creator
    support_link = models.URLField(max_length=200, null=True, blank=True)
    # The link to the support page of the creator where it can be found

    class Meta:
        permissions = [
            ('is_creador', 'Is creador')
        ]


class Campania(TimeStampedModel, AbstractBaseModel):
    creador = models.ForeignKey(Creador, on_delete=models.CASCADE)
    # The creator of the campaign

    nombre = models.CharField(max_length=100)
    # The name of the campaign

    reglamento = models.TextField()
    # The rules of the campaign
    
    foto = models.ImageField(upload_to=campaign_directory_path, null=True, blank=True)
    # TODO: Controlar el tamaño de la imagen
    # The photo of the campaign

    precio_ticket = models.DecimalField(max_digits=9, decimal_places=2)
    # The price of the ticket

    
    # cantidad_tickets es un valor que viene dado por un select de entre 0 y 5 que se traduce en la cantidad de tickets disponibles
    # if choice == 0: cantidad_tickets = 99
    # if choice == 1: cantidad_tickets = 999
    # if choice == 2: cantidad_tickets = 9999
    # if choice == 3: cantidad_tickets = 99999
    # if choice == 4: cantidad_tickets = 999999
    # if choice == 5: cantidad_tickets = 4999999
    cantidad_tickets = models.IntegerField(choices=[(99, "0"), (999,"1"), (9999,"2"), (99999,"3"), (999999,"4"), (4999999,"5")])
    # The amount of tickets available

    tickets_necesarios = models.IntegerField()
    # The amount of tickets needed to end the campaign

    ranking_activo = models.BooleanField()
    # If the ranking is active

    info_ranking = models.TextField()
    # The information of the ranking

    num_visibles = models.BooleanField(blank=True, default=False)
    # If the user can select the tickets number

    buyed_tickets = models.IntegerField(blank=True, default=0)

    has_end = models.BooleanField(blank=True, default=False)

    has_winner = models.BooleanField(blank=True, default=False)

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
                # Test that the amount of tickets is less than 5000000
                check=Q(cantidad_tickets__lte=4999999),
                name='campania_cantidad_menor_igual_5000000'
            ),
            CheckConstraint(
                # Test that the amount of tickets needed is greater than 0
                check=Q(tickets_necesarios__gte=0),
                name='campania_tickets_necesarios_no_negativos'
            ),
            CheckConstraint(
                # Test that the amount of tickets needed is less than the amount of tickets
                check=Q(tickets_necesarios__lte=F('cantidad_tickets')),
                name='campania_tickets_necesarios_menor_o_igual_cantiad_tickets'
            ),
            # CheckConstraint(
            #     # Test that the  max_reservas is less than the amount of tickets and greater than 0
            #     check=Q(max_reservas__lte=F('cantidad_tickets'), max_reservas__gte=0),
            #     name='campania_max_reservas_menor_o_igual_tickets'
            # ),
            CheckConstraint(
                # Test that the buyed_tickets is lower than cantidad_tickets
                check=Q(buyed_tickets__lt=F('cantidad_tickets')),
                name="tickets_bought_lower_than_tickets_available"
            )
        ]
    
        
    def ranking(self, top:int):
        """Return the usernames that have bought more tickets in the campaign"""
        return User.objects.annotate(reservas=Count('reserva', filter=Q(reserva__campania=self))).filter(reservas__gt=0).order_by('-reservas')[:top].values('username')


class Premios(AbstractBaseModel):
    campania = models.ForeignKey(Campania, on_delete=models.CASCADE)
    # The campaign of the prize

    nombre = models.CharField(max_length=100)
    # The name of the prize

class Ofertas(AbstractBaseModel):
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
            )
        ]


class Reserva(TimeStampedModel, AbstractBaseModel):
    campania = models.ForeignKey(Campania, on_delete=models.CASCADE)
    # The campaign of the reservation

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE)
    # The user of the reservation

    id_ticket = models.IntegerField()


    def __str__(self):
        return f'{self.usuario.username} - {self.campania.nombre} - {self.id_ticket}'

    class Meta:
        unique_together = ('campania', 'id_ticket')
        # Tickets are unique per campaign

        constraints = [
            
            CheckConstraint(
                # Test that the id_ticket is greater than 0
                check=Q(id_ticket__gte=0),
                name='cantidad_no_negativa'
            )
        ]

class Ganador(TimeStampedModel, AbstractBaseModel):
    reserva = models.OneToOneField(Reserva, on_delete=models.CASCADE)

@receiver(models.signals.pre_save, sender=Ganador)
def check_winner(sender, instance, **kwargs):
    """
    Check that the campaign hasn't a winner and that the campaign has ended
    """
    if instance.reserva.campania.has_winner:
        raise ValueError('The campaign already has a winner')
    if not instance.reserva.campania.has_end:
        raise ValueError('The campaign has not ended yet')

@receiver(models.signals.post_save, sender=Ganador)
def update_winner(sender, instance, **kwargs):
    """
    Update the campaign to have a winner
    """
    instance.reserva.campania.has_winner = True
    instance.reserva.campania.save()



# @receiver(models.signals.post_save, sender=Reserva)
# def count_comprados(sender, instance:Reserva, **kwargs):
#     # update campania buyed_tickets
#     campania = instance.campania;
#     campania.buyed_tickets=F('buyed_tickets') + 1
#     campania.save()

@receiver(models.signals.pre_save, sender=Reserva)
def check_reserva(sender, instance, **kwargs):
    # Test that the id_ticket is less than the amount of tickets
    if instance.id_ticket >= instance.campania.cantidad_tickets:
        raise ValueError('The id_ticket is greater than the amount of tickets')


@receiver(models.signals.pre_save, sender=Ofertas)
def check_ofertas(sender, instance, **kwargs):
    # Test that the amount of tickets needed is less than the amount of tickets
    if instance.cada > instance.campania.cantidad_tickets:
        raise ValueError('The amount of tickets needed is greater than the amount of tickets')
    
    # Test that cada is less than max_reservas
    # if instance.cada > instance.campania.max_reservas:
    #     raise ValueError('The amount of tickets needed is greater than max_reservas')


