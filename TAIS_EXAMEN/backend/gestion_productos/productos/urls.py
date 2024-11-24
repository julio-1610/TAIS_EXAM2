
from django.urls import path
from productos.views import ProductoView, ActualizarInventarioView

urlpatterns = [
    path('productos/', ProductoView.as_view()),
    path('productos/<str:id_producto>/', ProductoView.as_view()),
    path('productos/<str:id_producto>/actualizar_inventario/',
         ActualizarInventarioView.as_view()),
]
