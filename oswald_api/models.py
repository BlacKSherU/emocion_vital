# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User


class PagoCita(models.Model):
    id_pago_cita = models.IntegerField()
    id_cita = models.IntegerField()
    tipo_pago = models.CharField(max_length=22)
    monto = models.FloatField()
    fecha_pago = models.DateField()
    referencia_bancaria = models.IntegerField()

    class Meta:

        db_table = "pago_cita"


class Factura(models.Model):
    id_factura = models.IntegerField()
    fecha = models.DateField()
    id_paciente = models.IntegerField()
    monto = models.DecimalField(max_digits=10, decimal_places=0)
    id_pago_cita = models.IntegerField()
    status = models.CharField(max_length=9)

    class Meta:

        db_table = "factura"


class Psicologo(models.Model):
    id_psicologo = models.IntegerField()
    id_admin = models.IntegerField()

    class Meta:

        db_table = "psicologo"


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


class Municipios(models.Model):
    id_municipio = models.AutoField(primary_key=True)
    id_estado = models.ForeignKey(Estados, models.CASCADE, db_column="id_estado")
    municipio = models.CharField(max_length=100)

    class Meta:

        db_table = "municipios"


class Parroquias(models.Model):
    id_parroquia = models.AutoField(primary_key=True)
    id_municipio = models.ForeignKey(
        Municipios, models.CASCADE, db_column="id_municipio"
    )
    parroquia = models.CharField(max_length=250)

    class Meta:

        db_table = "parroquias"


class Ciudades(models.Model):
    id_ciudad = models.AutoField(primary_key=True)
    id_estado = models.ForeignKey("Estados", models.CASCADE, db_column="id_estado")
    ciudad = models.CharField(max_length=200)
    capital = models.IntegerField()

    class Meta:

        db_table = "ciudades"


class Direccion(models.Model):
    estado = models.ForeignKey(Estados, on_delete=models.CASCADE)
    municipio = models.ForeignKey(Municipios, on_delete=models.CASCADE)
    parroquia = models.ForeignKey(Parroquias, on_delete=models.CASCADE)
    ciudad = models.ForeignKey(Ciudades, on_delete=models.CASCADE)
    direccion_corta = models.CharField(max_length=50, null=True)


class Familiar(models.Model):
    """class relaciones(models.IntegerChoices):
    MADRE = 0 ,"madre"
    PADRE = 1 ,"padre"
    HIJO = 2 , "hijo"
    NIETO = 3 , "nieto"
    BISNIETO = 4 , "bisnieto"
    TIO = 5, "tio"
    PRIMO = 6, "primo"
    ABUELO = 7, "abuelo"
    BISABUELO = 8, "bisabuelo" """

    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="yo")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="familiar")
    relacion = models.CharField(max_length=40)


class Tratamientos(models.Model):
    Tratamientos_fecha = models.DateField()
    Tratamientos_tipo = models.CharField(max_length=30)


class Sumario_Diagnostico(models.Model):
    Signos_sintomas = models.CharField(max_length=50)
    Patologias = models.CharField(max_length=50)
    Trastornos = models.CharField(max_length=50)
    Nivel_afectacion = models.CharField(max_length=50)


class Baterias(models.Model):
    Baterias = models.CharField(max_length=50)
    Resultados = models.CharField(max_length=50)


