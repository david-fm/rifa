from rest_framework.views import APIView
from auth.serializer import ModifyUserSerializer
from core.serializer import RifaSerializer, ImageSerializer
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin
from core.models import Creador, Campania, Premios, Ofertas
from collections import OrderedDict


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
        pass


class UserDashboard(APIView):
    def get(self, request):
        user = request.user
        print(user.id)
        print(user)
        print(Creador.objects.filter(user=user.id))
        if not Creador.objects.filter(user=user.id).exists():
            return Response({'message': 'User is not a creator'})
        creador = Creador.objects.get(user=user.id)
        campanias = Campania.objects.filter(creador=creador)

        # Get next data from campanias and send it to the frontend
        # interface Rifa {
        #     foto: string;
        #     nombre: string;
        #     reglamento: string;
        #     id: number;
        # }

        to_send = []
        for campania in campanias:
            to_send.append({
                'foto': campania.foto.url if campania.foto else None,
                'nombre': campania.nombre,
                'reglamento': campania.reglamento,
                'id': campania.id
            })
            
        return Response(to_send, status=200)