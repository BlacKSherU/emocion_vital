from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    PagoCita,
    Factura,
    Psicologo,
    Empresa,
    Estados,
    Municipios,
    Parroquias,
    Ciudades,
    Direccion,
    Familiar,
    Tratamientos,
    Sumario_Diagnostico,
    Baterias,
    HistoriaMedica,
    Pacientes,
    TipoCita,
    Resultado,
    Cita,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_active",
            "date_joined",
        ]
        read_only_fields = ["date_joined"]


class PagoCitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoCita
        fields = "__all__"


class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = "__all__"


class PsicologoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Psicologo
        fields = "__all__"


class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = "__all__"


class EstadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estados
        fields = "__all__"


class MunicipiosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipios
        fields = "__all__"


class ParroquiasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parroquias
        fields = "__all__"


class CiudadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciudades
        fields = "__all__"


class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = "__all__"


class FamiliarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Familiar
        fields = "__all__"


class TratamientosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tratamientos
        fields = "__all__"


class SumarioDiagnosticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sumario_Diagnostico
        fields = "__all__"


class BateriasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Baterias
        fields = "__all__"


class HistoriaMedicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriaMedica
        fields = "__all__"


class PacientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pacientes
        fields = "__all__"


class TipoCitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoCita
        fields = "__all__"


class ResultadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resultado
        fields = "__all__"


class CitaSerializer(serializers.ModelSerializer):
    acompañantes = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Pacientes.objects.all(), 
        required=False,
        allow_empty=True
    )
    
    class Meta:
        model = Cita
        fields = "__all__"
