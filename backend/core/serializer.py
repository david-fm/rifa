from rest_framework import serializers
from core.models import Campania, Premios, Ofertas, Reserva


class CampaniaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campania
        exclude = ['creador','id','buyed_tickets']


class OfertasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ofertas
        exclude = ['campania','id']

class RifaSerializer(serializers.Serializer):
    campania = CampaniaSerializer()
    premios = serializers.ListField(child=serializers.CharField(max_length=100))
    ofertas = OfertasSerializer(many=True)

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        exclude = ['id','id_ticket']

class ImageSerializer(serializers.Serializer):
    campania = serializers.UUIDField()
    foto = serializers.ImageField()

class BuySerializer(serializers.Serializer):
    campania = serializers.UUIDField()
    cantidad = serializers.IntegerField()

class SearchSerializer(serializers.Serializer):
    search = serializers.CharField(max_length=100)

class TestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Campania
        fields = ['cantidad_tickets']