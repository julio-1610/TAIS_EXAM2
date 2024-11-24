import requests

id_producto = "cod-1245"
producto_url = f"http://127.0.0.1:8000/api/productos/{id_producto}/"

try:
    response = requests.get(producto_url)
    if response.status_code == 200:
        producto = response.json()
        print("Producto encontrado:", producto)
    elif response.status_code == 404:
        print("Producto no encontrado en el microservicio de productos.")
    else:
        print("Error desconocido al consultar el microservicio de productos:",
              response.status_code)
except requests.exceptions.RequestException as e:
    print("Error de conexión con el microservicio de productos:", e)
