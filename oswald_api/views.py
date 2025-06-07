from django.shortcuts import render
from rest_framework import viewsets
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
from .serializers import (
    PagoCitaSerializer,
    FacturaSerializer,
    PsicologoSerializer,
    EmpresaSerializer,
    EstadosSerializer,
    MunicipiosSerializer,
    ParroquiasSerializer,
    CiudadesSerializer,
    DireccionSerializer,
    FamiliarSerializer,
    TratamientosSerializer,
    SumarioDiagnosticoSerializer,
    BateriasSerializer,
    HistoriaMedicaSerializer,
    PacientesSerializer,
    TipoCitaSerializer,
    ResultadoSerializer,
    CitaSerializer,
)

# Create your views here.


class PagoCitaViewSet(viewsets.ModelViewSet):
    queryset = PagoCita.objects.all()
    serializer_class = PagoCitaSerializer


class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer


class PsicologoViewSet(viewsets.ModelViewSet):
    queryset = Psicologo.objects.all()
    serializer_class = PsicologoSerializer


class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer


class EstadosViewSet(viewsets.ModelViewSet):
    queryset = Estados.objects.all()
    serializer_class = EstadosSerializer


class MunicipiosViewSet(viewsets.ModelViewSet):
    queryset = Municipios.objects.all()
    serializer_class = MunicipiosSerializer


class ParroquiasViewSet(viewsets.ModelViewSet):
    queryset = Parroquias.objects.all()
    serializer_class = ParroquiasSerializer


class CiudadesViewSet(viewsets.ModelViewSet):
    queryset = Ciudades.objects.all()
    serializer_class = CiudadesSerializer


class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer


class FamiliarViewSet(viewsets.ModelViewSet):
    queryset = Familiar.objects.all()
    serializer_class = FamiliarSerializer


class TratamientosViewSet(viewsets.ModelViewSet):
    queryset = Tratamientos.objects.all()
    serializer_class = TratamientosSerializer


class SumarioDiagnosticoViewSet(viewsets.ModelViewSet):
    queryset = Sumario_Diagnostico.objects.all()
    serializer_class = SumarioDiagnosticoSerializer


class BateriasViewSet(viewsets.ModelViewSet):
    queryset = Baterias.objects.all()
    serializer_class = BateriasSerializer


class HistoriaMedicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaMedica.objects.all()
    serializer_class = HistoriaMedicaSerializer


class PacientesViewSet(viewsets.ModelViewSet):
    queryset = Pacientes.objects.all()
    serializer_class = PacientesSerializer


class TipoCitaViewSet(viewsets.ModelViewSet):
    queryset = TipoCita.objects.all()
    serializer_class = TipoCitaSerializer


class ResultadoViewSet(viewsets.ModelViewSet):
    queryset = Resultado.objects.all()
    serializer_class = ResultadoSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
