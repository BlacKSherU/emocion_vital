// === INICIO: Función para peticiones a la API ===
const API_BASE_URL = 'http://127.0.0.1:8000/api';
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'include',
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        }
    } catch (error) {
        console.error('Error en la petición API:', error);
        throw error;
    }
}
// === FIN función apiRequest ===

// Manejo de la navegación
document.addEventListener('DOMContentLoaded', function () {
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');

    // Función para mostrar una sección y ocultar las demás
    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
    }

    // Agregar eventos click a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Excluir el enlace de cerrar sesión
            if (this.classList.contains('logout-link') || this.textContent.includes('Cerrar sesión')) {
                return; // Permitir el comportamiento normal del enlace
            }
            
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);

            // Actualizar clases active
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Mostrar la sección correspondiente
            showSection(sectionId);
        });
    });

    // Buscar input de búsqueda en la sección de pacientes
    const inputBusqueda = document.querySelector('#pacientes input[type="text"]');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', function () {
            filtrarPacientesBusqueda(this.value);
        });
    }
});



// Variable global para almacenar los pacientes cargados
let pacientesGlobal = [];

function cargarPacientes() {
    const listaPacientes = document.getElementById('lista-pacientes');
    if (!listaPacientes) return;

    apiRequest('/pacientes/')
        .then(response => {
            console.log('Respuesta cruda de la API /pacientes/:', response);
            let pacientes = Array.isArray(response) ? response :
                (response.results ? response.results : (response.data ? response.data : []));
            console.log('Pacientes procesados:', pacientes);
            pacientesGlobal = pacientes; // Guardar en variable global
            renderizarPacientes(pacientes);
        })
        .catch(error => {
            console.error('Error al cargar pacientes:', error);
            listaPacientes.innerHTML = '<tr><td colspan="4" class="text-danger">Error al cargar los pacientes</td></tr>';
        });
}

