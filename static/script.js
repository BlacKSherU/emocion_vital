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
            if (!this.getAttribute('href').startsWith('#')) {
                return;
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

    // Gestión del formulario de perfil
    const perfilForm = document.querySelector('#perfil form');
    if (perfilForm) {
        perfilForm.addEventListener('submit', function (e) {

            // Aquí se implementaría la lógica para guardar los datos del perfil

        });
    }

    // Gestión del formulario de citas
    const citasForm = document.querySelector('#citas form');
    if (citasForm) {
        // Manejar cambios en el tipo de consulta
        const tipoConsulta = document.querySelector('#tipo-consulta');
        const familiaresContainer = document.querySelector('#familiares-container');

        tipoConsulta.addEventListener('change', function () {
            // Mostrar selector de familiares solo para consultas familiares o de pareja
            familiaresContainer.style.display =
                ['familiar', 'pareja', "ninos", "adolescentes"].includes(this.value) ? 'block' : 'none';
        });

        // Validar fecha y hora antes de enviar
        citasForm.addEventListener('submit', function (e) {

            const fecha = document.querySelector('#fecha').value;
            const hora = document.querySelector('#hora').value;

            // Validar que la fecha no sea anterior a hoy
            /*const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const fechaSeleccionada = new Date(fecha);

            if (fechaSeleccionada < hoy) {
                alert('Por favor seleccione una fecha futura');
                return;
            }

            const citaData = {
                fecha: fecha,
                hora: hora,
                modalidad: document.querySelector('#modalidad').value,
                tipoConsulta: document.querySelector('#tipo-consulta').value,
                paciente: document.querySelector('#paciente').value,
                familiares: ['familiar', 'pareja'].includes(document.querySelector('#tipo-consulta').value)
                    ? Array.from(document.querySelector('#familiares').selectedOptions).map(option => option.value)
                    : [],
                notas: document.querySelector('#notas').value
            };
            agregarCita(citaData);*/
        });
    }

    // Gestión del formulario de familiares
    const familiaresForm = document.querySelector('#familiares form');
    if (familiaresForm) {
        familiaresForm.addEventListener('submit', function (e) {

        });
    }
});

// Función para agregar una nueva cita a la lista
function agregarCita(citaData) {
    const listaCitas = document.querySelector('#citas .list-group');
    const nuevaCita = document.createElement('div');
    nuevaCita.className = 'list-group-item';

    // Formatear la información de familiares si existe
    const familiaresInfo = citaData.familiares && citaData.familiares.length > 0
        ? `<p class="mb-1">Familiares: ${citaData.familiares.join(', ')}</p>`
        : '';

    nuevaCita.innerHTML = `
        <div class="d-flex w-100 justify-content-between align-items-center">
            <div>
                <h5 class="mb-1">Cita ${citaData.modalidad} - ${citaData.tipoConsulta}</h5>
                <p class="mb-1">Paciente: ${citaData.paciente}</p>
                ${familiaresInfo}
                <p class="mb-1">Fecha: ${citaData.fecha} - Hora: ${citaData.hora}</p>
                <small class="text-muted">${citaData.notas}</small>
            </div>
            <div class="btn-group-vertical">
                <button class="btn btn-sm btn-warning mb-1" onclick="editarCita(this)">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="this.closest('.list-group-item').remove()">Cancelar</button>
            </div>
        </div>
    `;
    listaCitas.appendChild(nuevaCita);
    document.querySelector('#citas form').reset();
    document.querySelector('#familiares-container').style.display = 'none';
}

// Función para validar disponibilidad de horario
function validarDisponibilidad(fecha, hora) {
    // Aquí se implementaría la lógica para verificar si el horario está disponible
    // Por ahora retornamos true
    return true;
}

// Función para cargar los familiares en el selector
function cargarFamiliares() {
    const selectFamiliares = document.querySelector('#familiares');
    // Aquí se cargarían los familiares desde el backend
    const familiares = [
        { id: 1, nombre: 'Juan Pérez' },
        { id: 2, nombre: 'María García' },
        // ... más familiares
    ];

    selectFamiliares.innerHTML = familiares.map(familiar =>
        `<option value="${familiar.id}">${familiar.nombre}</option>`
    ).join('');
}

// Función para editar una cita
function editarCita(boton) {
    const citaElement = boton.closest('.list-group-item');
    // Aquí se implementaría la lógica para editar la cita
    alert('Funcionalidad de edición en desarrollo');
}

// Función para agregar un nuevo familiar a la lista
function agregarFamiliar(familiarData) {
    const listaFamiliares = document.querySelector('#lista-familiares');
    const nuevoFamiliar = document.createElement('div');
    nuevoFamiliar.className = 'list-group-item';
    nuevoFamiliar.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${familiarData.nombre} ${familiarData.apellido}</h5>
            <small>${familiarData.parentesco}</small>
        </div>
        <p class="mb-1">Edad: ${familiarData.edad}</p>
        <small>Cédula: ${familiarData.cedula}</small>
        <button class="btn btn-sm btn-danger float-end" onclick="this.parentElement.remove()">Eliminar</button>
    `;
    listaFamiliares.appendChild(nuevoFamiliar);
    document.querySelector('#familiares form').reset();
}

// Función para cargar datos del perfil (simulado)
/*
function cargarDatosPerfil() {
    // Aquí se implementaría la carga de datos desde el backend
    const datosPerfil = {
        nombres: 'Ana María',
        apellidos: 'García López',
        fechaNacimiento: '1985-06-15',
        lugarNacimiento: 'Lima',
        nivelInstruccion: 'universitario',
        ocupacion: 'Psicóloga',
        cedula: '12345678',
        telefono: '555-0123',
        correo: 'ana.garcia@ejemplo.com',
        sexo: 'femenino',
        estadoCivil: 'casado',
        religion: 'Católica',
        centroTrabajo: 'Centro de Salud Mental San Juan',
        grado: 'Licenciatura',
        ciclo: 'N/A',
        lugarResidencia: 'Av. Las Palmeras 123, San Isidro',
        tiempoResidencia: '5',
        tiempoResidenciaUnidad: 'años'
    };

    // Rellenar los campos del formulario
    Object.keys(datosPerfil).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            if (input.type === 'date') {
                // Formatear fecha para input type="date"
                input.value = datosPerfil[key];
            } else if (input.tagName === 'SELECT') {
                // Para elementos select
                input.value = datosPerfil[key];
            } else {
                input.value = datosPerfil[key];
            }
        }
    });
}
*/
// Cargar datos iniciales
window.addEventListener('load', function () {
    cargarDatosPerfil();

}); 