from rest_framework import serializers
from decimal import Decimal
from .models import Movimiento


class MovimientoSerializer(serializers.Serializer):

    id_movimiento = serializers.CharField()
    id_producto = serializers.CharField()
    tipo_movimiento = serializers.CharField(max_length=50)
    cantidad = serializers.IntegerField()
    descripcion = serializers.CharField()
