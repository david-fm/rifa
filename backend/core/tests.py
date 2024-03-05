from django.test import TestCase
from core.models import Campania, Reserva, Creador
from django.contrib.auth.models import User

# Create your tests here.

class CampaniaTestCase(TestCase):
    # Test of the check constraints of the Campania model
    # class Meta:
    #     constraints = [
    #         CheckConstraint(
    #             # Test that the price is greater than 0
    #             check=Q(precio_ticket__gte=0),
    #             name='campania_precio_no_negativo'
    #         ),
    #         CheckConstraint(
    #             # Test that the amount of tickets is greater than 0
    #             check=Q(cantidad_tickets__gte=0),
    #             name='campania_cantidad_no_negativa'
    #         ),
    #         CheckConstraint(
    #             # Test that the amount of tickets needed is greater than 0
    #             check=Q(tickets_necesarios__gte=0),
    #             name='campania_tickets_necesarios_no_negativos'
    #         ),
    #         CheckConstraint(
    #             # Test that the amount of tickets needed is less than the amount of tickets
    #             check=Q(tickets_necesarios__lte=F('cantidad_tickets')),
    #             name='campania_tickets_necesarios_menor_o_igual_tickets'
    #         ),
    #         CheckConstraint(
            #     # Test that the  max_reservas is less than the amount of tickets and greater than 0
            #     check=Q(max_reservas__lte=F('cantidad_tickets'), max_reservas__gte=0),
            #     name='campania_max_reservas_menor_o_igual_tickets'
            # )
    #     ]
    def setUp(self) -> None:
        user = User.objects.create_user(username="test", email="test@gmail.com", password="test")
        creador = Creador.objects.create(user=user)

        user.save()
        creador.save()
    
    def test_campania_precio_no_negativo(self):
        creador = Creador.objects.get(user__username="test")
        # Positive test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10, max_reservas=100, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Negative test
        campania = Campania(nombre="TestCampania", precio_ticket=-1, cantidad_tickets=100, tickets_necesarios=10, max_reservas=100, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        with self.assertRaises(Exception):
            campania.save()

    def test_campania_cantidad_no_negativa(self):
        creador = Creador.objects.get(user__username="test")

        # Positive test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10, max_reservas=100, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Negative test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=-1, tickets_necesarios=10, max_reservas=100, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        with self.assertRaises(Exception):
            campania.save()
    
    def test_campania_tickets_necesarios_no_negativos(self):
        creador = Creador.objects.get(user__username="test")

        # Positive test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10, max_reservas=100, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Negative test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=-1, max_reservas=100, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        with self.assertRaises(Exception):
            campania.save()
    
    def test_campania_tickets_necesarios_menor_o_igual_tickets(self):
        creador = Creador.objects.get(user__username="test")

        # Positive test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10, max_reservas=100, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Negative test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=101, max_reservas=100, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        with self.assertRaises(Exception):
            campania.save()
    
    def test_campania_max_reservas_menor_o_igual_tickets(self):
        creador = Creador.objects.get(user__username="test")

        # Positive test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10, max_reservas=100, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Negative test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10, max_reservas=101, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        with self.assertRaises(Exception):
            campania.save()
        


class ReservaTestCase(TestCase):
    # Test on creation of a reservation check_reserva
    # @receiver(models.signals.pre_save, sender=Reserva)
    # def check_reserva(sender, instance, **kwargs):
    #     # Test that the id_ticket is less or equal than the amount of tickets
    #     if instance.id_ticket > instance.campania.cantidad_tickets:
    #         raise ValueError('The id_ticket is greater than the amount of tickets')

    def setUp(self) :
        user = User.objects.create_user(username="test", email="test@gmail.com", password="test")
        creador = Creador.objects.create(user=user)
        campania = Campania.objects.create(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10, max_reservas=100, ranking_activo=False, num_visibles=False, creador=creador, info_ranking="Test", reglamento="Test")

        user.save()
        creador.save()
        campania.save()

    def test_check_reserva_id_ticket_menor_o_igual_cantidad_tickets(self):
        campania = Campania.objects.get(nombre="TestCampania")
        usuario = User.objects.get(username="test")

        # Positive test
        reserva = Reserva(campania=campania, id_ticket=99, usuario=usuario)
        reserva.save()

        # Negative test
        reserva = Reserva(campania=campania, id_ticket=100, usuario=usuario)
        with self.assertRaises(Exception):
            reserva.save()
    
    def test_reserva_id_unique(self):
        campania = Campania.objects.get(nombre="TestCampania")
        usuario = User.objects.get(username="test")
        reserva = Reserva(campania=campania, id_ticket=99, usuario=usuario)
        reserva.save()

        # Positive test
        reserva = Reserva(campania=campania, id_ticket=100, usuario=usuario)

        # Negative test
        reserva = Reserva(campania=campania, id_ticket=99, usuario=usuario)
        with self.assertRaises(Exception):
            reserva.save()