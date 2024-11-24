from django.db import models

# Create your models here.
import boto3
import uuid

dynamodb = boto3.resource("dynamodb")
table_producto = dynamodb.Table("Producto")
table_movimiento = dynamodb.Table("MovimientosInventario")


class Producto:
    id_producto = models.CharField(max_length=255, unique=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    categoria = models.CharField(max_length=100)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField(default=0)

    def __str__(self):
        return self.nombre

    @staticmethod
    def guardar_producto(data):
        if "id_producto" not in data:
            data["id_producto"] = str(uuid.uuid4())
        table_producto.put_item(Item=data)

    @staticmethod
    def obtener_productos():
        response = table_producto.scan()
        return response.get("Items", [])

    @staticmethod
    def obtener_producto_por_id(id_producto):
        try:
            response = table_producto.get_item(
                Key={"id_producto": id_producto})
            return response.get("Item", None)
        except Exception as e:
            print(f"Error al obtener producto: {e}")
            return None


class Movimiento:
    TIPO_MOVIMIENTO_CHOICES = (
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
    )

    id_movimiento = models.CharField(max_length=255, unique=True)
    # Solo guardamos el ID como texto
    id_producto = models.CharField(max_length=255)
    tipo_movimiento = models.CharField(
        max_length=50, choices=TIPO_MOVIMIENTO_CHOICES)
    cantidad = models.IntegerField()
    descripcion = models.TextField()

    @staticmethod
    def guardar_movimiento(data):
        if "id_movimiento" not in data:
            data["id_movimiento"] = str(uuid.uuid4())
        table_movimiento.put_item(Item=data)

    @staticmethod
    def obtener_movimientos():
        response = table_movimiento.scan()
        return response.get("Items", [])

    def __str__(self):
        return f'{self.id_movimiento} - {self.tipo_movimiento}'
