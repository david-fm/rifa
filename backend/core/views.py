from rest_framework.views import APIView
from auth.serializer import ModifyUserSerializer
from core.serializer import RifaSerializer, ImageSerializer, BuySerializer, SearchSerializer
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from core.models import Creador, Campania, Premios, Ofertas, Reserva
from collections import OrderedDict
from django.db.models import F
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
        if 'logo' or 'support_link' in data:
            creador = Creador.objects.get(user=user)

            if not creador:
                return Response({'error': 'User is not a creator'}, status=400)

            

            if 'logo' in data:
                print('logo')
                print(data['logo'])
                creador.logo = data['logo']
            
            if 'support_link' in data:
                creador.support_link = data['support_link']
            
            creador.save()
            
        response_data = {
            'username': user.username,
        }
        if Creador.objects.filter(user=user).exists():
            creador = Creador.objects.get(user=user)
            response_data['logo'] =  creador.logo.url if creador.logo else None
            response_data['support_link'] = creador.support_link

        return Response(response_data, status=200)


def create_campania(data: OrderedDict, creador: Creador) -> Campania:
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
    return campania

def create_premio(data, campania: Campania) -> Premios:
    premio = Premios.objects.create(
        nombre=data,
        campania=campania
    )
    return premio

def create_oferta(data: OrderedDict, campania: Campania) -> Ofertas:
    oferta = Ofertas.objects.create(
        cada=data['cada'],
        precio=data['precio'],
        campania=campania
    )
    return oferta


class Rifa(APIView):
    def post(self, request):

        user = request.user
        if not Creador.objects.filter(user=user.id).exists():
            return Response({'error': 'User is not a creator'}, status=400)
        creador = Creador.objects.get(user=user.id)
        
        serializer = RifaSerializer(data=request.data)
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
        creador = Creador.objects.get(user=user.id)
        if not creador:
            return Response({'error': 'User is not a creator'}, status=400)
        
        serializer = ImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

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
        campania : Campania = Campania.objects.get(id=id)
        if not campania:
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

        if not Creador.objects.filter(user=user.id).exists():
            return JsonResponse(to_send)
        
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


class BuyTicket(APIView):
    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'User is not authenticated'}, status=400)
        

        serializer = BuySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        campania_id = serializer.validated_data['campania']
        cantidad = serializer.validated_data['cantidad']

        campania = Campania.objects.get(id=campania_id)
        
        if not campania:
            return Response({'error': 'Campaign does not exist'}, status=400)
        
        try:
            campania.buyed_tickets = F('buyed_tickets') + cantidad
            campania.save()

        except Exception as e:
            return Response({'error': str(e)}, status=400)
        
        for i in range(cantidad):
            while True:
                id = randint(0, campania.cantidad_tickets)
                try:
                    reserva = Reserva.objects.create(
                        campania=campania,
                        usuario=user,
                        id_ticket=id
                    )
                    reserva.save()
                    break
                except:
                    continue
        return Response({'message': 'Tickets comprados correctamente'}, status=200)