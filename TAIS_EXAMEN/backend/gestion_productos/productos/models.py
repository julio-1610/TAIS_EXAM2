from django.db import models
import boto3

from decimal import Decimal
from django.core.exceptions import ValidationError

# Conexión a DynamoDB
dynamodb = boto3.resource("dynamodb")
table_producto = dynamodb.Table("Producto")


class Producto(models.Model):
    id_producto = models.CharField(max_length=255, unique=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    categoria = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField(default=0)

    def __str__(self):
        return self.nombre

    def actualizar_inventario(self, cantidad):
        """Actualizar la cantidad del producto."""
        if cantidad < 0:
            raise ValidationError("La cantidad no puede ser negativa.")
        self.cantidad += cantidad  # Modificar la cantidad según el movimiento
        # Guardar el producto actualizado en DynamoDB
        table_producto.put_item(Item=self.to_dict())

    def to_dict(self):
        """Convierte el objeto producto a un diccionario para guardar en DynamoDB."""
        return {
            "id_producto": self.id_producto,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "categoria": self.categoria,
            "precio": str(self.precio),  # Convertir Decimal a string
            "cantidad": self.cantidad,
        }

    @staticmethod
    def obtener_producto_por_id(id_producto):
        """Obtiene un producto de DynamoDB por id_producto."""
        try:
            response = table_producto.get_item(Key={"id_producto": id_producto})
            return (
                Producto.from_dict(response.get("Item", {}))
                if "Item" in response
                else None
            )
        except Exception as e:
            print(f"Error al obtener producto: {e}")
            return None

    @staticmethod
    def from_dict(data):
        """Convierte un diccionario de DynamoDB a un objeto Producto."""
        producto = Producto()
        producto.id_producto = data.get("id_producto")
        producto.nombre = data.get("nombre")
        producto.descripcion = data.get("descripcion")
        producto.categoria = data.get("categoria")
        producto.precio = Decimal(data.get("precio"))
        producto.cantidad = int(data.get("cantidad"))
        return producto

    @staticmethod
    def guardar_producto(data):
        """Guarda un nuevo producto en DynamoDB."""

        table_producto.put_item(Item=data)

    @staticmethod
    def obtener_productos():
        """Obtiene todos los productos de DynamoDB."""
        response = table_producto.scan()
        return response.get("Items", [])

    @staticmethod
    def eliminar_producto(id_producto):
        """Elimina un producto de DynamoDB por id_producto."""
        try:
            response = table_producto.delete_item(Key={"id_producto": id_producto})
            if response.get("ResponseMetadata", {}).get("HTTPStatusCode") == 200:
                print(f"Producto con id {id_producto} eliminado correctamente.")
            else:
                print(f"Error al eliminar el producto con id {id_producto}.")
        except Exception as e:
            print(f"Error al eliminar producto: {e}")
