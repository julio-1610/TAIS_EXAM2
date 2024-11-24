from rest_framework import serializers

from .models import Producto


class ProductoSerializer(serializers.Serializer):
    id_producto = serializers.CharField()
    nombre = serializers.CharField(max_length=200)
    descripcion = serializers.CharField()
    categoria = serializers.CharField(max_length=100)
    precio_unitario = serializers.IntegerField()
    cantidad = serializers.IntegerField()

    def validate_id_producto(self, value):
        producto_existente = Producto.obtener_producto_por_id(value)
        if producto_existente:
            raise serializers.ValidationError(
                "El Codigo de producto ya existe. Por favor, utiliza un id único.")
            return value


class MovimientoSerializer(serializers.Serializer):
    id_movimiento = serializers.CharField()
    id_producto = serializers.CharField()
    tipo_movimiento = serializers.CharField(max_length=50)
    cantidad = serializers.IntegerField()
    descripcion = serializers.CharField()
    fecha_movimiento = serializers.DateTimeField()
