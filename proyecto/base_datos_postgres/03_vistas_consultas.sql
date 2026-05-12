-- Vistas y consultas utiles para alimentar los paneles del prototipo.

BEGIN;

SET search_path TO admision, public;

CREATE OR REPLACE VIEW vw_aspirantes_resumen AS
SELECT
  a.id,
  a.uuid,
  a.folio,
  CONCAT_WS(' ', a.nombre, a.apellido_paterno, a.apellido_materno) AS nombre_completo,
  a.curp,
  a.correo,
  a.telefono,
  a.fecha_nacimiento,
  c.nombre AS carrera,
  c.clave AS carrera_clave,
  b.nombre AS bachillerato,
  a.promedio,
  a.estado,
  a.activo,
  pc.estatus AS pago_ceneval_estatus,
  pc.referencia AS pago_ceneval_referencia,
  rc.puntaje AS puntaje_ceneval,
  pi.estatus AS pago_inscripcion_estatus,
  pi.referencia AS pago_inscripcion_referencia,
  al.numero_control,
  g.clave AS grupo,
  a.creado_en,
  a.actualizado_en
FROM aspirantes a
JOIN carreras c ON c.id = a.carrera_interes_id
JOIN bachilleratos b ON b.id = a.bachillerato_id
LEFT JOIN pagos pc ON pc.aspirante_id = a.id AND pc.tipo = 'ceneval'
LEFT JOIN pagos pi ON pi.aspirante_id = a.id AND pi.tipo = 'inscripcion'
LEFT JOIN resultados_ceneval rc ON rc.aspirante_id = a.id
LEFT JOIN alumnos al ON al.aspirante_id = a.id
LEFT JOIN grupos g ON g.id = al.grupo_id;

CREATE OR REPLACE VIEW vw_admisiones_panel AS
SELECT
  id,
  folio,
  nombre_completo,
  curp,
  carrera,
  bachillerato,
  promedio,
  estado,
  activo,
  pago_ceneval_estatus,
  pago_ceneval_referencia,
  puntaje_ceneval
FROM vw_aspirantes_resumen;

CREATE OR REPLACE VIEW vw_inscripciones_panel AS
SELECT
  r.id,
  r.folio,
  r.nombre_completo,
  r.curp,
  r.carrera,
  r.estado,
  r.pago_inscripcion_estatus,
  r.pago_inscripcion_referencia,
  COUNT(ad.id) FILTER (WHERE dc.obligatorio) AS documentos_obligatorios,
  COUNT(ad.id) FILTER (WHERE dc.obligatorio AND ad.estatus = 'valido') AS documentos_validos,
  COUNT(ad.id) FILTER (WHERE dc.obligatorio AND ad.estatus = 'cargado') AS documentos_por_revisar,
  COUNT(ad.id) FILTER (WHERE dc.obligatorio AND ad.estatus = 'no_valido') AS documentos_observados,
  BOOL_AND(COALESCE(ad.estatus = 'valido', FALSE)) FILTER (WHERE dc.obligatorio) AS documentos_completos
FROM vw_aspirantes_resumen r
JOIN aspirantes a ON a.id = r.id
LEFT JOIN aspirante_documentos ad ON ad.aspirante_id = a.id
LEFT JOIN documentos_catalogo dc ON dc.id = ad.documento_id AND dc.activo = TRUE
WHERE r.estado IN (
  'aceptado',
  'documentos_pendientes',
  'documentos_cargados',
  'documentos_observados',
  'documentos_validados',
  'pendiente_pago_inscripcion',
  'pago_inscripcion_validado',
  'inscrito'
)
GROUP BY
  r.id,
  r.folio,
  r.nombre_completo,
  r.curp,
  r.carrera,
  r.estado,
  r.pago_inscripcion_estatus,
  r.pago_inscripcion_referencia;

CREATE OR REPLACE VIEW vw_director_academico_resumen_carrera AS
SELECT
  c.id AS carrera_id,
  c.clave AS carrera_clave,
  c.nombre AS carrera,
  COUNT(a.id) AS total_aspirantes,
  COUNT(a.id) FILTER (
    WHERE a.estado IN (
      'aceptado',
      'documentos_pendientes',
      'documentos_cargados',
      'documentos_observados',
      'documentos_validados',
      'pendiente_pago_inscripcion',
      'pago_inscripcion_validado',
      'inscrito'
    )
  ) AS total_aceptados,
  COUNT(a.id) FILTER (WHERE a.estado = 'inscrito') AS total_inscritos,
  c.cupo,
  CASE
    WHEN c.cupo IS NULL THEN NULL
    ELSE c.cupo - COUNT(a.id) FILTER (WHERE a.estado = 'inscrito')
  END AS cupo_disponible_estimado
