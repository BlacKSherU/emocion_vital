from django.shortcuts import render


def home(request):
    return render(request, "home.html")


def consultas(request):
    return render(request, "consultas.html")


def precios(request):
    return render(request, "precios.html")


def conoce(request):
    return render(request, "conoce.html")


def perfil(request):
    return render(request, "perfil.html")


def prueba(request):
    return render(request, "usuario.html")
