from django.shortcuts import render


def prueba(request):
    return render(request, "usuario.html")


def perfil(request):
    return render(request, "perfil.html")
