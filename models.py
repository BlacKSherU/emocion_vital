# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Admin(models.Model):
    id_admin = models.IntegerField(primary_key=True)
    usuario = models.CharField(max_length=250)
    contrasena = models.CharField(max_length=250)
    nombre1 = models.CharField(max_length=250)
    nombre2 = models.CharField(max_length=250)
    apellido1 = models.CharField(max_length=250)
    apellido2 = models.CharField(max_length=250)
    pregunta1 = models.CharField(max_length=15)
    repuesta1 = models.CharField(max_length=150)
    pregunta2 = models.CharField(max_length=20)
    repuesta2 = models.CharField(max_length=150)
    pregunta3 = models.CharField(max_length=18)
    repuesta3 = models.CharField(max_length=100)
    tipo_doc = models.CharField(max_length=1)
    num_doc = models.CharField(max_length=12)
    correo = models.CharField(max_length=80)
    fecha_nac = models.DateField()
    telefono = models.CharField(max_length=15)
    status = models.CharField(max_length=8)

    class Meta:

        db_table = "admin"


class Agenda(models.Model):
    id_agenda = models.IntegerField(primary_key=True)
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_final = models.TimeField()
    contador_cita = models.IntegerField()
    id_paciente = models.IntegerField()
    status = models.CharField(max_length=10)

    class Meta:

        db_table = "agenda"


class Citas(models.Model):
    id_cita = models.IntegerField(primary_key=True)
    id_agenda = models.IntegerField()
    id_psicologo = models.IntegerField()
    id_paciente = models.IntegerField()
    id_tipo_cita = models.ForeignKey(
        "TipoCita", models.DO_NOTHING, db_column="id_tipo_cita"
    )
    fecha = models.DateTimeField()
    motivo_cita = models.CharField(max_length=300)

    class Meta:

        db_table = "citas"


class Ciudades(models.Model):
    id_ciudad = models.AutoField(primary_key=True)
    id_estado = models.ForeignKey("Estados", models.DO_NOTHING, db_column="id_estado")
    ciudad = models.CharField(max_length=200)
    capital = models.IntegerField()

    class Meta:

        db_table = "ciudades"


class Empresa(models.Model):
    id_empresa = models.IntegerField()
    razon_social = models.CharField(max_length=200)
    tipo_documento = models.CharField(max_length=1)
    n_documento = models.CharField(max_length=15)
    direccion = models.CharField(max_length=150)
    correo = models.CharField(max_length=150)
    celular_local = models.CharField(max_length=150)
    celular_movil = models.CharField(max_length=150)

    class Meta:

        db_table = "empresa"


class Estados(models.Model):
    id_estado = models.AutoField(primary_key=True)
    estado = models.CharField(max_length=250)
    iso_3166_2 = models.CharField(
        db_column="iso_3166-2", max_length=4
    )  # Field renamed to remove unsuitable characters.

    class Meta:

        db_table = "estados"


class Factura(models.Model):
    id_factura = models.IntegerField()
    fecha = models.DateField()
    id_paciente = models.IntegerField()
    monto = models.DecimalField(max_digits=10, decimal_places=0)
    id_pago_cita = models.IntegerField()
    status = models.CharField(max_length=9)

    class Meta:

        db_table = "factura"


class Historial(models.Model):
    id_historial = models.IntegerField(primary_key=True)
    motivo = models.TextField()
    inicio_terapia = models.TextField()
    tiempo_problem = models.TextField()
    suceso_dia = models.TextField()
    que_hizo = models.TextField()
    hablo_del_problema = models.TextField()
    factores_del_problema = models.TextField()
    tratamiento_psicologico = models.TextField()
    ultimo_tratamiento = models.TextField()
    autodescrip_personal = models.TextField()
    id_usuario = models.IntegerField()

    class Meta:

        db_table = "historial"


class Municipios(models.Model):
    id_municipio = models.AutoField(primary_key=True)
    id_estado = models.ForeignKey(Estados, models.DO_NOTHING, db_column="id_estado")
    municipio = models.CharField(max_length=100)

    class Meta:

        db_table = "municipios"


class Pacientes(models.Model):
    id_paciente = models.IntegerField()
    num_hijos = models.IntegerField()
    discpacidad = models.IntegerField()
    desc_discapacidad = models.CharField(max_length=300)
    id_usuario = models.IntegerField()
    id_direccion = models.IntegerField()
    edad_hijos = models.IntegerField()

    class Meta:

        db_table = "pacientes"


class PagoCita(models.Model):
    id_pago_cita = models.IntegerField()
    id_cita = models.IntegerField()
    tipo_pago = models.CharField(max_length=22)
    monto = models.FloatField()
    fecha_pago = models.DateField()
    referencia_bancaria = models.IntegerField()

    class Meta:

        db_table = "pago_cita"


class Parroquias(models.Model):
    id_parroquia = models.AutoField(primary_key=True)
    id_municipio = models.ForeignKey(
        Municipios, models.DO_NOTHING, db_column="id_municipio"
    )
    parroquia = models.CharField(max_length=250)

    class Meta:

        db_table = "parroquias"


class Personas(models.Model):
    id_personas = models.IntegerField(primary_key=True)
    id_usuarios = models.ForeignKey(
        "Usuarios", models.DO_NOTHING, db_column="id_usuarios"
    )
    tipo_documento = models.CharField(max_length=1)
    n_documento = models.CharField(max_length=50)
    direccion_principal = models.CharField(max_length=50)
    primer_nombre = models.CharField(max_length=50)
    segundo_nombre = models.CharField(max_length=50)
    primer_apellido = models.CharField(max_length=50)
    segundo_apellido = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    n_telefono = models.CharField(max_length=20)
    correo = models.CharField(max_length=50)
    status = models.CharField(max_length=8)

    class Meta:

        db_table = "personas"


class Psicologo(models.Model):
    id_psicologo = models.IntegerField()
    id_admin = models.IntegerField()

    class Meta:

        db_table = "psicologo"


class Reportes(models.Model):
    id_reportes = models.IntegerField(primary_key=True)
    id_persona = models.IntegerField()
    id_incidencia = models.IntegerField()
    detalles = models.CharField(max_length=200)
    observaciones = models.CharField(max_length=200)
    fecha_reporte = models.DateField()
    status = models.CharField(max_length=8)

    class Meta:

        db_table = "reportes"


class TipoCita(models.Model):
    id_tipo_cita = models.IntegerField(primary_key=True)
    tipo_cita = models.CharField(max_length=10)
    modalidad = models.CharField(max_length=10)

    class Meta:

        db_table = "tipo_cita"


class Usuarios(models.Model):
    id_usuarios = models.IntegerField(primary_key=True)
    usuario = models.CharField(max_length=50)
    tipo_doc = models.CharField(max_length=1)
    num_doc = models.CharField(max_length=12)
    correo = models.CharField(max_length=80)
    contrasena = models.CharField(max_length=34)
    nombre1 = models.CharField(max_length=150)
    nombre2 = models.CharField(max_length=150)
    apellido1 = models.CharField(max_length=150)
    apellido2 = models.CharField(max_length=150)
    fecha_naci = models.DateField()
    telefono = models.CharField(max_length=15)
    sexo = models.CharField(max_length=9)
    pregunta1 = models.CharField(max_length=15)
    repuesta1 = models.CharField(max_length=100)
    pregunta2 = models.CharField(max_length=20)
    repuesta2 = models.CharField(max_length=100)
    pregunta3 = models.CharField(max_length=18)
    repuesta3 = models.CharField(max_length=100)
    status = models.CharField(max_length=8)

    class Meta:

        db_table = "usuarios"
