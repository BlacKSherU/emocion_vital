from django.urls import include, path, re_path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)
urlpatterns = [
    path("", include(router.urls)),
    re_path("login", views.login),
    re_path("register", views.register),
    re_path("prueba", views.prueba),
]
