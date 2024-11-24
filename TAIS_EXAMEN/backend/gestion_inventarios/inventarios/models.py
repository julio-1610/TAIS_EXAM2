from django.db import models

# Create your models here.

import boto3
import uuid

dynamodb = boto3.resource("dynamodb")
table_producto = dynamodb.Table("Producto")


class Producto:

    @staticmethod
    def guardar_producto(data):
        """
        Guarda un nuevo producto en la tabla.
        """
        if "id_producto" not in data:
            # Generar un ID único si no existe
            data["id_producto"] = str(uuid.uuid4())
        table_producto.put_item(Item=data)

    @staticmethod
    def obtener_productos():
        """
        Obtiene todos los productos desde la tabla.
        """
        response = table_producto.scan()
        return response.get("Items", [])

    @staticmethod
    def obtener_producto_por_id(id_producto):
        """
        Obtiene un producto por su id_producto.
        """
        try:
            response = table_producto.get_item(
                Key={"id_producto": id_producto})
            # Retorna el producto si lo encuentra
            return response.get("Item", None)
        except Exception as e:
            print(f"Error al obtener producto: {e}")
            return None

    @staticmethod
    def eliminar_producto(id_producto):
        """
        Elimina un producto por su id_producto.
        """
        try:
            response = table_producto.delete_item(
                Key={"id_producto": id_producto})
            if response.get("ResponseMetadata", {}).get("HTTPStatusCode") == 200:
                print(
                    f"Producto con id {id_producto} eliminado correctamente.")
            else:
                print(f"Error al eliminar el producto con id {id_producto}.")
        except Exception as e:
            print(f"Error al eliminar producto: {e}")


class Movimiento:
    table = dynamodb.Table("MovimientosInventario")

    @staticmethod
    def guardar_producto(data):
        if "Code" not in data:
            data["Code"] = str(uuid.uuid4())
        Movimiento.table.put_item(Item=data)

    @staticmethod
    def obtener_productos():
        response = Movimiento.table.scan()
        return response.get("Items", [])
