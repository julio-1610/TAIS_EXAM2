from django.urls import path
from .views import MovimientoView

urlpatterns = [

    path('movimientos/', MovimientoView.as_view(), name='movimientos'),
    path('movimientos/<str:id_movimiento>/',
         MovimientoView.as_view(), name='movimiento_detalle'),
]
