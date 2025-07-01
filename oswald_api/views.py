from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse, Http404
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
import os
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
    
    @action(detail=True, methods=['get'])
    def descargar_historial(self, request, pk=None):
        try:
            cita = self.get_object()
            print(f"Descargando historial para cita ID: {pk}")
            print(f"Archivo en base de datos: {cita.historiamedica_archivo}")
            
            if cita.historiamedica_archivo and cita.historiamedica_archivo.name:
                print(f"Ruta del archivo: {cita.historiamedica_archivo.path}")
                print(f"¿Existe el archivo?: {os.path.exists(cita.historiamedica_archivo.path)}")
                
                # Verificar que el archivo existe
                if os.path.exists(cita.historiamedica_archivo.path):
                    # Abrir y servir el archivo
                    response = FileResponse(
                        open(cita.historiamedica_archivo.path, 'rb'),
                        content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    )
                    response['Content-Disposition'] = f'attachment; filename="{os.path.basename(cita.historiamedica_archivo.name)}"'
                    return response
                else:
                    return Response({
                        'error': 'El archivo no existe en el servidor',
                        'archivo_path': cita.historiamedica_archivo.path,
                        'archivo_name': cita.historiamedica_archivo.name
                    }, status=404)
            else:
                return Response({'error': 'No hay archivo de historial médico para esta cita'}, status=404)
        except Exception as e:
            print(f"Error en descargar_historial: {str(e)}")
            return Response({'error': f'Error al descargar el archivo: {str(e)}'}, status=500)
    
    @action(detail=False, methods=['get'])
    def test_archivo(self, request):
        """Endpoint de prueba para verificar que los archivos se pueden servir"""
        try:
            # Ruta al archivo de prueba
            test_file_path = os.path.join(settings.MEDIA_ROOT, 'historias_medicas', 'test_historial.docx')
            print(f"Probando archivo: {test_file_path}")
            print(f"¿Existe?: {os.path.exists(test_file_path)}")
            
            if os.path.exists(test_file_path):
                response = FileResponse(
                    open(test_file_path, 'rb'),
                    content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                )
                response['Content-Disposition'] = 'attachment; filename="test_historial.docx"'
                return response
            else:
                return Response({'error': 'Archivo de prueba no encontrado', 'path': test_file_path}, status=404)
        except Exception as e:
            print(f"Error en test_archivo: {str(e)}")
            return Response({'error': f'Error al servir archivo de prueba: {str(e)}'}, status=500)
