from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("consultas", views.consultas, name="consultas"),
    path("precios", views.precios, name="precios"),
    path("conoce", views.conoce, name="conoce"),
    path("perfil", views.perfil, name="perfil"),
    path("perfil/formdatos", views.perfil_personal, name="perfil_formdatos"),
    path("login", views.iniciar_sesion, name="login"),
    path("registro", views.registro, name="registro"),
    path("recuperar", views.recuperar, name="recuperar"),
]

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
