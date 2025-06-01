from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from api.models import Paciente, Familiar, Cita
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


def agregarFamiliar(request: HttpRequest):
    print(request.POST)
    try:
        User.objects.get(username=request.POST["familiar-cedula"])
        existe = True
    except User.DoesNotExist:
        existe = False
    if existe:
        messages.warning(
            request,
            "ya esta registrada una persona con esa cedula nombre XXXXXXX",
            "alguien con esa cedula ya esta registrado",
        )
    else:
        user = User.objects.create_user(
            username=request.POST["familiar-cedula"],
            password=request.POST["familiar-cedula"],
            first_name=request.POST["familiar-nombre"],
            last_name=request.POST["familiar-apellido"],
        )
        paciente = Paciente.objects.create(
            user=user, Feche_de_nacimiento=request.POST["familiar-fechaNacimiento"]
        )
        paciente.save()
        familiar = Familiar.objects.create(
            user1=request.user,
            user2=user,
            relacion=request.POST["familiar-parentesco"],
        )
        user = request.user
        paciente = Paciente.objects.get(user=user)
        paciente.familiares.add(familiar)
        request.session["pantalla"] = "familiares"
    return redirect("perfil")


def perfil_personal(request: HttpRequest):
    print(request.POST)
    user = request.user
    paciente = Paciente.objects.get(user=user)
    user.first_name = request.POST["nombres"]
    user.last_name = request.POST["apellidos"]
    paciente.Feche_de_nacimiento = request.POST["fechaNacimiento"]
    paciente.Lugar_de_nacimiento = request.POST["lugarNacimiento"]
    paciente.Instruccion_paciente = request.POST["nivelInstruccion"]
    paciente.Ocupacion_paciente = request.POST["ocupacion"]
    user.username = request.POST["cedula"]
    paciente.Telefono_paciente = request.POST["telefono"]
    user.email = request.POST["correo"]
    paciente.Estado_civil_paciente = request.POST["estadoCivil"]
    paciente.Religion_paciente = request.POST["religion"]
    paciente.Centros_estudios_trabajos = request.POST["centroTrabajo"]
    paciente.Grado_paciente = request.POST["grado"]
    paciente.Ciclo_paciente = request.POST["ciclo"]
    paciente.Lugar_residencia_paciente = request.POST["lugarResidencia"]
    paciente.sexo = request.POST["sexo"]
    paciente.Cantidad_tiempo_residencia_paciente = request.POST["tiempoResidencia"]
    paciente.Tiempo_residencia_paciente = request.POST["tiempoResidenciaUnidad"]
    paciente.save()
    user.save()
    return redirect("perfil")


def agendarcita(request: HttpRequest):
    print(request.POST)
    user = request.user
    paciente = Paciente.objects.get(user=user)
    cita = Cita.objects.create(
        paciente=paciente,
    )


def perfil(request: HttpRequest):

    paciente = Paciente.objects.get(user=request.user)
    user = request.user
    familiares = paciente.familiares.all()
    print(get_messages(request))
    familiar_final = []
    for familiar in familiares:
        usuario_familiar = copy.deepcopy(familiar.user2)
        familiar_final.append(
            {
                "paciente": Paciente.objects.get(user=usuario_familiar),
                "relacion": familiar.relacion,
            }
        )
    print(familiar_final)
    datos = {
        "nombre": user.first_name,
        "apellido": user.last_name,
        "cedula": user.username,
        "correo": user.email,
        "lugarNacimiento": paciente.Lugar_de_nacimiento,
        "nivelInstruccion": paciente.Instruccion_paciente,
        "ocupacion": paciente.Ocupacion_paciente,
        "telefono": paciente.Telefono_paciente,
        "estadoCivil": paciente.Estado_civil_paciente,
        "religion": paciente.Religion_paciente,
        "centroTrabajo": paciente.Centros_estudios_trabajos,
        "grado": paciente.Grado_paciente,
        "ciclo": paciente.Ciclo_paciente,
        "lugarResidencia": paciente.Lugar_residencia_paciente,
        "sexo": paciente.sexo,
        "tiempoResidencia": paciente.Cantidad_tiempo_residencia_paciente,
        "tiempoResidenciaUnidad": paciente.Tiempo_residencia_paciente,
        "familiares": familiar_final,
        "fecha_actual": date.today(),
    }
    try:
        datos["fechaNacimiento"] = paciente.Feche_de_nacimiento.strftime("%Y-%m-%d")
    except:
        pass
    copia = copy.deepcopy(datos)
    for key in copia.keys():
        if datos[key] is None:
            datos.pop(key)
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
            login(request, user)
            return redirect("perfil")
    return render(request, "registro.html")


def recuperar(request: HttpRequest):
    return render(request, "recuperar.html")
