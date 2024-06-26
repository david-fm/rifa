from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import LoginSerializer, RegisterSerializer
from django.contrib.auth import authenticate
from core.models import Creador 


from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class LoginAuthToken(APIView):

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(username=email, password=password)
        if not user:
            return Response({'error': 'Invalid email or password'}, status=400)
        
        creador = Creador.objects.filter(user=user).first()
        refresh = RefreshToken.for_user(user=user)
        if not creador:
            creador_info = {
                'logo': None,
                'support_link': None,
            }
        else:
            creador_info = {
                'logo': creador.logo.url if creador.logo else None,
                'support_link': creador.support_link,
            }

        return Response({
            'refresh': str(refresh),
            'token': str(refresh.access_token),
            'username': user.username,
            'email': user.email,
            'creadorInfo': creador_info,
            'isCreador': creador is not None,
        })

class Register(APIView):
    
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        username = serializer.validated_data['username']

        if not email or not password or not username:
            return Response({'error': 'Email, username and password are required'}, status=400)

        user = User.objects.create_user(email=email, password=password, username=username)

        if not user:
            return Response({'error': 'Invalid email or password'}, status=400)
        
        return Response({},status=201)
