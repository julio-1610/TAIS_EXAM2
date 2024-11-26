from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Producto
from .serializers import ProductoSerializer
import uuid


class ProductoView(APIView):
    def get(self, request, id_producto=None):
        if id_producto:
            producto = Producto.obtener_producto_por_id(id_producto)
            if producto:
                return Response(
                    ProductoSerializer(
                        producto).data, status=status.HTTP_200_OK
                )
            return Response(
                {"message": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
        productos = Producto.obtener_productos()
        return Response(
            ProductoSerializer(
                productos, many=True).data, status=status.HTTP_200_OK
        )

    def post(self, request):
        requestid = request.data
        if "id_producto" not in requestid or not requestid["id_producto"]:
            requestid["id_producto"] = str(uuid.uuid4())
        serializer = ProductoSerializer(data=requestid)
        if serializer.is_valid():
            Producto.guardar_producto(serializer.validated_data)
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # Método PUT para actualizar un producto

    def put(self, request, id_producto):
        producto = Producto.obtener_producto_por_id(id_producto)
        if not producto:
            return Response(
                {"message": "Producto no encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Actualizar el producto con los nuevos datos proporcionados
        serializer = ProductoSerializer(
            producto, data=request.data, partial=True)
        if serializer.is_valid():
            # Actualizamos el producto en DynamoDB
            Producto.guardar_producto(serializer.validated_data)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Método DELETE para eliminar un producto
    def delete(self, request, id_producto):
        producto = Producto.obtener_producto_por_id(id_producto)
        if not producto:
            return Response(
                {"message": "Producto no encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Eliminar el producto
        Producto.eliminar_producto(id_producto)
        return Response({"message": "Producto eliminado correctamente"}, status=status.HTTP_200_OK)


class ActualizarInventarioView(APIView):
    def post(self, request, id_producto):
        try:
            producto = Producto.obtener_producto_por_id(id_producto)
            if not producto:
                return Response(
                    {"message": "Producto no encontrado"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Obtener la cantidad a actualizar desde el cuerpo de la solicitud
            cantidad = request.data.get("cantidad", 0)
            if not isinstance(cantidad, int):
                return Response(
                    {"message": "Cantidad inválida"}, status=status.HTTP_400_BAD_REQUEST
                )

            # Actualizar la cantidad
            producto.actualizar_inventario(cantidad)
            return Response(
                {"message": "Inventario actualizado correctamente"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"message": f"Error al actualizar inventario: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
