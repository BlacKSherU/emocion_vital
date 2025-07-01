// Configuración de la API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Función auxiliar para obtener el ID del paciente correcto
async function obtenerIdPacienteCorrecto() {
    const idUsuario = window.pacienteid || 1;
    console.log('Obteniendo ID del paciente para usuario:', idUsuario);

    try {
        // Primero intentar obtener el paciente directamente por ID
        const pacienteDirecto = await apiRequest(`/pacientes/${idUsuario}/`);
        console.log('Paciente encontrado directamente:', pacienteDirecto.id);
        return pacienteDirecto.id;
    } catch (error) {
        if (error.message.includes('404')) {
            console.log('Buscando paciente por usuario...');
            // Si no se encuentra, buscar por usuario
            const todosPacientes = await apiRequest('/pacientes/');
            let pacientes = Array.isArray(todosPacientes) ? todosPacientes :
                (todosPacientes.results ? todosPacientes.results :
                    (todosPacientes.data ? todosPacientes.data : []));

            const paciente = pacientes.find(p => p.user === idUsuario);
            if (paciente) {
                console.log('Paciente encontrado por usuario:', paciente.id);
                return paciente.id;
            } else {
                console.error('No se encontró paciente para el usuario:', idUsuario);
                return null;
            }
        } else {
            throw error;
        }
    }
}

// Variable global para el estado del perfil
let perfilCompleto = false;

// Funciones de la API
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
            console.log('Datos que se enviarán a la API:', data);
            console.log('Datos serializados:', options.body);
        }

        console.log(`Enviando petición a: ${API_BASE_URL}${endpoint}`);
        console.log('Método:', method);
        console.log('Opciones completas:', options);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la respuesta del servidor:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }

        // Intentar parsear la respuesta como JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json();
            console.log('Respuesta JSON del servidor:', jsonResponse);
            return jsonResponse;
        } else {
            // Si la respuesta no es JSON, devolver el texto
            const text = await response.text();
            console.log('Respuesta de texto del servidor (no JSON):', text);
            return text ? JSON.parse(text) : {};
        }
    } catch (error) {
        console.error('Error en la petición API:', error);
        throw error;
    }
}

// Función para validar si el perfil está completo
async function validarPerfilCompleto() {
    // Primero verificar si hay datos en la base de datos
    try {
        // Obtener el ID del usuario actual
        const idUsuario = window.pacienteid || 1;

        // Obtener datos del paciente
        const datosPaciente = await apiRequest(`/pacientes/${idUsuario}/`);

        if (!datosPaciente) {
            console.log('No se encontró el paciente');
            return false;
        }

        // Verificar que tenga todos los campos principales completos
        const camposPrincipales = [
            'primer_nombre', 'primer_apellido', 'fecha_nacimiento',
            'n_documento', 'Telefono_paciente', 'sexo', 'Estado_civil_paciente',
            'Instruccion_paciente', 'Ocupacion_paciente', 'tipo_documento',
            'Procedencia_paciente', 'Cantidad_tiempo_residencia_paciente',
            'pregunta_1', 'respuesta_1', 'pregunta_2', 'respuesta_2', 'pregunta_3', 'respuesta_3'
        ];

        // Verificar que todos los campos principales tengan valores válidos
        const tieneDatosPrincipales = camposPrincipales.every(campo => {
            const valor = datosPaciente[campo];
            return valor !== null && valor !== undefined && valor.toString().trim() !== '';
        });

        if (!tieneDatosPrincipales) {
            console.log('Faltan campos principales en la base de datos');
            console.log('Campos faltantes:', camposPrincipales.filter(campo => {
                const valor = datosPaciente[campo];
                return valor === null || valor === undefined || valor.toString().trim() === '';
            }));
            return false;
        }

        // Verificar que tenga dirección principal
        if (!datosPaciente.direccion_principal) {
            console.log('Falta dirección principal');
            return false;
        }

        // Verificar que tenga correo electrónico (del usuario relacionado)
        if (datosPaciente.user) {
            try {
                const datosUsuario = await apiRequest(`/usuarios/${datosPaciente.user}/`);
                const correoUsuario = datosUsuario.email || datosUsuario.correo;
                if (!correoUsuario || correoUsuario.trim() === '') {
                    console.log('Usuario relacionado no tiene correo electrónico');
                    return false;
                }
            } catch (error) {
                console.log('Error al obtener correo del usuario relacionado');
                return false;
            }
        } else {
            console.log('Paciente no tiene usuario relacionado');
            return false;
        }

        console.log('Perfil completo detectado en base de datos');
        return true;

    } catch (error) {
        console.error('Error al verificar datos en base de datos:', error);
    }

    // Si no hay datos en BD o hay errores, verificar formulario
    const camposRequeridos = [
        'nombres', 'apellidos', 'fechaNacimiento', 'estadoNacimiento',
        'municipioNacimiento', 'parroquiaNacimiento', 'ciudadNacimiento',
        'nivelInstruccion', 'ocupacion', 'tipoDocumento', 'cedula', 'telefono', 'correo',
        'sexo', 'estadoCivil', 'lugarResidencia', 'tiempoResidencia',
        'pregunta1', 'respuesta1', 'pregunta2', 'respuesta2', 'pregunta3', 'respuesta3'
    ];

    console.log('Verificando campos del formulario...');
    for (const campo of camposRequeridos) {
        const elemento = document.getElementById(campo);
        if (!elemento) {
            console.log(`Campo ${campo} no encontrado en el formulario`);
            return false;
        }

        const valor = elemento.value.trim();
        if (!valor) {
            console.log(`Campo ${campo} está vacío`);
            return false;
        }

        // Validaciones específicas por tipo de campo
        if (campo === 'cedula' && valor.length < 7) {
            console.log(`Cédula ${valor} es muy corta`);
            return false;
        }

        if (campo === 'telefono' && valor.length < 10) {
            console.log(`Teléfono ${valor} es muy corto`);
            return false;
        }

        if (campo === 'correo' && !valor.includes('@')) {
            console.log(`Correo ${valor} no es válido`);
            return false;
        }

        if (campo === 'fechaNacimiento') {
            const fecha = new Date(valor);
            const hoy = new Date();
            const edadMinima = new Date();
            edadMinima.setFullYear(hoy.getFullYear() - 5);

            if (fecha > edadMinima) {
                console.log(`Fecha de nacimiento ${valor} es muy reciente`);
                return false;
            }
        }
    }

    console.log('Todos los campos del formulario están completos');
    return true;
}

// Función para configurar la fecha máxima de nacimiento (5 años atrás)
function configurarFechaNacimiento() {
    const fechaInput = document.getElementById('fechaNacimiento');
    if (fechaInput) {
        const hoy = new Date();
        const fechaMinima = new Date();
        fechaMinima.setFullYear(hoy.getFullYear() - 5);

        // Formatear fechas para el input date (YYYY-MM-DD)
        const fechaMaxima = fechaMinima.toISOString().split('T')[0];
        const fechaMinimaFormateada = new Date(1900, 0, 1).toISOString().split('T')[0];

        fechaInput.setAttribute('max', fechaMaxima);
        fechaInput.setAttribute('min', fechaMinimaFormateada);

        // Agregar evento para validar en tiempo real
        fechaInput.addEventListener('change', function () {
            const fechaSeleccionada = new Date(this.value);
            const fechaLimite = new Date();
            fechaLimite.setFullYear(fechaLimite.getFullYear() - 5);

            if (fechaSeleccionada > fechaLimite) {
                alert('La fecha de nacimiento debe ser al menos 5 años anterior a la fecha actual.');
                this.value = '';
            }
        });
    }
}

// Función para configurar la fecha mínima en campos de citas
function configurarFechaCitas() {
    const camposFecha = ['fecha', 'editar-fecha'];

    camposFecha.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            // Establecer la fecha mínima como hoy
            const hoy = new Date();
            const fechaMinima = hoy.toISOString().split('T')[0];
            campo.setAttribute('min', fechaMinima);

            // Agregar evento para validar en tiempo real
            campo.addEventListener('change', function () {
                const fechaSeleccionada = new Date(this.value);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0); // Resetear a medianoche para comparar solo fechas

                if (fechaSeleccionada < hoy) {
                    alert('Por favor seleccione una fecha futura.');
                    this.value = '';
                }
            });
        }
    });
}

// Función para validar campos de solo letras en tiempo real
function configurarValidacionesLetras() {
    const camposLetras = [
        'nombres', 'apellidos', 'ocupacion', 'religion', 'centroTrabajo', 'grado', 'ciclo',
        'familiar-nombre', 'familiar-apellido', 'editar-familiar-nombre', 'editar-familiar-apellido'
    ];

    camposLetras.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function () {
                // Remover caracteres no permitidos
                this.value = this.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, '');
            });
        }
    });
}

// Función para validar campos de solo números en tiempo real
function configurarValidacionesNumeros() {
    const camposNumeros = [
        'cedula', 'telefono', 'familiar-cedula', 'editar-familiar-cedula'
    ];

    camposNumeros.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function () {
                // Remover caracteres no numéricos
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        }
    });
}

// Función para validar edad mínima en tiempo real
function configurarValidacionEdad() {
    const camposEdad = ['familiar-edad', 'editar-familiar-edad'];

    camposEdad.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function () {
                const valor = parseInt(this.value);
                if (valor < 5) {
                    this.setCustomValidity('La edad mínima es 5 años');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
    });
}

