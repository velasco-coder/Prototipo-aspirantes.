-- Datos de prueba equivalentes al prototipo local.
-- Este archivo reinicia datos del schema admision; usar solo en ambiente de prueba.

BEGIN;

SET search_path TO admision, public;

TRUNCATE TABLE
  auditoria_eventos,
  historial_estados,
  alumnos,
  grupos,
  solicitudes_cambio_carrera,
  aspirante_documentos,
  documentos_catalogo,
  resultados_ceneval,
  pagos,
  aspirantes,
  usuarios,
  bachilleratos,
  carreras,
  roles,
  periodos_admision,
  estado_transiciones
RESTART IDENTITY CASCADE;

INSERT INTO roles (clave, nombre, descripcion)
VALUES
  ('aspirante', 'Aspirante', 'Persona registrada para participar en el proceso de admision.'),
  ('admisiones', 'Responsable de Admisiones', 'Valida pago CENEVAL, captura resultados y decide aceptacion.'),
  ('inscripciones', 'Responsable de Inscripciones', 'Valida documentos, pago de inscripcion y alta de alumno.'),
  ('director_academico', 'Director Academico', 'Consulta resumen general y resuelve cambios de carrera.'),
  ('director_carrera', 'Director de Carrera', 'Consulta aspirantes, aceptados y grupos de una carrera.');

INSERT INTO periodos_admision (
  nombre,
  descripcion,
  fecha_inicio_registro,
  fecha_fin_registro,
  fecha_limite_documentos,
  fecha_limite_certificado,
  activo
)
VALUES (
  'Admision 2026',
  'Periodo de prueba basado en el prototipo de aspirantes UTeM.',
  DATE '2026-05-01',
  DATE '2026-08-31',
  DATE '2026-09-15',
  DATE '2026-12-10',
  TRUE
);

INSERT INTO carreras (clave, nombre, nivel, cupo)
VALUES
  ('CNT', 'TSU en Contabilidad', 'TSU', 60),
  ('QAI', 'TSU en Quimica Area Industrial', 'TSU', 60),
  ('TID', 'TSU en Tecnologias de la Informacion', 'TSU', 90),
  ('GAS', 'TSU en Gastronomia', 'TSU', 60),
  ('MMP', 'TSU en Mantenimiento', 'TSU', 60),
  ('ERE', 'TSU en Energias Renovables', 'TSU', 60),
  ('LCS', 'TSU en Logistica', 'TSU', 60);

INSERT INTO bachilleratos (nombre, municipio, estado)
VALUES
  ('CBTis 226', 'Manzanillo', 'Colima'),
  ('Prepa UDG 12', 'Guadalajara', 'Jalisco'),
  ('CBTis 156 Cihuatlan', 'Cihuatlan', 'Jalisco'),
  ('Bachillerato Tecnico 8', 'Manzanillo', 'Colima');

INSERT INTO documentos_catalogo (clave, nombre, descripcion, tipo_archivo, formatos_permitidos, obligatorio, permite_prorroga, orden)
VALUES
  ('acta_nacimiento', 'Acta de nacimiento', 'Documento oficial de identidad del aspirante.', 'documento', 'PDF', TRUE, FALSE, 1),
  ('certificado_bachillerato', 'Certificado de bachillerato', 'Documento academico final; puede tener prorroga cuando el bachillerato no lo entrega a tiempo.', 'documento', 'PDF', TRUE, TRUE, 2),
  ('comprobante_domicilio', 'Comprobante de domicilio', 'Documento de referencia domiciliaria.', 'documento', 'PDF', TRUE, FALSE, 3),
  ('foto_aspirante', 'Foto del aspirante', 'Fotografia para expediente, identificacion interna o credencial.', 'imagen', 'JPG, PNG', TRUE, FALSE, 4);

INSERT INTO usuarios (rol_id, correo, contrasena_hash, nombre_completo, tipo_acceso)
SELECT r.id, d.correo, d.contrasena_hash, d.nombre_completo, d.tipo_acceso
FROM (
  VALUES
    ('aspirante', 'aspirante@correo.com', 'mock_hash_Aspirante123', 'Carlos Emiliano Torres Salgado', 'aspirante'),
    ('admisiones', 'admisiones@utem.edu.mx', 'mock_hash_Admisiones123', 'Responsable de Admisiones', 'institucional'),
    ('inscripciones', 'inscripciones@utem.edu.mx', 'mock_hash_Inscripciones123', 'Responsable de Inscripciones', 'institucional'),
    ('director_academico', 'director.academico@utem.edu.mx', 'mock_hash_Academico123', 'Director Academico', 'institucional'),
    ('director_carrera', 'director.carrera@utem.edu.mx', 'mock_hash_Carrera123', 'Director de Carrera', 'institucional')
) AS d(rol_clave, correo, contrasena_hash, nombre_completo, tipo_acceso)
JOIN roles r ON r.clave = d.rol_clave;

