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
        if "id_movimiento" not in requestid or not requestid["id_movimiento"]:
            requestid["id_movimiento"] = str(uuid.uuid4())
        serializer = MovimientoSerializer(data=requestid)
        if serializer.is_valid():
            # Guardar el movimiento
            movimiento = serializer.validated_data
            Movimiento.guardar_movimiento(movimiento)

            # Llamar al microservicio de productos para actualizar el inventario
            producto_url = f"https://ohxkv3ewre.execute-api.us-east-2.amazonaws.com/dev/api/productos/{movimiento['id_producto']}/actualizar_inventario/"
            print(producto_url)
            cantidad = (
                movimiento["cantidad"]
                if movimiento["tipo_movimiento"] == "entrada"
                else -movimiento["cantidad"]
            )

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
