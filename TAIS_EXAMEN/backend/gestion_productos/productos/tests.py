from rest_framework.test import APITestCase
from rest_framework import status
from .models import Producto
import uuid


class ProductoAPITests(APITestCase):

    def setUp(self):
        # Crear un producto de prueba
        self.producto_data = {
            'id_producto': str(uuid.uuid4()),
            'nombre': 'Producto Test',
            'descripcion': 'Este es un producto de prueba',
            'categoria': 'Categoría Test',
            'precio': '100.00',  # Puede ser un string o Decimal en el modelo
            'cantidad': 50
        }
        self.url = '/productos/'

    def test_crear_producto(self):
        # Probar la creación de un producto
        response = self.client.post(
            self.url, self.producto_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nombre'], self.producto_data['nombre'])

    def test_obtener_producto(self):
        # Crear un producto y obtenerlo por ID
        producto = Producto.objects.create(**self.producto_data)
        response = self.client.get(f'/productos/{producto.id_producto}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], producto.nombre)

    def test_actualizar_producto(self):
        # Crear un producto y actualizarlo
        producto = Producto.objects.create(**self.producto_data)
        updated_data = {
            'nombre': 'Producto Actualizado',
            'descripcion': 'Descripción actualizada',
            'precio': '150.00',
            'cantidad': 60
        }
        response = self.client.put(
            f'/productos/{producto.id_producto}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], updated_data['nombre'])

    def test_eliminar_producto(self):
        # Crear un producto y eliminarlo
        producto = Producto.objects.create(**self.producto_data)
        response = self.client.delete(f'/productos/{producto.id_producto}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_actualizar_inventario(self):
        # Crear un producto y actualizar su inventario
        producto = Producto.objects.create(**self.producto_data)
        update_data = {'cantidad': 20}
        response = self.client.post(
            f'/productos/{producto.id_producto}/actualizar_inventario/', update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        producto.refresh_from_db()  # Refrescar desde la DB para obtener los datos actualizados
        self.assertEqual(producto.cantidad,
                         self.producto_data['cantidad'] + 20)
