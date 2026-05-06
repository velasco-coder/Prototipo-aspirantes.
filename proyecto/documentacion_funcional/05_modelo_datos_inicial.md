# 05 - Modelo De Datos Inicial

## Objetivo

Proponer una base de datos inicial para construir el MVP sin perder relacion con el modelo E-R existente de personas, aspirantes, telefonos, correos, direcciones y familiares.

## Principios

- Separar datos de persona de datos de aspirante.
- Usar catalogos para carrera, periodo, estado civil, sexo, tipo de telefono y tipo de documento.
- Guardar historico de estados.
- Guardar documentos como registros con archivo, estatus y observacion.
- No convertir a alumno hasta tener documentos y pago de inscripcion validados.

## Tablas base

### personas

Representa a cualquier persona registrada.

Campos sugeridos:

- `id`
- `nombre`
- `apellido_paterno`
- `apellido_materno`
- `sexo`
- `estado_civil`
- `fecha_nacimiento`
- `lugar_nacimiento_id`
- `nacionalidad`
- `curp`
- `rfc`
- `foto_id`
- `activo`
- `created_at`
- `updated_at`

Reglas:

- `curp` debe ser unico si existe.
- `apellido_paterno` y `apellido_materno` pueden ser nulos segun caso.
- `activo` permite baja logica.

### aspirantes

Representa la solicitud de admision.

Campos sugeridos:

- `id`
- `folio`
- `persona_id`
- `periodo_id`
- `carrera_interes_id`
- `escuela_procedencia_id`
- `promedio_bachillerato`
- `estado_actual`
- `fecha_registro`
- `created_at`
- `updated_at`

Reglas:

- Una persona puede tener varias solicitudes en distintos periodos, pero no deberia duplicarse en el mismo periodo.
- `folio` debe ser unico.
- `estado_actual` debe estar controlado por catalogo o enum.

### aspirante_estados

Bitacora de cambios de estado.

Campos sugeridos:

- `id`
- `aspirante_id`
- `estado_anterior`
- `estado_nuevo`
- `comentario`
- `usuario_id`
- `created_at`

### direcciones

Campos sugeridos:

- `id`
- `persona_id`
- `calle`
- `numero_exterior`
- `numero_interior`
- `codigo_postal`
- `localidad_id`
- `municipio`
- `estado`
- `created_at`
- `updated_at`

### telefonos

Campos sugeridos:

- `id`
- `persona_id`
- `numero`
- `tipo`
- `extension`
- `principal`
- `created_at`
- `updated_at`

### emails

Campos sugeridos:

- `id`
- `persona_id`
- `email`
- `tipo`
- `principal`
- `verificado`
- `created_at`
- `updated_at`

### familiares

Campos sugeridos:

- `id`
- `aspirante_id`
- `nombre`
- `apellido_paterno`
- `apellido_materno`
- `parentesco`
- `calle`
- `numero_exterior`
- `numero_interior`
- `municipio`
- `estado`
- `created_at`
- `updated_at`

### familiar_telefonos

Campos sugeridos:

- `id`
- `familiar_id`
- `numero`
- `tipo`
- `extension`
- `created_at`
- `updated_at`

## Tablas de proceso

### pagos

Campos sugeridos:

- `id`
- `aspirante_id`
- `tipo_pago`
- `referencia`
- `monto`
- `estatus`
- `archivo_comprobante_id`
- `fecha_generacion`
- `fecha_pago`
- `fecha_validacion`
- `validado_por_usuario_id`
- `observacion`
- `created_at`
- `updated_at`

Valores sugeridos para `tipo_pago`:

- `ceneval`
- `inscripcion`
- `extraordinario`
- `convenio`

Valores sugeridos para `estatus`:

- `generado`
- `comprobante_cargado`
- `validado`
- `rechazado`
- `cancelado`

### resultados_ceneval

Campos sugeridos:

- `id`
- `aspirante_id`
- `puntaje`
- `archivo_resultado_id`
- `capturado_por_usuario_id`
- `fecha_captura`
- `observacion`
- `created_at`
- `updated_at`

### documentos_aspirante

Campos sugeridos:

- `id`
- `aspirante_id`
- `tipo_documento_id`
- `archivo_id`
- `estatus`
- `observacion`
- `validado_por_usuario_id`
- `fecha_carga`
- `fecha_validacion`
- `created_at`
- `updated_at`

Valores sugeridos para `estatus`:

- `pendiente`
- `cargado`
- `valido`
- `no_valido`

### solicitudes_cambio_carrera

Campos sugeridos:

- `id`
- `aspirante_id`
- `carrera_origen_id`
- `carrera_destino_id`
- `motivo`
- `estatus`
- `respuesta`
- `resuelto_por_usuario_id`
- `fecha_solicitud`
- `fecha_resolucion`
- `created_at`
- `updated_at`

Valores sugeridos para `estatus`:

- `pendiente`
- `aceptada`
- `rechazada`
- `cancelada`

### alumnos

Campos sugeridos:

- `id`
- `persona_id`
- `aspirante_id`
- `numero_control`
- `periodo_ingreso_id`
- `carrera_id`
- `grupo_id`
- `estatus`
- `fecha_alta`
- `created_at`
- `updated_at`

Reglas:

- Solo se crea cuando el aspirante esta listo para inscripcion.
- `numero_control` debe ser unico.
- `aspirante_id` permite rastrear de que solicitud nacio el alumno.

### grupos

Campos sugeridos:

- `id`
- `periodo_id`
- `carrera_id`
- `clave`
- `capacidad`
- `turno`
- `created_at`
- `updated_at`

### grupo_alumnos

Campos sugeridos:

- `id`
- `grupo_id`
- `alumno_id`
- `fecha_asignacion`
- `usuario_id`
- `created_at`

## Catalogos minimos

- `periodos`
- `carreras`
- `escuelas_procedencia`
- `tipos_documento`
- `usuarios`
- `roles`
- `usuario_roles`
- `archivos`
- `ciudades`
- `localidades`

## Documentos obligatorios iniciales

- Acta de nacimiento
- Certificado de bachillerato
- Comprobante de domicilio
- Ficha/comprobante de pago de inscripcion

## Diagrama logico resumido

`personas 1--N aspirantes`

`personas 1--N direcciones`

`personas 1--N telefonos`

`personas 1--N emails`

`aspirantes 1--N familiares`

`familiares 1--N familiar_telefonos`

`aspirantes 1--N pagos`

`aspirantes 1--N documentos_aspirante`

`aspirantes 1--1 resultados_ceneval`

`aspirantes 1--N solicitudes_cambio_carrera`

`aspirantes 1--0/1 alumnos`

`grupos 1--N grupo_alumnos`

`alumnos 1--N grupo_alumnos`

