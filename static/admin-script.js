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

// Función para cargar la lista de psicólogos
function cargarPsicologos() {
    const listaPsicologos = document.getElementById('lista-psicologos');
    if (!listaPsicologos) return;

    // Datos de ejemplo
    const psicologos = [
        {
            nombre: 'Dr. Juan García',
            cedula: '12345',
            especialidad: 'Psicología Clínica',
            estado: 'Activo'
        },
        {
            nombre: 'Dra. María López',
            cedula: '67890',
            especialidad: 'Terapia Familiar',
            estado: 'Activo'
        }
    ];

    // Generar HTML para la tabla
    listaPsicologos.innerHTML = psicologos.map(psicologo => `
        <tr>
            <td>${psicologo.nombre}</td>
            <td>${psicologo.cedula}</td>
            <td>${psicologo.especialidad}</td>
            <td><span class="badge bg-success">${psicologo.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarPsicologo('${psicologo.cedula}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarPsicologo('${psicologo.cedula}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Función para cargar la lista de pacientes
function cargarPacientes() {
    const listaPacientes = document.getElementById('lista-pacientes');
    if (!listaPacientes) return;

    // Datos de ejemplo
    const pacientes = [
        {
            nombre: 'Ana Martínez',
            cedula: '12345678',
            telefono: '555-0123',
            psicologo: 'Dr. García',
            ultimaCita: '2024-03-15'
        }
    ];

    // Generar HTML para la tabla
    listaPacientes.innerHTML = pacientes.map(paciente => `
        <tr>
            <td>${paciente.nombre}</td>
            <td>${paciente.cedula}</td>
            <td>${paciente.telefono}</td>
            <td>${paciente.psicologo}</td>
            <td>${paciente.ultimaCita}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="verHistorial('${paciente.cedula}')">Historial</button>
                <button class="btn btn-sm btn-warning me-1" onclick="editarPaciente('${paciente.cedula}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarPaciente('${paciente.cedula}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
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
    // Implementar lógica de edición
    alert(`Editando paciente con cédula: ${cedula}`);
}

function eliminarPaciente(cedula) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
        // Implementar lógica de eliminación
        alert(`Eliminando paciente con cédula: ${cedula}`);
    }
}

// Función para cargar la lista de citas
function cargarCitas() {
    const listaCitas = document.getElementById('lista-citas');
    if (!listaCitas) return;

    // Datos de ejemplo
    const citas = [
        {
            fecha: '2024-03-20',
            hora: '09:00',
            paciente: 'Ana Martínez',
            psicologo: 'Dr. García',
            estado: 'Pendiente'
        },
        {
            fecha: '2024-03-20',
            hora: '10:30',
            paciente: 'Carlos Rodríguez',
            psicologo: 'Dra. López',
            estado: 'Completada'
        },
        {
            fecha: '2024-03-20',
            hora: '14:00',
            paciente: 'María González',
            psicologo: 'Dr. Martínez',
            estado: 'Cancelada'
        },
        {
            fecha: '2024-03-21',
            hora: '11:00',
            paciente: 'Juan Pérez',
            psicologo: 'Dra. Rodríguez',
            estado: 'Pendiente'
        },
        {
            fecha: '2024-03-21',
            hora: '15:30',
            paciente: 'Laura Sánchez',
            psicologo: 'Dr. García',
            estado: 'Pendiente'
        }
    ];

    // Generar HTML para la tabla
    listaCitas.innerHTML = citas.map(cita => `
        <tr>
            <td>${cita.fecha}</td>
            <td>${cita.hora}</td>
            <td>${cita.paciente}</td>
            <td>${cita.psicologo}</td>
            <td>
                <span class="badge ${getEstadoClass(cita.estado)}">${cita.estado}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="verDetallesCita('${cita.fecha}', '${cita.hora}')">Detalles</button>
                <button class="btn btn-sm btn-warning me-1" onclick="editarCita('${cita.fecha}', '${cita.hora}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="cancelarCita('${cita.fecha}', '${cita.hora}')">Cancelar</button>
            </td>
        </tr>
    `).join('');

    // Cargar opciones de psicólogos en el filtro
    const filtroPsicologo = document.getElementById('filtro-psicologo');
    if (filtroPsicologo) {
        const psicologos = ['Dr. García', 'Dra. López', 'Dr. Martínez', 'Dra. Rodríguez'];
        psicologos.forEach(psicologo => {
            const option = document.createElement('option');
            option.value = psicologo;
            option.textContent = psicologo;
            filtroPsicologo.appendChild(option);
        });
    }
}

// Función para obtener la clase CSS según el estado de la cita
function getEstadoClass(estado) {
    switch (estado.toLowerCase()) {
        case 'pendiente':
            return 'bg-warning';
        case 'completada':
            return 'bg-success';
        case 'cancelada':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Funciones para manejar acciones de citas
function verDetallesCita(fecha, hora) {
    alert(`Viendo detalles de la cita del ${fecha} a las ${hora}`);
}

function editarCita(fecha, hora) {
    alert(`Editando cita del ${fecha} a las ${hora}`);
}

function cancelarCita(fecha, hora) {
    if (confirm('¿Está seguro de cancelar esta cita?')) {
        alert(`Cancelando cita del ${fecha} a las ${hora}`);
    }
}

// Cargar datos iniciales
window.addEventListener('load', function () {
    cargarPsicologos();
    cargarPacientes();
    cargarCitas();
}); 