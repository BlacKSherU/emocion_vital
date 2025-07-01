from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    PagoCitaViewSet,
    FacturaViewSet,
    PsicologoViewSet,
    EmpresaViewSet,
    EstadosViewSet,
    MunicipiosViewSet,
    ParroquiasViewSet,
    CiudadesViewSet,
    DireccionViewSet,
    FamiliarViewSet,
    TratamientosViewSet,
    SumarioDiagnosticoViewSet,
    BateriasViewSet,
    HistoriaMedicaViewSet,
    PacientesViewSet,
    TipoCitaViewSet,
    ResultadoViewSet,
    CitaViewSet,
)

router = DefaultRouter()
router.register(r"usuarios", UserViewSet)
router.register(r"pagos-cita", PagoCitaViewSet)
router.register(r"facturas", FacturaViewSet)
router.register(r"psicologos", PsicologoViewSet)
router.register(r"empresas", EmpresaViewSet)
router.register(r"estados", EstadosViewSet)
router.register(r"municipios", MunicipiosViewSet)
router.register(r"parroquias", ParroquiasViewSet)
router.register(r"ciudades", CiudadesViewSet)
router.register(r"direcciones", DireccionViewSet)
router.register(r"familiares", FamiliarViewSet)
router.register(r"tratamientos", TratamientosViewSet)
router.register(r"sumarios-diagnostico", SumarioDiagnosticoViewSet)
router.register(r"baterias", BateriasViewSet)
router.register(r"historias-medicas", HistoriaMedicaViewSet)
router.register(r"pacientes", PacientesViewSet)
router.register(r"tipos-cita", TipoCitaViewSet)
router.register(r"resultados", ResultadoViewSet)
router.register(r"citas", CitaViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