class HistoriaMedica(models.Model):
    Gestacion_paciente = models.CharField(max_length=100, null=True)
    Edad_madre_nacimiento = models.CharField(max_length=2, null=True)
    Parto_paciente = models.CharField(max_length=100, null=True)
    Tipo_atencion_parto = models.CharField(max_length=100, null=True)
    Eutocico = models.CharField(max_length=50, null=True)
    Distocico = models.CharField(max_length=50, null=True)
    Razon_parto = models.CharField(max_length=100, null=True)
    Termino_parto = models.BooleanField(null=True)
    Postnatalidad = models.CharField(max_length=100, null=True)
    Estatura_nacer = models.CharField(max_length=10, null=True)
    Peso_nacer = models.CharField(max_length=10, null=True)
    Perimetro_cefalico = models.CharField(max_length=30, null=True)
    Perimetro_toraxico = models.CharField(max_length=30, null=True)
    Llorar_nacer = models.CharField(max_length=20, null=True)
    Reflejos = models.CharField(max_length=200, null=True)
    Dtor = models.CharField(max_length=200, null=True)
    Lenguaje_paciente = models.CharField(max_length=100, null=True)
    Juego_paciente = models.CharField(max_length=100, null=True)
    Edad_caminar_paciente = models.CharField(max_length=2, null=True)
    Control_encopresis = models.BooleanField(null=True)
    Edad_control_enco = models.CharField(max_length=2, null=True)
    Enuresis_paciente = models.BooleanField(null=True)
    Control_enuresis = models.CharField(max_length=2, null=True)
    Motricidad_fina = models.CharField(max_length=100, null=True)
    Motricidad_gruesa = models.CharField(max_length=100, null=True)
    Movimiento_pinza = models.CharField(max_length=100, null=True)
    Alimentacion_infancia = models.CharField(max_length=200, null=True)
    Crianza_padres = models.CharField(max_length=20, null=True)
    Solo_madre = models.CharField(max_length=20, null=True)
    Solo_padre = models.CharField(max_length=20, null=True)
    Otros_padres = models.CharField(max_length=100, null=True)
    Juego_infantil = models.CharField(max_length=100, null=True)
    Juego_humano = models.CharField(max_length=200, null=True)
    Juego_imaginario = models.CharField(max_length=200, null=True)
    Caracter_infantil = models.CharField(max_length=200, null=True)
    Social_padres = models.CharField(max_length=200, null=True)
    Social_hermanos = models.CharField(max_length=200, null=True)
    Social_familiares = models.CharField(max_length=200, null=True)
    Social_conocidos = models.CharField(max_length=200, null=True)
    Social_extraños = models.CharField(max_length=200, null=True)
    Grado_integracion = models.CharField(max_length=200, null=True)
    Ingreso_escuela_paciente = models.CharField(max_length=100, null=True)
    Integracion_compañeros = models.CharField(max_length=100, null=True)
    Comportamiento_salon = models.CharField(max_length=100, null=True)
    Comportamiento_recreo = models.CharField(max_length=100, null=True)
    Relacion_demas = models.CharField(max_length=100, null=True)
    Aislamiento = models.CharField(max_length=100, null=True)
    Razon_aisla = models.CharField(max_length=100, null=True)
    Dificultades_academicas_primaria = models.CharField(max_length=200, null=True)
    Dificultades_academicas_secundaria = models.CharField(max_length=200, null=True)
    Dificultades_academicas_superior = models.CharField(max_length=200, null=True)
    Problemas_afectivos_niñez = models.CharField(max_length=200, null=True)
    Problemas_afectivos_pubertad = models.CharField(max_length=200, null=True)
    Particularidades_adolescencia = models.CharField(max_length=200, null=True)
    Problemas_afectivos_adolescencia = models.CharField(max_length=200, null=True)
    Armonia_madurez = models.CharField(max_length=200, null=True)
    Desarrollo_voluntad = models.CharField(max_length=200, null=True)
    Grado_autonomia = models.CharField(max_length=200, null=True)
    Persistencia_esfuerzo = models.CharField(max_length=200, null=True)
    Jerarquia_valores = models.CharField(max_length=200, null=True)
    Estilo_vida = models.CharField(max_length=200, null=True)
    Sexualidad_actividad = models.CharField(max_length=200, null=True)
    Problemas_legales = models.CharField(max_length=200, null=True)
    Norma_familiar = models.CharField(max_length=200, null=True)
    Servivio_militar = models.CharField(max_length=100, null=True)
    SMO = models.CharField(max_length=200, null=True)
    Habitos_intereses = models.CharField(max_length=200, null=True)
    Enfermedades_accidentes = models.CharField(max_length=200, null=True)
    Profesion_oficio = models.CharField(max_length=200, null=True)
    Actual_trabajo = models.CharField(max_length=200, null=True)
    Vivienda_paciente = models.CharField(max_length=200, null=True)
    Economia_paciente = models.CharField(max_length=200, null=True)
    Relaciones_trabajo = models.CharField(max_length=200, null=True)
    Crecimiento_psicosocial = models.CharField(max_length=200, null=True)
    Ambiciones_laborales = models.CharField(max_length=200, null=True)
    Cambios_profesion = models.CharField(max_length=200, null=True)
    Cuadro_familiar = models.CharField(max_length=200, null=True)
    Relaciones_interpersonales = models.CharField(max_length=200, null=True)
    Religion_paciente = models.CharField(max_length=200, null=True)
    Recreacion_paciente = models.CharField(max_length=200, null=True)
    Relaciones_sexos = models.CharField(max_length=200, null=True)
    Eleccion_pareja = models.CharField(max_length=200, null=True)
    Fiel_exigente = models.CharField(max_length=200, null=True)
    Noviazgos = models.CharField(max_length=200, null=True)
    Matrimonio = models.CharField(max_length=200, null=True)
    Opinion_matrimonio = models.CharField(max_length=200, null=True)
    Particularidades_boda = models.CharField(max_length=200, null=True)
    Vida_matrimonial = models.CharField(max_length=200, null=True)
    Separacion = models.CharField(max_length=200, null=True)
    Divorcio = models.CharField(max_length=200, null=True)
    Sistesis_problemas = models.TextField(null=True)