// Función para validar tiempo de residencia no negativo
function configurarValidacionTiempoResidencia() {
    const campo = document.getElementById('tiempoResidencia');
    if (campo) {
        campo.addEventListener('input', function () {
            const valor = parseInt(this.value);
            if (valor < 0) {
                this.setCustomValidity('No se permiten números negativos');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Función para actualizar el estado de acceso a las secciones
async function actualizarAccesoSecciones() {
    perfilCompleto = await validarPerfilCompleto();

    const navCitas = document.getElementById('nav-citas');
    const navFamiliares = document.getElementById('nav-familiares');
    const perfilIncompletoCitas = document.getElementById('perfil-incompleto-citas');
    const perfilIncompletoFamiliares = document.getElementById('perfil-incompleto-familiares');
    const citasContent = document.getElementById('citas-content');
    const familiaresContent = document.getElementById('familiares-content');

    if (perfilCompleto) {
        // Habilitar navegación
        if (navCitas) navCitas.classList.remove('disabled');
        if (navFamiliares) navFamiliares.classList.remove('disabled');

        // Ocultar mensajes de advertencia
        if (perfilIncompletoCitas) perfilIncompletoCitas.style.display = 'none';
        if (perfilIncompletoFamiliares) perfilIncompletoFamiliares.style.display = 'none';

        // Mostrar contenido
        if (citasContent) citasContent.style.display = 'block';
        if (familiaresContent) familiaresContent.style.display = 'block';
    } else {
        // Deshabilitar navegación
        if (navCitas) navCitas.classList.add('disabled');
        if (navFamiliares) navFamiliares.classList.add('disabled');

        // Mostrar mensajes de advertencia
        if (perfilIncompletoCitas) perfilIncompletoCitas.style.display = 'block';
        if (perfilIncompletoFamiliares) perfilIncompletoFamiliares.style.display = 'block';

        // Ocultar contenido
        if (citasContent) citasContent.style.display = 'none';
        if (familiaresContent) familiaresContent.style.display = 'none';
    }
}

// Funciones específicas de la API
const api = {
    // Pacientes
    getPaciente: async (id) => {
        try {
            const response = await apiRequest(`/pacientes/${id}/`);
            console.log('Respuesta del servidor:', response);
            return response;
        } catch (error) {
            console.error('Error al obtener paciente:', error);
            throw error;
        }
    },
    // Nueva función para buscar paciente por cédula
    getPacientePorCedula: async (cedula) => {
        try {
            let pacientes = await apiRequest('/pacientes/');
            // Si la respuesta no es un array, buscar la propiedad que lo contenga
            if (!Array.isArray(pacientes)) {
                if (Array.isArray(pacientes.results)) {
                    pacientes = pacientes.results;
                } else if (Array.isArray(pacientes.data)) {
                    pacientes = pacientes.data;
                } else {
                    pacientes = [];
                }
            }
            // Buscar por n_documento (que es la cédula real en la API)
            return pacientes.find(p => p.n_documento === cedula) || null;
        } catch (error) {
            console.error('Error al buscar paciente por cédula:', error);
            throw error;
        }
    },
    updatePaciente: async (id, data) => {
        try {
            console.log('Actualizando paciente con datos:', data);
            const response = await apiRequest(`/pacientes/${id}/`, 'PUT', data);
            console.log('Respuesta del servidor:', response);
            return response;
        } catch (error) {
            console.error('Error al actualizar paciente:', error);
            throw error;
        }
    },

    // Citas
    getCitas: () => apiRequest('/citas/'),
    createCita: (data) => apiRequest('/citas/', 'POST', data),
    updateCita: (id, data) => apiRequest(`/citas/${id}/`, 'PUT', data),
    deleteCita: (id) => apiRequest(`/citas/${id}/`, 'DELETE'),

    // Familiares
    getFamiliares: () => apiRequest('/familiares/'),
    createFamiliar: (data) => apiRequest('/familiares/', 'POST', data),
    updateFamiliar: (id, data) => apiRequest(`/familiares/${id}/`, 'PUT', data),
    deleteFamiliar: (id) => apiRequest(`/familiares/${id}/`, 'DELETE'),
};

// Manejo de la navegación
document.addEventListener('DOMContentLoaded', function () {
    // Configurar validaciones
    configurarFechaNacimiento();
    configurarFechaCitas();
    configurarValidacionesLetras();
    configurarValidacionesNumeros();
    configurarValidacionEdad();
    configurarValidacionTiempoResidencia();

    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');

    // Función para mostrar una sección y ocultar las demás
    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });

        // Verificar acceso antes de cargar datos
        if (sectionId === 'citas' && !perfilCompleto) {
            return;
        }
        if (sectionId === 'familiares' && !perfilCompleto) {
            return;
        }

        // Cargar datos específicos según la sección
        if (sectionId === 'citas') {
            cargarCitas();
        } else if (sectionId === 'familiares') {
            cargarFamiliares();
        }
    }

    // Agregar eventos click a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Si el enlace no comienza con #, permitir el comportamiento por defecto
            if (!this.getAttribute('href').startsWith('#')) {
                return;
            }

            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);

            // Verificar acceso para citas y familiares
            if ((sectionId === 'citas' || sectionId === 'familiares') && !perfilCompleto) {
                alert('Debes completar todos los datos del perfil antes de acceder a esta sección.');
                return;
            }

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
        perfilForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validar que todos los campos requeridos estén completos
            if (!validarPerfilCompleto()) {
                alert('Por favor complete todos los campos requeridos del perfil.');
                return;
            }

            // Obtener el botón submit antes de cualquier operación
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            try {
                // Mostrar indicador de carga
                submitButton.disabled = true;
                submitButton.textContent = 'Guardando...';

                // Obtener el ID del usuario actual
                const idUsuario = window.pacienteid || 1;

                // Obtener datos del paciente para el correo
                const datosPaciente = await apiRequest(`/pacientes/${idUsuario}/`);
                const correoUsuario = datosPaciente?.email || datosPaciente?.correo;

                // Buscar el paciente por correo
                const pacientesResponse = await apiRequest('/pacientes/');
                let pacientes = Array.isArray(pacientesResponse) ? pacientesResponse :
                    (pacientesResponse.results ? pacientesResponse.results :
                        (pacientesResponse.data ? pacientesResponse.data : []));

                const pacienteExistente = pacientes.find(p =>
                    (p.email === correoUsuario || p.correo === correoUsuario)
                ) || pacientes.find(p => p.user === datosPaciente.user);

                if (!pacienteExistente) {
                    throw new Error('No se encontró el paciente asociado al usuario');
                }

                // Crear dirección antes de enviar el perfil
                let direccionId = null;
                try {
                    function getValueOrNull(id) {
                        const el = document.getElementById(id);
                        if (!el) {
                            console.error('No se encontró el elemento con id:', id);
                            return null;
                        }
                        return el.value;
                    }

                    const direccionData = {
                        estado: getValueOrNull('estadoNacimiento'),
                        municipio: getValueOrNull('municipioNacimiento'),
                        parroquia: getValueOrNull('parroquiaNacimiento'),
                        ciudad: getValueOrNull('ciudadNacimiento'),
                        direccion_corta: 'Prueba'
                    };
                    const direccionResp = await apiRequest('/direcciones/', 'POST', direccionData);
                    direccionId = direccionResp.id || direccionResp.id_direccion;
                } catch (error) {
                    alert('Error al crear la dirección: ' + error.message);
                    return;
                }

                const perfilData = {
                    primer_nombre: getValueOrNull('nombres') ? getValueOrNull('nombres').split(' ')[0] : null,
                    segundo_nombre: getValueOrNull('nombres') ? getValueOrNull('nombres').split(' ').slice(1).join(' ') : null,
                    primer_apellido: getValueOrNull('apellidos') ? getValueOrNull('apellidos').split(' ')[0] : null,
                    segundo_apellido: getValueOrNull('apellidos') ? getValueOrNull('apellidos').split(' ').slice(1).join(' ') : null,
                    fecha_nacimiento: getValueOrNull('fechaNacimiento'),
                    Instruccion_paciente: getValueOrNull('nivelInstruccion'),
                    Ocupacion_paciente: getValueOrNull('ocupacion'),
                    tipo_documento: getValueOrNull('tipoDocumento'),
                    n_documento: getValueOrNull('cedula'),
                    Telefono_paciente: getValueOrNull('telefono'),
                    sexo: getValueOrNull('sexo'),
                    Estado_civil_paciente: getValueOrNull('estadoCivil'),
                    Religion_paciente: getValueOrNull('religion'),
                    Centros_estudios_trabajos: getValueOrNull('centroTrabajo'),
                    Grado_paciente: getValueOrNull('grado'),
                    Ciclo_paciente: getValueOrNull('ciclo'),
                    Procedencia_paciente: getValueOrNull('lugarResidencia'),
                    Cantidad_tiempo_residencia_paciente: parseInt(getValueOrNull('tiempoResidencia')) || null, // Número
                    Tiempo_residencia_paciente: getValueOrNull('tiempoResidenciaUnidad'), // Texto del selector (años/meses)
                    pregunta_1: getValueOrNull('pregunta1'),
                    respuesta_1: getValueOrNull('respuesta1'),
                    pregunta_2: getValueOrNull('pregunta2'),
                    respuesta_2: getValueOrNull('respuesta2'),
                    pregunta_3: getValueOrNull('pregunta3'),
                    respuesta_3: getValueOrNull('respuesta3'),
                    direccion_principal: direccionId,
                    email: correoUsuario,
                    correo: correoUsuario,
                    user: datosPaciente.user,
                    status: "activo"
                };

                // Log de los datos que se enviarán
                console.log('Datos a enviar a la API:', perfilData);

                // Actualizar el paciente usando su ID
                const response = await api.updatePaciente(pacienteExistente.id, perfilData);
                console.log('Respuesta del servidor:', response);

                // Verificar si la respuesta es exitosa
                if (response) {
                    alert('Cambios guardados correctamente');
                    // Recargar los datos del perfil para mostrar la información actualizada
                    await cargarDatosPerfil();
                    // Actualizar el estado de acceso a las secciones
                    await actualizarAccesoSecciones();
                } else {
                    throw new Error('No se recibió respuesta del servidor');
                }
            } catch (error) {
                console.error('Error completo:', error);
                alert('Error al guardar los cambios: ' + error.message);
            } finally {
                // Restaurar el botón
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });

        // Agregar eventos para validar en tiempo real
        const camposPerfil = perfilForm.querySelectorAll('input, select');
        camposPerfil.forEach(campo => {
            campo.addEventListener('change', async () => await actualizarAccesoSecciones());
            campo.addEventListener('input', async () => await actualizarAccesoSecciones());
        });
    }

    // Gestión del formulario de citas
    const citasForm = document.querySelector('#citas form');
    if (citasForm) {
        // Manejar cambios en el tipo de consulta
        const tipoConsulta = document.querySelector('#tipo-consulta');
        const familiaresSelect = document.querySelector('#familiares');

        tipoConsulta.addEventListener('change', function () {
            // Mostrar selector de familiares para todos los tipos excepto individual
            familiaresSelect.style.display = this.value === 'individual' ? 'none' : 'block';
            if (this.value === 'individual') {
                familiaresSelect.value = ''; // Limpiar selección
            }
        });

        // Agregar validación en tiempo real para fecha y hora
        const fechaInput = document.querySelector('#fecha');
        const horaSelect = document.querySelector('#hora');
        const submitButton = citasForm.querySelector('button[type="submit"]');
        let validacionTimeout;

        // Función para validar disponibilidad en tiempo real
        async function validarDisponibilidadTiempoReal() {
            const fecha = fechaInput.value;
            const hora = horaSelect.value;

            if (fecha && hora) {
                // Mostrar indicador de validación
                submitButton.disabled = true;
                submitButton.textContent = 'Verificando disponibilidad...';

                try {
                    const resultado = await validarDisponibilidad(fecha, hora);

                    if (resultado.disponible) {
                        // Horario disponible
                        submitButton.disabled = false;
                        submitButton.textContent = 'Agendar Cita';
                        submitButton.className = 'btn btn-success';

                        // Mostrar mensaje de éxito temporal
                        mostrarMensajeValidacion('Horario disponible', 'success');
                    } else {
                        // Horario no disponible
                        submitButton.disabled = true;
                        submitButton.textContent = 'Horario No Disponible';
                        submitButton.className = 'btn btn-danger';

                        // Mostrar mensaje de error
                        mostrarMensajeValidacion(resultado.mensaje, 'danger');
                    }
                } catch (error) {
                    console.error('Error en validación:', error);
                    submitButton.disabled = false;
                    submitButton.textContent = 'Agendar Cita';
                    submitButton.className = 'btn btn-success';
                    mostrarMensajeValidacion('Error al verificar disponibilidad', 'warning');
                }
            } else {
                // Resetear botón si no hay fecha u hora seleccionada
                submitButton.disabled = false;
                submitButton.textContent = 'Agendar Cita';
                submitButton.className = 'btn btn-success';
            }
        }

        // Función para mostrar mensajes de validación
        function mostrarMensajeValidacion(mensaje, tipo) {
            // Remover mensaje anterior si existe
            const mensajeAnterior = document.getElementById('mensaje-validacion');
            if (mensajeAnterior) {
                mensajeAnterior.remove();
            }

            // Crear nuevo mensaje
            const mensajeElement = document.createElement('div');
            mensajeElement.id = 'mensaje-validacion';
            mensajeElement.className = `alert alert-${tipo} alert-dismissible fade show mt-2`;
            mensajeElement.innerHTML = `
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

            // Insertar después del formulario
            citasForm.appendChild(mensajeElement);

            // Auto-ocultar después de 5 segundos
            setTimeout(() => {
                if (mensajeElement.parentNode) {
                    mensajeElement.remove();
                }
            }, 5000);
        }

        // Eventos para validación en tiempo real
        fechaInput.addEventListener('change', function () {
            clearTimeout(validacionTimeout);
            validacionTimeout = setTimeout(validarDisponibilidadTiempoReal, 500);
        });

        horaSelect.addEventListener('change', function () {
            clearTimeout(validacionTimeout);
            validacionTimeout = setTimeout(validarDisponibilidadTiempoReal, 500);
        });

        // Validar fecha y hora antes de enviar
        citasForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Verificar que el perfil esté completo
            if (!perfilCompleto) {
                alert('Debes completar todos los datos del perfil antes de agendar citas.');
                return;
            }

            const fecha = document.querySelector('#fecha').value;
            const hora = document.querySelector('#hora').value;

            // Validar que la fecha no sea anterior a hoy
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const fechaSeleccionada = new Date(fecha);

            if (fechaSeleccionada < hoy) {
                alert('Por favor seleccione una fecha futura');
                return;
            }

            // Validar disponibilidad antes de crear la cita
            const disponibilidad = await validarDisponibilidad(fecha, hora);
            if (!disponibilidad.disponible) {
                alert(disponibilidad.mensaje);
                return;
            }

            // Obtener el botón submit antes de cualquier operación
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            try {
                // Mostrar indicador de carga
                submitButton.disabled = true;
                submitButton.textContent = 'Agendando...';

                // Obtener los familiares seleccionados
                const familiaresSeleccionados = document.querySelector('#tipo-consulta').value !== 'individual'
                    ? Array.from(document.querySelector('#familiares').selectedOptions).map(option => option.value)
                    : [];

                // Estructura de datos según la API
                const citaData = {
                    Numero_historial: 1,
                    Fecha_primera_consulta: fecha,
                    hora_consulta: hora,
                    modalidad: document.querySelector('#modalidad').value,
                    tipo_consulta: document.querySelector('#tipo-consulta').value,
                    notas: document.querySelector('#notas').value || "",
                    paciente: 1, // ID del paciente principal (por ahora fijo en 1)
                    resultado: null,
                    acompañantes: familiaresSeleccionados
                };

                console.log('Datos de cita a enviar a la API:', citaData);

                // Llamar a la función para crear la cita
                await agregarCita(citaData);

                // Limpiar el formulario
                this.reset();
                document.querySelector('#familiares').style.display = 'none';

                // Limpiar mensaje de validación
                const mensajeValidacion = document.getElementById('mensaje-validacion');
                if (mensajeValidacion) {
                    mensajeValidacion.remove();
                }

            } catch (error) {
                console.error('Error completo:', error);
                alert('Error al agendar la cita: ' + error.message);
            } finally {
                // Restaurar el botón
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // Gestión del formulario de familiares
    const familiaresForm = document.querySelector('#familiares form');
    if (familiaresForm) {
        familiaresForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Verificar que el perfil esté completo
            if (!perfilCompleto) {
                alert('Debes completar todos los datos del perfil antes de agregar familiares.');
                return;
            }

            // Obtener el botón submit antes de cualquier operación
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            try {
                // Mostrar indicador de carga
                submitButton.disabled = true;
                submitButton.textContent = 'Guardando...';

                // Recopilar datos del formulario para paciente
                const cedulaFamiliar = document.getElementById('familiar-cedula').value;
                const tipoDocumentoFamiliar = document.getElementById('familiar-tipo-documento').value;
                const nombreFamiliar = document.getElementById('familiar-nombre').value.trim();
                const apellidoFamiliar = document.getElementById('familiar-apellido').value.trim();
                const edadFamiliar = parseInt(document.getElementById('familiar-edad').value) || null;
                const parentescoFamiliar = document.getElementById('familiar-parentesco').value;

                // Validar campos requeridos
                if (!nombreFamiliar || !apellidoFamiliar || !tipoDocumentoFamiliar || !cedulaFamiliar) {
                    alert('Por favor complete todos los campos requeridos');
                    return;
                }

                // Validar edad mínima
                if (edadFamiliar < 5) {
                    alert('La edad mínima es 5 años');
                    return;
                }

                // Obtener datos del usuario actual
                const idUsuario = window.pacienteid || 1;
                // Obtener el paciente para obtener el id de usuario real
                const datosPaciente = await apiRequest(`/pacientes/${idUsuario}/`);
                const userId = datosPaciente.user;
                let cedulaUsuario = null;
                if (userId) {
                    // Obtener el usuario real usando el campo user del paciente
                    const datosUsuario = await apiRequest(`/usuarios/${userId}/`);
                    cedulaUsuario = datosUsuario.username || datosUsuario.cedula;
                } else {
                    // Fallback: usar la cédula del paciente
                    cedulaUsuario = datosPaciente.n_documento;
                }

                // Determinar la cédula del familiar
                let cedulaFinal = cedulaFamiliar;
                let statusFamiliar = "activo";

                if (edadFamiliar < 18) {
                    // Es menor de edad, usar cédula especial
                    cedulaFinal = await generarCedulaFamiliarMenor(cedulaUsuario);
                    statusFamiliar = "inactivo";
                    console.log('Familiar menor de edad, cédula generada:', cedulaFinal);
                }

                const primerNombre = nombreFamiliar.split(' ')[0] || null;
                const segundoNombre = nombreFamiliar.split(' ').slice(1).join(' ') || null;
                const primerApellido = apellidoFamiliar.split(' ')[0] || null;
                const segundoApellido = apellidoFamiliar.split(' ').slice(1).join(' ') || null;
                const pacienteFamiliarData = {
                    tipo_documento: tipoDocumentoFamiliar,
                    n_documento: cedulaFinal,
                    primer_nombre: primerNombre,
                    segundo_nombre: segundoNombre,
                    primer_apellido: primerApellido,
                    segundo_apellido: segundoApellido,
                    fecha_nacimiento: null, // Puedes agregar un campo en el formulario si lo necesitas
                    status: statusFamiliar,
                    is_menor: edadFamiliar !== null ? edadFamiliar < 18 : false,
                    Instruccion_paciente: null,
                    Ocupacion_paciente: null,
                    Estado_civil_paciente: null,
                    Religion_paciente: null,
                    Telefono_paciente: null,
                    Centros_estudios_trabajos: null,
                    Grado_paciente: null,
                    Ciclo_paciente: null,
                    Cantidad_tiempo_residencia_paciente: null,
                    Tiempo_residencia_paciente: null,
                    Procedencia_paciente: null,
                    Telefonos_adicionales: null,
                    sexo: null,
                    Informante: null,
                    user: idUsuario, // Asociar al usuario actual
                    direccion_principal: null,
                    Lugar_de_nacimiento: null,
                    Historiamedica: null
                };

                // Buscar si ya existe el paciente por cédula
                let pacienteFamiliar = await api.getPacientePorCedula(cedulaFamiliar);
                if (pacienteFamiliar) {
                    // Actualizar paciente existente usando su id
                    await apiRequest(`/pacientes/${pacienteFamiliar.id}/`, 'PUT', pacienteFamiliarData);
                    // Volver a obtener el paciente actualizado
                    pacienteFamiliar = await api.getPacientePorCedula(cedulaFamiliar);
                } else {
                    // Crear nuevo paciente y guardar la respuesta
                    pacienteFamiliar = await apiRequest('/pacientes/', 'POST', pacienteFamiliarData);
                }

                // Crear el registro de familiar
                const familiarData = {
                    parentesco: parentescoFamiliar,
                    edad: edadFamiliar,
                    n_documento: cedulaFamiliar,
                    paciente: 1, // ID del paciente principal (ajusta si es dinámico)
                    familiar: pacienteFamiliar.cedula, // o pacienteFamiliar.id si tu backend lo usa así
                    relacion: parentescoFamiliar,
                    user1: 1, // ID del usuario que registra (por ahora fijo)
                    user2: 1  // ID del usuario del familiar (por ahora fijo)
                };
                const response = await api.createFamiliar(familiarData);

                if (response) {
                    alert('Familiar agregado correctamente');
                    await cargarFamiliares();
                    this.reset();
                } else {
                    throw new Error('No se recibió respuesta del servidor');
                }
            } catch (error) {
                console.error('Error completo:', error);
                alert('Error al agregar familiar: ' + error.message);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
});

// Función para generar enlaces únicos de reunión
function generarEnlaceReunion(citaId, fecha) {
    // Generar un código único basado en el ID de la cita y la fecha
    const fechaObj = new Date(fecha);
    const codigo = `${citaId}-${fechaObj.getFullYear()}${(fechaObj.getMonth() + 1).toString().padStart(2, '0')}${fechaObj.getDate().toString().padStart(2, '0')}`;
    return `https://meet.google.com/${codigo}-${Math.random().toString(36).substring(2, 8)}`;
}

// Modificar la función agregarCita para usar la API
async function agregarCita(citaData) {
    try {
        console.log('Enviando cita a la API:', citaData);
        const response = await api.createCita(citaData);
        console.log('Respuesta de la API:', response);

        // Buscar el contenedor de citas pendientes
        const listaCitas = document.querySelector('#citas .list-group');
        if (!listaCitas) {
            console.error('No se encontró el contenedor de citas');
            return;
        }

        const nuevaCita = document.createElement('div');
        nuevaCita.className = 'list-group-item';
        nuevaCita.setAttribute('data-cita-id', response.id || 'nueva');

        // Crear información de acompañantes
        const acompañantesInfo = citaData.acompañantes && citaData.acompañantes.length > 0
            ? `<p class="mb-1"><strong>Acompañantes:</strong> ${citaData.acompañantes.join(', ')}</p>`
            : '';

        // Generar enlace único para la reunión
        const enlaceReunion = generarEnlaceReunion(response.id || 'nueva', citaData.Fecha_primera_consulta);

        nuevaCita.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-center">
                <div>
                    <h5 class="mb-1">Cita ${citaData.modalidad} - ${citaData.tipo_consulta}</h5>
                    ${acompañantesInfo}
                    <p class="mb-1"><strong>Fecha:</strong> ${citaData.Fecha_primera_consulta} - <strong>Hora:</strong> ${citaData.hora_consulta}</p>
                    ${citaData.notas ? `<small class="text-muted"><strong>Notas:</strong> ${citaData.notas}</small>` : ''}
                    <p class="mb-1">
                        <a href="${enlaceReunion}" target="_blank" class="btn btn-sm btn-success">
                            <i class="bi bi-camera-video"></i> Unirse a la Reunión
                        </a>
                    </p>
                </div>
                <div class="btn-group-vertical">
                    <button class="btn btn-sm btn-warning mb-1" onclick="editarCita(${response.id || 'nueva'})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarCita(${response.id || 'nueva'})">Cancelar</button>
                </div>
            </div>
        `;

        listaCitas.appendChild(nuevaCita);

        // Mostrar mensaje de éxito
        alert('Cita agendada correctamente');

        // Recargar los familiares en el selector después de crear la cita
        await cargarFamiliares();

    } catch (error) {
        console.error('Error al crear la cita:', error);
        alert('Error al crear la cita: ' + error.message);
        throw error; // Re-lanzar el error para que el formulario lo maneje
    }
}

// Función para validar disponibilidad de horario
async function validarDisponibilidad(fecha, hora) {
    try {
        console.log(`Validando disponibilidad para ${fecha} a las ${hora}`);

        // Obtener todas las citas existentes
        const response = await api.getCitas();
        const citas = Array.isArray(response) ? response :
            (response.results ? response.results :
                (response.data ? response.data : []));

        // Filtrar citas para la fecha específica
        const citasEnFecha = citas.filter(cita => {
            const fechaCita = cita.Fecha_primera_consulta || cita.fecha;
            return fechaCita === fecha;
        });

        console.log(`Citas encontradas para ${fecha}:`, citasEnFecha);

        // Función auxiliar para normalizar formato de hora
        function normalizarHora(horaString) {
            if (!horaString) return '';
            // Si tiene segundos (formato HH:MM:SS), extraer solo HH:MM
            if (horaString.includes(':') && horaString.split(':').length === 3) {
                return horaString.substring(0, 5);
            }
            // Si ya está en formato HH:MM, devolver tal como está
            return horaString;
        }

        // Normalizar la hora que queremos validar
        const horaNormalizada = normalizarHora(hora);
        console.log(`Hora a validar (normalizada): ${horaNormalizada}`);

        // Verificar si ya existe una cita con la misma hora
        const citaExistente = citasEnFecha.find(cita => {
            const horaCita = cita.hora_consulta || cita.hora;
            const horaCitaNormalizada = normalizarHora(horaCita);
            console.log(`Comparando: ${horaNormalizada} vs ${horaCitaNormalizada} (original: ${horaCita})`);
            return horaCitaNormalizada === horaNormalizada;
        });

        if (citaExistente) {
            console.log(`❌ Ya existe una cita para ${fecha} a las ${horaNormalizada}`);
            return {
                disponible: false,
                mensaje: `Ya existe una cita programada para el ${fecha} a las ${horaNormalizada}. Por favor seleccione otro horario.`
            };
        }

        console.log(`✅ Horario disponible para ${fecha} a las ${horaNormalizada}`);
        return {
            disponible: true,
            mensaje: 'Horario disponible'
        };

    } catch (error) {
        console.error('Error al validar disponibilidad:', error);
        return {
            disponible: false,
            mensaje: 'Error al verificar disponibilidad. Intente nuevamente.'
        };
    }
}

// Función para cargar la lista de familiares
async function cargarFamiliares() {
    try {
        // Obtener el ID del usuario actual
        const idUsuario = window.pacienteid || 1;

        // Obtener todos los pacientes para usar como familiares
        const pacientesResponse = await apiRequest('/pacientes/');
        let pacientes = Array.isArray(pacientesResponse) ? pacientesResponse :
            (pacientesResponse.results ? pacientesResponse.results :
                (pacientesResponse.data ? pacientesResponse.data : []));

        console.log('Pacientes para usar como familiares:', pacientes);

        // Filtrar solo los familiares del usuario actual
        const familiaresUsuario = pacientes.filter(p =>
            p.user === idUsuario &&
            p.id !== idUsuario // Excluir al usuario principal
        );

        console.log('Familiares del usuario actual:', familiaresUsuario);

        // Actualizar la lista de familiares en la sección de familiares
        const listaFamiliares = document.getElementById('lista-familiares');
        if (listaFamiliares) {
            // Limpiar la lista actual
            listaFamiliares.innerHTML = '';

            if (familiaresUsuario.length === 0) {
                listaFamiliares.innerHTML = '<div class="list-group-item text-muted">No hay familiares registrados</div>';
            } else {
                familiaresUsuario.forEach(paciente => {
                    const familiarElement = document.createElement('div');
                    familiarElement.className = 'list-group-item';
                    familiarElement.setAttribute('data-familiar-id', paciente.id);

                    const nombreCompleto = [
                        paciente.primer_nombre,
                        paciente.segundo_nombre,
                        paciente.primer_apellido,
                        paciente.segundo_apellido
                    ].filter(n => n).join(' ');

                    const statusBadge = paciente.status === 'inactivo' ?
                        '<span class="badge bg-warning ms-2">Menor de edad</span>' :
                        '<span class="badge bg-success ms-2">Activo</span>';

                    familiarElement.innerHTML = `
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-1">${nombreCompleto || 'Sin nombre'}</h5>
                                <small class="d-block">Cédula: ${paciente.n_documento} ${statusBadge}</small>
                                <small class="d-block">Tipo: ${paciente.tipo_documento || 'No especificado'}</small>
                            </div>
                            <div class="btn-group-vertical">
                                <button class="btn btn-sm btn-warning mb-1" onclick="editarFamiliar(${paciente.id})">Editar</button>
                                <button class="btn btn-sm btn-danger" onclick="eliminarFamiliar(${paciente.id})">Eliminar</button>
                            </div>
                        </div>
                    `;
                    listaFamiliares.appendChild(familiarElement);
                });
            }
        }

        // Actualizar el selector de familiares en el formulario de citas
        const selectFamiliares = document.getElementById('familiares');
        if (selectFamiliares) {
            selectFamiliares.innerHTML = '<option value="">Seleccione familiares...</option>';

            // Usar solo los familiares del usuario actual
            familiaresUsuario.forEach(paciente => {
                let nombreCompleto = [
                    paciente.primer_nombre,
                    paciente.segundo_nombre,
                    paciente.primer_apellido,
                    paciente.segundo_apellido
                ].filter(n => n).join(' ');

                if (!nombreCompleto) {
                    nombreCompleto = `Cédula: ${paciente.n_documento}`;
                }

                const option = document.createElement('option');
                option.value = paciente.id;
                option.textContent = nombreCompleto;
                selectFamiliares.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar familiares:', error);
    }
}

// Función para editar un familiar
async function editarFamiliar(id) {
    try {
        // Obtener los datos del familiar
        const familiar = await api.getPaciente(id);
        if (!familiar) {
            alert('No se encontró el familiar');
            return;
        }

        // Llenar el formulario del modal con los datos del familiar
        document.getElementById('editar-familiar-id').value = familiar.id;
        document.getElementById('editar-familiar-nombre').value = [
            familiar.primer_nombre,
            familiar.segundo_nombre
        ].filter(n => n).join(' ');
        document.getElementById('editar-familiar-apellido').value = [
            familiar.primer_apellido,
            familiar.segundo_apellido
        ].filter(a => a).join(' ');
        document.getElementById('editar-familiar-tipo-documento').value = familiar.tipo_documento || '';
        document.getElementById('editar-familiar-cedula').value = familiar.n_documento || '';
        document.getElementById('editar-familiar-edad').value = familiar.edad || '';

        // Intentar obtener el parentesco del registro de familiar
        try {
            const familiaresResponse = await apiRequest('/familiares/');
            let familiares = Array.isArray(familiaresResponse) ? familiaresResponse :
                (familiaresResponse.results ? familiaresResponse.results :
                    (familiaresResponse.data ? familiaresResponse.data : []));

            const registroFamiliar = familiares.find(f => f.familiar === familiar.id || f.familiar === familiar.n_documento);
            if (registroFamiliar) {
                document.getElementById('editar-familiar-parentesco').value = registroFamiliar.parentesco || registroFamiliar.relacion || '';
            }
        } catch (error) {
            console.error('Error al obtener parentesco:', error);
        }

        // Abrir el modal
        const modal = new bootstrap.Modal(document.getElementById('editarFamiliarModal'));
        modal.show();

    } catch (error) {
        console.error('Error al editar familiar:', error);
        alert('Error al editar familiar: ' + error.message);
    }
}

// Función para guardar la edición del familiar
async function guardarEdicionFamiliar() {
    try {
        const familiarId = document.getElementById('editar-familiar-id').value;
        const nombreCompleto = document.getElementById('editar-familiar-nombre').value.trim();
        const apellidoCompleto = document.getElementById('editar-familiar-apellido').value.trim();
        const tipoDocumento = document.getElementById('editar-familiar-tipo-documento').value;
        const cedula = document.getElementById('editar-familiar-cedula').value;
        const edad = parseInt(document.getElementById('editar-familiar-edad').value) || null;
        const parentesco = document.getElementById('editar-familiar-parentesco').value;

        // Validar campos requeridos
        if (!nombreCompleto || !apellidoCompleto || !tipoDocumento || !cedula) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }

        // Validar edad mínima
        if (edad < 5) {
            alert('La edad mínima es 5 años');
            return;
        }

        // Separar nombres y apellidos
        const primerNombre = nombreCompleto.split(' ')[0] || null;
        const segundoNombre = nombreCompleto.split(' ').slice(1).join(' ') || null;
        const primerApellido = apellidoCompleto.split(' ')[0] || null;
        const segundoApellido = apellidoCompleto.split(' ').slice(1).join(' ') || null;

        // Datos actualizados del paciente
        const pacienteFamiliarData = {
            tipo_documento: tipoDocumento,
            n_documento: cedula,
            primer_nombre: primerNombre,
            segundo_nombre: segundoNombre,
            primer_apellido: primerApellido,
            segundo_apellido: segundoApellido,
            fecha_nacimiento: null,
            status: null,
            is_menor: edad !== null ? edad < 18 : false,
            Instruccion_paciente: null,
            Ocupacion_paciente: null,
            Estado_civil_paciente: null,
            Religion_paciente: null,
            Telefono_paciente: null,
            Centros_estudios_trabajos: null,
            Grado_paciente: null,
            Ciclo_paciente: null,
            Cantidad_tiempo_residencia_paciente: null,
            Tiempo_residencia_paciente: null,
            Procedencia_paciente: null,
            Telefonos_adicionales: null,
            sexo: null,
            Informante: null,
            user: null,
            direccion_principal: null,
            Lugar_de_nacimiento: null,
            Historiamedica: null
        };

        // Actualizar el paciente
        await apiRequest(`/pacientes/${familiarId}/`, 'PUT', pacienteFamiliarData);

        // Actualizar el registro de familiar
        try {
            const familiaresResponse = await apiRequest('/familiares/');
            let familiares = Array.isArray(familiaresResponse) ? familiaresResponse :
                (familiaresResponse.results ? familiaresResponse.results :
                    (familiaresResponse.data ? familiaresResponse.data : []));

            const registroFamiliar = familiares.find(f => f.familiar === familiarId || f.familiar === cedula);
            if (registroFamiliar) {
                const familiarData = {
                    parentesco: parentesco,
                    edad: edad,
                    n_documento: cedula,
                    paciente: 1, // ID del paciente principal
                    familiar: cedula,
                    relacion: parentesco,
                    user1: 1,
                    user2: 1
                };
                await apiRequest(`/familiares/${registroFamiliar.id}/`, 'PUT', familiarData);
            }
        } catch (error) {
            console.error('Error al actualizar registro de familiar:', error);
        }

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarFamiliarModal'));
        modal.hide();

        // Mostrar mensaje de éxito
        alert('Familiar actualizado correctamente');

        // Recargar la lista de familiares
        await cargarFamiliares();

    } catch (error) {
        console.error('Error al guardar edición del familiar:', error);
        alert('Error al guardar los cambios: ' + error.message);
    }
}

// Nueva función para eliminar cita usando la API
async function eliminarCita(id) {
    try {
        await api.deleteCita(id);
        const citaElement = document.querySelector(`[data-cita-id="${id}"]`);
        if (citaElement) {
            citaElement.remove();
        }
    } catch (error) {
        alert('Error al eliminar la cita: ' + error.message);
    }
}

// Modificar la función editarCita para usar la API
async function editarCita(id) {
    try {
        // Obtener los datos de la cita
        const citasResponse = await apiRequest('/citas/');
        let citas = Array.isArray(citasResponse) ? citasResponse :
            (citasResponse.results ? citasResponse.results :
                (citasResponse.data ? citasResponse.data : []));

        const cita = citas.find(c => c.id == id);
        if (!cita) {
            alert('No se encontró la cita');
            return;
        }

        // Llenar el formulario del modal con los datos de la cita
        document.getElementById('editar-cita-id').value = cita.id;
        document.getElementById('editar-fecha').value = cita.Fecha_primera_consulta || cita.fecha || '';
        document.getElementById('editar-hora').value = cita.hora_consulta || cita.hora || '';
        document.getElementById('editar-modalidad').value = cita.modalidad || '';
        document.getElementById('editar-tipo-consulta').value = cita.tipo_consulta || '';
        document.getElementById('editar-notas').value = cita.notas || '';

        // Cargar familiares en el selector múltiple
        await cargarFamiliaresEnSelector('editar-familiares');

        // Seleccionar los familiares que ya están en la cita
        if (cita.acompañantes && Array.isArray(cita.acompañantes)) {
            const selectFamiliares = document.getElementById('editar-familiares');
            Array.from(selectFamiliares.options).forEach(option => {
                if (cita.acompañantes.includes(option.value)) {
                    option.selected = true;
                }
            });
        }

        // Configurar el comportamiento del selector de tipo de consulta
        const tipoConsulta = document.getElementById('editar-tipo-consulta');
        const familiaresSelect = document.getElementById('editar-familiares');

        tipoConsulta.addEventListener('change', function () {
            familiaresSelect.style.display = this.value === 'individual' ? 'none' : 'block';
            if (this.value === 'individual') {
                familiaresSelect.value = ''; // Limpiar selección
            }
        });

        // Aplicar la lógica inicial
        if (tipoConsulta.value === 'individual') {
            familiaresSelect.style.display = 'none';
        }

        // Abrir el modal
        const modal = new bootstrap.Modal(document.getElementById('editarCitaModal'));
        modal.show();

        // Configurar la fecha mínima en el modal
        configurarFechaCitas();

    } catch (error) {
        console.error('Error al editar cita:', error);
        alert('Error al editar cita: ' + error.message);
    }
}

// Función para cargar familiares en un selector específico
async function cargarFamiliaresEnSelector(selectorId) {
    try {
        // Obtener el ID del usuario actual
        const idUsuario = window.pacienteid || 1;

        const pacientesResponse = await apiRequest('/pacientes/');
        let pacientes = Array.isArray(pacientesResponse) ? pacientesResponse :
            (pacientesResponse.results ? pacientesResponse.results :
                (pacientesResponse.data ? pacientesResponse.data : []));

        const selectFamiliares = document.getElementById(selectorId);
        if (selectFamiliares) {
            selectFamiliares.innerHTML = '';

            // Filtrar solo los familiares del usuario actual
            const familiaresUsuario = pacientes.filter(p =>
                p.user === idUsuario &&
                p.id !== idUsuario // Excluir al usuario principal
            );

            familiaresUsuario.forEach(paciente => {
                let nombreCompleto = [
                    paciente.primer_nombre,
                    paciente.segundo_nombre,
                    paciente.primer_apellido,
                    paciente.segundo_apellido
                ].filter(n => n).join(' ');

                if (!nombreCompleto) {
                    nombreCompleto = `Cédula: ${paciente.n_documento}`;
                }

                const option = document.createElement('option');
                option.value = paciente.id;
                option.textContent = nombreCompleto;
                selectFamiliares.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar familiares en selector:', error);
    }
}

// Función para guardar la edición de la cita
async function guardarEdicionCita() {
    try {
        const citaId = document.getElementById('editar-cita-id').value;
        const fecha = document.getElementById('editar-fecha').value;
        const hora = document.getElementById('editar-hora').value;
        const modalidad = document.getElementById('editar-modalidad').value;
        const tipoConsulta = document.getElementById('editar-tipo-consulta').value;
        const notas = document.getElementById('editar-notas').value;

        // Validar campos requeridos
        if (!fecha || !hora || !modalidad || !tipoConsulta) {
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

        // Validar disponibilidad (excluyendo la cita actual)
        const disponibilidad = await validarDisponibilidadEdicion(citaId, fecha, hora);
        if (!disponibilidad.disponible) {
            alert(disponibilidad.mensaje);
            return;
        }

        // Obtener los familiares seleccionados
        const familiaresSeleccionados = tipoConsulta !== 'individual'
            ? Array.from(document.getElementById('editar-familiares').selectedOptions).map(option => option.value)
            : [];

        // Estructura de datos para actualizar la cita
        const citaData = {
            Numero_historial: 1,
            Fecha_primera_consulta: fecha,
            hora_consulta: hora,
            modalidad: modalidad,
            tipo_consulta: tipoConsulta,
            notas: notas || "",
            paciente: 1, // ID del paciente principal
            resultado: null,
            acompañantes: familiaresSeleccionados
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

// Función para validar disponibilidad excluyendo la cita actual (para edición)
async function validarDisponibilidadEdicion(citaId, fecha, hora) {
    try {
        console.log(`Validando disponibilidad para edición - Cita ${citaId}, ${fecha} a las ${hora}`);

        // Obtener todas las citas existentes
        const response = await api.getCitas();
        const citas = Array.isArray(response) ? response :
            (response.results ? response.results :
                (response.data ? response.data : []));

        // Filtrar citas para la fecha específica, excluyendo la cita actual
        const citasEnFecha = citas.filter(cita => {
            const fechaCita = cita.Fecha_primera_consulta || cita.fecha;
            return fechaCita === fecha && cita.id != citaId;
        });

        console.log(`Citas encontradas para ${fecha} (excluyendo cita ${citaId}):`, citasEnFecha);

        // Función auxiliar para normalizar formato de hora
        function normalizarHora(horaString) {
            if (!horaString) return '';
            // Si tiene segundos (formato HH:MM:SS), extraer solo HH:MM
            if (horaString.includes(':') && horaString.split(':').length === 3) {
                return horaString.substring(0, 5);
            }
            // Si ya está en formato HH:MM, devolver tal como está
            return horaString;
        }

        // Normalizar la hora que queremos validar
        const horaNormalizada = normalizarHora(hora);
        console.log(`Hora a validar (normalizada): ${horaNormalizada}`);

        // Verificar si ya existe una cita con la misma hora
        const citaExistente = citasEnFecha.find(cita => {
            const horaCita = cita.hora_consulta || cita.hora;
            const horaCitaNormalizada = normalizarHora(horaCita);
            console.log(`Comparando: ${horaNormalizada} vs ${horaCitaNormalizada} (original: ${horaCita})`);
            return horaCitaNormalizada === horaNormalizada;
        });

        if (citaExistente) {
            console.log(`❌ Ya existe otra cita para ${fecha} a las ${horaNormalizada}`);
            return {
                disponible: false,
                mensaje: `Ya existe otra cita programada para el ${fecha} a las ${horaNormalizada}. Por favor seleccione otro horario.`
            };
        }

        console.log(`✅ Horario disponible para edición - ${fecha} a las ${horaNormalizada}`);
        return {
            disponible: true,
            mensaje: 'Horario disponible'
        };

    } catch (error) {
        console.error('Error al validar disponibilidad para edición:', error);
        return {
            disponible: false,
            mensaje: 'Error al verificar disponibilidad. Intente nuevamente.'
        };
    }
}

// Modificar la función cargarDatosPerfil para mostrar correctamente los selects de dirección
async function cargarDatosPerfil() {
    console.log('Cargando datos del perfil');

    // Deshabilitar temporalmente la navegación mientras carga
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.6';
    });

    // Mostrar mensaje de carga
    const cargandoElement = document.getElementById('cargando-perfil');
    const errorElement = document.getElementById('error-perfil');
    const bienvenidaElement = document.getElementById('bienvenida-perfil');

    if (cargandoElement) cargandoElement.style.display = 'block';
    if (errorElement) errorElement.style.display = 'none';
    if (bienvenidaElement) bienvenidaElement.style.display = 'none';

    try {
        // Obtener el ID del usuario actual desde la variable global
        const idUsuario = window.pacienteid || 1;
        console.log('ID del usuario actual:', idUsuario);

        // Primero intentar obtener el paciente directamente por ID (en caso de que sea el ID del paciente)
        let datosPaciente = null;
        try {
            datosPaciente = await apiRequest(`/pacientes/${idUsuario}/`);
            console.log('Paciente encontrado directamente por ID:', datosPaciente);
        } catch (error) {
            if (error.message.includes('404')) {
                console.log('No se encontró paciente con ese ID, intentando buscar por usuario...');

                // Si no se encuentra, intentar buscar el paciente por el usuario
                try {
                    // Obtener todos los pacientes y buscar el que corresponda al usuario
                    const todosPacientes = await apiRequest('/pacientes/');
                    let pacientes = Array.isArray(todosPacientes) ? todosPacientes :
                        (todosPacientes.results ? todosPacientes.results :
                            (todosPacientes.data ? todosPacientes.data : []));

                    // Buscar el paciente que tenga el usuario con el ID proporcionado
                    datosPaciente = pacientes.find(p => p.user === idUsuario);

                    if (datosPaciente) {
                        console.log('Paciente encontrado por usuario:', datosPaciente);
                    } else {
                        console.log('No se encontró paciente para el usuario:', idUsuario);
                        // Mostrar mensaje de bienvenida para nuevo usuario
                        if (bienvenidaElement) bienvenidaElement.style.display = 'block';
                        if (cargandoElement) cargandoElement.style.display = 'none';

                        // Cargar solo los estados para el formulario vacío
                        await cargarEstadosNacimiento();
                        return;
                    }
                } catch (error2) {
                    console.error('Error al buscar paciente por usuario:', error2);
                    // Mostrar mensaje de bienvenida para nuevo usuario
                    if (bienvenidaElement) bienvenidaElement.style.display = 'block';
                    if (cargandoElement) cargandoElement.style.display = 'none';

                    // Cargar solo los estados para el formulario vacío
                    await cargarEstadosNacimiento();
                    return;
                }
            } else {
                throw error;
            }
        }

        if (!datosPaciente) {
            console.log('No se encontró el paciente con ID:', idUsuario);
            if (bienvenidaElement) bienvenidaElement.style.display = 'block';
            if (cargandoElement) cargandoElement.style.display = 'none';
            return;
        }

        // Si hay dirección principal, cargar y seleccionar los valores
        if (datosPaciente.direccion_principal) {
            try {
                const direccion = await apiRequest(`/direcciones/${datosPaciente.direccion_principal}/`);
                console.log('Datos de dirección cargados:', direccion);

                // Cargar estados primero
                await cargarEstadosNacimiento();

                // Seleccionar estado con retraso para asegurar que el select esté cargado
                setTimeout(async () => {
                    const estadoSel = document.getElementById('estadoNacimiento');
                    if (estadoSel && direccion.estado) {
                        // Asegurar que el valor sea string
                        const estadoValue = String(direccion.estado);
                        estadoSel.value = estadoValue;
                        console.log('Estado seleccionado:', estadoValue);

                        // Verificar que se haya establecido correctamente
                        if (estadoSel.value === estadoValue) {
                            console.log('Estado establecido correctamente');

                            // Disparar evento change para cargar municipios
                            estadoSel.dispatchEvent(new Event('change'));

                            // Cargar municipios para este estado
                            await cargarMunicipiosNacimiento(direccion.estado);

                            // Seleccionar municipio con retraso
                            setTimeout(async () => {
                                const municipioSel = document.getElementById('municipioNacimiento');
                                if (municipioSel && direccion.municipio) {
                                    const municipioValue = String(direccion.municipio);
                                    municipioSel.value = municipioValue;
                                    console.log('Municipio seleccionado:', municipioValue);

                                    // Disparar evento change para cargar parroquias
                                    municipioSel.dispatchEvent(new Event('change'));

                                    // Cargar parroquias para este municipio
                                    await cargarParroquiasNacimiento(direccion.municipio);

                                    // Seleccionar parroquia con retraso
                                    setTimeout(() => {
                                        const parroquiaSel = document.getElementById('parroquiaNacimiento');
                                        if (parroquiaSel && direccion.parroquia) {
                                            const parroquiaValue = String(direccion.parroquia);
                                            parroquiaSel.value = parroquiaValue;
                                            console.log('Parroquia seleccionada:', parroquiaValue);
                                        }
                                    }, 100);
                                }
                            }, 100);

                            // Cargar ciudades para este estado
                            await cargarCiudadesNacimiento(direccion.estado);

                            // Seleccionar ciudad con retraso
                            setTimeout(() => {
                                const ciudadSel = document.getElementById('ciudadNacimiento');
                                if (ciudadSel && direccion.ciudad) {
                                    const ciudadValue = String(direccion.ciudad);
                                    ciudadSel.value = ciudadValue;
                                    console.log('Ciudad seleccionada:', ciudadValue);
                                }
                            }, 100);
                        } else {
                            console.warn('No se pudo establecer el estado correctamente');
                            // Intentar nuevamente después de un breve retraso
                            setTimeout(() => {
                                estadoSel.value = estadoValue;
                                console.log('Reintento de selección de estado:', estadoValue);
                            }, 200);
                        }
                    }
                }, 100);

            } catch (error) {
                console.error('Error al cargar la dirección principal:', error);
                // Si hay error, cargar solo los estados
                await cargarEstadosNacimiento();
            }
        } else {
            // Si no hay dirección principal, cargar solo los estados
            await cargarEstadosNacimiento();
        }

        // Mapeo de campos de la API a IDs del formulario
        const mapeoCampos = {
            primer_nombre: 'nombres',
            segundo_nombre: 'nombres',
            primer_apellido: 'apellidos',
            segundo_apellido: 'apellidos',
            fecha_nacimiento: 'fechaNacimiento',
            Instruccion_paciente: 'nivelInstruccion',
            Ocupacion_paciente: 'ocupacion',
            tipo_documento: 'tipoDocumento',
            n_documento: 'cedula',
            Telefono_paciente: 'telefono',
            sexo: 'sexo',
            Estado_civil_paciente: 'estadoCivil',
            Religion_paciente: 'religion',
            Centros_estudios_trabajos: 'centroTrabajo',
            Grado_paciente: 'grado',
            Ciclo_paciente: 'ciclo',
            Procedencia_paciente: 'lugarResidencia',
            Cantidad_tiempo_residencia_paciente: 'tiempoResidencia', // Campo numérico
            Tiempo_residencia_paciente: 'tiempoResidenciaUnidad', // Campo texto (años/meses)
            pregunta_1: 'pregunta1',
            respuesta_1: 'respuesta1',
            pregunta_2: 'pregunta2',
            respuesta_2: 'respuesta2',
            pregunta_3: 'pregunta3',
            respuesta_3: 'respuesta3'
        };

        let camposCargados = 0;
        const totalCampos = Object.keys(mapeoCampos).length;

        // Cargar correo del paciente si existe, si no, dejar vacío
        const campoCorreo = document.getElementById('correo');
        if (campoCorreo) {
            const correoPaciente = datosPaciente.correo || datosPaciente.email || '';
            campoCorreo.value = correoPaciente;
            console.log('Correo del paciente cargado:', correoPaciente);
            if (correoPaciente) camposCargados++;
        }

        // Cargar correo del usuario relacionado al paciente
        if (campoCorreo && datosPaciente.user) {
            try {
                // Obtener el correo del usuario relacionado
                const datosUsuario = await apiRequest(`/usuarios/${datosPaciente.user}/`);
                const correoUsuario = datosUsuario.email || datosUsuario.correo || '';
                campoCorreo.value = correoUsuario;
                console.log('Correo del usuario relacionado cargado:', correoUsuario);
                if (correoUsuario) camposCargados++;
            } catch (error) {
                console.error('Error al cargar correo del usuario:', error);
                // Fallback: usar correo del paciente si existe
                const correoPaciente = datosPaciente.correo || datosPaciente.email || '';
                campoCorreo.value = correoPaciente;
                console.log('Correo del paciente (fallback) cargado:', correoPaciente);
                if (correoPaciente) camposCargados++;
            }
        } else if (campoCorreo) {
            // Si no hay usuario relacionado, usar correo del paciente
            const correoPaciente = datosPaciente.correo || datosPaciente.email || '';
            campoCorreo.value = correoPaciente;
            console.log('Correo del paciente cargado:', correoPaciente);
            if (correoPaciente) camposCargados++;
        }

        // Actualizar cada campo del formulario
        Object.entries(mapeoCampos).forEach(([apiField, formId]) => {
            const field = document.getElementById(formId);
            if (field && datosPaciente[apiField] !== undefined && datosPaciente[apiField] !== null) {
                if (formId === 'nombres') {
                    const nombres = [datosPaciente.primer_nombre, datosPaciente.segundo_nombre]
                        .filter(n => n).join(' ');
                    field.value = nombres;
                    console.log('Nombres cargados:', nombres);
                    if (nombres) camposCargados++;
                } else if (formId === 'apellidos') {
                    const apellidos = [datosPaciente.primer_apellido, datosPaciente.segundo_apellido]
                        .filter(a => a).join(' ');
                    field.value = apellidos;
                    console.log('Apellidos cargados:', apellidos);
                    if (apellidos) camposCargados++;
                } else if (field.type === 'date') {
                    field.value = datosPaciente[apiField];
                    console.log(`Campo ${formId} (fecha) cargado:`, datosPaciente[apiField]);
                    if (datosPaciente[apiField]) camposCargados++;
                } else if (field.tagName === 'SELECT') {
                    field.value = datosPaciente[apiField];
                    console.log(`Campo ${formId} (select) cargado:`, datosPaciente[apiField]);
                    if (datosPaciente[apiField]) camposCargados++;
                } else {
                    field.value = datosPaciente[apiField];
                    console.log(`Campo ${formId} cargado:`, datosPaciente[apiField]);
                    if (datosPaciente[apiField]) camposCargados++;
                }
            }
        });

        // Actualizar el estado de acceso a las secciones después de cargar los datos
        await actualizarAccesoSecciones();

        // Verificar que el estado se haya seleccionado correctamente
        setTimeout(() => {
            verificarSeleccionEstado();
        }, 500);

        // Ocultar mensaje de carga
        if (cargandoElement) cargandoElement.style.display = 'none';

        console.log('Datos del perfil cargados exitosamente');
        console.log(`Campos cargados: ${camposCargados}/${totalCampos}`);

        // Mostrar mensaje de éxito si se cargaron datos
        if (camposCargados > 0) {
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success alert-dismissible fade show';
            successAlert.innerHTML = `
                <strong>¡Datos cargados!</strong> Se han cargado ${camposCargados} campos del perfil del paciente ID ${idUsuario}.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            const perfilSection = document.getElementById('perfil');
            if (perfilSection) {
                perfilSection.insertBefore(successAlert, perfilSection.firstChild);
                // Auto-ocultar después de 5 segundos
                setTimeout(() => {
                    if (successAlert.parentNode) {
                        successAlert.remove();
                    }
                }, 5000);
            }
        }

        // Habilitar la navegación después de cargar los datos
        habilitarNavegacion();

    } catch (error) {
        console.error('Error al cargar datos del perfil:', error);

        // Mostrar mensaje de error
        if (errorElement) {
            const mensajeError = document.getElementById('mensaje-error');
            if (mensajeError) {
                mensajeError.textContent = error.message;
            }
            errorElement.style.display = 'block';
        }

        // Ocultar mensaje de carga
        if (cargandoElement) cargandoElement.style.display = 'none';

        // Mostrar mensaje de bienvenida como fallback
        if (bienvenidaElement) bienvenidaElement.style.display = 'block';

        // Habilitar la navegación incluso si hay error
        habilitarNavegacion();
    }
}

// Función para habilitar la navegación
function habilitarNavegacion() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
    });
}

