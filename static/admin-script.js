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
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);

            // Actualizar clases active
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Mostrar la sección correspondiente
            showSection(sectionId);
        });
    });

    // Inicializar gráficos
    inicializarGraficos();

    // Buscar input de búsqueda en la sección de pacientes
    const inputBusqueda = document.querySelector('#pacientes input[type="text"]');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', function () {
            filtrarPacientesBusqueda(this.value);
        });
    }
});

// Función para inicializar los gráficos
function inicializarGraficos() {
    // Gráfico de citas por psicólogo
    const ctxCitas = document.getElementById('grafico-citas');
    if (ctxCitas) {
        new Chart(ctxCitas, {
            type: 'bar',
            data: {
                labels: ['Dr. García', 'Dra. López', 'Dr. Martínez', 'Dra. Rodríguez'],
                datasets: [{
                    label: 'Citas por Psicólogo',
                    data: [12, 19, 8, 15],
                    backgroundColor: [
                        'rgba(46, 125, 50, 0.8)',
                        'rgba(129, 199, 132, 0.8)',
                        'rgba(165, 214, 167, 0.8)',
                        'rgba(200, 230, 201, 0.8)'
                    ],
                    borderColor: [
                        'rgba(46, 125, 50, 1)',
                        'rgba(129, 199, 132, 1)',
                        'rgba(165, 214, 167, 1)',
                        'rgba(200, 230, 201, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Gráfico de ingresos mensuales
    const ctxIngresos = document.getElementById('grafico-ingresos');
    if (ctxIngresos) {
        new Chart(ctxIngresos, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Ingresos Mensuales',
                    data: [12000, 19000, 15000, 17000, 14000, 12500],
                    fill: false,
                    borderColor: 'rgb(46, 125, 50)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Función para cargar la lista de psicólogos desde la API (para panel de psicólogos)
function cargarPsicologosAPI() {
    const listaPsicologos = document.getElementById('lista-psicologos');
    if (!listaPsicologos) return;

    apiRequest('/psicologos/')
        .then(response => {
            console.log('Respuesta cruda de la API /psicologos/:', response);
            let psicologos = Array.isArray(response) ? response :
                (response.results ? response.results : (response.data ? response.data : []));
            console.log('Psicólogos procesados:', psicologos);
            listaPsicologos.innerHTML = psicologos.map(psicologo => `
                <tr>
                    <td>${[psicologo.primer_nombre, psicologo.segundo_nombre].filter(Boolean).join(' ')}</td>
                    <td>${psicologo.n_documento || ''}</td>
                    <td>${psicologo.especialidad || ''}</td>
                    <td><span class="badge bg-success">${psicologo.estado || ''}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1" onclick="editarPsicologo('${psicologo.n_documento || ''}')\">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarPsicologo('${psicologo.n_documento || ''}')\">Eliminar</button>
                    </td>
                </tr>
            `).join('');
            if (psicologos.length === 0) {
                listaPsicologos.innerHTML = '<tr><td colspan="5" class="text-muted">No hay psicólogos registrados</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error al cargar psicólogos:', error);
            listaPsicologos.innerHTML = '<tr><td colspan="5" class="text-danger">Error al cargar los psicólogos</td></tr>';
        });
}

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
                    <button class="btn btn-sm btn-info me-1" onclick="verHistorial('${paciente.n_documento || ''}')\">Historial</button>
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

// Funciones de utilidad
function editarPsicologo(cedula) {
    // Implementar lógica de edición
    alert(`Editando psicólogo con cédula: ${cedula}`);
}

function eliminarPsicologo(cedula) {
    if (confirm('¿Está seguro de eliminar este psicólogo?')) {
        // Implementar lógica de eliminación
        alert(`Eliminando psicólogo con cédula: ${cedula}`);
    }
}

function verHistorial(cedula) {
    // Implementar lógica para ver historial
    alert(`Viendo historial del paciente con cédula: ${cedula}`);
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
                <button class="btn btn-sm btn-info me-1" onclick="verDetallesCita('${cita.Fecha_primera_consulta || cita.fecha || ''}', '${cita.hora_consulta || cita.hora || ''}')">Detalles</button>
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

// Función para cargar psicólogos en un selector específico
async function cargarPsicologosEnSelector(selectorId, psicologoSeleccionado = null) {
    try {
        const psicologosResponse = await apiRequest('/psicologos/');
        let psicologos = Array.isArray(psicologosResponse) ? psicologosResponse : 
                        (psicologosResponse.results ? psicologosResponse.results : 
                        (psicologosResponse.data ? psicologosResponse.data : []));
        
        const selectPsicologos = document.getElementById(selectorId);
        if (selectPsicologos) {
            selectPsicologos.innerHTML = '<option value="">Seleccione psicólogo...</option>';
            
            psicologos.forEach(psicologo => {
                const nombreCompleto = [
                    psicologo.primer_nombre,
                    psicologo.segundo_nombre,
                    psicologo.primer_apellido,
                    psicologo.segundo_apellido
                ].filter(n => n).join(' ');
                
                const option = document.createElement('option');
                option.value = psicologo.id || psicologo.n_documento;
                option.textContent = nombreCompleto || `Cédula: ${psicologo.n_documento}`;
                
                // Seleccionar el psicólogo actual si se especifica
                if (psicologoSeleccionado && (psicologo.id == psicologoSeleccionado || psicologo.n_documento == psicologoSeleccionado)) {
                    option.selected = true;
                }
                
                selectPsicologos.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar psicólogos en selector:', error);
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
    cargarPsicologosAPI();
    cargarPacientes();
    cargarCitas();
});

// Objeto para guardar la especialidad de cada usuario psicólogo
const especialidadesPsicologos = {};

// Lógica para el formulario de agregar psicólogos
window.addEventListener('DOMContentLoaded', function () {
    const formAgregarPsicologo = document.querySelector('#psicologos form');
    if (formAgregarPsicologo) {
        formAgregarPsicologo.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nombre = document.getElementById('psicologo-nombre').value.trim();
            const apellido = document.getElementById('psicologo-apellido').value.trim();
            const email = document.getElementById('psicologo-email').value.trim();
            const cedula = document.getElementById('psicologo-cedula').value.trim();
            const especialidad = document.getElementById('psicologo-especialidad').value.trim();

            // Crear usuario en /usuarios/
            const nombres = nombre.split(' ');
            const apellidos = apellido.split(' ');
            const first_name = nombres[0] || '';
            const last_name = apellidos.join(' ');
            let userId = null;
            let username = '';
            try {
                // Primero, obtener el número de usuarios actuales para generar el username
                const usuariosResp = await apiRequest('/usuarios/');
                let usuarios = Array.isArray(usuariosResp) ? usuariosResp : (usuariosResp.results ? usuariosResp.results : (usuariosResp.data ? usuariosResp.data : []));
                const nextId = (usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1);
                username = `Psico${nextId}`;
                const usuarioData = {
                    username: username,
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    is_active: true
                };
                const usuarioCreado = await apiRequest('/usuarios/', 'POST', usuarioData);
                userId = usuarioCreado.id;
                // Guardar la especialidad en JS
                especialidadesPsicologos[userId] = especialidad;
                // Obtener el siguiente id_psicologo autoincremental
                const psicologosResp = await apiRequest('/psicologos/');
                let psicologos = Array.isArray(psicologosResp) ? psicologosResp : (psicologosResp.results ? psicologosResp.results : (psicologosResp.data ? psicologosResp.data : []));
                const nextPsicologoId = (psicologos.length > 0 ? Math.max(...psicologos.map(p => p.id_psicologo || p.id)) + 1 : 1);
                // Crear psicólogo en /psicologos/
                const psicologoData = {
                    id_psicologo: nextPsicologoId,
                    id_admin: 1,
                    id_usuario: userId,
                    n_documento: cedula
                };
                await apiRequest('/psicologos/', 'POST', psicologoData);
                alert('Psicólogo agregado correctamente');
                formAgregarPsicologo.reset();
                cargarPsicologosAPI();
            } catch (error) {
                console.error('Error al agregar psicólogo:', error);
                alert('Error al agregar psicólogo: ' + error.message);
            }
        });
    }
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