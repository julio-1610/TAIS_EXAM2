from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Producto, Movimiento
from .serializers import ProductoSerializer, MovimientoSerializer


class ProductoView(APIView):
    def post(self, request):
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            Producto.guardar_producto(serializer.data)
            return Response(
                {"message": "Producto registrado exitosamente"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        productos = Producto.obtener_productos()
        return Response(productos, status=status.HTTP_200_OK)


class MovimientoView(APIView):
    def post(self, request):
        serializer = MovimientoSerializer(data=request.data)
        if serializer.is_valid():
            Movimiento.guardar_producto(serializer.data)
            return Response(
                {"message": "Movimiento registrado exitosamente"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        movimientos = Movimiento.obtener_productos()
        return Response(movimientos, status=status.HTTP_200_OK)
