from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("consultas", views.consultas, name="consultas"),
    path("precios", views.precios, name="precios"),
    path("conoce", views.conoce, name="conoce"),
    path("login", views.iniciar_sesion, name="login"),
    path("registro", views.registro, name="registro"),
    path("recuperar", views.recuperar, name="recuperar"),
    path("paciente", views.paciente, name="paciente"),
    path("psicologa", views.psicologa, name="psicologa"),
]

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