INSERT INTO estado_transiciones (estado_origen, accion, estado_destino, rol_responsable, condicion)
VALUES
  ('registrado', 'Generar ficha CENEVAL', 'pendiente_pago_ceneval', 'Aspirante', 'Aspirante activo y sin referencia CENEVAL'),
  ('pendiente_pago_ceneval', 'Subir comprobante CENEVAL', 'pago_ceneval_cargado', 'Aspirante', 'Existe referencia CENEVAL'),
  ('pago_ceneval_cargado', 'Validar pago CENEVAL', 'evaluacion_pendiente', 'Responsable de Admisiones', 'Comprobante revisado y aceptado'),
  ('pago_ceneval_cargado', 'Rechazar pago CENEVAL', 'pago_ceneval_rechazado', 'Responsable de Admisiones', 'Comprobante incorrecto'),
  ('evaluacion_pendiente', 'Capturar puntaje CENEVAL', 'evaluado', 'Responsable de Admisiones', 'Pago CENEVAL validado'),
  ('evaluado', 'Aceptar aspirante', 'aceptado', 'Responsable de Admisiones', 'Cumple criterio de aceptacion'),
  ('evaluado', 'No aceptar aspirante', 'no_aceptado', 'Responsable de Admisiones', 'No cumple criterio de aceptacion'),
  ('aceptado', 'Subir documentos', 'documentos_pendientes', 'Aspirante', 'Inicia expediente documental'),
  ('documentos_pendientes', 'Completar carga documental', 'documentos_cargados', 'Aspirante', 'Todos los documentos obligatorios tienen archivo o revision'),
  ('documentos_cargados', 'Validar documentos', 'documentos_validados', 'Responsable de Inscripciones', 'Todos los documentos son validos'),
  ('documentos_cargados', 'Observar documentos', 'documentos_observados', 'Responsable de Inscripciones', 'Al menos un documento no es valido'),
  ('documentos_validados', 'Generar ficha de inscripcion', 'pendiente_pago_inscripcion', 'Aspirante', 'Documentos obligatorios validados'),
  ('pendiente_pago_inscripcion', 'Validar pago inscripcion', 'pago_inscripcion_validado', 'Responsable de Inscripciones', 'Comprobante de inscripcion aceptado'),
  ('pago_inscripcion_validado', 'Dar de alta alumno', 'inscrito', 'Responsable de Inscripciones', 'Documentos validos y pago validado');

INSERT INTO aspirantes (
  periodo_id,
  usuario_id,
  folio,
  nombre,
  apellido_paterno,
  apellido_materno,
  curp,
  correo,
  telefono,
  fecha_nacimiento,
  carrera_interes_id,
  bachillerato_id,
  promedio,
  estado,
  activo
)
SELECT
  p.id,
  u.id,
  d.folio,
  d.nombre,
  d.apellido_paterno,
  d.apellido_materno,
  d.curp,
  d.correo,
  d.telefono,
  d.fecha_nacimiento,
  c.id,
  b.id,
  d.promedio,
  d.estado::admision.estado_aspirante,
  d.activo
FROM (
  VALUES
    ('aspirante@correo.com', 'ASP-2026-0001', 'Carlos Emiliano', 'Torres', 'Salgado', 'TOSC060918HCMRLR08', 'carlos.torres@correo.com', '3147788899', DATE '2006-09-18', 'TSU en Contabilidad', 'CBTis 226', 8.70, 'pago_ceneval_cargado', TRUE),
    (NULL, 'ASP-2026-0002', 'Abigail', 'De la Cruz', 'Solano', 'CUSA060415MCMRLB05', 'abigail.solano@correo.com', '3145552211', DATE '2006-04-15', 'TSU en Tecnologias de la Informacion', 'Prepa UDG 12', 9.30, 'aceptado', TRUE),
    (NULL, 'ASP-2026-0003', 'Juan Pedro', 'Guerra', 'Glez', 'GUGJ060211HCMRZN09', 'juan.guerra@correo.com', '3149876543', DATE '2006-02-11', 'TSU en Quimica Area Industrial', 'CBTis 156 Cihuatlan', 8.10, 'documentos_cargados', TRUE),
    (NULL, 'ASP-2026-0004', 'Sofia', 'Mendoza', 'Rios', 'MERS060721MCMNFF04', 'sofia.mendoza@correo.com', '3144449988', DATE '2006-07-21', 'TSU en Gastronomia', 'Bachillerato Tecnico 8', 7.80, 'inscrito', TRUE)
) AS d(usuario_correo, folio, nombre, apellido_paterno, apellido_materno, curp, correo, telefono, fecha_nacimiento, carrera, bachillerato, promedio, estado, activo)
JOIN periodos_admision p ON p.nombre = 'Admision 2026'
LEFT JOIN usuarios u ON u.correo = d.usuario_correo
JOIN carreras c ON c.nombre = d.carrera
JOIN bachilleratos b ON b.nombre = d.bachillerato;

