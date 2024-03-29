from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField()
    passwordConfirmation = serializers.CharField()

class ModifyUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    support_link = serializers.CharField(required=False)
    logo = serializers.ImageField(required=False)
