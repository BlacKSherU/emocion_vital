from django.urls import path
from . import views

urlpatterns = [
    path("usuario", views.prueba, name="ususario"),
    path("", views.home, name="home"),
    path("consultas", views.consultas, name="consultas"),
    path("precios", views.precios, name="precios"),
    path("conoce", views.conoce, name="conoce"),
    path("perfil", views.perfil, name="perfil"),
]

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
