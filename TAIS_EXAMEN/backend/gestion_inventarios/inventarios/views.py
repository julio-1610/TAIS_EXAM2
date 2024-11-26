import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Movimiento
import uuid
from .serializers import MovimientoSerializer


class MovimientoView(APIView):
    def get(self, request, id_movimiento=None):
        if id_movimiento:
            movimiento = Movimiento.obtener_movimiento_por_id(id_movimiento)
            if movimiento:
                return Response(movimiento, status=status.HTTP_200_OK)
            return Response(
                {"message": "Movimiento no encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )
        movimientos = Movimiento.obtener_movimientos()
        return Response(movimientos, status=status.HTTP_200_OK)

    def post(self, request):
        requestid = request.data

        # Generar ID de movimiento si no está presente
        if "id_movimiento" not in requestid or not requestid["id_movimiento"]:
            requestid["id_movimiento"] = str(uuid.uuid4())

        serializer = MovimientoSerializer(data=requestid)

        if serializer.is_valid():
            # Validar el tipo de movimiento
            tipo_movimiento = requestid.get("tipo_movimiento")
            if tipo_movimiento not in ["entrada", "salida"]:
                return Response(
                    {"message": "El tipo de movimiento debe ser 'entrada' o 'salida'."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validación para movimiento de salida: Verificar que no se exceda la cantidad disponible
            if tipo_movimiento == "salida":
                # Obtener la cantidad actual del producto
                id_producto = requestid["id_producto"]
                producto_url = f"https://ohxkv3ewre.execute-api.us-east-2.amazonaws.com/dev/api/productos/{id_producto}/"
                response_producto = requests.get(producto_url)

                if response_producto.status_code == 200:
                    producto = response_producto.json()
                    cantidad_actual = producto.get("cantidad", 0)

                    if cantidad_actual < requestid["cantidad"]:
                        return Response(
                            {
                                "message": "La cantidad de salida no puede ser mayor a la cantidad disponible del producto."
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    return Response(
                        {
                            "message": "Producto no encontrado en el microservicio de productos."
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )

            # Si las validaciones son correctas, guardar el movimiento
            movimiento = serializer.validated_data
            Movimiento.guardar_movimiento(movimiento)

            # Llamar al microservicio de productos para actualizar el inventario
            cantidad = (
                movimiento["cantidad"]
                if tipo_movimiento == "entrada"
                else -movimiento["cantidad"]
            )
            producto_url = f"https://ohxkv3ewre.execute-api.us-east-2.amazonaws.com/dev/api/productos/{movimiento['id_producto']}/actualizar_inventario/"
            print(producto_url)

            response = requests.post(producto_url, json={"cantidad": cantidad})
            print(response)

            if response.status_code == 200:
                return Response(
                    {"message": "Movimiento registrado y producto actualizado"},
                    status=status.HTTP_201_CREATED,
                )
            elif response.status_code == 404:
                return Response(
                    {
                        "message": "Producto no encontrado en el microservicio de productos"
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {"message": "Error al actualizar el inventario"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id_movimiento):
        try:
            # Eliminar el movimiento usando el método estático del modelo
            response = Movimiento.eliminar_movimiento(id_movimiento)

            if response.get("ResponseMetadata", {}).get("HTTPStatusCode") == 200:
                return Response(
                    {
                        "message": f"Movimiento con ID {id_movimiento} eliminado correctamente."
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Error al eliminar el movimiento."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        except ValueError as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"message": f"Error inesperado: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
