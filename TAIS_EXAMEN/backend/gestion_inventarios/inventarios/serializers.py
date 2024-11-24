from rest_framework import serializers
from decimal import Decimal
from .models import Producto


class ProductoSerializer(serializers.Serializer):
    id_producto = serializers.CharField(max_length=255)
    nombre = serializers.CharField(max_length=200)
    descripcion = serializers.CharField()
    categoria = serializers.CharField(max_length=100)
    precio = serializers.DecimalField(
        max_digits=10, decimal_places=2)  # Cambiado a DecimalField
    cantidad = serializers.IntegerField()

    def validate_precio_unitario_float(self, value):
        # Convertir el valor float a Decimal antes de guardarlo
        return Decimal(str(value))

    def validate_id_producto(self, value):
        if not value:  # Verifica si el valor está vacío
            raise serializers.ValidationError(
                "El campo 'id_producto' no puede estar vacío.")

        producto_existente = Producto.obtener_producto_por_id(value)
        if producto_existente:
            raise serializers.ValidationError(
                "El Código de producto ya existe. Por favor, utiliza un id único.")
        return value


class MovimientoSerializer(serializers.Serializer):

    id_movimiento = serializers.CharField()
    id_producto = serializers.CharField()
    tipo_movimiento = serializers.CharField(max_length=50)
    cantidad = serializers.IntegerField()
    descripcion = serializers.CharField()
    fecha_movimiento = serializers.DateTimeField()
