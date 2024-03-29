from typing import List
from rest_framework.views import APIView
from myauth.serializer import ModifyUserSerializer
from core.serializer import RifaSerializer, ImageSerializer, BuySerializer, SearchSerializer
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from core.models import Creador, Campania, Premios, Ofertas, Reserva
from collections import OrderedDict
from django.db.models import F, Count
from random import randint



# Create your views here.

class ModifyCreador(APIView, LoginRequiredMixin):
    def post(self, request):
        serializer = ModifyUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data: OrderedDict = serializer.validated_data
        user = request.user
        if 'username' in data:
            user.username = data['username']
            user.save()
        
        
            
        response_data = {
            'username': user.username,
        }
        try:
            creador = Creador.objects.get(user=user)
            if 'logo' or 'support_link' in data and data['logo'] or data['support_link']:
                
                if 'logo' in data and data['logo']:
                    creador.logo = data['logo']
                
                if 'support_link' in data and data['support_link']:
                    creador.support_link = data['support_link']
                
                creador.save()
            
            response_data['logo'] =  creador.logo.url if creador.logo else None
            response_data['support_link'] = creador.support_link

        except Creador.DoesNotExist:
            pass

        return Response(response_data, status=200)


def create_campania(data: OrderedDict, creador: Creador) -> Campania:
    try:
        campania = Campania.objects.create(
            nombre=data['nombre'],
            reglamento=data['reglamento'],
            precio_ticket=data['precio_ticket'],
            cantidad_tickets=data['cantidad_tickets'],
            tickets_necesarios=data['tickets_necesarios'],
            ranking_activo=data['ranking_activo'],
            info_ranking=data['info_ranking'],
            # num_visibles=data['num_visibles'],
            creador=creador
        )
    except Exception as e:
        print(e)
        return None
    return campania

def create_premio(data, campania: Campania) -> Premios:
    try:
        premio = Premios.objects.create(
            nombre=data,
            campania=campania
        )
    except Exception as e:
        print(e)
        return None
    return premio

def create_oferta(data: OrderedDict, campania: Campania) -> Ofertas:
    try:
        oferta = Ofertas.objects.create(
            cada=data['cada'],
            precio=data['precio'],
            campania=campania
        )
    except Exception as e:
        print(e)
        return None
    return oferta

def choice_to_cantidad_tickets(choice: str) -> int:
    if choice == '0': return 99
    if choice == '1': return 999
    if choice == '2': return 9999
    if choice == '3': return 99999
    if choice == '4': return 999999
    if choice == '5': return 9999999
    return 0

def check_info_creador_complete(creador: Creador) -> bool:
    return creador.logo and creador.support_link and creador.user.username

class Rifa(APIView):
    def post(self, request):

        user = request.user

        try:
            creador = Creador.objects.get(user=user.id)
        except Creador.DoesNotExist:
            return Response({'error': 'User is not a creator'}, status=400)
        
        if not check_info_creador_complete(creador):
            return Response({'error': 'Creador info is not complete'}, status=400)
        
        data = request.data
        data['campania']['cantidad_tickets'] = choice_to_cantidad_tickets(data['campania']['cantidad_tickets'])

        serializer = RifaSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        data: OrderedDict = serializer.validated_data
        campania:Campania = create_campania(data['campania'], creador)
        premios = data['premios']
        ofertas = data['ofertas']

        for premio in premios:
            create_premio(premio, campania)
        
        for oferta in ofertas:
            create_oferta(oferta, campania)
        
        return Response({'campania':campania.id}, status=200)

    def patch(self, request):
        user = request.user
        try:
            creador = Creador.objects.get(user=user.id)
        except Creador.DoesNotExist:
            return Response({'error': 'User is not a creator'}, status=400)
        print("HOLA ")
        serializer = ImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print("HOLAAA ")

        campania_id = serializer.validated_data['campania']
        foto = serializer.validated_data['foto']

        campania = Campania.objects.get(id=campania_id)

        if not campania:
            return Response({'error': 'Campaign does not exist'}, status=400)
 
        if campania.creador != creador:
            return Response({'error': 'User is not the creator of the campaign'}, status=400)
        campania.foto = foto
        campania.save()

        return Response({'message': 'Foto subida correctamente'}, status=200)

    def get(self, request):
        
        search = request.GET.get('search', '')
        if not search:
            return Response({'error': 'No search parameter'}, status=400)
        

        serializer = SearchSerializer(data={'search': search})
        serializer.is_valid()
        search = serializer.validated_data['search']
        campanias = Campania.objects.filter(nombre__icontains=search)

        to_send = []
        for campania in campanias:
            to_send.append({
                
                'title': campania.nombre,
                'creador': campania.creador.user.username,
                'id': campania.id
            })
        return Response(to_send, status=200)
    



