from django.urls import path
from . import views

urlpatterns = [
    path("", views.prueba, name="index"),
    path("perfil", views.perfil, name="perfil"),
]

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
