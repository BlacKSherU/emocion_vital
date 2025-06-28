from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
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
    UserSerializer,
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


@method_decorator(csrf_exempt, name="dispatch")
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@method_decorator(csrf_exempt, name="dispatch")
class PagoCitaViewSet(viewsets.ModelViewSet):
    queryset = PagoCita.objects.all()
    serializer_class = PagoCitaSerializer


@method_decorator(csrf_exempt, name="dispatch")
class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer


@method_decorator(csrf_exempt, name="dispatch")
class PsicologoViewSet(viewsets.ModelViewSet):
    queryset = Psicologo.objects.all()
    serializer_class = PsicologoSerializer


@method_decorator(csrf_exempt, name="dispatch")
class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer


@method_decorator(csrf_exempt, name="dispatch")
class EstadosViewSet(viewsets.ModelViewSet):
    queryset = Estados.objects.all()
    serializer_class = EstadosSerializer


@method_decorator(csrf_exempt, name="dispatch")
class MunicipiosViewSet(viewsets.ModelViewSet):
    queryset = Municipios.objects.all()
    serializer_class = MunicipiosSerializer


@method_decorator(csrf_exempt, name="dispatch")
class ParroquiasViewSet(viewsets.ModelViewSet):
    queryset = Parroquias.objects.all()
    serializer_class = ParroquiasSerializer


@method_decorator(csrf_exempt, name="dispatch")
class CiudadesViewSet(viewsets.ModelViewSet):
    queryset = Ciudades.objects.all()
    serializer_class = CiudadesSerializer


@method_decorator(csrf_exempt, name="dispatch")
class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer


@method_decorator(csrf_exempt, name="dispatch")
class FamiliarViewSet(viewsets.ModelViewSet):
    queryset = Familiar.objects.all()
    serializer_class = FamiliarSerializer


@method_decorator(csrf_exempt, name="dispatch")
class TratamientosViewSet(viewsets.ModelViewSet):
    queryset = Tratamientos.objects.all()
    serializer_class = TratamientosSerializer


@method_decorator(csrf_exempt, name="dispatch")
class SumarioDiagnosticoViewSet(viewsets.ModelViewSet):
    queryset = Sumario_Diagnostico.objects.all()
    serializer_class = SumarioDiagnosticoSerializer


@method_decorator(csrf_exempt, name="dispatch")
class BateriasViewSet(viewsets.ModelViewSet):
    queryset = Baterias.objects.all()
    serializer_class = BateriasSerializer


@method_decorator(csrf_exempt, name="dispatch")
class HistoriaMedicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaMedica.objects.all()
    serializer_class = HistoriaMedicaSerializer


@method_decorator(csrf_exempt, name="dispatch")
class PacientesViewSet(viewsets.ModelViewSet):
    queryset = Pacientes.objects.all()
    serializer_class = PacientesSerializer


@method_decorator(csrf_exempt, name="dispatch")
class TipoCitaViewSet(viewsets.ModelViewSet):
    queryset = TipoCita.objects.all()
    serializer_class = TipoCitaSerializer


@method_decorator(csrf_exempt, name="dispatch")
class ResultadoViewSet(viewsets.ModelViewSet):
    queryset = Resultado.objects.all()
    serializer_class = ResultadoSerializer


@method_decorator(csrf_exempt, name="dispatch")
class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