INSERT INTO historial_estados (aspirante_id, estado_anterior, estado_nuevo, accion, comentario)
SELECT id, NULL, estado, 'estado_inicial', 'Estado inicial cargado por seed de prueba.'
FROM aspirantes;

INSERT INTO pagos (
  aspirante_id,
  tipo,
  referencia,
  monto,
  comprobante_cargado,
  comprobante_archivo_nombre,
  estatus,
  fecha_generacion,
  fecha_carga,
  fecha_validacion,
  validado_por
)
SELECT
  a.id,
  d.tipo::admision.tipo_pago,
  d.referencia,
  d.monto,
  d.comprobante_cargado,
  d.comprobante_archivo_nombre,
  d.estatus::admision.estatus_pago,
  d.fecha_generacion,
  d.fecha_carga,
  d.fecha_validacion,
  u.id
FROM (
  VALUES
    ('ASP-2026-0001', 'ceneval', 'CEN-0001', 650.00, TRUE, 'ceneval-0001.pdf', 'comprobante_cargado', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days', NULL, NULL),
    ('ASP-2026-0002', 'ceneval', 'CEN-0002', 650.00, TRUE, 'ceneval-0002.pdf', 'validado', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days', 'admisiones@utem.edu.mx'),
    ('ASP-2026-0003', 'ceneval', 'CEN-0003', 650.00, TRUE, 'ceneval-0003.pdf', 'validado', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', 'admisiones@utem.edu.mx'),
    ('ASP-2026-0004', 'ceneval', 'CEN-0004', 650.00, TRUE, 'ceneval-0004.pdf', 'validado', NOW() - INTERVAL '18 days', NOW() - INTERVAL '17 days', NOW() - INTERVAL '16 days', 'admisiones@utem.edu.mx'),
    ('ASP-2026-0001', 'inscripcion', NULL, NULL, FALSE, NULL, 'pendiente', NULL, NULL, NULL, NULL),
    ('ASP-2026-0002', 'inscripcion', NULL, NULL, FALSE, NULL, 'pendiente', NULL, NULL, NULL, NULL),
    ('ASP-2026-0003', 'inscripcion', NULL, NULL, FALSE, NULL, 'pendiente', NULL, NULL, NULL, NULL),
    ('ASP-2026-0004', 'inscripcion', 'INS-0004', 1800.00, TRUE, 'inscripcion-0004.pdf', 'validado', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days', 'inscripciones@utem.edu.mx')
) AS d(folio, tipo, referencia, monto, comprobante_cargado, comprobante_archivo_nombre, estatus, fecha_generacion, fecha_carga, fecha_validacion, validado_por_correo)
JOIN aspirantes a ON a.folio = d.folio
LEFT JOIN usuarios u ON u.correo = d.validado_por_correo;

INSERT INTO resultados_ceneval (aspirante_id, puntaje, capturado_por, capturado_en)
SELECT a.id, d.puntaje, u.id, NOW() - INTERVAL '10 days'
FROM (
  VALUES
    ('ASP-2026-0002', 1006),
    ('ASP-2026-0003', 950),
    ('ASP-2026-0004', 890)
) AS d(folio, puntaje)
JOIN aspirantes a ON a.folio = d.folio
LEFT JOIN usuarios u ON u.correo = 'admisiones@utem.edu.mx';

INSERT INTO aspirante_documentos (
  aspirante_id,
  documento_id,
  estatus,
  archivo_nombre,
  observacion,
  fecha_limite,
  prorroga_hasta,
  motivo_prorroga,
  cargado_en,
  validado_en,
  validado_por
)
SELECT
  a.id,
  dc.id,
  CASE
    WHEN a.folio = 'ASP-2026-0004' THEN 'valido'
    WHEN a.folio = 'ASP-2026-0003' THEN 'cargado'
    WHEN a.folio = 'ASP-2026-0002' AND dc.clave = 'certificado_bachillerato' THEN 'prorroga'
    ELSE 'pendiente'
  END::admision.estatus_documento,
  CASE
    WHEN a.folio IN ('ASP-2026-0003', 'ASP-2026-0004')
      THEN REPLACE(dc.clave, '_', '-') || '-' || a.id || CASE WHEN dc.tipo_archivo = 'imagen' THEN '.jpg' ELSE '.pdf' END
    ELSE NULL
  END,
  CASE
    WHEN a.folio = 'ASP-2026-0002' AND dc.clave = 'certificado_bachillerato'
      THEN 'Prorroga por entrega tardia del certificado por parte del bachillerato.'
    ELSE NULL
  END,
  CASE
    WHEN dc.clave = 'certificado_bachillerato' THEN DATE '2026-12-10'
    ELSE DATE '2026-09-15'
  END,
  CASE
    WHEN a.folio = 'ASP-2026-0002' AND dc.clave = 'certificado_bachillerato'
      THEN DATE '2027-01-31'
    ELSE NULL
  END,
  CASE
    WHEN a.folio = 'ASP-2026-0002' AND dc.clave = 'certificado_bachillerato'
      THEN 'La preparatoria aun no libera certificados oficiales.'
    ELSE NULL
  END,
  CASE
    WHEN a.folio IN ('ASP-2026-0003', 'ASP-2026-0004') THEN NOW() - INTERVAL '6 days'
    ELSE NULL
  END,
  CASE
    WHEN a.folio = 'ASP-2026-0004' THEN NOW() - INTERVAL '5 days'
    ELSE NULL
  END,
  CASE
    WHEN a.folio = 'ASP-2026-0004' THEN u.id
    ELSE NULL
  END
FROM aspirantes a
CROSS JOIN documentos_catalogo dc
LEFT JOIN usuarios u ON u.correo = 'inscripciones@utem.edu.mx'
WHERE dc.activo = TRUE;

INSERT INTO solicitudes_cambio_carrera (
  aspirante_id,
  carrera_origen_id,
  carrera_destino_id,
  motivo,
  estatus
)
SELECT
  a.id,
  origen.id,
  destino.id,
  'Deseo cambiar al area financiera por afinidad con mi bachillerato.',
  'pendiente'
FROM aspirantes a
JOIN carreras origen ON origen.id = a.carrera_interes_id
JOIN carreras destino ON destino.nombre = 'TSU en Contabilidad'
WHERE a.folio = 'ASP-2026-0002';

INSERT INTO grupos (periodo_id, carrera_id, clave, capacidad)
SELECT p.id, c.id, d.clave_grupo, 30
FROM (
  VALUES
    ('TSU en Contabilidad', '1CNT1'),
    ('TSU en Contabilidad', '1CNT2'),
    ('TSU en Quimica Area Industrial', '1QAI1'),
    ('TSU en Quimica Area Industrial', '1QAI2'),
    ('TSU en Tecnologias de la Informacion', '1TID1'),
    ('TSU en Tecnologias de la Informacion', '1TID2'),
    ('TSU en Gastronomia', '1GAS1'),
    ('TSU en Gastronomia', '1GAS2'),
    ('TSU en Mantenimiento', '1MMP1'),
    ('TSU en Energias Renovables', '1ERE1'),
    ('TSU en Logistica', '1LCS1')
) AS d(carrera, clave_grupo)
JOIN periodos_admision p ON p.nombre = 'Admision 2026'
JOIN carreras c ON c.nombre = d.carrera;

INSERT INTO alumnos (aspirante_id, numero_control, carrera_id, grupo_id, dado_alta_por)
SELECT a.id, '20260004', a.carrera_interes_id, g.id, u.id
FROM aspirantes a
JOIN grupos g ON g.clave = '1GAS1'
LEFT JOIN usuarios u ON u.correo = 'inscripciones@utem.edu.mx'
WHERE a.folio = 'ASP-2026-0004';

INSERT INTO auditoria_eventos (usuario_id, aspirante_id, evento, detalle)
SELECT u.id, a.id, 'seed_datos_prueba', jsonb_build_object('folio', a.folio, 'estado', a.estado)
FROM aspirantes a
LEFT JOIN usuarios u ON u.correo = 'admisiones@utem.edu.mx';

COMMIT;
