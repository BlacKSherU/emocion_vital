// Configuración de la API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
        
        // Obtener datos del paciente para el correo
        const datosPaciente = await apiRequest(`/pacientes/${idUsuario}/`);
        const correoPaciente = datosPaciente?.email || datosPaciente?.correo;
        
        if (!correoPaciente) {
            console.log('Paciente no tiene correo electrónico');
            return false;
        }
        
        // Buscar paciente por correo electrónico
        const pacientesResponse = await apiRequest('/pacientes/');
        let pacientes = Array.isArray(pacientesResponse) ? pacientesResponse :
            (pacientesResponse.results ? pacientesResponse.results :
                (pacientesResponse.data ? pacientesResponse.data : []));
        
        const datosPacienteEncontrado = pacientes.find(p => 
            (p.email === correoPaciente || p.correo === correoPaciente)
        );
        
        if (datosPacienteEncontrado) {
            // Verificar que tenga los campos principales
            const camposPrincipales = [
                'primer_nombre', 'primer_apellido', 'fecha_nacimiento', 
                'n_documento', 'Telefono_paciente', 'sexo', 'Estado_civil_paciente'
            ];
            
            const tieneDatosPrincipales = camposPrincipales.every(campo => 
                datosPacienteEncontrado[campo] && datosPacienteEncontrado[campo].toString().trim() !== ''
            );
            
            if (tieneDatosPrincipales) {
                console.log('Perfil completo detectado en base de datos');
                return true;
            }
        }
    } catch (error) {
        console.error('Error al verificar datos en base de datos:', error);
    }
    
    // Si no hay datos en BD, verificar formulario
    const camposRequeridos = [
        'nombres', 'apellidos', 'fechaNacimiento', 'estadoNacimiento', 
        'municipioNacimiento', 'parroquiaNacimiento', 'ciudadNacimiento',
        'nivelInstruccion', 'ocupacion', 'tipoDocumento', 'cedula', 'telefono', 'correo',
        'sexo', 'estadoCivil', 'lugarResidencia', 'tiempoResidencia',
        'pregunta1', 'respuesta1', 'pregunta2', 'respuesta2', 'pregunta3', 'respuesta3'
    ];

    for (const campo of camposRequeridos) {
        const elemento = document.getElementById(campo);
        if (!elemento || !elemento.value.trim()) {
            return false;
        }
    }
    return true;
}

// ... resto del código corregido ... 