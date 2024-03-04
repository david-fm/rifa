from rest_framework.views import APIView
from auth.serializer import ModifyUserSerializer
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin
from core.models import Creador
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