// Cargar datos iniciales
window.addEventListener('load', function () {
    const idUsuario = window.pacienteid || 1;
    console.log('Página cargada, iniciando carga de datos del usuario ID:', idUsuario);

    // Configurar fechas de citas
    configurarFechaCitas();

    // Mostrar información de debug
    mostrarInfoDebug();

    // Cargar datos del perfil del usuario actual directamente
    cargarDatosPerfil().then(async () => {
        console.log('Datos del perfil cargados, verificando estado del perfil...');
        await actualizarAccesoSecciones();
        console.log('Estado del perfil verificado, ahora cargando familiares...');
        return cargarFamiliares();
    }).catch(error => {
        console.error('Error al cargar datos iniciales:', error);
    });
});

// Función para forzar la carga del paciente con ID 1
async function cargarPacienteID1() {
    console.log('=== FORZANDO CARGA DEL PACIENTE ID 1 ===');
    try {
        const datosPaciente = await apiRequest('/pacientes/1/');
        console.log('Datos del paciente ID 1:', datosPaciente);
        return datosPaciente;
    } catch (error) {
        console.error('Error al cargar paciente ID 1:', error);
        return null;
    }
}

// Función para verificar si hay datos del paciente en la base de datos
async function verificarDatosPaciente() {
    try {
        const idPaciente = window.pacienteid || 1;
        console.log('Verificando datos del paciente con ID:', idPaciente);

        const response = await apiRequest(`/pacientes/${idPaciente}/`);
        console.log('Respuesta de verificación:', response);

        if (response) {
            console.log('Paciente encontrado:', response);
            return true;
        } else {
            console.log('No se encontró el paciente');
            return false;
        }
    } catch (error) {
        console.error('Error al verificar datos del paciente:', error);
        return false;
    }
}