FROM carreras c
LEFT JOIN aspirantes a ON a.carrera_interes_id = c.id
WHERE c.activa = TRUE
GROUP BY c.id, c.clave, c.nombre, c.cupo
ORDER BY c.nombre;

CREATE OR REPLACE VIEW vw_solicitudes_cambio_carrera AS
SELECT
  s.id,
  a.folio,
  CONCAT_WS(' ', a.nombre, a.apellido_paterno, a.apellido_materno) AS aspirante,
  origen.nombre AS carrera_origen,
  destino.nombre AS carrera_destino,
  s.motivo,
  s.estatus,
  s.respuesta,
  s.solicitada_en,
  s.resuelta_en,
  u.nombre_completo AS resuelta_por
FROM solicitudes_cambio_carrera s
JOIN aspirantes a ON a.id = s.aspirante_id
JOIN carreras origen ON origen.id = s.carrera_origen_id
JOIN carreras destino ON destino.id = s.carrera_destino_id
LEFT JOIN usuarios u ON u.id = s.resuelta_por;

CREATE OR REPLACE VIEW vw_documentos_plazos AS
SELECT
  a.folio,
  CONCAT_WS(' ', a.nombre, a.apellido_paterno, a.apellido_materno) AS aspirante,
  c.nombre AS carrera,
  dc.nombre AS documento,
  dc.tipo_archivo,
  dc.formatos_permitidos,
  ad.estatus,
  ad.fecha_limite,
  ad.prorroga_hasta,
  COALESCE(ad.prorroga_hasta, ad.fecha_limite) AS fecha_limite_real,
  CASE
    WHEN ad.estatus = 'valido' THEN 'validado'
    WHEN COALESCE(ad.prorroga_hasta, ad.fecha_limite) IS NULL THEN 'sin_fecha'
    WHEN COALESCE(ad.prorroga_hasta, ad.fecha_limite) < CURRENT_DATE THEN 'vencido'
    WHEN COALESCE(ad.prorroga_hasta, ad.fecha_limite) <= CURRENT_DATE + INTERVAL '15 days' THEN 'por_vencer'
    ELSE 'en_tiempo'
  END AS semaforo_plazo,
  ad.observacion,
  ad.motivo_prorroga
FROM aspirante_documentos ad
JOIN aspirantes a ON a.id = ad.aspirante_id
JOIN carreras c ON c.id = a.carrera_interes_id
JOIN documentos_catalogo dc ON dc.id = ad.documento_id
WHERE dc.obligatorio = TRUE
ORDER BY fecha_limite_real NULLS LAST, a.folio, dc.orden;

CREATE OR REPLACE VIEW vw_grupos_director_carrera AS
SELECT
  c.nombre AS carrera,
  g.clave AS grupo,
  g.capacidad,
  COUNT(al.id) AS alumnos_asignados,
  g.capacidad - COUNT(al.id) AS lugares_disponibles,
  STRING_AGG(
    CONCAT_WS(' ', a.nombre, a.apellido_paterno, a.apellido_materno),
    ', '
    ORDER BY a.apellido_paterno, a.apellido_materno, a.nombre
  ) AS alumnos
FROM grupos g
JOIN carreras c ON c.id = g.carrera_id
LEFT JOIN alumnos al ON al.grupo_id = g.id
LEFT JOIN aspirantes a ON a.id = al.aspirante_id
WHERE g.activo = TRUE
GROUP BY c.nombre, g.clave, g.capacidad
ORDER BY c.nombre, g.clave;

COMMIT;

-- Consultas de prueba:
--
-- 1. Buscar aspirantes por nombre, CURP, folio o carrera:
-- SELECT *
-- FROM admision.vw_admisiones_panel
-- WHERE LOWER(nombre_completo || ' ' || curp || ' ' || carrera || ' ' || folio)
--       LIKE LOWER('%contabilidad%');
--
-- 2. Ver aceptados para inscripciones:
-- SELECT * FROM admision.vw_inscripciones_panel;
--
-- 3. Ver resumen por carrera:
-- SELECT * FROM admision.vw_director_academico_resumen_carrera;
--
-- 4. Revisar documentos con prorroga o vencimiento:
-- SELECT * FROM admision.vw_documentos_plazos
-- WHERE semaforo_plazo IN ('vencido', 'por_vencer') OR prorroga_hasta IS NOT NULL;
--
-- 5. Probar si un aspirante puede inscribirse:
-- SELECT admision.fn_puede_inscribir(id), folio
-- FROM admision.aspirantes
-- ORDER BY id;