// Función para renderizar la tabla de pacientes
function renderizarPacientes(pacientes) {
    const listaPacientes = document.getElementById('lista-pacientes');
    if (!listaPacientes) return;
    listaPacientes.innerHTML = pacientes.map(paciente => {
        console.log('Paciente a mostrar:', paciente);
        return `
            <tr>
                <td>${[paciente.primer_nombre, paciente.segundo_nombre].filter(Boolean).join(' ')}</td>
                <td>${paciente.n_documento || ''}</td>
                <td>${paciente.Telefono_paciente || ''}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editarPaciente('${paciente.n_documento || ''}')\">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarPaciente('${paciente.n_documento || ''}')\">Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');
    if (pacientes.length === 0) {
        listaPacientes.innerHTML = '<tr><td colspan="4" class="text-muted">No hay pacientes registrados</td></tr>';
    }
}

// Función para filtrar pacientes según la búsqueda
function filtrarPacientesBusqueda(valorBusqueda) {
    const valor = valorBusqueda.trim().toLowerCase();
    if (!valor) {
        renderizarPacientes(pacientesGlobal);
        return;
    }
    const filtrados = pacientesGlobal.filter(paciente => {
        const nombre = [paciente.primer_nombre, paciente.segundo_nombre].filter(Boolean).join(' ').toLowerCase();
        const cedula = (paciente.n_documento || '').toLowerCase();
        const telefono = (paciente.Telefono_paciente || '').toLowerCase();
        return nombre.includes(valor) || cedula.includes(valor) || telefono.includes(valor);
    });
    renderizarPacientes(filtrados);
}

// Variable global para almacenar archivos de historial médico
let archivosHistorialMedico = {};

// Funciones de utilidad
function verHistorial(citaId) {
    // Buscar la cita por ID
    const cita = citasGlobal.find(c => c.id == citaId);
    
    if (!cita) {
        alert('No se encontró la cita');
        return;
    }
    
    // Guardar el ID de la cita en el modal
    document.getElementById('historial-cita-id').value = cita.id || '';
    
    // Mostrar información del archivo actual si existe
    const archivoActualInfo = document.getElementById('archivo-actual-info');
    const archivoDescarga = document.getElementById('archivo-descarga');
    
    if (cita.historiamedica_archivo) {
        archivoActualInfo.innerHTML = `
            <div class="alert alert-info">
                <strong>Archivo actual:</strong> ${cita.historiamedica_archivo}
            </div>
        `;
        archivoDescarga.style.display = 'block';
    } else {
        archivoActualInfo.innerHTML = '<span class="text-muted">No hay archivo cargado</span>';
        archivoDescarga.style.display = 'none';
    }
    
    // Abrir el modal
    const modal = new bootstrap.Modal(document.getElementById('historialMedicoModal'));
    modal.show();
}

function editarPaciente(cedula) {
    // Buscar el paciente en los pacientes globales
    const paciente = pacientesGlobal.find(p => p.n_documento === cedula);
    
    if (!paciente) {
        alert('No se encontró el paciente');
        return;
    }
    
    // Llenar el formulario del modal con los datos del paciente
    document.getElementById('editar-paciente-id').value = paciente.id || '';
    document.getElementById('editar-paciente-nombre').value = [
        paciente.primer_nombre,
        paciente.segundo_nombre
    ].filter(n => n).join(' ');
    document.getElementById('editar-paciente-apellido').value = [
        paciente.primer_apellido,
        paciente.segundo_apellido
    ].filter(a => a).join(' ');
    document.getElementById('editar-paciente-cedula').value = paciente.n_documento || '';
    document.getElementById('editar-paciente-telefono').value = paciente.Telefono_paciente || '';
    
    // Abrir el modal
    const modal = new bootstrap.Modal(document.getElementById('editarPacienteModal'));
    modal.show();
}

function eliminarPaciente(cedula) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
        // Implementar lógica de eliminación
        alert(`Eliminando paciente con cédula: ${cedula}`);
    }
}

// Variable global para almacenar las citas cargadas
let citasGlobal = [];

function cargarCitas() {
    const listaCitas = document.getElementById('lista-citas');
    if (!listaCitas) return;

    apiRequest('/citas/')
        .then(response => {
            console.log('Respuesta cruda de la API /citas/:', response);
            let citas = Array.isArray(response) ? response :
                (response.results ? response.results : (response.data ? response.data : []));
            console.log('Citas procesadas:', citas);
            citasGlobal = citas; // Guardar en variable global
            renderizarCitas(citas);
        })
        .catch(error => {
            console.error('Error al cargar citas:', error);
            listaCitas.innerHTML = '<tr><td colspan="4" class="text-danger">Error al cargar las citas</td></tr>';
        });
}

// Función para renderizar la tabla de citas
function renderizarCitas(citas) {
    const listaCitas = document.getElementById('lista-citas');
    if (!listaCitas) return;
    listaCitas.innerHTML = citas.map(cita => `
        <tr>
            <td>${cita.Fecha_primera_consulta || cita.fecha || ''}</td>
            <td>${cita.hora_consulta || cita.hora || ''}</td>
            <td>${cita.paciente_nombre || (cita.paciente && cita.paciente.primer_nombre ? cita.paciente.primer_nombre : '')}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="verHistorial('${cita.id || ''}')">Historial</button>
                <button class="btn btn-sm btn-warning me-1" onclick="editarCita('${cita.Fecha_primera_consulta || cita.fecha || ''}', '${cita.hora_consulta || cita.hora || ''}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="cancelarCita('${cita.Fecha_primera_consulta || cita.fecha || ''}', '${cita.hora_consulta || cita.hora || ''}')">Cancelar</button>
            </td>
        </tr>
    `).join('');
    if (citas.length === 0) {
        listaCitas.innerHTML = '<tr><td colspan="4" class="text-muted">No hay citas agendadas</td></tr>';
    }
}

// Funciones para manejar acciones de citas
function verDetallesCita(fecha, hora) {
    alert(`Viendo detalles de la cita del ${fecha} a las ${hora}`);
}

function editarCita(fecha, hora) {
    // Buscar la cita en las citas globales
    const cita = citasGlobal.find(c => 
        (c.Fecha_primera_consulta || c.fecha) === fecha && 
        (c.hora_consulta || c.hora) === hora
    );
    
    if (!cita) {
        alert('No se encontró la cita');
        return;
    }
    
    // Llenar el formulario del modal con los datos de la cita
    document.getElementById('editar-cita-id').value = cita.id || '';
    document.getElementById('editar-fecha').value = cita.Fecha_primera_consulta || cita.fecha || '';
    document.getElementById('editar-hora').value = cita.hora_consulta || cita.hora || '';
    document.getElementById('editar-modalidad').value = cita.modalidad || '';
    document.getElementById('editar-notas').value = cita.notas || '';
    
    // Cargar pacientes en el selector
    cargarPacientesEnSelector('editar-paciente', cita.paciente || cita.paciente_id);
    
    // Abrir el modal
    const modal = new bootstrap.Modal(document.getElementById('editarCitaModal'));
    modal.show();
}

// Función para cargar pacientes en un selector específico
async function cargarPacientesEnSelector(selectorId, pacienteSeleccionado = null) {
    try {
        const pacientesResponse = await apiRequest('/pacientes/');
        let pacientes = Array.isArray(pacientesResponse) ? pacientesResponse : 
                       (pacientesResponse.results ? pacientesResponse.results : 
                       (pacientesResponse.data ? pacientesResponse.data : []));
        
        const selectPacientes = document.getElementById(selectorId);
        if (selectPacientes) {
            selectPacientes.innerHTML = '<option value="">Seleccione paciente...</option>';
            
            pacientes.forEach(paciente => {
                const nombreCompleto = [
                    paciente.primer_nombre,
                    paciente.segundo_nombre,
                    paciente.primer_apellido,
                    paciente.segundo_apellido
                ].filter(n => n).join(' ');
                
                const option = document.createElement('option');
                option.value = paciente.id || paciente.n_documento;
                option.textContent = nombreCompleto || `Cédula: ${paciente.n_documento}`;
                
                // Seleccionar el paciente actual si se especifica
                if (pacienteSeleccionado && (paciente.id == pacienteSeleccionado || paciente.n_documento == pacienteSeleccionado)) {
                    option.selected = true;
                }
                
                selectPacientes.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar pacientes en selector:', error);
    }
}

// Función para guardar la edición de la cita
async function guardarEdicionCita() {
    try {
        const citaId = document.getElementById('editar-cita-id').value;
        const fecha = document.getElementById('editar-fecha').value;
        const hora = document.getElementById('editar-hora').value;
        const paciente = document.getElementById('editar-paciente').value;
        const modalidad = document.getElementById('editar-modalidad').value;
        const notas = document.getElementById('editar-notas').value;
        
        // Validar campos requeridos
        if (!fecha || !hora || !paciente || !modalidad) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
        
        // Validar que la fecha no sea anterior a hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaSeleccionada = new Date(fecha);
        
        if (fechaSeleccionada < hoy) {
            alert('Por favor seleccione una fecha futura');
            return;
        }
        
        // Estructura de datos para actualizar la cita
        const citaData = {
            Numero_historial: 1,
            Fecha_primera_consulta: fecha,
            hora_consulta: hora,
            modalidad: modalidad,
            tipo_consulta: 'individual', // Por defecto, se puede modificar si es necesario
            notas: notas || "",
            paciente: paciente,
            acompañantes: []
        };
        
        console.log('Datos de cita a actualizar:', citaData);
        
        // Actualizar la cita
        await apiRequest(`/citas/${citaId}/`, 'PUT', citaData);
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarCitaModal'));
        modal.hide();
        
        // Mostrar mensaje de éxito
        alert('Cita actualizada correctamente');
        
        // Recargar las citas
        await cargarCitas();
        
    } catch (error) {
        console.error('Error al guardar edición de la cita:', error);
        alert('Error al guardar los cambios: ' + error.message);
    }
}

function cancelarCita(fecha, hora) {
    if (confirm('¿Está seguro de cancelar esta cita?')) {
        alert(`Cancelando cita del ${fecha} a las ${hora}`);
    }
}

// Cargar datos iniciales
window.addEventListener('load', function () {
    console.log('Página cargada, iniciando carga de datos...');
    cargarPacientes();
    cargarCitas();
});



// Función para filtrar citas según los filtros del formulario
function filtrarCitas() {
    const fecha = document.getElementById('filtro-fecha').value;
    let filtradas = citasGlobal;
    if (fecha) {
        filtradas = filtradas.filter(cita => (cita.Fecha_primera_consulta || cita.fecha || '').startsWith(fecha));
    }
    renderizarCitas(filtradas);
}

// Agregar evento al formulario de filtros de citas
window.addEventListener('DOMContentLoaded', function () {
    const formFiltroCitas = document.querySelector('#citas form');
    if (formFiltroCitas) {
        formFiltroCitas.addEventListener('submit', function (e) {
            e.preventDefault();
            filtrarCitas();
        });
    }
});

// Función para guardar la edición del paciente
async function guardarEdicionPaciente() {
    try {
        const pacienteId = document.getElementById('editar-paciente-id').value;
        const nombreCompleto = document.getElementById('editar-paciente-nombre').value.trim();
        const apellidoCompleto = document.getElementById('editar-paciente-apellido').value.trim();
        const cedula = document.getElementById('editar-paciente-cedula').value;
        const telefono = document.getElementById('editar-paciente-telefono').value;
        
        // Validar campos requeridos
        if (!nombreCompleto || !apellidoCompleto || !cedula || !telefono) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
        
        // Separar nombres y apellidos
        const primerNombre = nombreCompleto.split(' ')[0] || null;
        const segundoNombre = nombreCompleto.split(' ').slice(1).join(' ') || null;
        const primerApellido = apellidoCompleto.split(' ')[0] || null;
        const segundoApellido = apellidoCompleto.split(' ').slice(1).join(' ') || null;
        
        // Estructura de datos para actualizar el paciente
        const pacienteData = {
            primer_nombre: primerNombre,
            segundo_nombre: segundoNombre,
            primer_apellido: primerApellido,
            segundo_apellido: segundoApellido,
            n_documento: cedula,
            Telefono_paciente: telefono
        };
        
        console.log('Datos de paciente a actualizar:', pacienteData);
        
        // Actualizar el paciente
        await apiRequest(`/pacientes/${pacienteId}/`, 'PUT', pacienteData);
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarPacienteModal'));
        modal.hide();
        
        // Mostrar mensaje de éxito
        alert('Paciente actualizado correctamente');
        
        // Recargar los pacientes
        await cargarPacientes();
        
    } catch (error) {
        console.error('Error al guardar edición del paciente:', error);
        alert('Error al guardar los cambios: ' + error.message);
    }
}



// Función para guardar el archivo de historial médico
async function guardarHistorialMedico() {
    try {
        const citaId = document.getElementById('historial-cita-id').value;
        const archivoInput = document.getElementById('archivo-historial');
        const archivo = archivoInput.files[0];
        
        if (!archivo) {
            alert('Por favor seleccione un archivo');
            return;
        }
        
        // Validar que sea un archivo .docx
        if (!archivo.name.toLowerCase().endsWith('.docx')) {
            alert('Por favor seleccione solo archivos Word (.docx)');
            return;
        }
        
        // Crear FormData para enviar el archivo
        const formData = new FormData();
        formData.append('historiamedica_archivo', archivo);
        
        // Guardar el archivo en la variable global
        archivosHistorialMedico[citaId] = {
            nombre: archivo.name,
            archivo: archivo,
            fecha: new Date().toISOString()
        };
        
        // Enviar a la API
        const response = await fetch(`${API_BASE_URL}/citas/${citaId}/`, {
            method: 'PATCH',
            body: formData,
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('historialMedicoModal'));
        modal.hide();
        
        // Mostrar mensaje de éxito
        alert('Archivo de historial médico guardado correctamente');
        
        // Recargar las citas para mostrar el archivo actualizado
        await cargarCitas();
        
    } catch (error) {
        console.error('Error al guardar archivo de historial médico:', error);
        alert('Error al guardar el archivo: ' + error.message);
    }
}

// Función para descargar el archivo de historial médico
async function descargarHistorial() {
    try {
        const citaId = document.getElementById('historial-cita-id').value;
        const cita = citasGlobal.find(c => c.id == citaId);
        
        if (!cita || !cita.historiamedica_archivo) {
            alert('No hay archivo para descargar');
            return;
        }
        
        // Verificar primero si el archivo existe haciendo una petición HEAD
        const response = await fetch(`${API_BASE_URL}/citas/${citaId}/descargar_historial/`, {
            method: 'HEAD',
            credentials: 'include'
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                alert('El archivo no existe en el servidor');
            } else {
                alert('Error al verificar el archivo: ' + response.statusText);
            }
            return;
        }
        
        // Si el archivo existe, proceder con la descarga
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}/citas/${citaId}/descargar_historial/`;
        link.download = cita.historiamedica_archivo;
        link.target = '_blank';
        
        // Simular clic en el enlace
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error('Error al descargar archivo:', error);
        alert('Error al descargar el archivo: ' + error.message);
    }
}

// Hacer las funciones disponibles globalmente
window.guardarHistorialMedico = guardarHistorialMedico;
window.descargarHistorial = descargarHistorial; 