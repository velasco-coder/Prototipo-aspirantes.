# 01 - Flujo Principal MVP

## Objetivo

Construir primero el flujo minimo completo que permita registrar aspirantes, evaluar su avance de admision, validar pagos/documentos y convertir a un aspirante aceptado en alumno de nuevo ingreso.

## Flujo MVP propuesto

1. Registro publico del aspirante
2. Generacion de acceso al portal
3. Solicitud/generacion de ficha de pago CENEVAL
4. Carga de comprobante de pago CENEVAL
5. Validacion del pago CENEVAL por Admisiones
6. Captura/carga de resultados CENEVAL
7. Publicacion o marcado de aspirante aceptado/no aceptado
8. Acceso del aceptado al portal de nuevo ingreso
9. Captura o correccion de datos personales, familiares y escolares
10. Carga de documentos de inscripcion
11. Validacion documental por Inscripciones
12. Generacion de ficha de pago de inscripcion
13. Validacion/conciliacion de pago de inscripcion
14. Alta del alumno de nuevo ingreso
15. Asignacion de carrera, grupo y numero de control definitivo

## Flujo textual

El aspirante entra al sitio publico de registro, selecciona una carrera de interes y captura datos personales, familiares y escolares. Al finalizar, el sistema crea el registro de aspirante, genera un identificador inicial y envia datos de acceso por correo.

Despues, el aspirante entra al portal, imprime o solicita la ficha de pago CENEVAL, realiza el pago y sube el comprobante. El Responsable de Admisiones revisa el comprobante y acredita o rechaza el pago. Si el pago se acredita, el aspirante queda habilitado para el proceso de evaluacion.

Cuando existen resultados CENEVAL, Admisiones los captura o carga por archivo. Con base en esos resultados y en las reglas institucionales, el aspirante puede quedar aceptado, no aceptado o pendiente.

El aspirante aceptado entra al portal de nuevo ingreso. Si tiene informacion incompleta, el sistema le pide completar datos personales, datos familiares, documentos y pago de inscripcion. El aceptado sube documentos como acta de nacimiento, certificado de bachillerato, comprobante de domicilio y ficha de pago de inscripcion.

El Responsable de Inscripciones valida cada documento. Si todos son validos y el pago de inscripcion fue acreditado, se genera el alta como alumno. Finalmente, se asigna carrera, grupo y numero de control definitivo.

## Entradas principales

- Convocatoria vigente
- Catalogo de carreras
- Catalogo de periodos
- Datos personales del aspirante
- Datos familiares
- Escuela de procedencia
- Comprobante de pago CENEVAL
- Resultado CENEVAL
- Documentos de inscripcion
- Comprobante o conciliacion de pago de inscripcion

## Salidas principales

- Registro de aspirante
- Cuenta de acceso
- Ficha de pago CENEVAL
- Pago CENEVAL validado
- Resultado CENEVAL registrado
- Aspirante aceptado/no aceptado
- Expediente digital
- Documentos validados/rechazados
- Ficha de pago de inscripcion
- Alumno de nuevo ingreso
- Grupo asignado

## Reglas iniciales

- Un aspirante debe pertenecer a un periodo de admision.
- Un aspirante debe seleccionar al menos una carrera de interes.
- El CURP debe ser unico cuando aplique a persona mexicana.
- No se debe permitir avanzar a resultados si el pago CENEVAL no esta validado.
- No se debe permitir alta como alumno si faltan documentos obligatorios.
- No se debe permitir alta como alumno si el pago de inscripcion no esta acreditado.
- Los cambios de carrera deben quedar como solicitudes, no como cambios directos automaticos.

## Fuera del MVP

- Reinscripcion
- Bajas temporales y definitivas
- Actividades culturales y deportivas
- Evaluacion de extraordinarios
- Titulados y egresados
- Convenios de pago avanzados
- Integracion masiva con IMSS

