import boto3
from decimal import Decimal
from django.core.exceptions import ValidationError

# Conexión a DynamoDB
dynamodb = boto3.resource("dynamodb")
table_movimiento = dynamodb.Table("MovimientosInventario")


class Movimiento:
    """Modelo para manejar los movimientos en DynamoDB."""

    @staticmethod
    def guardar_movimiento(data):
        """Guarda un nuevo movimiento en DynamoDB."""
        # Validar los datos antes de guardar
        Movimiento.validate_data(data)

        try:
            # Guardar el movimiento en DynamoDB
            table_movimiento.put_item(Item=data)
        except Exception as e:
            raise ValueError(f"Error al guardar movimiento: {e}")

    @staticmethod
    def actualizar_movimiento(id_movimiento, data):
        """Actualiza un movimiento existente en DynamoDB."""
        # Asegurarse de que el movimiento existe
        movimiento = Movimiento.obtener_movimiento_por_id(id_movimiento)
        if not movimiento:
            raise ValueError("Movimiento no encontrado.")

        # Validar los nuevos datos
        Movimiento.validate_data(data)

        try:
            # Actualizar el movimiento en DynamoDB
            table_movimiento.update_item(
                Key={"id_movimiento": id_movimiento},
                UpdateExpression="SET cantidad = :cantidad, descripcion = :descripcion, precio = :precio",
                ExpressionAttributeValues={
                    ":cantidad": data.get("cantidad", movimiento["cantidad"]),
                    ":descripcion": data.get("descripcion", movimiento["descripcion"]),
                    ":precio": data.get("precio", movimiento["precio"]),
                },
            )
        except Exception as e:
            raise ValueError(f"Error al actualizar el movimiento: {e}")

    @staticmethod
    def eliminar_movimiento(id_movimiento):
        """Elimina un movimiento de inventario en DynamoDB."""
        try:
            response = table_movimiento.delete_item(
                Key={"id_movimiento": id_movimiento}
            )
            return response
        except Exception as e:
            raise ValueError(f"Error al eliminar el movimiento: {e}")

    @staticmethod
    def obtener_movimientos():
        """Obtiene todos los movimientos de inventario de DynamoDB."""
        try:
            response = table_movimiento.scan()
            return response.get("Items", [])
        except Exception as e:
            raise ValueError(f"Error al obtener movimientos: {e}")

    @staticmethod
    def obtener_movimiento_por_id(id_movimiento):
        """Obtiene un movimiento por su ID."""
        try:
            response = table_movimiento.get_item(
                Key={"id_movimiento": id_movimiento})
            return response.get("Item", None)
        except Exception as e:
            raise ValueError(f"Error al obtener el movimiento: {e}")

    @staticmethod
    def obtener_movimientos_por_fecha(inicio, fin):
        """Obtiene los movimientos en un rango de fechas."""
        # Asumiendo que la tabla tiene un campo 'fecha' de tipo string
        try:
            response = table_movimiento.scan(
                FilterExpression="fecha BETWEEN :inicio AND :fin",
                ExpressionAttributeValues={":inicio": inicio, ":fin": fin},
            )
            return response.get("Items", [])
        except Exception as e:
            raise ValueError(f"Error al obtener movimientos por fecha: {e}")

    @staticmethod
    def validate_data(data):
        """Valida los datos antes de guardarlos."""
        if "cantidad" in data and (data["cantidad"] < 0 or data["cantidad"] is None):
            raise ValidationError("La cantidad no puede ser negativa o nula.")
        if "descripcion" in data and len(data["descripcion"]) < 5:
            raise ValidationError(
                "La descripción debe tener al menos 5 caracteres.")
        if "precio" in data and (data["precio"] is None or data["precio"] < 0):
            raise ValidationError("El precio no puede ser nulo o negativo.")

        # Validación del tipo de movimiento
        if "tipo_movimiento" in data:
            tipo = data["tipo_movimiento"].lower()
            if tipo not in ["entrada", "salida"]:
                raise ValidationError(
                    "El tipo de movimiento debe ser 'entrada' o 'salida'.")
        else:
            raise ValidationError("El tipo de movimiento es obligatorio.")
