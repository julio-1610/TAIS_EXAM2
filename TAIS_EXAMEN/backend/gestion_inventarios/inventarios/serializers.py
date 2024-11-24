from rest_framework import serializers


class ProductoSerializer(serializers.Serializer):
    Code = serializers.CharField(max_length=255)
    Name = serializers.CharField(max_length=255)
    Price = serializers.DecimalField(max_digits=10, decimal_places=2)
