// Configuración de la API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');

    // Función para mostrar una sección y ocultar las demás
    function showSection(sectionId) {
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
        
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
            
            // Obtener el botón submit antes de cualquier operación
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
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
                //Lugar_de_nacimiento: document.getElementById('lugarNacimiento').value || null,
                Instruccion_paciente: getValueOrNull('nivelInstruccion'),
                Ocupacion_paciente: getValueOrNull('ocupacion'),
                n_documento: getValueOrNull('cedula'),
                Telefono_paciente: getValueOrNull('telefono'),
                sexo: getValueOrNull('sexo'),
                Estado_civil_paciente: getValueOrNull('estadoCivil'),
                Religion_paciente: getValueOrNull('religion'),
                Centros_estudios_trabajos: getValueOrNull('centroTrabajo'),
                Grado_paciente: getValueOrNull('grado'),
                Ciclo_paciente: getValueOrNull('ciclo'),
                Procedencia_paciente: getValueOrNull('lugarResidencia'),
                Tiempo_residencia_paciente: getValueOrNull('tiempoResidencia'),
                Cantidad_tiempo_residencia_paciente: parseInt(getValueOrNull('tiempoResidencia')) || null,
                pregunta_1: getValueOrNull('pregunta1'),
                respuesta_1: getValueOrNull('respuesta1'),
                pregunta_2: getValueOrNull('pregunta2'),
                respuesta_2: getValueOrNull('respuesta2'),
                pregunta_3: getValueOrNull('pregunta3'),
                respuesta_3: getValueOrNull('respuesta3'),
                direccion_principal: direccionId
            };

            // Log de los datos que se enviarán
            console.log('Datos a enviar a la API:', perfilData);

            try {
                // Mostrar indicador de carga
                submitButton.disabled = true;
                submitButton.textContent = 'Guardando...';

                // Actualizar el paciente con ID 1
                const response = await api.updatePaciente(1, perfilData);
                console.log('Respuesta del servidor:', response);
                
                // Verificar si la respuesta es exitosa
                if (response) {
                    alert('Cambios guardados correctamente');
                    // Recargar los datos del perfil para mostrar la información actualizada
                    await cargarDatosPerfil();
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

        // Validar fecha y hora antes de enviar
        citasForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            // Obtener el botón submit antes de cualquier operación
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                // Mostrar indicador de carga
                submitButton.disabled = true;
                submitButton.textContent = 'Agendando...';
                
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
            
            // Obtener el botón submit antes de cualquier operación
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                // Mostrar indicador de carga
                submitButton.disabled = true;
                submitButton.textContent = 'Guardando...';

                // Recopilar datos del formulario para paciente
                const cedulaFamiliar = document.getElementById('familiar-cedula').value;
                const nombreFamiliar = document.getElementById('familiar-nombre').value.trim();
                const apellidoFamiliar = document.getElementById('familiar-apellido').value.trim();
                const edadFamiliar = parseInt(document.getElementById('familiar-edad').value) || null;
                const primerNombre = nombreFamiliar.split(' ')[0] || null;
                const segundoNombre = nombreFamiliar.split(' ').slice(1).join(' ') || null;
                const primerApellido = apellidoFamiliar.split(' ')[0] || null;
                const segundoApellido = apellidoFamiliar.split(' ').slice(1).join(' ') || null;
                const pacienteFamiliarData = {
                    tipo_documento: null,
                    n_documento: cedulaFamiliar,
                    primer_nombre: primerNombre,
                    segundo_nombre: segundoNombre,
                    primer_apellido: primerApellido,
                    segundo_apellido: segundoApellido,
                    fecha_nacimiento: null, // Puedes agregar un campo en el formulario si lo necesitas
                    status: null,
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
                    user: null,
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
                    parentesco: document.getElementById('familiar-parentesco').value,
                    edad: parseInt(document.getElementById('familiar-edad').value) || null,
                    n_documento: cedulaFamiliar,
                    paciente: 1, // ID del paciente principal (ajusta si es dinámico)
                    familiar: pacienteFamiliar.cedula, // o pacienteFamiliar.id si tu backend lo usa así
                    relacion: document.getElementById('familiar-parentesco').value,
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

        nuevaCita.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-center">
                <div>
                    <h5 class="mb-1">Cita ${citaData.modalidad} - ${citaData.tipo_consulta}</h5>
                    ${acompañantesInfo}
                    <p class="mb-1"><strong>Fecha:</strong> ${citaData.Fecha_primera_consulta} - <strong>Hora:</strong> ${citaData.hora_consulta}</p>
                    ${citaData.notas ? `<small class="text-muted"><strong>Notas:</strong> ${citaData.notas}</small>` : ''}
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
function validarDisponibilidad(fecha, hora) {
    // Aquí se implementaría la lógica para verificar si el horario está disponible
    // Por ahora retornamos true
    return true;
}

// Función para cargar la lista de familiares
async function cargarFamiliares() {
    try {
        // Obtener todos los pacientes para usar como familiares
        const pacientesResponse = await apiRequest('/pacientes/');
        let pacientes = Array.isArray(pacientesResponse) ? pacientesResponse : 
                       (pacientesResponse.results ? pacientesResponse.results : 
                       (pacientesResponse.data ? pacientesResponse.data : []));
        
        console.log('Pacientes para usar como familiares:', pacientes);
        
        // Actualizar la lista de familiares en la sección de familiares
        const listaFamiliares = document.getElementById('lista-familiares');
        if (listaFamiliares) {
            // Limpiar la lista actual
            listaFamiliares.innerHTML = '';
            
            // Mostrar SOLO pacientes sin fecha de nacimiento y su cédula (estos son los familiares)
            const familiaresPacientes = pacientes.filter(p => !p.fecha_nacimiento && p.n_documento);
            
            if (familiaresPacientes.length === 0) {
                listaFamiliares.innerHTML = '<div class="list-group-item text-muted">No hay familiares registrados</div>';
            } else {
                familiaresPacientes.forEach(paciente => {
                    const familiarElement = document.createElement('div');
                    familiarElement.className = 'list-group-item';
                    familiarElement.setAttribute('data-familiar-id', paciente.id);
                    familiarElement.innerHTML = `
                        <div class="d-flex w-100 justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-1">${paciente.primer_nombre ?? ''} ${paciente.primer_apellido ?? ''}</h5>
                                <small class="d-block">Cédula: ${paciente.n_documento}</small>
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
            
            // Usar los mismos pacientes como opciones para el selector
            pacientes.filter(p => !p.fecha_nacimiento && p.n_documento).forEach(paciente => {
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
        const cedula = document.getElementById('editar-familiar-cedula').value;
        const edad = parseInt(document.getElementById('editar-familiar-edad').value) || null;
        const parentesco = document.getElementById('editar-familiar-parentesco').value;
        
        // Validar campos requeridos
        if (!nombreCompleto || !apellidoCompleto || !cedula) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
        
        // Separar nombres y apellidos
        const primerNombre = nombreCompleto.split(' ')[0] || null;
        const segundoNombre = nombreCompleto.split(' ').slice(1).join(' ') || null;
        const primerApellido = apellidoCompleto.split(' ')[0] || null;
        const segundoApellido = apellidoCompleto.split(' ').slice(1).join(' ') || null;
        
        // Datos actualizados del paciente
        const pacienteFamiliarData = {
            tipo_documento: null,
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
        
    } catch (error) {
        console.error('Error al editar cita:', error);
        alert('Error al editar cita: ' + error.message);
    }
}

// Función para cargar familiares en un selector específico
async function cargarFamiliaresEnSelector(selectorId) {
    try {
        const pacientesResponse = await apiRequest('/pacientes/');
        let pacientes = Array.isArray(pacientesResponse) ? pacientesResponse : 
                       (pacientesResponse.results ? pacientesResponse.results : 
                       (pacientesResponse.data ? pacientesResponse.data : []));
        
        const selectFamiliares = document.getElementById(selectorId);
        if (selectFamiliares) {
            selectFamiliares.innerHTML = '';
            
            // Mostrar SOLO pacientes sin fecha de nacimiento y su cédula (estos son los familiares)
            const familiaresPacientes = pacientes.filter(p => !p.fecha_nacimiento && p.n_documento);
            
            familiaresPacientes.forEach(paciente => {
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

// Modificar la función cargarDatosPerfil para mostrar correctamente los selects de dirección
async function cargarDatosPerfil() {
    console.log('Cargando datos del perfil');
    try {
        const datosPaciente = await api.getPaciente(1);
        console.log('Datos del paciente recibidos:', datosPaciente);
        if (!datosPaciente) {
            console.error('No se recibieron datos del paciente');
            return;
        }
        // Si hay dirección principal, cargar y seleccionar los valores
        if (datosPaciente.direccion_principal) {
            try {
                const direccion = await apiRequest(`/direcciones/${datosPaciente.direccion_principal}/`);
                // Seleccionar estado
                const estadoSel = document.getElementById('estadoNacimiento');
                if (estadoSel && direccion.estado) {
                    estadoSel.value = String(direccion.estado);
                    await cargarMunicipiosNacimiento(direccion.estado);
                }
                // Seleccionar municipio
                const municipioSel = document.getElementById('municipioNacimiento');
                if (municipioSel && direccion.municipio) {
                    municipioSel.value = String(direccion.municipio);
                    await cargarParroquiasNacimiento(direccion.municipio);
                }
                // Seleccionar parroquia
                const parroquiaSel = document.getElementById('parroquiaNacimiento');
                if (parroquiaSel && direccion.parroquia) {
                    parroquiaSel.value = String(direccion.parroquia);
                }
                // Seleccionar ciudad
                const ciudadSel = document.getElementById('ciudadNacimiento');
                if (ciudadSel && direccion.ciudad) {
                    await cargarCiudadesNacimiento(direccion.estado);
                    ciudadSel.value = String(direccion.ciudad);
                }
            } catch (error) {
                console.error('Error al cargar la dirección principal:', error);
            }
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
            n_documento: 'cedula',
            Telefono_paciente: 'telefono',
            sexo: 'sexo',
            Estado_civil_paciente: 'estadoCivil',
            Religion_paciente: 'religion',
            Centros_estudios_trabajos: 'centroTrabajo',
            Grado_paciente: 'grado',
            Ciclo_paciente: 'ciclo',
            Procedencia_paciente: 'lugarResidencia',
            Tiempo_residencia_paciente: 'tiempoResidencia',
            Cantidad_tiempo_residencia_paciente: 'tiempoResidenciaUnidad',
            pregunta_1: 'pregunta1',
            respuesta_1: 'respuesta1',
            pregunta_2: 'pregunta2',
            respuesta_2: 'respuesta2',
            pregunta_3: 'pregunta3',
            respuesta_3: 'respuesta3'
        };
        // Actualizar cada campo del formulario
        Object.entries(mapeoCampos).forEach(([apiField, formId]) => {
            const field = document.getElementById(formId);
            if (field && datosPaciente[apiField] !== undefined && datosPaciente[apiField] !== null) {
                if (formId === 'nombres') {
                    const nombres = [datosPaciente.primer_nombre, datosPaciente.segundo_nombre]
                        .filter(n => n).join(' ');
                    field.value = nombres;
                } else if (formId === 'apellidos') {
                    const apellidos = [datosPaciente.primer_apellido, datosPaciente.segundo_apellido]
                        .filter(a => a).join(' ');
                    field.value = apellidos;
                } else if (field.type === 'date') {
                    field.value = datosPaciente[apiField];
                } else if (field.tagName === 'SELECT') {
                    field.value = datosPaciente[apiField];
                } else {
                    field.value = datosPaciente[apiField];
                }
            }
        });
    } catch (error) {
        console.error('Error al cargar datos del perfil:', error);
    }
}

// Cargar datos iniciales
window.addEventListener('load', function () {
    cargarDatosPerfil();
    cargarFamiliares();
});

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

            citaElement.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">Cita ${cita.modalidad} - ${cita.tipo_consulta}</h5>
                        ${acompañantesInfo}
                        <p class="mb-1"><strong>Fecha:</strong> ${cita.Fecha_primera_consulta} - <strong>Hora:</strong> ${cita.hora_consulta}</p>
                        ${cita.notas ? `<small class="text-muted"><strong>Notas:</strong> ${cita.notas}</small>` : ''}
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
        let estados = [];
        // Primera página sin parámetro page
        const urlPrimera = '/estados/';
        const responsePrimera = await apiRequest(urlPrimera);
        let batchPrimera = Array.isArray(responsePrimera) ? responsePrimera : (responsePrimera.results ? responsePrimera.results : (responsePrimera.data ? responsePrimera.data : []));
        estados = estados.concat(batchPrimera);
        // Siguientes páginas con page=2, page=3
        for (let page = 2; page <= 3; page++) {
            const url = `/estados/?page=${page}`;
            const response = await apiRequest(url);
            let batch = Array.isArray(response) ? response : (response.results ? response.results : (response.data ? response.data : []));
            estados = estados.concat(batch);
        }
        const select = document.getElementById('estadoNacimiento');
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