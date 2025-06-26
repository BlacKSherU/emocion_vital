from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from oswald_api.models import Pacientes, Familiar, Cita
from django.contrib import messages
from django.contrib.messages import get_messages
import copy
from datetime import date


def home(request: HttpRequest):
    return render(request, "home.html")


def consultas(request: HttpRequest):
    return render(request, "consultas.html")


def precios(request: HttpRequest):
    return render(request, "precios.html")


def conoce(request: HttpRequest):
    return render(request, "conoce.html")


def iniciar_sesion(request: HttpRequest):
    if request.method == "POST":
        user = authenticate(
            request, password=request.POST["password"], username=request.POST["usuario"]
        )
        print(request.POST)
        print(user)
        if user is not None:
            login(request, user)
            return redirect("paciente")
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
            Pacientes.objects.create(
                user=user,
                primer_nombre=request.POST["nombre"],
                primer_apellido=request.POST["apellido"],
                pregunta_1=request.POST["pregunta1"],
                pregunta_2=request.POST["pregunta2"],
                pregunta_3=request.POST["pregunta3"],
                respuesta_1=request.POST["respuesta1"],
                respuesta_2=request.POST["respuesta2"],
                respuesta_3=request.POST["respuesta3"],
            )
            login(request, user)
            return redirect("paciente")
    return render(request, "registro.html")


def recuperar(request: HttpRequest):
    return render(request, "recuperar.html")


def paciente(request: HttpRequest):
    paciente = Pacientes.objects.get(user=request.user)
    return render(request, "panel-psicologa.html", {"pacienteid": paciente.id})


def psicologa(request: HttpRequest):
    user = request.user
    paciente = Pacientes.objects.get(user=user)
    return render(request, "panel-admin.html")
