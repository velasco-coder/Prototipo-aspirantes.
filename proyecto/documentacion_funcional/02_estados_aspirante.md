# 02 - Estados Del Aspirante

## Objetivo

Normalizar los estados para evitar que el sistema mezcle conceptos como aspirante, admitido, aceptado, inscrito, nuevo ingreso, alumno, matricula y numero de control.

## Estados propuestos

| Estado | Descripcion | Actor que lo provoca |
| --- | --- | --- |
| `registrado` | El aspirante completo el registro inicial. | Aspirante o Responsable de Admisiones |
| `datos_incompletos` | Falta informacion personal, familiar o escolar obligatoria. | Sistema |
| `pendiente_pago_ceneval` | Ya existe registro, pero falta pago CENEVAL. | Sistema |
| `pago_ceneval_cargado` | El aspirante subio comprobante CENEVAL. | Aspirante |
| `pago_ceneval_rechazado` | El comprobante CENEVAL fue rechazado. | Responsable de Admisiones |
| `pago_ceneval_validado` | El pago CENEVAL fue acreditado. | Responsable de Admisiones |
| `evaluacion_pendiente` | El aspirante esta listo para evaluacion, pero aun no hay resultado. | Sistema |
| `evaluado` | Ya se capturo resultado CENEVAL. | Responsable de Admisiones |
| `no_aceptado` | El aspirante no fue seleccionado. | Responsable de Admisiones |
| `aceptado` | El aspirante fue seleccionado para nuevo ingreso. | Responsable de Admisiones |
| `documentos_pendientes` | El aceptado aun no carga todos los documentos. | Sistema |
| `documentos_cargados` | El aceptado cargo documentos para revision. | Aceptado |
| `documentos_observados` | Uno o mas documentos fueron rechazados. | Responsable de Inscripciones |
| `documentos_validados` | Todos los documentos obligatorios fueron aprobados. | Responsable de Inscripciones |
| `pendiente_pago_inscripcion` | Falta generar, cargar o acreditar pago de inscripcion. | Sistema |
| `pago_inscripcion_validado` | El pago de inscripcion fue acreditado. | Responsable de Inscripciones/Finanzas |
| `inscrito` | El aceptado ya fue dado de alta como alumno. | Responsable de Inscripciones |
| `inactivo` | El registro fue desactivado administrativamente. | Responsable de Admisiones |

## Transicion principal

`registrado -> pendiente_pago_ceneval -> pago_ceneval_cargado -> pago_ceneval_validado -> evaluacion_pendiente -> evaluado -> aceptado -> documentos_pendientes -> documentos_cargados -> documentos_validados -> pendiente_pago_inscripcion -> pago_inscripcion_validado -> inscrito`

## Transiciones alternativas

- `pago_ceneval_cargado -> pago_ceneval_rechazado -> pendiente_pago_ceneval`
- `evaluado -> no_aceptado`
- `documentos_cargados -> documentos_observados -> documentos_pendientes`
- `registrado -> inactivo`
- `aceptado -> solicitud_cambio_carrera` como proceso paralelo, sin cambiar el estado base hasta que sea aprobado.

## Diferencia entre conceptos

| Concepto | Uso recomendado |
| --- | --- |
| Aspirante | Persona registrada que busca entrar a la universidad. |
| Aceptado | Aspirante seleccionado despues de evaluacion/resultados. |
| Admitido | Sinonimo operativo de aceptado; conviene usar solo `aceptado` en sistema. |
| Nuevo ingreso | Aceptado en etapa de inscripcion. |
| Alumno | Persona ya inscrita oficialmente. |
| Folio | Identificador de solicitud de admision. |
| Matricula/numero de control | Identificador academico del alumno inscrito. |

## Recomendacion tecnica

Usar un campo principal `estado_aspirante` y una bitacora de estados para auditoria:

- `estado_actual`
- `fecha_estado`
- `usuario_que_modifica`
- `comentario`
- `estado_anterior`
- `estado_nuevo`

