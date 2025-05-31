from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from api.models import Paciente
from django.contrib import messages


def home(request: HttpRequest):
    return render(request, "home.html")


def consultas(request: HttpRequest):
    return render(request, "consultas.html")


def precios(request: HttpRequest):
    return render(request, "precios.html")


def conoce(request: HttpRequest):
    return render(request, "conoce.html")


def perfil_personal(request: HttpRequest):
    print(request.POST)
    return redirect("perfil")


def perfil(request: HttpRequest):

    paciente = Paciente.objects.get(user=request.user)
    user = request.user
    datos = {
        "nombre": user.first_name,
        "apellido": user.last_name,
        "cedula": user.username,
        "correo": user.email,
    }
    return render(request, "panel-psicologa.html", datos)


def iniciar_sesion(request: HttpRequest):
    if request.method == "POST":
        user = authenticate(
            request, password=request.POST["password"], username=request.POST["usuario"]
        )
        print(request.POST)
        print(user)
        if user is not None:
            login(request, user)
            return redirect("perfil")
        messages.error(request, "contraseña invalida", "errror")

    return render(request, "login.html")


def registro(request: HttpRequest):
    if request.method == "POST":
        print(request.POST)
        existe = False
        try:
            user = User.objects.get(email=request.POST["correo"])
            messages.error(request, "correo ya registrado cambialo", "errror")
            existe = False
        except User.DoesNotExist:
            existe = True

        try:
            user = User.objects.get(username=request.POST["cedula"])
            messages.error(request, "cedula ya registrada cambiala", "errror")
            existe = False
        except User.DoesNotExist:
            if existe:
                existe = True
        if existe:
            user = User.objects.create_user(
                request.POST["cedula"],
                request.POST["correo"],
                request.POST["password"],
                first_name=request.POST["nombre"],
                last_name=request.POST["apellido"],
            )
            Paciente.objects.create(user=user)
            return redirect("perfil")
    return render(request, "registro.html")


def recuperar(request: HttpRequest):
    return render(request, "recuperar.html")