// Función para eliminar un familiar
async function eliminarFamiliar(id) {
    if (!confirm('¿Está seguro de que desea eliminar este familiar?')) {
        return;
    }

    try {
        // Eliminar el paciente que representa al familiar
        await apiRequest(`/pacientes/${id}/`, 'DELETE');

        // Actualizar la interfaz
        const familiarElement = document.querySelector(`[data-familiar-id="${id}"]`);
        if (familiarElement) {
            familiarElement.remove();
        }

        // Recargar la lista de familiares
        await cargarFamiliares();

        alert('Familiar eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar familiar:', error);
        alert('Error al eliminar familiar: ' + error.message);
    }
}

// Función para cargar las citas existentes
async function cargarCitas() {
    try {
        const response = await api.getCitas();
        console.log('Respuesta de citas:', response);

        // Verificar si la respuesta es un objeto con una propiedad que contiene el array
        const citas = Array.isArray(response) ? response :
            (response.results ? response.results :
                (response.data ? response.data : []));

        console.log('Citas procesadas:', citas);

        const listaCitas = document.querySelector('#citas .list-group');
        if (!listaCitas) return;

        // Limpiar la lista actual
        listaCitas.innerHTML = '';

        if (citas.length === 0) {
            listaCitas.innerHTML = '<div class="list-group-item text-muted">No hay citas agendadas</div>';
            return;
        }

        // Mostrar cada cita
        citas.forEach(cita => {
            const citaElement = document.createElement('div');
            citaElement.className = 'list-group-item';
            citaElement.setAttribute('data-cita-id', cita.id);

            // Crear información de acompañantes
            const acompañantesInfo = cita.acompañantes && cita.acompañantes.length > 0
                ? `<p class="mb-1"><strong>Acompañantes:</strong> ${cita.acompañantes.join(', ')}</p>`
                : '';

            // Generar enlace único para la reunión
            const enlaceReunion = generarEnlaceReunion(cita.id, cita.Fecha_primera_consulta);

            citaElement.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">Cita ${cita.modalidad} - ${cita.tipo_consulta}</h5>
                        ${acompañantesInfo}
                        <p class="mb-1"><strong>Fecha:</strong> ${cita.Fecha_primera_consulta} - <strong>Hora:</strong> ${cita.hora_consulta}</p>
                        ${cita.notas ? `<small class="text-muted"><strong>Notas:</strong> ${cita.notas}</small>` : ''}
                        <p class="mb-1">
                            <a href="${enlaceReunion}" target="_blank" class="btn btn-sm btn-success">
                                <i class="bi bi-camera-video"></i> Unirse a la Reunión
                            </a>
                        </p>
                    </div>
                    <div class="btn-group-vertical">
                        <button class="btn btn-sm btn-warning mb-1" onclick="editarCita(${cita.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarCita(${cita.id})">Cancelar</button>
                    </div>
                </div>
            `;
            listaCitas.appendChild(citaElement);
        });
    } catch (error) {
        console.error('Error al cargar citas:', error);
        const listaCitas = document.querySelector('#citas .list-group');
        if (listaCitas) {
            listaCitas.innerHTML = '<div class="list-group-item text-danger">Error al cargar las citas</div>';
        }
    }
}

// Función para llenar el select de estados en el perfil
async function cargarEstados() {
    try {
        const response = await apiRequest('/estados/');
        let estados = Array.isArray(response) ? response : (response.results ? response.results : (response.data ? response.data : []));
        const select = document.getElementById('lugarNacimiento');
        if (select) {
            select.innerHTML = '<option value="">Seleccione un estado...</option>';
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.id_estado || estado.id || '';
                option.textContent = estado.estado || '';
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar estados:', error);
    }
}

// Llamar cargarEstados al cargar la página
window.addEventListener('DOMContentLoaded', cargarEstados);

// Lógica para obtener todos los estados paginando si es necesario
async function obtenerTodosLosEstados() {
    let estados = [];
    let url = '/estados/?limit=10&offset=0';
    let seguir = true;
    while (seguir) {
        const response = await apiRequest(url);
        let batch = Array.isArray(response) ? response : (response.results ? response.results : (response.data ? response.data : []));
        console.log('Batch recibido:', batch);
        estados = estados.concat(batch);
        console.log('Estados acumulados:', estados.length);
        // Si hay paginación tipo next, seguir, si no, parar
        if (response.next) {
            // Extraer el path relativo de next si es URL absoluta
            const nextUrl = response.next.startsWith('http') ? response.next.replace(/^https?:\/\/[^/]+/, '') : response.next;
            url = nextUrl;
            console.log('Siguiente URL de paginación:', url);
        } else {
            seguir = false;
        }
        if (estados.length >= 25) seguir = false;
    }
    console.log('Total de estados obtenidos:', estados.length);
    return estados;
}

// Lógica para selects encadenados de lugar de nacimiento y creación de dirección
async function cargarEstadosNacimiento() {
    try {
        console.log('Iniciando carga de estados de nacimiento...');
        let estados = [];

        // Primera página sin parámetro page
        const urlPrimera = '/estados/';
        const responsePrimera = await apiRequest(urlPrimera);
        let batchPrimera = Array.isArray(responsePrimera) ? responsePrimera :
            (responsePrimera.results ? responsePrimera.results :
                (responsePrimera.data ? responsePrimera.data : []));
        estados = estados.concat(batchPrimera);
        console.log('Estados de la primera página:', batchPrimera.length);

        // Siguientes páginas con page=2, page=3
        for (let page = 2; page <= 3; page++) {
            const url = `/estados/?page=${page}`;
            const response = await apiRequest(url);
            let batch = Array.isArray(response) ? response :
                (response.results ? response.results :
                    (response.data ? response.data : []));
            estados = estados.concat(batch);
            console.log(`Estados de la página ${page}:`, batch.length);
        }

        console.log('Total de estados obtenidos:', estados.length);

        const select = document.getElementById('estadoNacimiento');
        if (select) {
            // Limpiar el select
            select.innerHTML = '<option value="">Seleccione un estado...</option>';

            // Agregar las opciones
            estados.forEach(estado => {
                const option = document.createElement('option');
                option.value = estado.id_estado || estado.id || '';
                option.textContent = estado.estado || '';
                select.appendChild(option);
            });

            console.log('Estados cargados en el select:', select.options.length - 1);

            // Verificar si hay un valor seleccionado previamente
            if (select.value) {
                console.log('Estado previamente seleccionado:', select.value);
                // Disparar evento change para cargar municipios si es necesario
                select.dispatchEvent(new Event('change'));
            }
        } else {
            console.error('No se encontró el elemento select de estados');
        }
    } catch (error) {
        console.error('Error al cargar estados:', error);
    }
}

async function cargarMunicipiosNacimiento(idEstado) {
    const select = document.getElementById('municipioNacimiento');
    select.innerHTML = '<option value="">Seleccione un municipio...</option>';
    select.disabled = true;
    if (!idEstado) return;
    try {
        let municipios = [];
        let page = 1;
        let seguir = true;
        while (seguir) {
            const url = `/municipios/?page=${page}`;
            const response = await apiRequest(url);
            let batch = Array.isArray(response) ? response : (response.results ? response.results : (response.data ? response.data : []));
            municipios = municipios.concat(batch);
            if (!response.next) {
                seguir = false;
            } else {
                page++;
            }
        }
        // Filtrar solo los municipios del estado seleccionado
        const municipiosFiltrados = municipios.filter(mun => String(mun.id_estado) === String(idEstado));
        municipiosFiltrados.forEach(mun => {
            const option = document.createElement('option');
            option.value = mun.id_municipio || mun.id || '';
            option.textContent = mun.municipio || '';
            select.appendChild(option);
        });
        select.disabled = false;
    } catch (error) {
        console.error('Error al cargar municipios:', error);
    }
}

async function cargarParroquiasNacimiento(idMunicipio) {
    const select = document.getElementById('parroquiaNacimiento');
    select.innerHTML = '<option value="">Seleccione una parroquia...</option>';
    select.disabled = true;
    if (!idMunicipio) return;
    try {
        let parroquias = [];
        let page = 1;
        let seguir = true;
        while (seguir) {
            const url = `/parroquias/?page=${page}`;
            const response = await apiRequest(url);
            let batch = Array.isArray(response) ? response : (response.results ? response.results : (response.data ? response.data : []));
            parroquias = parroquias.concat(batch);
            if (!response.next) {
                seguir = false;
            } else {
                page++;
            }
        }
        // Filtrar solo las parroquias del municipio seleccionado
        const parroquiasFiltradas = parroquias.filter(parr => String(parr.id_municipio) === String(idMunicipio));
        parroquiasFiltradas.forEach(parr => {
            const option = document.createElement('option');
            option.value = parr.id_parroquia || parr.id || '';
            option.textContent = parr.parroquia || '';
            select.appendChild(option);
        });
        select.disabled = false;
    } catch (error) {
        console.error('Error al cargar parroquias:', error);
    }
}

async function cargarCiudadesNacimiento(idEstado) {
    const select = document.getElementById('ciudadNacimiento');
    select.innerHTML = '<option value="">Seleccione una ciudad...</option>';
    select.disabled = true;
    if (!idEstado) return;
    try {
        let ciudades = [];
        let page = 1;
        let seguir = true;
        while (seguir) {
            const url = `/ciudades/?page=${page}`;
            const response = await apiRequest(url);
            let batch = Array.isArray(response) ? response : (response.results ? response.results : (response.data ? response.data : []));
            ciudades = ciudades.concat(batch);
            if (!response.next) {
                seguir = false;
            } else {
                page++;
            }
        }
        // Filtrar solo las ciudades del estado seleccionado
        const ciudadesFiltradas = ciudades.filter(ciudad => String(ciudad.id_estado) === String(idEstado));
        ciudadesFiltradas.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad.id_ciudad || ciudad.id || '';
            option.textContent = ciudad.ciudad || '';
            select.appendChild(option);
        });
        select.disabled = false;
    } catch (error) {
        console.error('Error al cargar ciudades:', error);
    }
}

// Eventos para selects encadenados
window.addEventListener('DOMContentLoaded', function () {
    cargarEstadosNacimiento();
    const estadoSel = document.getElementById('estadoNacimiento');
    const municipioSel = document.getElementById('municipioNacimiento');
    const parroquiaSel = document.getElementById('parroquiaNacimiento');
    const ciudadSel = document.getElementById('ciudadNacimiento');
    if (estadoSel) {
        estadoSel.addEventListener('change', function () {
            cargarMunicipiosNacimiento(this.value);
            cargarCiudadesNacimiento(this.value);
            municipioSel.value = '';
            municipioSel.disabled = true;
            parroquiaSel.value = '';
            parroquiaSel.disabled = true;
            ciudadSel.value = '';
            ciudadSel.disabled = true;
        });
    }
    if (municipioSel) {
        municipioSel.addEventListener('change', function () {
            cargarParroquiasNacimiento(this.value);
            parroquiaSel.value = '';
            parroquiaSel.disabled = true;
        });
    }
    if (parroquiaSel) {
        parroquiaSel.addEventListener('change', function () {
            ciudadSel.value = '';
            ciudadSel.disabled = false;
        });
    }
});

// Función para probar la conectividad con la API
async function probarAPI() {
    console.log('=== PRUEBA DE CONECTIVIDAD API ===');
    console.log('URL base de la API:', API_BASE_URL);
    console.log('Variable global pacienteid al inicio de la prueba:', window.pacienteid);

    try {
        // Probar endpoint de pacientes
        console.log('Probando endpoint /pacientes/...');
        const pacientesResponse = await apiRequest('/pacientes/');
        console.log('Respuesta de pacientes:', pacientesResponse);

        // Probar endpoint específico del paciente
        const idPaciente = window.pacienteid || 1;
        console.log(`Probando endpoint /pacientes/${idPaciente}/...`);
        const pacienteResponse = await apiRequest(`/pacientes/${idPaciente}/`);
        console.log('Respuesta del paciente específico:', pacienteResponse);

        // Probar endpoint de estados
        console.log('Probando endpoint /estados/...');
        const estadosResponse = await apiRequest('/estados/');
        console.log('Respuesta de estados:', estadosResponse);

        console.log('=== PRUEBA COMPLETADA ===');
        return true;
    } catch (error) {
        console.error('Error en la prueba de API:', error);
        return false;
    }
}

// Función para mostrar información de debug en la página
function mostrarInfoDebug() {
    const debugInfo = {
        'ID del Usuario Actual': window.pacienteid || 'No definido',
        'URL de la API': API_BASE_URL,
        'User Agent': navigator.userAgent,
        'Timestamp': new Date().toISOString()
    };

    console.log('=== INFORMACIÓN DE DEBUG ===');
    Object.entries(debugInfo).forEach(([key, value]) => {
        console.log(`${key}:`, value);
    });
    console.log('=== FIN DEBUG ===');

    // Verificar si la variable global se estableció correctamente
    if (typeof window.pacienteid === 'undefined') {
        console.error('¡ADVERTENCIA! La variable global pacienteid no está definida');
    } else {
        console.log('Variable global pacienteid está definida como:', window.pacienteid);
        console.log('Tipo de dato:', typeof window.pacienteid);
    }

    // Mostrar alerta con información básica
    //alert(`Información de Debug:\nID del Usuario: ${window.pacienteid || 'No definido'}\nURL API: ${API_BASE_URL}\nTimestamp: ${new Date().toISOString()}`);
}

// Función para verificar y mostrar datos del paciente ID 1
async function verificarDatosPacienteID1() {
    console.log('=== VERIFICANDO DATOS DEL USUARIO ACTUAL ===');
    try {
        // Obtener el ID del usuario actual
        const idUsuario = window.pacienteid || 1;

        // Primero verificar si existe el paciente
        const pacienteExistente = await verificarPacienteExiste(idUsuario);

        if (!pacienteExistente) {
            console.log('❌ No se encontró paciente con ID:', idUsuario);
            alert('No se encontró paciente con ID ' + idUsuario);
            return null;
        }

        console.log('✅ Paciente encontrado:', pacienteExistente);

        // Ahora verificar si existe el usuario
        let datosUsuario;
        try {
            datosUsuario = await apiRequest(`/usuarios/${idUsuario}/`);
            console.log('✅ Usuario encontrado:', datosUsuario);
        } catch (error) {
            console.log('❌ Usuario no encontrado, creando uno nuevo...');

            const cedulaUsuario = pacienteExistente.n_documento || idUsuario.toString();
            const confirmar = confirm(`No se encontró el usuario con ID ${idUsuario}.\n¿Deseas crear un usuario nuevo con cédula ${cedulaUsuario}?`);

            if (confirmar) {
                try {
                    const usuarioCreado = await crearUsuarioNuevo(idUsuario, cedulaUsuario);
                    if (usuarioCreado) {
                        console.log('✅ Usuario creado exitosamente:', usuarioCreado);
                        datosUsuario = usuarioCreado;
                    } else {
                        alert('Error al crear el usuario');
                        return null;
                    }
                } catch (crearError) {
                    alert('Error al crear usuario: ' + crearError.message);
                    return null;
                }
            } else {
                alert('Usuario no creado');
                return null;
            }
        }

        // Mostrar información del paciente y usuario
        console.log('Datos principales del paciente:');
        console.log('- Nombres:', pacienteExistente.primer_nombre, pacienteExistente.segundo_nombre);
        console.log('- Apellidos:', pacienteExistente.primer_apellido, pacienteExistente.segundo_apellido);
        console.log('- Cédula:', pacienteExistente.n_documento);
        console.log('- Teléfono:', pacienteExistente.Telefono_paciente);
        console.log('- Fecha nacimiento:', pacienteExistente.fecha_nacimiento);
        console.log('- Status:', pacienteExistente.status);

        const nombreCompleto = [
            pacienteExistente.primer_nombre,
            pacienteExistente.segundo_nombre,
            pacienteExistente.primer_apellido,
            pacienteExistente.segundo_apellido
        ].filter(n => n).join(' ');

        alert(`Usuario ID ${idUsuario}:\n\nPACIENTE:\nNombre: ${nombreCompleto || 'No especificado'}\nCédula: ${pacienteExistente.n_documento || 'No especificada'}\nTeléfono: ${pacienteExistente.Telefono_paciente || 'No especificado'}\nStatus: ${pacienteExistente.status || 'No especificado'}\n\nUSUARIO:\nUsername: ${datosUsuario?.username || 'No especificado'}\nEmail: ${datosUsuario?.email || 'No especificado'}`);

        return { paciente: pacienteExistente, usuario: datosUsuario };

    } catch (error) {
        console.error('❌ Error al verificar usuario actual:', error);
        alert('Error al verificar usuario actual: ' + error.message);
        return null;
    }
}

// Función para cargar el correo del usuario 8
async function cargarCorreoUsuario8() {
    try {
        console.log('Cargando correo del usuario 8...');
        const response = await apiRequest('/usuarios/8/');
        console.log('Datos del usuario 8:', response);

        if (response && (response.email || response.correo)) {
            const correo = response.email || response.correo;
            console.log('Correo del usuario 8 encontrado:', correo);
            return correo;
        } else {
            console.log('No se encontró correo para el usuario 8');
            return null;
        }
    } catch (error) {
        console.error('Error al cargar correo del usuario 8:', error);
        return null;
    }
}

// Función para generar cédula especial para familiar menor de edad
async function generarCedulaFamiliarMenor(cedulaUsuario) {
    try {
        // Obtener todos los pacientes que son familiares del usuario actual
        const idUsuario = window.pacienteid || 1;
        const pacientesResponse = await apiRequest('/pacientes/');
        let pacientes = Array.isArray(pacientesResponse) ? pacientesResponse :
            (pacientesResponse.results ? pacientesResponse.results :
                (pacientesResponse.data ? pacientesResponse.data : []));

        // Filtrar familiares del usuario actual que sean menores de edad
        const familiaresMenores = pacientes.filter(p =>
            p.user === idUsuario &&
            p.is_menor === true &&
            p.n_documento &&
            p.n_documento.startsWith(cedulaUsuario + '-')
        );

        // Encontrar el siguiente número disponible
        let siguienteNumero = 1;
        if (familiaresMenores.length > 0) {
            const numerosExistentes = familiaresMenores.map(f => {
                const match = f.n_documento.match(new RegExp(`^${cedulaUsuario}-(\\d+)$`));
                return match ? parseInt(match[1]) : 0;
            });
            siguienteNumero = Math.max(...numerosExistentes) + 1;
        }

        return `${cedulaUsuario}-${siguienteNumero}`;
    } catch (error) {
        console.error('Error al generar cédula para familiar menor:', error);
        return `${cedulaUsuario}-1`;
    }
}

// Función para verificar el usuario actual
async function verificarUsuarioActual() {
    console.log('=== VERIFICANDO USUARIO ACTUAL ===');
    const idUsuario = window.pacienteid || 1;
    console.log('ID del usuario desde variable global:', idUsuario);
    try {
        // Buscar el usuario en todas las páginas
        const todosLosUsuarios = await obtenerTodosLosUsuarios();
        const datosUsuario = todosLosUsuarios.find(u => u.id == idUsuario);
        console.log('Datos del usuario actual:', datosUsuario);
        if (datosUsuario) {
            console.log('✅ Usuario encontrado');
            console.log('- ID:', datosUsuario.id);
            console.log('- Username:', datosUsuario.username);
            console.log('- Email:', datosUsuario.email);
            console.log('- Correo:', datosUsuario.correo);
            alert(`Usuario actual:\nID: ${datosUsuario.id}\nUsername: ${datosUsuario.username || 'No especificado'}\nEmail: ${datosUsuario.email || datosUsuario.correo || 'No especificado'}`);
            return datosUsuario;
        } else {
            console.log('❌ Usuario no encontrado');
            const cedula = await obtenerCedulaUsuario(idUsuario);
            const confirmar = confirm(`No se encontró el usuario con ID ${idUsuario}.\n¿Deseas crear un usuario nuevo con cédula ${cedula}?`);
            if (confirmar) {
                const usuarioCreado = await crearUsuarioNuevo(idUsuario, cedula);
                if (usuarioCreado) {
                    alert('Usuario creado exitosamente');
                    return usuarioCreado;
                } else {
                    alert('Error al crear el usuario');
                    return null;
                }
            } else {
                alert('Usuario no creado');
                return null;
            }
        }
    } catch (error) {
        console.error('❌ Error al verificar usuario:', error);
        alert('Error al verificar usuario: ' + error.message);
        return null;
    }
}

// Función para crear un usuario nuevo
async function crearUsuarioNuevo(idUsuario, cedula) {
    try {
        console.log('Creando usuario nuevo con ID:', idUsuario, 'y cédula:', cedula);

        // Obtener datos del paciente para usar en la creación del usuario
        const pacientes = await obtenerTodosLosPacientes();
        const paciente = pacientes.find(p => p.id == idUsuario);

        let first_name = "";
        let last_name = "";
        let email = "";

        if (paciente) {
            first_name = paciente.primer_nombre || "";
            last_name = paciente.primer_apellido || "";
            email = paciente.email || paciente.correo || "";
        }

        const usuarioData = {
            username: cedula,
            email: email,
            first_name: first_name,
            last_name: last_name,
            is_staff: false,
            is_active: true
        };

        console.log('Datos del usuario a crear:', usuarioData);

        const response = await apiRequest('/usuarios/', 'POST', usuarioData);
        console.log('Usuario creado:', response);

        return response;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}

// Función para obtener la cédula del usuario registrado
async function obtenerCedulaUsuario(idUsuario) {
    try {
        // Buscar el paciente con el ID correspondiente para obtener su cédula
        const pacientes = await obtenerTodosLosPacientes();
        const paciente = pacientes.find(p => p.id == idUsuario);

        if (paciente && paciente.n_documento) {
            console.log('Cédula encontrada para usuario', idUsuario, ':', paciente.n_documento);
            return paciente.n_documento;
        } else {
            console.log('No se encontró paciente con ID', idUsuario, 'o no tiene cédula');
            // Fallback: usar el ID como cédula temporal
            return idUsuario.toString();
        }
    } catch (error) {
        console.error('Error al obtener cédula del usuario:', error);
        return idUsuario.toString(); // Fallback al ID como cédula
    }
}

// Función para verificar si existe un paciente con el ID
async function verificarPacienteExiste(idPaciente) {
    try {
        console.log('Verificando paciente con ID:', idPaciente);

        // Buscar directamente el paciente por ID
        const response = await apiRequest(`/pacientes/${idPaciente}/`);

        if (response) {
            console.log('✅ Paciente encontrado:', response);
            return response;
        } else {
            console.log('❌ No se encontró paciente con ID:', idPaciente);
            return null;
        }
    } catch (error) {
        console.error('Error al verificar paciente:', error);
        return null;
    }
}

// Función para obtener todos los pacientes paginando
async function obtenerTodosLosPacientes() {
    try {
        let todosLosPacientes = [];
        let pagina = 1;
        let hayMasPaginas = true;

        console.log('Obteniendo todos los pacientes paginando...');

        while (hayMasPaginas) {
            const url = `/pacientes/?page=${pagina}`;
            console.log(`Obteniendo página ${pagina}: ${url}`);

            const response = await apiRequest(url);
            console.log(`Respuesta página ${pagina}:`, response);

            let pacientesPagina = [];
            if (Array.isArray(response)) {
                pacientesPagina = response;
            } else if (response.results && Array.isArray(response.results)) {
                pacientesPagina = response.results;
            } else if (response.data && Array.isArray(response.data)) {
                pacientesPagina = response.data;
            }

            console.log(`Pacientes en página ${pagina}:`, pacientesPagina.length);
            todosLosPacientes = todosLosPacientes.concat(pacientesPagina);

            // Verificar si hay más páginas
            if (response.next && response.next !== null) {
                pagina++;
            } else {
                hayMasPaginas = false;
            }

            // Prevenir bucle infinito
            if (pagina > 50) {
                console.warn('Límite de páginas alcanzado (50), deteniendo paginación');
                hayMasPaginas = false;
            }
        }

        console.log(`Total de pacientes obtenidos: ${todosLosPacientes.length}`);
        return todosLosPacientes;

    } catch (error) {
        console.error('Error al obtener todos los pacientes:', error);
        throw error;
    }
}

// Función para obtener todos los usuarios paginando
async function obtenerTodosLosUsuarios() {
    try {
        let todosLosUsuarios = [];
        let pagina = 1;
        let hayMasPaginas = true;

        console.log('Obteniendo todos los usuarios paginando...');

        while (hayMasPaginas) {
            const url = `/usuarios/?page=${pagina}`;
            console.log(`Obteniendo página ${pagina}: ${url}`);

            const response = await apiRequest(url);
            console.log(`Respuesta página ${pagina}:`, response);

            let usuariosPagina = [];
            if (Array.isArray(response)) {
                usuariosPagina = response;
            } else if (response.results && Array.isArray(response.results)) {
                usuariosPagina = response.results;
            } else if (response.data && Array.isArray(response.data)) {
                usuariosPagina = response.data;
            }

            console.log(`Usuarios en página ${pagina}:`, usuariosPagina.length);
            todosLosUsuarios = todosLosUsuarios.concat(usuariosPagina);

            // Verificar si hay más páginas
            if (response.next && response.next !== null) {
                pagina++;
            } else {
                hayMasPaginas = false;
            }

            // Prevenir bucle infinito
            if (pagina > 50) {
                console.warn('Límite de páginas alcanzado (50), deteniendo paginación');
                hayMasPaginas = false;
            }
        }

        console.log(`Total de usuarios obtenidos: ${todosLosUsuarios.length}`);
        return todosLosUsuarios;

    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        throw error;
    }
}

// ... existing code ... 

// Función para buscar un usuario por ID, primero directo y luego paginando si es necesario
async function buscarUsuarioPorId(id) {
    console.log('=== BUSCANDO USUARIO POR ID ===');
    console.log('ID solicitado:', id);
    try {
        // Intentar obtener el usuario directamente
        const usuario = await apiRequest(`/usuarios/${id}/`);
        if (usuario && usuario.id == id) {
            console.log('✅ Usuario encontrado directamente:', usuario);
            alert(`Usuario encontrado (directo):\nID: ${usuario.id}\nUsername: ${usuario.username || 'No especificado'}\nEmail: ${usuario.email || usuario.correo || 'No especificado'}`);
            return usuario;
        }
    } catch (error) {
        // Si es 404, buscar paginando
        if (error.message && error.message.includes('404')) {
            console.warn('Usuario no encontrado directamente, buscando en todas las páginas...');
            try {
                let pagina = 1;
                let hayMasPaginas = true;
                while (hayMasPaginas) {
                    const url = `/usuarios/?page=${pagina}`;
                    const response = await apiRequest(url);
                    let usuariosPagina = [];
                    if (Array.isArray(response)) {
                        usuariosPagina = response;
                    } else if (response.results && Array.isArray(response.results)) {
                        usuariosPagina = response.results;
                    } else if (response.data && Array.isArray(response.data)) {
                        usuariosPagina = response.data;
                    }
                    const encontrado = usuariosPagina.find(u => u.id == id);
                    if (encontrado) {
                        console.log('✅ Usuario encontrado paginando:', encontrado);
                        alert(`Usuario encontrado (paginando):\nID: ${encontrado.id}\nUsername: ${encontrado.username || 'No especificado'}\nEmail: ${encontrado.email || encontrado.correo || 'No especificado'}`);
                        return encontrado;
                    }
                    if (response.next && response.next !== null) {
                        pagina++;
                    } else {
                        hayMasPaginas = false;
                    }
                    if (pagina > 50) {
                        console.warn('Límite de páginas alcanzado (50), deteniendo paginación');
                        hayMasPaginas = false;
                    }
                }
                alert(`No se encontró el usuario con ID ${id} en ninguna página.`);
                return null;
            } catch (err) {
                alert('Error al buscar usuario paginando: ' + err.message);
                return null;
            }
        } else {
            alert('Error al buscar usuario: ' + error.message);
            return null;
        }
    }
}
// ... existing code ... 

// Función para verificar y corregir la selección del estado
function verificarSeleccionEstado() {
    const estadoSel = document.getElementById('estadoNacimiento');
    if (!estadoSel) {
        console.error('No se encontró el select de estado');
        return;
    }

    console.log('Verificando selección del estado...');
    console.log('Valor actual del estado:', estadoSel.value);
    console.log('Opciones disponibles:', estadoSel.options.length);

    // Si hay un valor pero no se está mostrando correctamente
    if (estadoSel.value && estadoSel.value !== '') {
        // Verificar si la opción existe
        const opcionSeleccionada = estadoSel.querySelector(`option[value="${estadoSel.value}"]`);
        if (opcionSeleccionada) {
            console.log('Estado seleccionado correctamente:', opcionSeleccionada.textContent);
        } else {
            console.warn('El valor del estado no coincide con ninguna opción disponible');
            // Intentar encontrar una opción que coincida
            for (let i = 0; i < estadoSel.options.length; i++) {
                const option = estadoSel.options[i];
                if (option.value === estadoSel.value) {
                    console.log('Estado encontrado en opciones:', option.textContent);
                    break;
                }
            }
        }
    } else {
        console.log('No hay estado seleccionado');
    }
}