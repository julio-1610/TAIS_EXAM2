import boto3
import uuid
from django.db import models

# Conexión a DynamoDB
dynamodb = boto3.resource('dynamodb')
table_movimiento = dynamodb.Table('MovimientosInventario')


class Movimiento:
    """Modelo para manejar los movimientos en DynamoDB."""

    @staticmethod
    def guardar_movimiento(data):
        """Guarda un nuevo movimiento en DynamoDB."""
        # Generar un ID único si no existe
        if "id_movimiento" not in data:
            data["id_movimiento"] = str(uuid.uuid4())

        # Guardar el movimiento en DynamoDB
        table_movimiento.put_item(Item=data)

    @staticmethod
    def obtener_movimientos():
        """Obtiene todos los movimientos de inventario de DynamoDB."""
        response = table_movimiento.scan()
        return response.get('Items', [])

    @staticmethod
    def obtener_movimiento_por_id(id_movimiento):
        """Obtiene un movimiento por su ID."""
        try:
            response = table_movimiento.get_item(
                Key={"id_movimiento": id_movimiento})
            return response.get('Item', None)
        except Exception as e:
            print(f"Error al obtener movimiento: {e}")
            return None
