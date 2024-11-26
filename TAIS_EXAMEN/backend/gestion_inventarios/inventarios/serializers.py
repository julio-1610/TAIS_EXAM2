from rest_framework import serializers
from decimal import Decimal
from .models import Movimiento


class MovimientoSerializer(serializers.Serializer):

    id_movimiento = serializers.CharField()
    id_producto = serializers.CharField()
    tipo_movimiento = serializers.ChoiceField(
        choices=['entrada', 'salida'], required=True)
    cantidad = serializers.IntegerField()
    descripcion = serializers.CharField()
