from django.urls import path
from .views import ProductoView, MovimientoView

urlpatterns = [
    path("productos/", ProductoView.as_view()),
    path("movimiento/", MovimientoView.as_view()),
]
