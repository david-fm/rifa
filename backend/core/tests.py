from django.test import TestCase
from core.models import Campania, Reserva, Creador
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your tests here.

class CampaniaTestCase(TestCase):
    # Test of the check constraints of the Campania model
    def setUp(self) -> None:
        user = User.objects.create_user(username="test", email="test@gmail.com", password="test")
        user2 = User.objects.create_user(username="test2", email="test2@gmail.com", password="test2")
        user3 = User.objects.create_user(username="test3", email="test3@gmail.com", password="test3")
        creador = Creador.objects.create(user=user)
        
        user.save()
        user2.save()
        user3.save()
        creador.save()
    
    def test_campania_precio_no_negativo(self):
        creador = Creador.objects.get(user__username="test")
        # Positive test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Negative test
        campania = Campania(nombre="TestCampania", precio_ticket=-1, cantidad_tickets=100, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        with self.assertRaises(Exception):
            campania.save()

    def test_campania_cantidad_no_negativa(self):
        creador = Creador.objects.get(user__username="test")

        # Positive test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Negative test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=-1, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        with self.assertRaises(Exception):
            campania.save()
    
    def test_campania_tickets_necesarios_no_negativos(self):
        creador = Creador.objects.get(user__username="test")

        # Positive test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Negative test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=-1,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        with self.assertRaises(Exception):
            campania.save()
    
    def test_campania_tickets_necesarios_menor_o_igual_tickets(self):
        creador = Creador.objects.get(user__username="test")

        # Positive test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Negative test
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=101,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        with self.assertRaises(Exception):
            campania.save()
    
    def test_ranking(self):
        """Test the ranking method of the Campania model"""
        creador = Creador.objects.get(user__username="test")
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()

        # Positive test
        ranking = campania.ranking(10)
        # print(f"ranking: {ranking}")
        # print(f"Length ranking: {len(ranking)}")
        # print(f"Reservas: {Reserva.objects.all()}")
        self.assertEqual(len(ranking), 0)

        # Negative test
        ranking = campania.ranking(10)
        
        self.assertNotEqual(len(ranking), 1)

    def test_multiple_buyers_ranking(self):
        from .views import create_reserva
        creador = Creador.objects.get(user__username="test")
        campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
        campania.save()
        user = User.objects.get(username="test")
        user2 = User.objects.get(username="test2")
        user3 = User.objects.get(username="test3")

        reserva = create_reserva(campania, user)
        reserva = create_reserva(campania, user)
        reserva = create_reserva(campania, user2)
        reserva = create_reserva(campania, user2)
        reserva = create_reserva(campania, user2)
        reserva = create_reserva(campania, user3)
        
        ranking = campania.ranking(3)
        #print(f"ranking: {ranking}")
        # Take the first user in the ranking
        self.assertEqual(ranking[0].get('username'), user2.username)

        # Take the second user in the ranking
        self.assertEqual(ranking[1].get('username'), user.username)

        # Take the third user in the ranking
        self.assertEqual(ranking[2].get('username'), user3.username)
        
        
    # def test_campania_max_reservas_menor_o_igual_tickets(self):
    #     creador = Creador.objects.get(user__username="test")

    #     # Positive test
    #     campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
    #     campania.save()

    #     # Negative test
    #     campania = Campania(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10, max_reservas=101, ranking_activo=False, num_visibles=False, info_ranking="Test", reglamento="Test",creador=creador)
    #     with self.assertRaises(Exception):
    #         campania.save()
    


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
        campania = Campania.objects.create(nombre="TestCampania", precio_ticket=100, cantidad_tickets=100, tickets_necesarios=10,  ranking_activo=False, num_visibles=False, creador=creador, info_ranking="Test", reglamento="Test")

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
    
    def test_multiple_tickets_buyed_same_time_update_buyed_tickets(self):
        campania = Campania.objects.get(nombre="TestCampania")
        usuario1 = User.objects.get(username="test")

        list_reservs = [Reserva(campania=campania, usuario=usuario1, id_ticket=i) for i in range(0,99)]

        
        
