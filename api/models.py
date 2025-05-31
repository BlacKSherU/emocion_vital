from django.db import models
from django.contrib.auth.models import User

# Create your models here.


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
    Gestacion_paciente = models.CharField(max_length=100)
    Edad_madre_nacimiento = models.CharField(max_length=2)
    Parto_paciente = models.CharField(max_length=100)
    Tipo_atencion_parto = models.CharField(max_length=100)
    Eutocico = models.CharField(max_length=50)
    Distocico = models.CharField(max_length=50)
    Razon_parto = models.CharField(max_length=100)
    Termino_parto = models.BooleanField()
    Postnatalidad = models.CharField(max_length=100)
    Estatura_nacer = models.CharField(max_length=10)
    Peso_nacer = models.CharField(max_length=10)
    Perimetro_cefalico = models.CharField(max_length=30)
    Perimetro_toraxico = models.CharField(max_length=30)
    Llorar_nacer = models.CharField(max_length=20)
    Reflejos = models.CharField(max_length=200)
    Dtor = models.CharField(max_length=200)
    Lenguaje_paciente = models.CharField(max_length=100)
    Juego_paciente = models.CharField(max_length=100)
    Edad_caminar_paciente = models.CharField(max_length=2)
    Control_encopresis = models.BooleanField()
    Edad_control_enco = models.CharField(max_length=2)
    Enuresis_paciente = models.BooleanField()
    Control_enuresis = models.CharField(max_length=2)
    Motricidad_fina = models.CharField(max_length=100)
    Motricidad_gruesa = models.CharField(max_length=100)
    Movimiento_pinza = models.CharField(max_length=100)
    Alimentacion_infancia = models.CharField(max_length=200)
    Crianza_padres = models.CharField(max_length=20)
    Solo_madre = models.CharField(max_length=20)
    Solo_padre = models.CharField(max_length=20)
    Otros_padres = models.CharField(max_length=100)
    Juego_infantil = models.CharField(max_length=100)
    Juego_humano = models.CharField(max_length=200)
    Juego_imaginario = models.CharField(max_length=200)
    Caracter_infantil = models.CharField(max_length=200)
    Social_padres = models.CharField(max_length=200)
    Social_hermanos = models.CharField(max_length=200)
    Social_familiares = models.CharField(max_length=200)
    Social_conocidos = models.CharField(max_length=200)
    Social_extraños = models.CharField(max_length=200)
    Grado_integracion = models.CharField(max_length=200)
    Ingreso_escuela_paciente = models.CharField(max_length=100)
    Integracion_compañeros = models.CharField(max_length=100)
    Comportamiento_salon = models.CharField(max_length=100)
    Comportamiento_recreo = models.CharField(max_length=100)
    Relacion_demas = models.CharField(max_length=100)
    Aislamiento = models.CharField(max_length=100)
    Razon_aisla = models.CharField(max_length=100)
    Dificultades_academicas_primaria = models.CharField(max_length=200)
    Dificultades_academicas_secundaria = models.CharField(max_length=200)
    Dificultades_academicas_superior = models.CharField(max_length=200)
    Problemas_afectivos_niñez = models.CharField(max_length=200)
    Problemas_afectivos_pubertad = models.CharField(max_length=200)
    Particularidades_adolescencia = models.CharField(max_length=200)
    Problemas_afectivos_adolescencia = models.CharField(max_length=200)
    Armonia_madurez = models.CharField(max_length=200)
    Desarrollo_voluntad = models.CharField(max_length=200)
    Grado_autonomia = models.CharField(max_length=200)
    Persistencia_esfuerzo = models.CharField(max_length=200)
    Jerarquia_valores = models.CharField(max_length=200)
    Estilo_vida = models.CharField(max_length=200)
    Sexualidad_actividad = models.CharField(max_length=200)
    Problemas_legales = models.CharField(max_length=200)
    Norma_familiar = models.CharField(max_length=200)
    Servivio_militar = models.CharField(max_length=100)
    SMO = models.CharField(max_length=200)
    Habitos_intereses = models.CharField(max_length=200)
    Enfermedades_accidentes = models.CharField(max_length=200)
    Profesion_oficio = models.CharField(max_length=200)
    Actual_trabajo = models.CharField(max_length=200)
    Vivienda_paciente = models.CharField(max_length=200)
    Economia_paciente = models.CharField(max_length=200)
    Relaciones_trabajo = models.CharField(max_length=200)
    Crecimiento_psicosocial = models.CharField(max_length=200)
    Ambiciones_laborales = models.CharField(max_length=200)
    Cambios_profesion = models.CharField(max_length=200)
    Cuadro_familiar = models.CharField(max_length=200)
    Relaciones_interpersonales = models.CharField(max_length=200)
    Religion_paciente = models.CharField(max_length=200)
    Recreacion_paciente = models.CharField(max_length=200)
    Relaciones_sexos = models.CharField(max_length=200)
    Eleccion_pareja = models.CharField(max_length=200)
    Fiel_exigente = models.CharField(max_length=200)
    Noviazgos = models.CharField(max_length=200)
    Matrimonio = models.CharField(max_length=200)
    Opinion_matrimonio = models.CharField(max_length=200)
    Particularidades_boda = models.CharField(max_length=200)
    Vida_matrimonial = models.CharField(max_length=200)
    Separacion = models.CharField(max_length=200)
    Divorcio = models.CharField(max_length=200)
    Sistesis_problemas = models.TextField()


