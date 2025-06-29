from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from oswald_api.models import Pacientes, Familiar, Cita
from django.contrib import messages
from django.contrib.messages import get_messages
import copy
from datetime import date
import re


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
        tipo_documento = request.POST.get("tipo_documento", "").strip()
        cedula = request.POST.get("cedula", "").strip()
        password = request.POST.get("password", "")

        # Crear username combinado (tipo + número)
        username = f"{tipo_documento}{cedula}"

        user = authenticate(request, password=password, username=username)
        print(request.POST)
        print(f"Username intentado: {username}")
        print(user)
        if user is not None:
            login(request, user)
            return redirect("paciente")
        messages.error(request, "Credenciales inválidas", "error")

    return render(request, "login.html")


def registro(request: HttpRequest):
    if request.method == "POST":
        print(request.POST)

        # Validaciones
        errores = []

        # Validar que todos los campos requeridos estén presentes
        campos_requeridos = [
            "nombre",
            "apellido",
            "tipo_documento",
            "cedula",
            "correo",
            "password",
            "pregunta1",
            "pregunta2",
            "pregunta3",
            "respuesta1",
            "respuesta2",
            "respuesta3",
        ]

        for campo in campos_requeridos:
            if not request.POST.get(campo, "").strip():
                errores.append(
                    f"El campo {campo.replace('_', ' ').title()} es obligatorio"
                )

        # Validar tipo de documento
        tipo_documento = request.POST.get("tipo_documento", "").strip()
        if tipo_documento and tipo_documento not in ["V", "E", "J"]:
            errores.append("El tipo de documento debe ser V, E o J")

        # Validar formato de cédula (solo números)
        cedula = request.POST.get("cedula", "").strip()
        if cedula and not cedula.isdigit():
            errores.append("El número de documento debe contener solo números")

        # Validar formato de correo
        email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        correo = request.POST.get("correo", "").strip()
        if correo and not re.match(email_pattern, correo):
            errores.append("El formato del correo electrónico no es válido")

        # Validar longitud de contraseña
        password = request.POST.get("password", "")
        if password and len(password) < 6:
            errores.append("La contraseña debe tener al menos 6 caracteres")

        # Obtener preguntas y respuestas de seguridad
        pregunta1 = request.POST.get("pregunta1", "").strip()
        pregunta2 = request.POST.get("pregunta2", "").strip()
        pregunta3 = request.POST.get("pregunta3", "").strip()
        respuesta1 = request.POST.get("respuesta1", "").strip()
        respuesta2 = request.POST.get("respuesta2", "").strip()
        respuesta3 = request.POST.get("respuesta3", "").strip()

        # Validar que las preguntas no estén vacías
        if not pregunta1 or not pregunta2 or not pregunta3:
            errores.append("Debes seleccionar las tres preguntas de seguridad")

        # Validar que las respuestas no estén vacías
        if not respuesta1 or not respuesta2 or not respuesta3:
            errores.append("Todas las respuestas de seguridad son obligatorias")

        # Verificar si el correo ya existe
        try:
            user = User.objects.get(email=correo)
            errores.append("Este correo ya está registrado")
        except User.DoesNotExist:
            pass

        # Crear username combinado para validación
        username = f"{tipo_documento}{cedula}"

        # Verificar si el username ya existe
        try:
            user = User.objects.get(username=username)
            errores.append(
                f"Ya existe un usuario con documento {tipo_documento}-{cedula}"
            )
        except User.DoesNotExist:
            pass

        # Verificar si el documento ya existe (tipo + número) pero solo si está activo
        try:
            paciente_existente = Pacientes.objects.get(
                tipo_documento=tipo_documento, n_documento=cedula
            )
            # Solo mostrar error si el paciente está activo
            if paciente_existente.status == "activo":
                errores.append(
                    f"Ya existe un usuario activo con documento {tipo_documento}-{cedula}"
                )
        except Pacientes.DoesNotExist:
            pass

        # Si hay errores, mostrarlos y no continuar
        if errores:
            for error in errores:
                messages.error(request, error, "error")
            return render(request, "registro.html")

        # Si no hay errores, crear o actualizar el usuario
        try:
            # Verificar si existe un paciente inactivo con el mismo documento
            paciente_inactivo = None
            try:
                paciente_inactivo = Pacientes.objects.get(
                    tipo_documento=tipo_documento, n_documento=cedula, status="inactivo"
                )
            except Pacientes.DoesNotExist:
                pass

            if paciente_inactivo:
                # Actualizar paciente inactivo existente
                user = paciente_inactivo.user

                # Crear username combinado
                username = f"{tipo_documento}{cedula}"

                # Actualizar datos del usuario
                user.username = username
                user.first_name = request.POST["nombre"]
                user.last_name = request.POST["apellido"]
                user.email = correo
                user.set_password(password)
                user.save()

                # Obtener segundo nombre y segundo apellido si existen
                segundo_nombre = request.POST.get("segundo_nombre", "").strip()
                segundo_apellido = request.POST.get("segundo_apellido", "").strip()

                # Actualizar datos del paciente
                paciente_inactivo.primer_nombre = request.POST["nombre"]
                paciente_inactivo.segundo_nombre = segundo_nombre
                paciente_inactivo.primer_apellido = request.POST["apellido"]
                paciente_inactivo.segundo_apellido = segundo_apellido
                paciente_inactivo.pregunta_1 = pregunta1
                paciente_inactivo.pregunta_2 = pregunta2
                paciente_inactivo.pregunta_3 = pregunta3
                paciente_inactivo.respuesta_1 = respuesta1
                paciente_inactivo.respuesta_2 = respuesta2
                paciente_inactivo.respuesta_3 = respuesta3
                paciente_inactivo.status = "activo"
                paciente_inactivo.save()

                messages.success(request, "Cuenta reactivada exitosamente", "success")

            else:
                # Crear username combinado
                username = f"{tipo_documento}{cedula}"

                # Crear nuevo usuario y paciente
                user = User.objects.create_user(
                    username=username,
                    email=correo,
                    password=password,
                    first_name=request.POST["nombre"],
                    last_name=request.POST["apellido"],
                )

                # Crear el paciente con todos los datos
                paciente = Pacientes.objects.create(
                    user=user,
                    primer_nombre=request.POST["nombre"],
                    segundo_nombre=request.POST.get("segundo_nombre", "").strip(),
                    primer_apellido=request.POST["apellido"],
                    segundo_apellido=request.POST.get("segundo_apellido", "").strip(),
                    tipo_documento=tipo_documento,  # Guardar el tipo de documento
                    n_documento=cedula,  # Guardar el número de documento
                    pregunta_1=pregunta1,
                    pregunta_2=pregunta2,
                    pregunta_3=pregunta3,
                    respuesta_1=respuesta1,
                    respuesta_2=respuesta2,
                    respuesta_3=respuesta3,
                    status="activo",  # Establecer estado activo por defecto
                )

                messages.success(request, "Registro exitoso", "success")

            login(request, user)
            return redirect("paciente")

        except Exception as e:
            messages.error(
                request, f"Error al crear/actualizar el usuario: {str(e)}", "error"
            )
            return render(request, "registro.html")

    return render(request, "registro.html")


