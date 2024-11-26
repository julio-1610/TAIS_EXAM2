from django.urls import path
from .views import ProductoView, ActualizarInventarioView

urlpatterns = [
    path('productos/', ProductoView.as_view(),
         name='productos-list'),  # Obtener todos o crear
    path('productos/<str:id_producto>/', ProductoView.as_view(),
         name='producto-detail'),  # Obtener, actualizar o eliminar por id
    path('productos/<str:id_producto>/actualizar_inventario/',
         ActualizarInventarioView.as_view(), name='actualizar-inventario'),
]