class Pacientes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    tipo_documento = models.CharField(max_length=1, null=True)
    n_documento = models.CharField(max_length=50, null=True)
    direccion_principal = models.ForeignKey(
        Direccion,
        on_delete=models.CASCADE,
        related_name="direccion_principal",
        null=True,
    )
    primer_nombre = models.CharField(max_length=50, null=True)
    segundo_nombre = models.CharField(max_length=50, null=True)
    primer_apellido = models.CharField(max_length=50, null=True)
    segundo_apellido = models.CharField(max_length=50, null=True)
    fecha_nacimiento = models.DateField(null=True)
    status = models.CharField(max_length=8, null=True)
    is_menor = models.BooleanField(default=False)
    familiares = models.ManyToManyField(Familiar, null=True)
    Lugar_de_nacimiento = models.ForeignKey(
        Direccion, on_delete=models.CASCADE, related_name="lugar_nacimiento", null=True
    )
    Instruccion_paciente = models.CharField(max_length=100, null=True)
    Ocupacion_paciente = models.CharField(max_length=100, null=True)
    Estado_civil_paciente = models.CharField(max_length=20, null=True)
    Religion_paciente = models.CharField(max_length=100, null=True)
    Telefono_paciente = models.CharField(max_length=20, null=True)
    Centros_estudios_trabajos = models.CharField(max_length=200, null=True)
    Grado_paciente = models.CharField(max_length=10, null=True)
    Ciclo_paciente = models.CharField(max_length=10, null=True)
    Cantidad_tiempo_residencia_paciente = models.IntegerField(null=True)
    Tiempo_residencia_paciente = models.CharField(max_length=100, null=True)
    Procedencia_paciente = models.CharField(max_length=50, null=True)
    Telefonos_adicionales = models.CharField(max_length=50, null=True)
    sexo = models.CharField(max_length=50, null=True)
    Informante = models.CharField(max_length=100, null=True)
    Historiamedica = models.ForeignKey(
        HistoriaMedica, on_delete=models.CASCADE, null=True
    )
    pregunta_1 = models.CharField(max_length=100, null=True)
    pregunta_2 = models.CharField(max_length=100, null=True)
    pregunta_3 = models.CharField(max_length=100, null=True)
    respuesta_1 = models.CharField(max_length=100, null=True)
    respuesta_2 = models.CharField(max_length=100, null=True)
    respuesta_3 = models.CharField(max_length=100, null=True)

    class Meta:

        db_table = "pacientes"


class TipoCita(models.Model):
    id_tipo_cita = models.IntegerField(primary_key=True)
    tipo_cita = models.CharField(max_length=10)
    modalidad = models.CharField(max_length=10)

    class Meta:

        db_table = "tipo_cita"


class Resultado(models.Model):
    Motivo_consulta = models.CharField(max_length=200, null=True)
    Desarrollo_problema = models.CharField(max_length=500, null=True)
    Tiempo_problema = models.CharField(max_length=50, null=True)
    Suceso_dia_problema = models.CharField(max_length=50, null=True)
    Dia_anterior_problema = models.CharField(max_length=100, null=True)
    Accion_dia_problema = models.CharField(max_length=100, null=True)
    Calma_dia_problema = models.CharField(max_length=100, null=True)
    Hablar_problema_alguien = models.CharField(max_length=100, null=True)
    Factores_problema = models.CharField(max_length=100, null=True)
    Tratamientos = models.ManyToManyField(Tratamientos)
    Personalidad_paciente = models.CharField(max_length=100, null=True)
    Filosofia_paciente = models.CharField(max_length=100, null=True)
    """final"""
    sumario_diagnostico = models.ForeignKey(
        Sumario_Diagnostico, on_delete=models.CASCADE
    )
    Aproximacion_diagnostica = models.CharField(max_length=100, null=True)
    Conclusion_diagnostica = models.CharField(max_length=100, null=True)
    Sintesis_facultades = models.CharField(max_length=500, null=True)
    baterias = models.ForeignKey(Baterias, on_delete=models.CASCADE)
    Sintesis_baterias = models.CharField(max_length=500, null=True)
    Programa_tratamiento = models.CharField(max_length=500, null=True)
    Evolucion = models.CharField(max_length=500, null=True)
    Nombre_responsable = models.CharField(max_length=100, null=True)
    Cargo = models.CharField(max_length=50, null=True)
    Universidad = models.CharField(max_length=100, null=True)
    Telefono_final = models.CharField(max_length=20, null=True)


class Cita(models.Model):
    paciente = models.ForeignKey(Pacientes, on_delete=models.CASCADE)
    acompañantes = models.ManyToManyField(
        Pacientes, related_name="acompañantes", verbose_name="acompañantes", blank=True
    )
    Numero_historial = models.CharField(max_length=8)
    Fecha_primera_consulta = models.DateField()
    hora_consulta = models.TimeField(null=True)
    modalidad = models.CharField(max_length=100, null=True)
    tipo_consulta = models.CharField(max_length=100, null=True)
    resultado = models.ForeignKey(Resultado, on_delete=models.CASCADE, null=True)
    notas = models.CharField(max_length=200, null=True)
    historiamedica_archivo = models.FileField(
        upload_to="historias_medicas/",
        null=True,
        blank=True,
        help_text="Archivo .docx de historia médica",
    )
