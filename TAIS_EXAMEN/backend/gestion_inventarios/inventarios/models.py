from django.db import models

# Create your models here.

import boto3
import uuid

dynamodb = boto3.resource("dynamodb")


class Producto:
    table = dynamodb.Table("Products")

    @staticmethod
    def guardar_producto(data):
        if "Code" not in data:
            data["Code"] = str(uuid.uuid4())
        Producto.table.put_item(Item=data)

    @staticmethod
    def obtener_productos():
        response = Producto.table.scan()
        return response.get("Items", [])
