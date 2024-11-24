import boto3
from decimal import Decimal

# Configura la conexión a DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Producto')

# Consulta todos los productos (o los productos que necesites modificar)
response = table.scan()

for item in response['Items']:
    # Eliminar el atributo antiguo 'precio_unitario'
    if 'precio_unitario' in item:
        # Convierte el valor a Float (Decimal)
        # Usamos Decimal para representar Float
        nuevo_precio = Decimal(item['precio_unitario'])
        # Actualiza el item eliminando el atributo antiguo y añadiendo el nuevo
        table.update_item(
            # Usa tu clave primaria aquí
            Key={'id_producto': item['id_producto']},
            UpdateExpression='REMOVE precio_unitario SET precio = :val',
            ExpressionAttributeValues={':val': nuevo_precio}
        )
        print(f"Producto {item['id_producto']} actualizado")