class Paciente(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_menor = models.BooleanField(default=False)
    familiares = models.ManyToManyField(Familiar)
    Feche_de_nacimiento = models.DateField(null=True)
    Lugar_de_nacimiento = models.CharField(max_length=50, null=True)
    Instruccion_paciente = models.CharField(max_length=100, null=True)
    Ocupacion_paciente = models.CharField(max_length=100, null=True)
    Estado_civil_paciente = models.CharField(max_length=20, null=True)
    Religion_paciente = models.CharField(max_length=100, null=True)
    Telefono_paciente = models.CharField(max_length=20, null=True)
    Centros_estudios_trabajos = models.CharField(max_length=200, null=True)
    Grado_paciente = models.CharField(max_length=10, null=True)
    Ciclo_paciente = models.CharField(max_length=10, null=True)
    Lugar_residencia_paciente = models.CharField(max_length=100, null=True)
    Tiempo_residencia_paciente = models.CharField(max_length=100, null=True)
    Procedencia_paciente = models.CharField(max_length=50, null=True)
    Telefonos_adicionales = models.CharField(max_length=50, null=True)

    Informante = models.CharField(max_length=100, null=True)
    Historiamedica = models.ForeignKey(
        HistoriaMedica, on_delete=models.CASCADE, null=True
    )


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
    Paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    Numero_historial = models.CharField(max_length=8)
    Fecha_primera_consulta = models.DateField()


"""
PRELUDIO

{{Numero_historial}} (6-8 caracteres) [String] x

{{Entrevistador}} (56 o 32 caracteres) [String]xx

{{Fecha_primera_consulta}} (8) [DATA-TIME]x

I DATOS DE FILIACION

{{Nombre_paciente}} (100) [Str]x

{{Edad_paciente}} (3) [Byte para menor uso de memoria]xx

{{Datos_nacimiento}} (200) [Str]xx

{{Instruccion_paciente}} (100) [Str]x

{{Ocupacion_paciente}} (100) [Str]x

{{Estado_civil_paciente}} (12) [Str]x

{{Religion_paciente}} (100) [Str]x

{{Nombre_conyuge}} (56 o 28) [Str]xx

{{Telefono_paciente}} (11) [Str]x

{{Hijos_paciente}} (2) [Byte]xx

{{Nombre_hijo_paciente}} (14) [Str]xx

{{Edades_paciente}} (2) [Byte]xx

{{Centros_estudios_trabajos}} (200) [Str]x

{{Grado_paciente}} (10) [Str]x

{{Ciclo_paciente}} (10) [Str]x

{{Lugar_residencia_paciente}} (100) [Str]x

{{Tiempo_residencia_paciente}} (15) [Str o DATATIME] x

{{Procedencia_paciente}} (20-50) [Str porque no se que es]x

{{Telefonos_adicionales}} (30) [Str]x

{{Correo_paciente}} (320) [Str]x

{{Informante}} (100) [Str]x

II PROBLEMA ACTUAL

{{Motivo_consulta}} (200) [Str]x

{{Desarrollo_problema}} (500) [Str]x

{{Tiempo_problema}} (50) [Str]x

{{Suceso_dia_problema}} (100) [Str]x

{{Dia_anterior_problema}} (100) [Str]x

{{Accion_dia_problema}} (100) [Str]x

{{Calma_dia_problema}} (100) [Str]x

{{Hablar_problema_alguien}} (100) [Str]x

{{Factores_problema}} (100) [Str]x   ---------------------------------------------

{{Tratamientos_fecha[]}} (8 fecha 30 tipo) [DATA-TIME y Str]xx clase Tratamientos

{{Tratamientos_tipo[]}}xx

{{Personalidad_paciente}} (100) [Str]x

{{Filosofia_paciente}} (100) [Str]x

III HISTORIA PERSONAL Y SOCIAL

{{Gestacion_paciente}} (100) Str]

{{Edad_madre_nacimiento}} (2) [Byte]

{{Parto_paciente}} (100) [Str]

{{Tipo_atencion_parto}} (100) [Str]

{{Eutocico}} ¿(50)? [Str]

{{Distocico}} ¿(50)? [Str]

{{Razon_parto}} (100) [Str]

¿Fue a término? SI ( ) NO ( )
{{Termino_parto}} (1) [Binario si puedes, Char alternativa] ?

{{Postnatalidad}} (100) [Str]

{{Estatura_nacer}} (10) [Str]

{{Peso_nacer}} (10) [Str]

{{Perimetro_cefalico}} (30) [Str]

{{Perimetro_toraxico}} (30) [Str]

{{Llorar_nacer}} (20) [Str]

{{Reflejos}} (200) [Str]

{{Dtor}} (200) [Str]

{{Lenguaje_paciente}} (100) [Str]

{{Juego_paciente}} (100) [Str]

{{Edad_caminar_paciente}} (10) [Str]

ENCOPRESIS si ( ) no ( ) 
{{Control_encopresis}} (1) [Binario]

{{Edad_control_enco}} (2) [Byte]

ENURESIS si ( ) no ( ) 
{{Enuresis_paciente}} (1) [Binario]

{{Control_enuresis}} (2) [Byte]

{{Motricidad_fina}} (100) [Str]

{{Motricidad_gruesa}} (100) [Str]

{{Movimiento_pinza}} (100) [Str]

{{Alimentacion_infancia}} (200) [Str]

{{Crianza_padres}} (20) [Str]

{{Solo_madre}} (20) [Str]

{{Solo_padre}} (20) [Str]

{{Otros_padres}} (100) [Str]

{{Juego_infantil}} (100) [Str]

{{Juego_humano}} (200) []

{{Juego_imaginario}} (200) [Str]

{{Caracter_infantil}} (200) [Str]

{{Social_padres}} (200) [Str]

{{Social_hermanos}} (200) [Str]

{{Social_familiares}} (200) [Str]

{{Social_conocidos}} (200) [Str]

{{Social_extraños}} (200) [Str]

{{Grado_integracion}} (200) [Str]

{{Ingreso_escuela_paciente}} (100) [Str]

{{Integracion_compañeros}} (100) [Str]

{{Comportamiento_salon}} (100) [Str]

{{Comportamiento_recreo}} (100) [Str]

{{Relacion_demas}} (100) [Str]

{{Aislamiento}} (100) [Str]

{{Razon_aisla}} (100) [Str]

{{Dificultades_academicas_primaria}} (200) [Str]

{{Dificultades_academicas_secundaria}} (200) [Str]

{{Dificultades_academicas_superior}} (200) [Str]

{{Problemas_afectivos_niñez}} (200) [Str]

{{Problemas_afectivos_pubertad}} (200) [Str]

{{Particularidades_adolescencia}} (200) [Str]

{{Problemas_afectivos_adolescencia}} (200) [Str]

{{Armonia_madurez}} (200) [Str]

{{Desarrollo_voluntad}} (200) [Str]

{{Grado_autonomia}} (200) [Str]

{{Persistencia_esfuerzo}} (200) [Str]

{{Jerarquia_valores}} (200) [Str] INHABILITADA

{{Estilo_vida}} (200) [Str]

{{Sexualidad_actividad}} (200) [Str]

{{Problemas_legales}} (200) [Str] INHABILITADA

{{Norma_familiar}} (200) [Str]

{{Servivio_militar}} (100) [Str]

{{SMO}} (200) [Str] INHABILITADA

{{Habitos_intereses}} (200) [Str]

{{Enfermedades_accidentes}} (200) [Str]

{{Profesion_oficio}} (200) [Str]

{{Actual_trabajo}} (200) [Str]

{{Vivienda_paciente}} (200) [Str]

{{Economia_paciente}} (200) [Str]

{{Relaciones_trabajo}} (200) [Str]

{{Crecimiento_psicosocial}} (200) [Str]

{{Ambiciones_laborales}} (200) [Str]

{{Cambios_profesion}} (200) [Str]

{{Cuadro_familiar}} (200) [Str]

{{Relaciones_interpersonales}} (200) [Str]

{{Religion_paciente}} (200) [Str]

{{Recreacion_paciente}} (200) [Str]

{{Relaciones_sexos}} (200) [Str]

{{Eleccion_pareja}} (200) [Str]

{{Fiel_exigente}} (200) [Str]

{{Noviazgos}} (200) [Str]

{{Matrimonio}} (200) [Str]

{{Opinion_matrimonio}} (200) [Str]

{{Particularidades_boda}} (200) [Str]

{{Vida_matrimonial}} (200) [Str]

{{Separacion}} (200) [Str]

{{Divorcio}} (200) [Str]

{{Sistesis_problemas}} (+500) [Str]

IV ANTECEDENTES FAMILIARES

{{Abuelo_paterno}} (100) [Str]xx

{{Abuela_paterna}} (100) [Str]xx

{{Padre_paciente}} (100) [Str]xx

{{Tios_paternos}} (100) [Str]xx

{{Abuelo_materno}} (100) [Str]xx

{{Abuela_materna}} (100) [Str]xx

{{Madre_paciente}} (100) [Str]xx

{{Tios_maternos}} (100) [Str]
xx
{{Hermanos_paciente}} (100) [Str]xx

{{Esposo}} (100) [Str]xx

{{Hijos}} (100) [Str]xx

{{Colaterales}} (100) [Str]xx

V SUMARIO RESULTADOS EVOLUCION

{{Signos_sintomas[]}} (50) [Str]

{{Patologias[]}} (50) [Str]

{{Trastornos[]}} (50) [Str]

{{Nivel_afectacion[]}} (50) [Str]

{{Aproximacion_diagnostica}} (100) [Str]

{{Conclusion_diagnostica}} (100) [Str]

{{Sintesis_facultades}} (500) [Str]

{{Baterias[]}} (50) [Str]

{{Resultados[]}} (50) [Str]

{{Sintesis_baterias}} (500) [Str]

{{Programa_tratamiento}} (500) [Str]

{{Evolucion}} (500) [Str]

{{Nombre_responsable}} (100) [Str]

{{Cargo}} (50) [Str]

{{Universidad}} (100) [Str]

{{Telefono_final}} (10) [Str]

{{Correo_final}} (320) [Str]
"""
