# Proyecto Emoción Vital

Este proyecto es una plataforma web desarrollada con Django para la gestión de consultas psicológicas, usuarios, pacientes y administración de historias médicas. Incluye una API RESTful y una interfaz web.

## Requisitos previos

- Python 3.10 o superior
- MySQL (o puedes adaptar a SQLite si lo prefieres)
- pip (gestor de paquetes de Python)

## Instalación

1. **Clona el repositorio y entra a la carpeta del proyecto:**

```bash
cd emocion_vital
```

2. **Crea y activa un entorno virtual (opcional pero recomendado):**

```bash
python -m venv venv
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/Mac
```

3. **Instala las dependencias:**

```bash
pip install -r requirements.txt
```

4. **Configura la base de datos:**

Por defecto, el proyecto está configurado para usar MySQL. Edita `psicologa/settings.py` si necesitas cambiar usuario, contraseña o nombre de la base de datos.

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "pruebatutorial",
        "USER": "root",
        "PASSWORD": "12345678",
        "HOST": "localhost",
        "PORT": "",
    }
}
```

5. **Aplica las migraciones:**

```bash
python manage.py migrate
```

6. **Carga los estados y capitales (formato ISO) en la base de datos:**

Ejecuta el siguiente script SQL en tu gestor de base de datos (por ejemplo, usando MySQL Workbench, phpMyAdmin o la línea de comandos):

```sql
source psicologia estados y capitales.sql;
```

Esto insertará todos los estados y capitales necesarios en formato ISO.

7. **Crea un superusuario (opcional, para acceder al panel de administración):**

```bash
python manage.py createsuperuser
```

8. **Inicia el servidor de desarrollo:**

```bash
python manage.py runserver
```

Accede a la web en [http://localhost:8000](http://localhost:8000)

## Uso

- La interfaz web está disponible en la raíz (`/`).
- El panel de administración está en `/psicologa`.
- La API REST está disponible en `/api/`.

### Endpoints principales

- Web:
  - `/` Página de inicio
  - `/consultas` Consultas
  - `/precios` Precios
  - `/conoce` Información
  - `/login` Inicio de sesión
  - `/admin-login` Login de administrador
  - `/logout` Cerrar sesión
  - `/registro` Registro de usuario
  - `/recuperar` Recuperar contraseña
  - `/paciente` Panel de paciente
  - `/psicologa` Panel de psicóloga (requiere superusuario)
  - `/test-static` Prueba de archivos estáticos

- API REST (autenticación por token/session):
  - `/api/usuarios/` CRUD de usuarios
  - `/api/pacientes/` CRUD de pacientes
  - `/api/citas/` CRUD de citas
  - `/api/historias-medicas/` CRUD de historias médicas
  - ...y más (ver `oswald_api/urls.py`)

## Archivos estáticos y media
- Los archivos estáticos están en la carpeta `static/`.
- Los archivos subidos (historias médicas, etc.) se guardan en `media/`.

## Notas de seguridad
- No uses `DEBUG = True` en producción.
- Cambia la clave secreta (`SECRET_KEY`) en producción.
- Configura correctamente los orígenes permitidos (`ALLOWED_HOSTS`).

## Licencia
Este proyecto es privado y para fines educativos.

## Funcionalidad principal

### Inicio de sesión, registro y recuperación

- **Inicio de sesión:**
  - Los usuarios pueden iniciar sesión con su documento y contraseña.
  - Si no tienen cuenta, pueden crear una nueva desde la opción de registro.
  - Si olvidan su contraseña, pueden recuperarla respondiendo preguntas de seguridad previamente configuradas.

- **Registro de usuario:**
  - El registro solicita datos personales, correo electrónico, documento de identidad y la configuración de tres preguntas de seguridad.
  - El sistema valida que el documento y el correo no estén registrados previamente.

- **Recuperación de contraseña:**
  - El usuario debe responder correctamente las preguntas de seguridad para poder restablecer su contraseña.

### Gestión de datos y flujo de usuario

- Al iniciar sesión, el usuario debe completar y cargar todos sus datos personales antes de poder agregar familiares o agendar citas.
- Una vez completado su perfil, puede:
  - Agregar familiares a su cuenta.
  - Agendar citas psicológicas.
  - Consultar el estado de sus citas y su historial médico.

### Panel de psicóloga (`/psicologa`)

- El acceso a este panel está restringido únicamente a usuarios con permisos de superusuario.
- Desde este panel, la psicóloga puede:
  - Ver y modificar la información de todos los pacientes registrados.
  - Consultar, modificar y gestionar todas las citas agendadas.
  - Agregar y editar la historia médica de cada paciente asociada a sus citas.

Esta estructura garantiza la seguridad y privacidad de los datos, permitiendo una gestión profesional tanto para pacientes como para el personal autorizado. 