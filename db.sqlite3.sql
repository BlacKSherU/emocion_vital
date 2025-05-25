create schema emocion_vital ;
CREATE TABLE IF NOT EXISTS Api_baterias (
	id	integer NOT NULL auto_increment,
	Baterias	varchar(50) NOT NULL,
	Resultados	varchar(50) NOT NULL,
	PRIMARY KEY (id) 
);
CREATE TABLE IF NOT EXISTS api_cita (
	id	integer NOT NULL auto_increment,
	Numero_historial	varchar(8) NOT NULL,
	Fecha_primera_consulta	date NOT NULL,
	Motivo_consulta	varchar(200) NOT NULL,
	Desarrollo_problema	varchar(500) NOT NULL,
	Tiempo_problema	varchar(50) NOT NULL,
	Suceso_dia_problema	varchar(50) NOT NULL,
	Dia_anterior_problema	varchar(100) NOT NULL,
	Accion_dia_problema	varchar(100) NOT NULL,
	Calma_dia_problema	varchar(100) NOT NULL,
	Hablar_problema_alguien	varchar(100) NOT NULL,
	Factores_problema	varchar(100) NOT NULL,
	Personalidad_paciente	varchar(100) NOT NULL,
	Filosofia_paciente	varchar(100) NOT NULL,
	Aproximacion_diagnostica	varchar(100) NOT NULL,
	Conclusion_diagnostica	varchar(100) NOT NULL,
	Sintesis_facultades	varchar(500) NOT NULL,
	Sintesis_baterias	varchar(500) NOT NULL,
	Programa_tratamiento	varchar(500) NOT NULL,
	Evolucion	varchar(500) NOT NULL,
	Nombre_responsable	varchar(100) NOT NULL,
	Cargo	varchar(50) NOT NULL,
	Universidad	varchar(100) NOT NULL,
	Telefono_final	varchar(20) NOT NULL,
	Correo_final	varchar(254) NOT NULL,
	baterias_id	bigint NOT NULL,
	Paciente_id	bigint NOT NULL,
	sumario_diagnostico_id	bigint NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(Paciente_id) REFERENCES api_paciente(id) DEFERRABLE INITIALLY DEFERRED,
	FOREIGN KEY(baterias_id) REFERENCES api_baterias(id) DEFERRABLE INITIALLY DEFERRED,
	FOREIGN KEY(sumario_diagnostico_id) REFERENCES api_sumario_diagnostico(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS api_cita_Tratamientos (
	id	integer NOT NULL auto_increment,
	cita_id	bigint NOT NULL,
	tratamientos_id	bigint NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(cita_id) REFERENCES api_cita(id) DEFERRABLE INITIALLY DEFERRED,
	FOREIGN KEY(tratamientos_id) REFERENCES api_tratamientos(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS api_familiar (
	id	integer NOT NULL auto_increment,
	relacion	varchar(40) NOT NULL,
	user1_id	integer NOT NULL,
	user2_id	integer NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(user1_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED,
	FOREIGN KEY(user2_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS api_paciente (
	id	integer NOT NULL,
	is_menor	bool NOT NULL,
	datos_varios	varchar(50) NOT NULL,
	Nombre_paciente	varchar(50) NOT NULL,
	Feche_de_nacimiento	date NOT NULL,
	Lugar_de_nacimiento	varchar(50) NOT NULL,
	Instruccion_paciente	varchar(100) NOT NULL,
	Ocupacion_paciente	varchar(100) NOT NULL,
	Estado_civil_paciente	varchar(20) NOT NULL,
	Telefono_paciente	varchar(20) NOT NULL,
	Centros_estudios_trabajos	varchar(200) NOT NULL,
	Grado_paciente	varchar(10) NOT NULL,
	Ciclo_paciente	varchar(10) NOT NULL,
	Lugar_residencia_paciente	varchar(100) NOT NULL,
	Tiempo_residencia_paciente	varchar(100) NOT NULL,
	Procedencia_paciente	varchar(50) NOT NULL,
	Telefonos_adicionales	varchar(50) NOT NULL,
	Correo_paciente	varchar(254) NOT NULL,
	Informante	varchar(100) NOT NULL,
	Gestacion_paciente	varchar(100) NOT NULL,
	Edad_madre_nacimiento	varchar(2) NOT NULL,
	Parto_paciente	varchar(100) NOT NULL,
	Tipo_atencion_parto	varchar(100) NOT NULL,
	Eutocico	varchar(50) NOT NULL,
	Distocico	varchar(50) NOT NULL,
	Razon_parto	varchar(100) NOT NULL,
	Termino_parto	bool NOT NULL,
	Postnatalidad	varchar(100) NOT NULL,
	Estatura_nacer	varchar(10) NOT NULL,
	Peso_nacer	varchar(10) NOT NULL,
	Perimetro_cefalico	varchar(30) NOT NULL,
	Perimetro_toraxico	varchar(30) NOT NULL,
	Llorar_nacer	varchar(20) NOT NULL,
	Reflejos	varchar(200) NOT NULL,
	Dtor	varchar(200) NOT NULL,
	Lenguaje_paciente	varchar(100) NOT NULL,
	Juego_paciente	varchar(100) NOT NULL,
	Edad_caminar_paciente	varchar(2) NOT NULL,
	Control_encopresis	bool NOT NULL,
	Edad_control_enco	varchar(2) NOT NULL,
	Enuresis_paciente	bool NOT NULL,
	Control_enuresis	varchar(2) NOT NULL,
	Motricidad_fina	varchar(100) NOT NULL,
	Motricidad_gruesa	varchar(100) NOT NULL,
	Movimiento_pinza	varchar(100) NOT NULL,
	Alimentacion_infancia	varchar(200) NOT NULL,
	Crianza_padres	varchar(20) NOT NULL,
	Solo_madre	varchar(20) NOT NULL,
	Solo_padre	varchar(20) NOT NULL,
	Otros_padres	varchar(100) NOT NULL,
	Juego_infantil	varchar(100) NOT NULL,
	Juego_humano	varchar(200) NOT NULL,
	Juego_imaginario	varchar(200) NOT NULL,
	Caracter_infantil	varchar(200) NOT NULL,
	Social_padres	varchar(200) NOT NULL,
	Social_hermanos	varchar(200) NOT NULL,
	Social_familiares	varchar(200) NOT NULL,
	Social_conocidos	varchar(200) NOT NULL,
	Social_extraños	varchar(200) NOT NULL,
	Grado_integracion	varchar(200) NOT NULL,
	Ingreso_escuela_paciente	varchar(100) NOT NULL,
	Integracion_compañeros	varchar(100) NOT NULL,
	Comportamiento_salon	varchar(100) NOT NULL,
	Comportamiento_recreo	varchar(100) NOT NULL,
	Relacion_demas	varchar(100) NOT NULL,
	Aislamiento	varchar(100) NOT NULL,
	Razon_aisla	varchar(100) NOT NULL,
	Dificultades_academicas_primaria	varchar(200) NOT NULL,
	Dificultades_academicas_secundaria	varchar(200) NOT NULL,
	Dificultades_academicas_superior	varchar(200) NOT NULL,
	Problemas_afectivos_niñez	varchar(200) NOT NULL,
	Problemas_afectivos_pubertad	varchar(200) NOT NULL,
	Particularidades_adolescencia	varchar(200) NOT NULL,
	Problemas_afectivos_adolescencia	varchar(200) NOT NULL,
	Armonia_madurez	varchar(200) NOT NULL,
	Desarrollo_voluntad	varchar(200) NOT NULL,
	Grado_autonomia	varchar(200) NOT NULL,
	Persistencia_esfuerzo	varchar(200) NOT NULL,
	Jerarquia_valores	varchar(200) NOT NULL,
	Estilo_vida	varchar(200) NOT NULL,
	Sexualidad_actividad	varchar(200) NOT NULL,
	Problemas_legales	varchar(200) NOT NULL,
	Norma_familiar	varchar(200) NOT NULL,
	Servivio_militar	varchar(100) NOT NULL,
	SMO	varchar(200) NOT NULL,
	Habitos_intereses	varchar(200) NOT NULL,
	Enfermedades_accidentes	varchar(200) NOT NULL,
	Profesion_oficio	varchar(200) NOT NULL,
	Actual_trabajo	varchar(200) NOT NULL,
	Vivienda_paciente	varchar(200) NOT NULL,
	Economia_paciente	varchar(200) NOT NULL,
	Relaciones_trabajo	varchar(200) NOT NULL,
	Crecimiento_psicosocial	varchar(200) NOT NULL,
	Ambiciones_laborales	varchar(200) NOT NULL,
	Cambios_profesion	varchar(200) NOT NULL,
	Cuadro_familiar	varchar(200) NOT NULL,
	Relaciones_interpersonales	varchar(200) NOT NULL,
	Religion_paciente	varchar(200) NOT NULL,
	Recreacion_paciente	varchar(200) NOT NULL,
	Relaciones_sexos	varchar(200) NOT NULL,
	Eleccion_pareja	varchar(200) NOT NULL,
	Fiel_exigente	varchar(200) NOT NULL,
	Noviazgos	varchar(200) NOT NULL,
	Matrimonio	varchar(200) NOT NULL,
	Opinion_matrimonio	varchar(200) NOT NULL,
	Particularidades_boda	varchar(200) NOT NULL,
	Vida_matrimonial	varchar(200) NOT NULL,
	Separacion	varchar(200) NOT NULL,
	Divorcio	varchar(200) NOT NULL,
	Sistesis_problemas	text NOT NULL,
	user_id	integer NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS api_paciente_familiares (
	id	integer NOT NULL,
	paciente_id	bigint NOT NULL,
	familiar_id	bigint NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(familiar_id) REFERENCES api_familiar(id) DEFERRABLE INITIALLY DEFERRED,
	FOREIGN KEY(paciente_id) REFERENCES api_paciente(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS api_sumario_diagnostico (
	id	integer NOT NULL,
	Signos_sintomas	varchar(50) NOT NULL,
	Patologias	varchar(50) NOT NULL,
	Trastornos	varchar(50) NOT NULL,
	Nivel_afectacion	varchar(50) NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS api_tratamientos (
	id	integer NOT NULL,
	Tratamientos_fecha	date NOT NULL,
	Tratamientos_tipo	varchar(30) NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS auth_group (
	id	integer NOT NULL,
	name	varchar(150) NOT NULL UNIQUE,
	PRIMARY KEY(id AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS auth_group_permissions (
	id	integer NOT NULL,
	group_id	integer NOT NULL,
	permission_id	integer NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED,
	FOREIGN KEY(permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS auth_permission (
	id	integer NOT NULL,
	content_type_id	integer NOT NULL,
	codename	varchar(100) NOT NULL,
	name	varchar(255) NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS auth_user (
	id	integer NOT NULL,
	password	varchar(128) NOT NULL,
	last_login	datetime,
	is_superuser	bool NOT NULL,
	username	varchar(150) NOT NULL UNIQUE,
	last_name	varchar(150) NOT NULL,
	email	varchar(254) NOT NULL,
	is_staff	bool NOT NULL,
	is_active	bool NOT NULL,
	date_joined	datetime NOT NULL,
	first_name	varchar(150) NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS auth_user_groups (
	id	integer NOT NULL,
	user_id	integer NOT NULL,
	group_id	integer NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED,
	FOREIGN KEY(user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS auth_user_user_permissions (
	id	integer NOT NULL,
	user_id	integer NOT NULL,
	permission_id	integer NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED,
	FOREIGN KEY(user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS authtoken_token (
	key	varchar(40) NOT NULL,
	created	datetime NOT NULL,
	user_id	integer NOT NULL UNIQUE,
	PRIMARY KEY(key),
	FOREIGN KEY(user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS django_admin_log (
	id	integer NOT NULL,
	object_id	text,
	object_repr	varchar(200) NOT NULL,
	action_flag	smallint unsigned NOT NULL CHECK(action_flag >= 0),
	change_message	text NOT NULL,
	content_type_id	integer,
	user_id	integer NOT NULL,
	action_time	datetime NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT),
	FOREIGN KEY(content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED,
	FOREIGN KEY(user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE IF NOT EXISTS django_content_type (
	id	integer NOT NULL,
	app_label	varchar(100) NOT NULL,
	model	varchar(100) NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS django_migrations (
	id	integer NOT NULL,
	app	varchar(255) NOT NULL,
	name	varchar(255) NOT NULL,
	applied	datetime NOT NULL,
	PRIMARY KEY(id AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS django_session (
	session_key	varchar(40) NOT NULL,
	session_data	text NOT NULL,
	expire_date	datetime NOT NULL,
	PRIMARY KEY(session_key)
);
CREATE INDEX IF NOT EXISTS api_cita_Paciente_id_3b00ea81 ON api_cita (
	Paciente_id
);
CREATE INDEX IF NOT EXISTS api_cita_Tratamientos_cita_id_324e9785 ON api_cita_Tratamientos (
	cita_id
);
CREATE UNIQUE INDEX IF NOT EXISTS api_cita_Tratamientos_cita_id_tratamientos_id_b9205fc9_uniq ON api_cita_Tratamientos (
	cita_id,
	tratamientos_id
);
CREATE INDEX IF NOT EXISTS api_cita_Tratamientos_tratamientos_id_1fcc4b59 ON api_cita_Tratamientos (
	tratamientos_id
);
CREATE INDEX IF NOT EXISTS api_cita_baterias_id_716aa131 ON api_cita (
	baterias_id
);
CREATE INDEX IF NOT EXISTS api_cita_sumario_diagnostico_id_41900e17 ON api_cita (
	sumario_diagnostico_id
);
CREATE INDEX IF NOT EXISTS api_familiar_user1_id_cdfeca71 ON api_familiar (
	user1_id
);
CREATE INDEX IF NOT EXISTS api_familiar_user2_id_0ec90fdd ON api_familiar (
	user2_id
);
CREATE INDEX IF NOT EXISTS api_paciente_familiares_familiar_id_4edc8c20 ON api_paciente_familiares (
	familiar_id
);
CREATE INDEX IF NOT EXISTS api_paciente_familiares_paciente_id_225c6998 ON api_paciente_familiares (
	paciente_id
);
CREATE UNIQUE INDEX IF NOT EXISTS api_paciente_familiares_paciente_id_familiar_id_85e1eb87_uniq ON api_paciente_familiares (
	paciente_id,
	familiar_id
);
CREATE INDEX IF NOT EXISTS api_paciente_user_id_c85d1e65 ON api_paciente (
	user_id
);
CREATE INDEX IF NOT EXISTS auth_group_permissions_group_id_b120cbf9 ON auth_group_permissions (
	group_id
);
CREATE UNIQUE INDEX IF NOT EXISTS auth_group_permissions_group_id_permission_id_0cd325b0_uniq ON auth_group_permissions (
	group_id,
	permission_id
);
CREATE INDEX IF NOT EXISTS auth_group_permissions_permission_id_84c5c92e ON auth_group_permissions (
	permission_id
);
CREATE INDEX IF NOT EXISTS auth_permission_content_type_id_2f476e4b ON auth_permission (
	content_type_id
);
CREATE UNIQUE INDEX IF NOT EXISTS auth_permission_content_type_id_codename_01ab375a_uniq ON auth_permission (
	content_type_id,
	codename
);
CREATE INDEX IF NOT EXISTS auth_user_groups_group_id_97559544 ON auth_user_groups (
	group_id
);
CREATE INDEX IF NOT EXISTS auth_user_groups_user_id_6a12ed8b ON auth_user_groups (
	user_id
);
CREATE UNIQUE INDEX IF NOT EXISTS auth_user_groups_user_id_group_id_94350c0c_uniq ON auth_user_groups (
	user_id,
	group_id
);
CREATE INDEX IF NOT EXISTS auth_user_user_permissions_permission_id_1fbb5f2c ON auth_user_user_permissions (
	permission_id
);
CREATE INDEX IF NOT EXISTS auth_user_user_permissions_user_id_a95ead1b ON auth_user_user_permissions (
	user_id
);
CREATE UNIQUE INDEX IF NOT EXISTS auth_user_user_permissions_user_id_permission_id_14a6b632_uniq ON auth_user_user_permissions (
	user_id,
	permission_id
);
CREATE INDEX IF NOT EXISTS django_admin_log_content_type_id_c4bce8eb ON django_admin_log (
	content_type_id
);
CREATE INDEX IF NOT EXISTS django_admin_log_user_id_c564eba6 ON django_admin_log (
	user_id
);
CREATE UNIQUE INDEX IF NOT EXISTS django_content_type_app_label_model_76bd3d3b_uniq ON django_content_type (
	app_label,
	model
);
CREATE INDEX IF NOT EXISTS django_session_expire_date_a5c62663 ON django_session (
	expire_date
);

