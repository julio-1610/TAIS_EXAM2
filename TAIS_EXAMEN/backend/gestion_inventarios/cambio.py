import requests
import json

# Lista de productos a insertar
productos = [
    # Electrónica
    {
        "id_producto": "e1d2f3g4h5i6",
        "nombre": "Smartphone XYZ",
        "descripcion": "Smartphone de última generación con pantalla AMOLED de 6.5 pulgadas.",
        "categoria": "Electrónica",
        "precio": "499.99",
        "cantidad": 50
    },
    {
        "id_producto": "e7d8f9g0h1i2",
        "nombre": "Laptop Gaming ABC",
        "descripcion": "Laptop para juegos con tarjeta gráfica GTX 1660 y 16GB de RAM.",
        "categoria": "Electrónica",
        "precio": "1200.00",
        "cantidad": 30
    },
    {
        "id_producto": "e3d4f5g6h7i8",
        "nombre": "Auriculares Bluetooth",
        "descripcion": "Auriculares inalámbricos con cancelación de ruido y batería de 20 horas.",
        "categoria": "Electrónica",
        "precio": "89.99",
        "cantidad": 100
    },

    # Ropa
    {
        "id_producto": "r1d2f3g4h5i6",
        "nombre": "Camiseta Casual",
        "descripcion": "Camiseta de algodón para uso diario, disponible en varios colores.",
        "categoria": "Ropa",
        "precio": "19.99",
        "cantidad": 200
    },
    {
        "id_producto": "r7d8f9g0h1i2",
        "nombre": "Jeans Ajustados",
        "descripcion": "Jeans de corte ajustado para un look moderno y cómodo.",
        "categoria": "Ropa",
        "precio": "39.99",
        "cantidad": 150
    },
    {
        "id_producto": "r3d4f5g6h7i8",
        "nombre": "Chaqueta de Invierno",
        "descripcion": "Chaqueta de lana para mantener el calor en climas fríos.",
        "categoria": "Ropa",
        "precio": "89.99",
        "cantidad": 80
    },

    # Alimentos
    {
        "id_producto": "a1d2f3g4h5i6",
        "nombre": "Arroz Integral",
        "descripcion": "Arroz integral de calidad, ideal para una dieta saludable.",
        "categoria": "Alimentos",
        "precio": "2.50",
        "cantidad": 500
    },
    {
        "id_producto": "a7d8f9g0h1i2",
        "nombre": "Aceite de Oliva",
        "descripcion": "Aceite de oliva extra virgen, 100% natural.",
        "categoria": "Alimentos",
        "precio": "5.99",
        "cantidad": 300
    },
    {
        "id_producto": "a3d4f5g6h7i8",
        "nombre": "Cereal de Avena",
        "descripcion": "Cereal de avena con frutas y alto contenido de fibra.",
        "categoria": "Alimentos",
        "precio": "4.50",
        "cantidad": 250
    }
]

# URL de la API para insertar los productos
url_api = "http://127.0.0.1:8001/api/productos/"

# Enviar cada producto a la API
for producto in productos:
    response = requests.post(url_api, json=producto)

    if response.status_code == 201:
        print(f"Producto {producto['nombre']} insertado correctamente.")
    else:
        print(
            f"Error al insertar el producto {producto['nombre']}: {response.status_code}")
