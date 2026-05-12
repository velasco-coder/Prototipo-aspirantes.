-- Esquema PostgreSQL para sistema de admision de aspirantes UTeM.
-- Ejecutar despues de crear/conectarse a la base:
-- psql -U postgres -d utem_admisiones -f proyecto/base_datos_postgres/01_esquema.sql

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE SCHEMA IF NOT EXISTS admision;
SET search_path TO admision, public;

DO $$
BEGIN
  CREATE TYPE admision.estado_aspirante AS ENUM (
    'registrado',
    'datos_incompletos',
    'pendiente_pago_ceneval',
    'pago_ceneval_cargado',
    'pago_ceneval_rechazado',
    'pago_ceneval_validado',
    'evaluacion_pendiente',
    'evaluado',
    'no_aceptado',
    'aceptado',
    'documentos_pendientes',
    'documentos_cargados',
    'documentos_observados',
    'documentos_validados',
    'pendiente_pago_inscripcion',
    'pago_inscripcion_validado',
    'inscrito',
    'inactivo'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE admision.tipo_pago AS ENUM ('ceneval', 'inscripcion');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE admision.estatus_pago AS ENUM (
    'pendiente',
    'generado',
    'comprobante_cargado',
    'validado',
    'rechazado'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE admision.estatus_documento AS ENUM (
    'pendiente',
    'cargado',
    'valido',
    'no_valido',
    'prorroga'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE admision.estatus_solicitud AS ENUM (
    'pendiente',
    'aceptada',
    'rechazada',
    'cancelada'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS periodos_admision (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  fecha_inicio_registro DATE NOT NULL,
  fecha_fin_registro DATE NOT NULL,
  fecha_limite_documentos DATE,
  fecha_limite_certificado DATE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_periodo_fechas CHECK (fecha_fin_registro >= fecha_inicio_registro),
  CONSTRAINT chk_periodo_documentos CHECK (
    fecha_limite_documentos IS NULL OR fecha_limite_documentos >= fecha_inicio_registro
  ),
  CONSTRAINT chk_periodo_certificado CHECK (
    fecha_limite_certificado IS NULL OR fecha_limite_certificado >= fecha_inicio_registro
  )
);

CREATE TABLE IF NOT EXISTS roles (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clave VARCHAR(40) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rol_id SMALLINT NOT NULL REFERENCES roles(id),
  correo VARCHAR(180) NOT NULL,
  contrasena_hash TEXT NOT NULL,
  nombre_completo VARCHAR(180) NOT NULL,
  tipo_acceso VARCHAR(30) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_acceso_en TIMESTAMPTZ,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_usuario_correo CHECK (correo ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  CONSTRAINT chk_usuario_tipo_acceso CHECK (tipo_acceso IN ('aspirante', 'institucional'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_usuarios_correo_lower ON usuarios (LOWER(correo));

CREATE TABLE IF NOT EXISTS carreras (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clave VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(160) NOT NULL UNIQUE,
  nivel VARCHAR(40) NOT NULL DEFAULT 'TSU',
  activa BOOLEAN NOT NULL DEFAULT TRUE,
  cupo INTEGER,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_carrera_cupo CHECK (cupo IS NULL OR cupo > 0)
);

CREATE TABLE IF NOT EXISTS bachilleratos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(180) NOT NULL UNIQUE,
  municipio VARCHAR(120),
  estado VARCHAR(120),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aspirantes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid UUID NOT NULL DEFAULT gen_random_uuid(),
  periodo_id BIGINT NOT NULL REFERENCES periodos_admision(id),
  usuario_id BIGINT UNIQUE REFERENCES usuarios(id),
  folio VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(80) NOT NULL,
  apellido_paterno VARCHAR(80) NOT NULL,
  apellido_materno VARCHAR(80) NOT NULL,
  curp CHAR(18) NOT NULL UNIQUE,
  correo VARCHAR(180) NOT NULL,
  telefono VARCHAR(10) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  carrera_interes_id BIGINT NOT NULL REFERENCES carreras(id),
  bachillerato_id BIGINT NOT NULL REFERENCES bachilleratos(id),
  promedio NUMERIC(4,2) NOT NULL,
  estado admision.estado_aspirante NOT NULL DEFAULT 'registrado',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_aspirantes_uuid UNIQUE (uuid),
  CONSTRAINT chk_aspirante_curp CHECK (curp ~ '^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9][0-9]$'),
  CONSTRAINT chk_aspirante_correo CHECK (correo ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  CONSTRAINT chk_aspirante_telefono CHECK (telefono ~ '^[0-9]{10}$'),
  CONSTRAINT chk_aspirante_promedio CHECK (promedio >= 0 AND promedio <= 10),
  CONSTRAINT chk_aspirante_fecha_nacimiento CHECK (fecha_nacimiento <= CURRENT_DATE)
);

CREATE INDEX IF NOT EXISTS ix_aspirantes_estado ON aspirantes (estado);
CREATE INDEX IF NOT EXISTS ix_aspirantes_carrera ON aspirantes (carrera_interes_id);
CREATE INDEX IF NOT EXISTS ix_aspirantes_periodo ON aspirantes (periodo_id);
CREATE INDEX IF NOT EXISTS ix_aspirantes_busqueda_nombre ON aspirantes USING gin (
  (LOWER(nombre || ' ' || apellido_paterno || ' ' || apellido_materno)) gin_trgm_ops
);
CREATE INDEX IF NOT EXISTS ix_aspirantes_busqueda_curp ON aspirantes USING gin (LOWER(curp) gin_trgm_ops);

CREATE TABLE IF NOT EXISTS pagos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  aspirante_id BIGINT NOT NULL REFERENCES aspirantes(id) ON DELETE CASCADE,
  tipo admision.tipo_pago NOT NULL,
  referencia VARCHAR(40),
  monto NUMERIC(10,2),
  comprobante_cargado BOOLEAN NOT NULL DEFAULT FALSE,
  comprobante_archivo_nombre VARCHAR(255),
  comprobante_url TEXT,
  estatus admision.estatus_pago NOT NULL DEFAULT 'pendiente',
  fecha_generacion TIMESTAMPTZ,
  fecha_carga TIMESTAMPTZ,
  fecha_validacion TIMESTAMPTZ,
  validado_por BIGINT REFERENCES usuarios(id),
  observacion TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_pagos_aspirante_tipo UNIQUE (aspirante_id, tipo),
  CONSTRAINT ux_pagos_referencia UNIQUE (referencia),
  CONSTRAINT chk_pago_monto CHECK (monto IS NULL OR monto >= 0),
  CONSTRAINT chk_pago_comprobante CHECK (
    comprobante_cargado = FALSE OR comprobante_archivo_nombre IS NOT NULL OR comprobante_url IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS ix_pagos_tipo_estatus ON pagos (tipo, estatus);
CREATE INDEX IF NOT EXISTS ix_pagos_aspirante ON pagos (aspirante_id);

CREATE TABLE IF NOT EXISTS resultados_ceneval (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  aspirante_id BIGINT NOT NULL UNIQUE REFERENCES aspirantes(id) ON DELETE CASCADE,
  puntaje INTEGER NOT NULL,
  capturado_por BIGINT REFERENCES usuarios(id),
  capturado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  observacion TEXT,
  CONSTRAINT chk_ceneval_puntaje CHECK (puntaje >= 0 AND puntaje <= 1300)
);

CREATE TABLE IF NOT EXISTS documentos_catalogo (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clave VARCHAR(80) NOT NULL UNIQUE,
  nombre VARCHAR(180) NOT NULL UNIQUE,
  descripcion TEXT,
  tipo_archivo VARCHAR(30) NOT NULL DEFAULT 'documento',
  formatos_permitidos VARCHAR(120),
  obligatorio BOOLEAN NOT NULL DEFAULT TRUE,
  permite_prorroga BOOLEAN NOT NULL DEFAULT FALSE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  orden INTEGER NOT NULL DEFAULT 1,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_documento_tipo_archivo CHECK (tipo_archivo IN ('documento', 'imagen'))
);

CREATE TABLE IF NOT EXISTS aspirante_documentos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  aspirante_id BIGINT NOT NULL REFERENCES aspirantes(id) ON DELETE CASCADE,
  documento_id BIGINT NOT NULL REFERENCES documentos_catalogo(id),
  estatus admision.estatus_documento NOT NULL DEFAULT 'pendiente',
  archivo_nombre VARCHAR(255),
  archivo_url TEXT,
  observacion TEXT,
  fecha_limite DATE,
  prorroga_hasta DATE,
  motivo_prorroga TEXT,
  cargado_en TIMESTAMPTZ,
  validado_en TIMESTAMPTZ,
  validado_por BIGINT REFERENCES usuarios(id),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_aspirante_documento UNIQUE (aspirante_id, documento_id),
  CONSTRAINT chk_documento_archivo CHECK (
    estatus IN ('pendiente', 'prorroga') OR archivo_nombre IS NOT NULL OR archivo_url IS NOT NULL
  ),
  CONSTRAINT chk_documento_prorroga CHECK (
    prorroga_hasta IS NULL OR fecha_limite IS NULL OR prorroga_hasta >= fecha_limite
  )
);

CREATE INDEX IF NOT EXISTS ix_aspirante_documentos_estatus ON aspirante_documentos (estatus);
CREATE INDEX IF NOT EXISTS ix_aspirante_documentos_aspirante ON aspirante_documentos (aspirante_id);
CREATE INDEX IF NOT EXISTS ix_aspirante_documentos_prorroga ON aspirante_documentos (prorroga_hasta);

CREATE TABLE IF NOT EXISTS solicitudes_cambio_carrera (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  aspirante_id BIGINT NOT NULL REFERENCES aspirantes(id) ON DELETE CASCADE,
  carrera_origen_id BIGINT NOT NULL REFERENCES carreras(id),
  carrera_destino_id BIGINT NOT NULL REFERENCES carreras(id),
  motivo TEXT NOT NULL,
  estatus admision.estatus_solicitud NOT NULL DEFAULT 'pendiente',
  respuesta TEXT,
  solicitada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resuelta_en TIMESTAMPTZ,
  resuelta_por BIGINT REFERENCES usuarios(id),
  CONSTRAINT chk_cambio_carrera_distinta CHECK (carrera_origen_id <> carrera_destino_id),
  CONSTRAINT chk_cambio_respuesta CHECK (
    estatus = 'pendiente' OR respuesta IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS ix_solicitudes_cambio_estatus ON solicitudes_cambio_carrera (estatus);

CREATE TABLE IF NOT EXISTS grupos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  periodo_id BIGINT NOT NULL REFERENCES periodos_admision(id),
  carrera_id BIGINT NOT NULL REFERENCES carreras(id),
  clave VARCHAR(30) NOT NULL,
  capacidad INTEGER NOT NULL DEFAULT 30,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_grupos_periodo_carrera_clave UNIQUE (periodo_id, carrera_id, clave),
  CONSTRAINT chk_grupo_capacidad CHECK (capacidad > 0)
);

CREATE TABLE IF NOT EXISTS alumnos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  aspirante_id BIGINT NOT NULL UNIQUE REFERENCES aspirantes(id),
  numero_control VARCHAR(20) NOT NULL UNIQUE,
  carrera_id BIGINT NOT NULL REFERENCES carreras(id),
  grupo_id BIGINT REFERENCES grupos(id),
  fecha_alta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dado_alta_por BIGINT REFERENCES usuarios(id),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS ix_alumnos_carrera ON alumnos (carrera_id);
CREATE INDEX IF NOT EXISTS ix_alumnos_grupo ON alumnos (grupo_id);

CREATE TABLE IF NOT EXISTS historial_estados (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  aspirante_id BIGINT NOT NULL REFERENCES aspirantes(id) ON DELETE CASCADE,
  estado_anterior admision.estado_aspirante,
  estado_nuevo admision.estado_aspirante NOT NULL,
  accion VARCHAR(120),
  usuario_id BIGINT REFERENCES usuarios(id),
  comentario TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_historial_estados_aspirante ON historial_estados (aspirante_id, creado_en DESC);

CREATE TABLE IF NOT EXISTS estado_transiciones (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  estado_origen admision.estado_aspirante NOT NULL,
  accion VARCHAR(140) NOT NULL,
  estado_destino admision.estado_aspirante NOT NULL,
  rol_responsable VARCHAR(80) NOT NULL,
  condicion TEXT,
  activa BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT ux_estado_transicion UNIQUE (estado_origen, accion, estado_destino)
);

CREATE TABLE IF NOT EXISTS auditoria_eventos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id BIGINT REFERENCES usuarios(id),
  aspirante_id BIGINT REFERENCES aspirantes(id) ON DELETE SET NULL,
  evento VARCHAR(120) NOT NULL,
  detalle JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_origen INET,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_auditoria_usuario ON auditoria_eventos (usuario_id, creado_en DESC);
CREATE INDEX IF NOT EXISTS ix_auditoria_aspirante ON auditoria_eventos (aspirante_id, creado_en DESC);

CREATE OR REPLACE FUNCTION admision.fn_set_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION admision.fn_registrar_historial_estado()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.estado IS DISTINCT FROM NEW.estado THEN
    INSERT INTO admision.historial_estados (
      aspirante_id,
      estado_anterior,
      estado_nuevo,
      accion,
      comentario
    )
    VALUES (
      NEW.id,
      OLD.estado,
      NEW.estado,
      'cambio_estado',
      'Cambio registrado automaticamente por la base de datos'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION admision.fn_actualizar_estado_documental(p_aspirante_id BIGINT)
RETURNS VOID AS $$
DECLARE
  v_estado_actual admision.estado_aspirante;
  v_total_obligatorios INTEGER;
  v_total_validos INTEGER;
  v_total_revisables INTEGER;
  v_total_rechazados INTEGER;
BEGIN
  SELECT estado INTO v_estado_actual
  FROM admision.aspirantes
  WHERE id = p_aspirante_id;

  IF v_estado_actual IS NULL THEN
    RETURN;
  END IF;

  IF v_estado_actual NOT IN (
    'aceptado',
    'documentos_pendientes',
    'documentos_cargados',
    'documentos_observados',
    'documentos_validados'
  ) THEN
    RETURN;
  END IF;

  SELECT
    COUNT(*) FILTER (WHERE dc.obligatorio),
    COUNT(*) FILTER (WHERE dc.obligatorio AND ad.estatus = 'valido'),
    COUNT(*) FILTER (WHERE dc.obligatorio AND ad.estatus IN ('cargado', 'valido', 'no_valido')),
    COUNT(*) FILTER (WHERE dc.obligatorio AND ad.estatus = 'no_valido')
  INTO
    v_total_obligatorios,
    v_total_validos,
    v_total_revisables,
    v_total_rechazados
  FROM admision.documentos_catalogo dc
  LEFT JOIN admision.aspirante_documentos ad
    ON ad.documento_id = dc.id
    AND ad.aspirante_id = p_aspirante_id
  WHERE dc.activo = TRUE
    AND dc.obligatorio = TRUE;

  IF v_total_obligatorios = 0 THEN
    RETURN;
  END IF;

  IF v_total_rechazados > 0 THEN
    UPDATE admision.aspirantes
    SET estado = 'documentos_observados'
    WHERE id = p_aspirante_id;
  ELSIF v_total_validos = v_total_obligatorios THEN
    UPDATE admision.aspirantes
    SET estado = 'documentos_validados'
    WHERE id = p_aspirante_id;
  ELSIF v_total_revisables = v_total_obligatorios THEN
    UPDATE admision.aspirantes
    SET estado = 'documentos_cargados'
    WHERE id = p_aspirante_id;
  ELSE
    UPDATE admision.aspirantes
    SET estado = 'documentos_pendientes'
    WHERE id = p_aspirante_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION admision.fn_sync_documentos_estado()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.estatus = 'pendiente' THEN
    RETURN NEW;
  END IF;

  PERFORM admision.fn_actualizar_estado_documental(NEW.aspirante_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION admision.fn_puede_inscribir(p_aspirante_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  v_docs_ok BOOLEAN;
  v_pago_ok BOOLEAN;
  v_no_inscrito BOOLEAN;
BEGIN
  SELECT NOT EXISTS (
    SELECT 1
    FROM admision.documentos_catalogo dc
    LEFT JOIN admision.aspirante_documentos ad
      ON ad.documento_id = dc.id
      AND ad.aspirante_id = p_aspirante_id
    WHERE dc.activo = TRUE
      AND dc.obligatorio = TRUE
      AND COALESCE(ad.estatus, 'pendiente') <> 'valido'
  )
  INTO v_docs_ok;

  SELECT EXISTS (
    SELECT 1
    FROM admision.pagos
    WHERE aspirante_id = p_aspirante_id
      AND tipo = 'inscripcion'
      AND estatus = 'validado'
  )
  INTO v_pago_ok;

  SELECT NOT EXISTS (
    SELECT 1
    FROM admision.alumnos
    WHERE aspirante_id = p_aspirante_id
  )
  INTO v_no_inscrito;

  RETURN COALESCE(v_docs_ok, FALSE)
     AND COALESCE(v_pago_ok, FALSE)
     AND COALESCE(v_no_inscrito, FALSE);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION admision.fn_alta_alumno(
  p_aspirante_id BIGINT,
  p_usuario_id BIGINT DEFAULT NULL,
  p_grupo_id BIGINT DEFAULT NULL,
  p_numero_control VARCHAR DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
  v_alumno_id BIGINT;
  v_aspirante admision.aspirantes%ROWTYPE;
  v_numero_control VARCHAR(20);
BEGIN
  IF admision.fn_puede_inscribir(p_aspirante_id) IS NOT TRUE THEN
    RAISE EXCEPTION 'No se puede inscribir: faltan documentos validos, pago de inscripcion validado o ya existe alumno.';
  END IF;

  SELECT * INTO v_aspirante
  FROM admision.aspirantes
  WHERE id = p_aspirante_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aspirante % no existe.', p_aspirante_id;
  END IF;

  v_numero_control := COALESCE(
    p_numero_control,
    '2026' || LPAD(v_aspirante.id::TEXT, 4, '0')
  );

  INSERT INTO admision.alumnos (
    aspirante_id,
    numero_control,
    carrera_id,
    grupo_id,
    dado_alta_por
  )
  VALUES (
    v_aspirante.id,
    v_numero_control,
    v_aspirante.carrera_interes_id,
    p_grupo_id,
    p_usuario_id
  )
  RETURNING id INTO v_alumno_id;

  UPDATE admision.aspirantes
  SET estado = 'inscrito',
      activo = TRUE
  WHERE id = p_aspirante_id;

  INSERT INTO admision.auditoria_eventos (usuario_id, aspirante_id, evento, detalle)
  VALUES (
    p_usuario_id,
    p_aspirante_id,
    'alta_alumno',
    jsonb_build_object('numero_control', v_numero_control)
  );

  RETURN v_alumno_id;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_periodos_actualizado_en ON periodos_admision;
CREATE TRIGGER trg_periodos_actualizado_en
BEFORE UPDATE ON periodos_admision
FOR EACH ROW EXECUTE FUNCTION admision.fn_set_actualizado_en();

DROP TRIGGER IF EXISTS trg_usuarios_actualizado_en ON usuarios;
CREATE TRIGGER trg_usuarios_actualizado_en
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION admision.fn_set_actualizado_en();

DROP TRIGGER IF EXISTS trg_carreras_actualizado_en ON carreras;
CREATE TRIGGER trg_carreras_actualizado_en
BEFORE UPDATE ON carreras
FOR EACH ROW EXECUTE FUNCTION admision.fn_set_actualizado_en();

DROP TRIGGER IF EXISTS trg_bachilleratos_actualizado_en ON bachilleratos;
CREATE TRIGGER trg_bachilleratos_actualizado_en
BEFORE UPDATE ON bachilleratos
FOR EACH ROW EXECUTE FUNCTION admision.fn_set_actualizado_en();

DROP TRIGGER IF EXISTS trg_aspirantes_actualizado_en ON aspirantes;
CREATE TRIGGER trg_aspirantes_actualizado_en
BEFORE UPDATE ON aspirantes
FOR EACH ROW EXECUTE FUNCTION admision.fn_set_actualizado_en();

DROP TRIGGER IF EXISTS trg_aspirantes_historial_estado ON aspirantes;
CREATE TRIGGER trg_aspirantes_historial_estado
AFTER UPDATE OF estado ON aspirantes
FOR EACH ROW EXECUTE FUNCTION admision.fn_registrar_historial_estado();

DROP TRIGGER IF EXISTS trg_pagos_actualizado_en ON pagos;
CREATE TRIGGER trg_pagos_actualizado_en
BEFORE UPDATE ON pagos
FOR EACH ROW EXECUTE FUNCTION admision.fn_set_actualizado_en();

DROP TRIGGER IF EXISTS trg_documentos_catalogo_actualizado_en ON documentos_catalogo;
CREATE TRIGGER trg_documentos_catalogo_actualizado_en
BEFORE UPDATE ON documentos_catalogo
FOR EACH ROW EXECUTE FUNCTION admision.fn_set_actualizado_en();

DROP TRIGGER IF EXISTS trg_aspirante_documentos_actualizado_en ON aspirante_documentos;
CREATE TRIGGER trg_aspirante_documentos_actualizado_en
BEFORE UPDATE ON aspirante_documentos
FOR EACH ROW EXECUTE FUNCTION admision.fn_set_actualizado_en();

DROP TRIGGER IF EXISTS trg_aspirante_documentos_sync_estado ON aspirante_documentos;
CREATE TRIGGER trg_aspirante_documentos_sync_estado
AFTER INSERT OR UPDATE OF estatus ON aspirante_documentos
FOR EACH ROW EXECUTE FUNCTION admision.fn_sync_documentos_estado();

DROP TRIGGER IF EXISTS trg_grupos_actualizado_en ON grupos;
CREATE TRIGGER trg_grupos_actualizado_en
BEFORE UPDATE ON grupos
FOR EACH ROW EXECUTE FUNCTION admision.fn_set_actualizado_en();

COMMIT;
