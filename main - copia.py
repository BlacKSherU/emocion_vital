from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn

app = FastAPI(title="API de Gestión Psicológica")

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class Psicologo(BaseModel):
    nombre: str
    cedula: str
    especialidad: str
    estado: str = "Activo"

class Paciente(BaseModel):
    nombre: str
    cedula: str
    telefono: str
    psicologo: str
    ultima_cita: Optional[str] = None

class Cita(BaseModel):
    fecha: str
    hora: str
    paciente: str
    psicologo: str
    estado: str = "Pendiente"

# Base de datos en memoria (temporal)
db_psicologos = []
db_pacientes = []
db_citas = []

# Endpoints para Psicólogos
@app.get("/api/psicologos", response_model=List[Psicologo])
async def get_psicologos():
    return db_psicologos

@app.post("/api/psicologos", response_model=Psicologo)
async def create_psicologo(psicologo: Psicologo):
    if any(p.cedula == psicologo.cedula for p in db_psicologos):
        raise HTTPException(status_code=400, detail="Cédula ya registrada")
    db_psicologos.append(psicologo)
    return psicologo

@app.put("/api/psicologos/{cedula}", response_model=Psicologo)
async def update_psicologo(cedula: str, psicologo: Psicologo):
    for i, p in enumerate(db_psicologos):
        if p.cedula == cedula:
            db_psicologos[i] = psicologo
            return psicologo
    raise HTTPException(status_code=404, detail="Psicólogo no encontrado")

@app.delete("/api/psicologos/{cedula}")
async def delete_psicologo(cedula: str):
    for i, p in enumerate(db_psicologos):
        if p.cedula == cedula:
            db_psicologos.pop(i)
            return {"message": "Psicólogo eliminado"}
    raise HTTPException(status_code=404, detail="Psicólogo no encontrado")

# Endpoints para Pacientes
@app.get("/api/pacientes", response_model=List[Paciente])
async def get_pacientes():
    return db_pacientes

@app.post("/api/pacientes", response_model=Paciente)
async def create_paciente(paciente: Paciente):
    if any(p.cedula == paciente.cedula for p in db_pacientes):
        raise HTTPException(status_code=400, detail="Cédula ya registrada")
    db_pacientes.append(paciente)
    return paciente

@app.put("/api/pacientes/{cedula}", response_model=Paciente)
async def update_paciente(cedula: str, paciente: Paciente):
    for i, p in enumerate(db_pacientes):
        if p.cedula == cedula:
            db_pacientes[i] = paciente
            return paciente
    raise HTTPException(status_code=404, detail="Paciente no encontrado")

@app.delete("/api/pacientes/{cedula}")
async def delete_paciente(cedula: str):
    for i, p in enumerate(db_pacientes):
        if p.cedula == cedula:
            db_pacientes.pop(i)
            return {"message": "Paciente eliminado"}
    raise HTTPException(status_code=404, detail="Paciente no encontrado")

# Endpoints para Citas
@app.get("/api/citas", response_model=List[Cita])
async def get_citas():
    return db_citas

@app.post("/api/citas", response_model=Cita)
async def create_cita(cita: Cita):
    # Verificar disponibilidad
    for c in db_citas:
        if c.fecha == cita.fecha and c.hora == cita.hora and c.psicologo == cita.psicologo:
            raise HTTPException(status_code=400, detail="Horario no disponible")
    db_citas.append(cita)
    return cita

@app.put("/api/citas/{fecha}/{hora}", response_model=Cita)
async def update_cita(fecha: str, hora: str, cita: Cita):
    for i, c in enumerate(db_citas):
        if c.fecha == fecha and c.hora == hora:
            db_citas[i] = cita
            return cita
    raise HTTPException(status_code=404, detail="Cita no encontrada")

@app.delete("/api/citas/{fecha}/{hora}")
async def delete_cita(fecha: str, hora: str):
    for i, c in enumerate(db_citas):
        if c.fecha == fecha and c.hora == hora:
            db_citas.pop(i)
            return {"message": "Cita eliminada"}
    raise HTTPException(status_code=404, detail="Cita no encontrada")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True) 