def recuperar(request: HttpRequest):
    if request.method == "POST":
        if "cedula" in request.POST:
            # Paso 1: Verificar que la cédula existe
            tipo_documento = request.POST.get("tipo_documento", "").strip()
            cedula = request.POST.get("cedula", "").strip()
            username = f"{tipo_documento}{cedula}"

            try:
                user = User.objects.get(username=username)
                paciente = Pacientes.objects.get(user=user)
                # Guardar el usuario en la sesión para el siguiente paso
                request.session["recuperar_user_id"] = user.id
                return render(
                    request,
                    "recuperar.html",
                    {"step": "preguntas", "paciente": paciente},
                )
            except (User.DoesNotExist, Pacientes.DoesNotExist):
                messages.error(request, "Documento no encontrado", "error")
                return render(request, "recuperar.html", {"step": "cedula"})

        elif (
            "respuesta1" in request.POST
            and "respuesta2" in request.POST
            and "respuesta3" in request.POST
        ):
            # Paso 2: Verificar las respuestas de seguridad
            user_id = request.session.get("recuperar_user_id")
            if not user_id:
                messages.error(request, "Sesión expirada, intenta nuevamente", "error")
                return render(request, "recuperar.html", {"step": "cedula"})

            try:
                user = User.objects.get(id=user_id)
                paciente = Pacientes.objects.get(user=user)

                # Verificar las respuestas
                if (
                    paciente.respuesta_1.lower().strip()
                    == request.POST["respuesta1"].lower().strip()
                    and paciente.respuesta_2.lower().strip()
                    == request.POST["respuesta2"].lower().strip()
                    and paciente.respuesta_3.lower().strip()
                    == request.POST["respuesta3"].lower().strip()
                ):

                    # Respuestas correctas, mostrar formulario de nueva contraseña
                    return render(
                        request,
                        "recuperar.html",
                        {"step": "nueva_password", "user_id": user_id},
                    )
                else:
                    messages.error(request, "Respuestas incorrectas", "error")
                    return render(
                        request,
                        "recuperar.html",
                        {"step": "preguntas", "paciente": paciente},
                    )
            except (User.DoesNotExist, Pacientes.DoesNotExist):
                messages.error(request, "Usuario no encontrado", "error")
                return render(request, "recuperar.html", {"step": "cedula"})

        elif "nueva_password" in request.POST:
            # Paso 3: Cambiar la contraseña
            user_id = request.session.get("recuperar_user_id")
            if not user_id:
                messages.error(request, "Sesión expirada, intenta nuevamente", "error")
                return render(request, "recuperar.html", {"step": "cedula"})

            nueva_password = request.POST["nueva_password"]
            confirmar_password = request.POST.get("confirmar_password", "")

            # Validar que las contraseñas coincidan
            if nueva_password != confirmar_password:
                messages.error(request, "Las contraseñas no coinciden", "error")
                return render(
                    request,
                    "recuperar.html",
                    {"step": "nueva_password", "user_id": user_id},
                )

            # Validar longitud mínima
            if len(nueva_password) < 6:
                messages.error(
                    request, "La contraseña debe tener al menos 6 caracteres", "error"
                )
                return render(
                    request,
                    "recuperar.html",
                    {"step": "nueva_password", "user_id": user_id},
                )

            try:
                user = User.objects.get(id=user_id)
                user.set_password(nueva_password)
                user.save()

                # Limpiar la sesión
                if "recuperar_user_id" in request.session:
                    del request.session["recuperar_user_id"]

                messages.success(request, "Contraseña cambiada exitosamente", "success")
                return redirect("login")
            except User.DoesNotExist:
                messages.error(request, "Usuario no encontrado", "error")
                return render(request, "recuperar.html", {"step": "cedula"})

    # GET request - mostrar formulario inicial
    return render(request, "recuperar.html", {"step": "cedula"})


def paciente(request: HttpRequest):
    paciente = Pacientes.objects.filter(user=request.user).first()
    if not paciente:
        # Si no hay paciente, crear uno o manejar el error
        messages.error(request, "No se encontró el paciente asociado al usuario", "error")
        return redirect("login")
    return render(request, "panel-psicologa.html", {"pacienteid": paciente.id})


def psicologa(request: HttpRequest):
    user = request.user
    paciente = Pacientes.objects.filter(user=user).first()
    if not paciente:
        messages.error(request, "No se encontró el paciente asociado al usuario", "error")
        return redirect("login")
    return render(request, "panel-admin.html")
