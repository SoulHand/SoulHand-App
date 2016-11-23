
CREATE TABLE  persona (
  persona_cedula VARCHAR(11) NOT NULL,
  persona_nombre VARCHAR(25) NOT NULL,
  persona_apellido VARCHAR(25) NOT NULL,
  persona_telefono VARCHAR(15),
  persona_fecha_nacimiento DATE NOT NULL,
  persona_correo TEXT,
  persona_imagen bytea NULL,
  PRIMARY KEY (persona_cedula)
  );
CREATE TABLE usuario(
  persona_cedula VARCHAR(11) NOT NULL,
  usuario_nombre VARCHAR(25) NOT NULL,
  usuario_contrasena VARCHAR(32) NOT NULL,
  usuario_role VARCHAR(10) NOT NULL DEFAULT 'ALUMNO',
  PRIMARY KEY (persona_cedula),
  UNIQUE (usuario_nombre)
);
CREATE TABLE sesiones(
  persona_cedula VARCHAR(11) NOT NULL,
  sessiones_id VARCHAR(30) NOT NULL,
  sessiones_user_agent TEXT NOT NULL,
  sessiones_IP TEXT NOT NULL,
  sessiones_fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(persona_cedula,sessiones_id)
);
-- -----------------------------------------------------
-- Table mydb.parroquia
-- -----------------------------------------------------
CREATE TABLE  parroquia (
  parroquia_id SERIAL NOT NULL,
  parroquia_nombre VARCHAR(45) NOT NULL,
  PRIMARY KEY (parroquia_id),
  UNIQUE (parroquia_nombre)
);
-- -----------------------------------------------------
-- Table mydb.institucion
-- -----------------------------------------------------
CREATE TABLE  institucion (
  institucion_cod SERIAL NOT NULL,
  institucion_nombre VARCHAR(45) NOT NULL,
  institucion_direccion TEXT NULL,
  parroquia_parroquia_id INT NOT NULL,
  PRIMARY KEY (institucion_cod),
  UNIQUE (institucion_nombre)
);
-- -----------------------------------------------------
-- Table mydb.docente
-- -----------------------------------------------------
CREATE TABLE  docente (
  docente_cedula VARCHAR(11) NOT NULL,
  docente_instruccion TEXT NULL,
  docente_interprete TEXT NULL,
  PRIMARY KEY (docente_cedula)
);
-- -----------------------------------------------------
-- Table mydb.materia
-- -----------------------------------------------------
CREATE TABLE  materia (
  materia_cod SERIAL NOT NULL,
  materia_nombre VARCHAR(45) NOT NULL,
  PRIMARY KEY (materia_cod),
  UNIQUE (materia_nombre)
);
-- -----------------------------------------------------
-- Table mydb.alumno
-- -----------------------------------------------------
CREATE TABLE  alumno (
  alumno_cedula VARCHAR(11) NOT NULL,
  institucion_institucion_cod INT NOT NULL,
  grado_sordera VARCHAR(45) NULL,
  PRIMARY KEY (alumno_cedula, institucion_institucion_cod)
  )
;
-- -----------------------------------------------------
-- Table mydb.actividades
-- -----------------------------------------------------
CREATE TABLE  actividades (
  actividades_cod SERIAL NOT NULL,
  materia_materia_cod INT NOT NULL,
  actividades_nombre VARCHAR(45) NOT NULL,
  actividades_descripcion TEXT NOT NULL,
  actividades_fecha_creado TIMESTAMP NOT NULL,
  actividades_fecha_expiracion TIMESTAMP NULL,
  PRIMARY KEY (actividades_cod, materia_materia_cod)
  )
;
-- -----------------------------------------------------
-- Table mydb.actividades_alumno
-- -----------------------------------------------------
CREATE TABLE  actividades_alumno (
actividades_alumno SERIAL NOT NULL,
  actividades_cod INT NOT NULL,
  actividades_materia_cod INT NOT NULL,
  docente_cedula VARCHAR(11) NOT NULL,
  alumno_cedula VARCHAR(11) NOT NULL,
  alumno_institucion_cod INT NOT NULL,
  alumno_actividades_puntaje FLOAT NULL,
  alumno_actividades_video bytea NULL,
  alumno_actividades_formato TEXT NULL,
  alumno_actividades_fecha_creado TIMESTAMP NOT NULL,
  alumno_actividades_fecha_modificado TIMESTAMP NULL,
  alumno_fecha_completado TIMESTAMP NULL,
  PRIMARY KEY (actividades_alumno)
  )
;
-- -----------------------------------------------------
-- Table mydb.perfil_pedagogico
-- -----------------------------------------------------
CREATE TABLE  perfil_pedagogico (
  perfil_pedagogico_cod SERIAL NOT NULL,
  docente_docente_cedula VARCHAR(11) NOT NULL,
  alumno_alumno_cedula VARCHAR(11) NOT NULL,
  alumno_institucion_institucion_cod INT NOT NULL,
  actividades_alumno_actividades_cod INT NOT NULL,
  actividades_alumno_actividades_materia_cod INT NOT NULL,
  actividades_alumno_docente_cedula VARCHAR(11) NOT NULL,
  actividades_alumno_alumno_cedula VARCHAR(11) NOT NULL,
  actividades_alumno_alumno_institucion_cod INT NOT NULL,
  perfil_pedagogico_nombre VARCHAR(45) NOT NULL,
  perfil_pedagogico_description TEXT NOT NULL,
  perfil_pedagogico_scala_aprendizaje INT NOT NULL,
  PRIMARY KEY (perfil_pedagogico_cod) 
  )
;