class RifaDetail(APIView):
    def get(self, request, id):
        try:
            campania : Campania = Campania.objects.get(id=id)
            premios : List[Premios] = Premios.objects.filter(campania=campania)
            ofertas : List[Ofertas] = Ofertas.objects.filter(campania=campania)

        except Campania.DoesNotExist:
            return Response({'error': 'Campaign does not exist'}, status=400)
        
        # data will follow the following structure
        # interface Rifa {
        #     foto: string;
        #     nombre: string;
        #     precio_ticket: number;
        #     cantidad_tickets:number;
        #     tickets_necesarios: number;
        #     tickets_vendidos: number;
        #     ranking_activo: boolean;
        #     info_ranking: string;
        #     reglamento: string;

        #     link_soporte: string;
        #     username_soporte: string;
        #     logo_soporte: string;
        # }

        creador = campania.creador

        data = {}
        data['foto'] = campania.foto.url if campania.foto else None
        data['nombre'] = campania.nombre
        data['precio_ticket'] = campania.precio_ticket
        data['cantidad_tickets'] = campania.cantidad_tickets
        data['tickets_necesarios'] = campania.tickets_necesarios
        data['tickets_vendidos'] = campania.buyed_tickets
        data['ranking_activo'] = campania.ranking_activo
        data['info_ranking'] = campania.info_ranking
        data['reglamento'] = campania.reglamento
        data['premios'] = [premio.nombre for premio in premios]
        data['ofertas'] = [{'cada': oferta.cada, 'precio': oferta.precio} for oferta in ofertas]

        data['link_soporte'] = creador.support_link
        data['username_soporte'] = creador.user.username
        data['logo_soporte'] = creador.logo.url if creador.logo else None


        return JsonResponse(data)

    

class UserDashboard(APIView):
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'User is not authenticated'}, status=400)
        to_send = {
            'campanias': [],
            'tickets': []
        }

        reservas = Reserva.objects.filter(usuario=user)
        for reserva in reservas:
            to_send['tickets'].append({
                'foto': reserva.campania.foto.url if reserva.campania.foto else None,
                'nombre': reserva.campania.nombre,
                'id_ticket': reserva.id_ticket,
                'id_campania': reserva.campania.id
            })

            
        try:
            creador = Creador.objects.get(user=user.id)
            campanias = Campania.objects.filter(creador=creador)

            # Get next data from campanias and send it to the frontend
            # interface Rifa {
            #     foto: string;
            #     nombre: string;
            #     reglamento: string;
            #     id: number;
            # }

            
            for campania in campanias:

                to_send['campanias'].append({
                    'foto': campania.foto.url if campania.foto else None,
                    'nombre': campania.nombre,
                    'reglamento': campania.reglamento,
                    'id': campania.id
                })
            
            
                
            return JsonResponse(to_send)
        
        except Creador.DoesNotExist:
            return JsonResponse(to_send)
        
def create_reserva(campania: Campania, user) -> List[Reserva]:
    """Create a reservation for a campaign and a user"""
    NUMBER_OF_TRIES = 20
    try_number = 0
    while True:
        try_number += 1
        if try_number > NUMBER_OF_TRIES:
            raise Exception('No hay suficientes tickets disponibles')
        try: 
            reserva : Reserva = Reserva.objects.create(
                campania=campania,
                usuario=user,
                id_ticket=Reserva.objects.filter(campania=campania).count() + 1
            )
            
            return reserva
        except:
            continue

def precio_oferta(ofertas: List[Ofertas], cantidad: int, precio_ticket: float) -> float:
    """Calculate the price based on the offers"""

    precio = 0
    ofertas.sort(reverse=True, key=lambda x: x.cada)

    for oferta in ofertas:
        aux = cantidad // oferta.cada
        precio += aux * oferta.precio
        cantidad -= aux * oferta.cada
        if cantidad == 0:
            break

    precio += cantidad * precio_ticket if cantidad > 0 else 0
    return precio


class BuyTicket(APIView):
    def post(self, request):
        #TODO: TENER EN CUENTA LAS OFERTAS
        # Check if the user is authenticated
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'User is not authenticated'}, status=400)
        
        # Get the data from the request
        serializer = BuySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        campania_id = serializer.validated_data['campania']
        cantidad = serializer.validated_data['cantidad']

        # Check if the campaign exists
        try:
            campania = Campania.objects.get(id=campania_id)
            id = campania.id
        except Campania.DoesNotExist:
            return Response({'error': 'Campaign does not exist'}, status=400)
        
        # Check if the user has enough tickets
        try:
            campania.buyed_tickets = F('buyed_tickets') + cantidad
            campania.save()
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        
        ofertas_query = Ofertas.objects.filter(campania=campania)
        print(ofertas_query)
        ofertas = list(ofertas_query)
        print(ofertas)
        
        precio = precio_oferta(ofertas, cantidad, campania.precio_ticket)
        
        print(precio)
        # TODO: Pasarela de pago

        # Create the tickets

        # Future improvement if we want to assign the tickets to the user randomly
        # reservas = []
        # for i in range(cantidad):
        #     while True:
        #         id = randint(0, campania.cantidad_tickets)
        #         try:
        #             reserva : Reserva = Reserva.objects.create(
        #                 campania=campania,
        #                 usuario=user,
        #                 id_ticket=id
        #             )
        #             reservas.append(reserva)
        #             break
        #         except:
        #             continue
        try:
            
            reservas : List[Reserva] = [
                create_reserva(campania,user) for i in range(cantidad)
            ]

            # Check if the tickets were created correctly
            if len(reservas) != cantidad:
                raise Exception('No hay suficientes tickets disponibles')
            
        except Exception as e:
            # Rollback the buyed tickets
            map(lambda reserva: reserva.delete(), reservas)
            
            campania = Campania.objects.filter(id=id)
            campania.update(buyed_tickets=F('buyed_tickets') - cantidad)
            
            
            text = ', no hay suficientes tickets disponibles' if len(reservas) else ''

            return Response({'error': f'Error al comprar los tickets{text}'}, status=400)

        return Response({'message': 'Tickets comprados correctamente'}, status=200)