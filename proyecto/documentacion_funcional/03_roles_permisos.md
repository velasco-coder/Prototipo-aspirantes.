# 03 - Roles Y Permisos

## Objetivo

Separar que puede hacer cada actor del sistema. Esto ayuda a definir menus, pantallas, permisos y responsabilidades.

## Roles principales

### Aspirante

Persona que quiere ingresar a TSU.

Permisos:

- Registrarse en el portal publico.
- Capturar datos personales.
- Capturar datos familiares.
- Capturar escuela de procedencia y promedio.
- Seleccionar carrera de interes.
- Consultar guia CENEVAL.
- Generar o imprimir ficha de pago CENEVAL.
- Subir comprobante de pago CENEVAL.
- Consultar carrera seleccionada.
- Consultar datos personales registrados.

### Aceptado / Nuevo Ingreso

Aspirante que fue seleccionado.

Permisos:

- Entrar al portal de aceptado.
- Completar informacion pendiente.
- Consultar resultados CENEVAL.
- Subir documentos de inscripcion.
- Imprimir ficha de pago de inscripcion.
- Solicitar cambio de carrera.
- Solicitar convenio de pago.
- Consultar estatus de documentos.
- Consultar horario cuando ya tenga grupo.

### Responsable de Admisiones

Usuario administrativo encargado del proceso de aspirantes y CENEVAL.

Permisos:

- Ver listado de aspirantes.
- Filtrar por nombre, matricula/folio, CURP, carrera o escuela.
- Agregar aspirante manualmente.
- Editar datos de aspirante.
- Activar o desactivar aspirantes.
- Revisar comprobantes de pago CENEVAL.
- Subir resultados CENEVAL por archivo.
- Capturar resultado CENEVAL individual.
- Marcar aspirantes como aceptados o no aceptados.
- Enviar o reenviar datos de acceso.

### Responsable de Inscripciones / Nuevo Ingreso

Usuario administrativo encargado de aceptados, documentos y alta de alumnos.

Permisos:

- Ver lista de aceptados.
- Filtrar por nombre, numero de control, carrera o escuela.
- Revisar documentos cargados.
- Marcar documento como valido o no valido.
- Registrar observaciones por documento.
- Agregar nuevo alumno manualmente.
- Registrar resultados CENEVAL si el alta es manual.
- Confirmar alta de alumno.
- Validar expediente completo.

### Director Academico

Rol que supervisa nuevo ingreso y decisiones academicas generales.

Permisos:

- Ver matricula proyectada por carrera.
- Ver aspirantes y datos generales.
- Ver lista de aceptados.
- Revisar solicitudes de cambio de carrera.
- Aceptar o rechazar cambios de carrera.
- Consultar grupos por carrera.
- Consultar integrantes de grupos.

### Director de Carrera

Rol que consulta aspirantes/aceptados de su carrera y apoya planeacion.

Permisos:

- Ver aspirantes de su carrera.
- Consultar datos generales de aspirantes.
- Ver aceptados de su carrera.
- Ver grupos de su carrera.
- Ver integrantes de grupo.
- Generar proyeccion de matricula.
- Proponer cantidad de grupos y alumnos por grupo.

### Servicios Escolares / Servicios Estudiantiles

Area institucional responsable del expediente y documentacion oficial.

Permisos:

- Publicar lista de aceptados.
- Validar cumplimiento de requisitos.
- Integrar expediente fisico/digital.
- Administrar reglas de inscripcion.
- Autorizar convenios de pago cuando aplique.

## Matriz resumida de permisos

| Funcion | Aspirante | Aceptado | Admisiones | Inscripciones | Dir. Academico | Dir. Carrera |
| --- | --- | --- | --- | --- | --- | --- |
| Registro inicial | Si | No | Si | No | Consulta | Consulta |
| Pago CENEVAL | Si | Consulta | Valida | No | Consulta | Consulta |
| Resultados CENEVAL | Consulta | Consulta | Captura | Consulta | Consulta | Consulta |
| Lista de aceptados | No | Consulta propia | Administra | Administra | Consulta | Consulta carrera |
| Documentos | No | Carga | Consulta | Valida | Consulta | Consulta |
| Pago inscripcion | No | Genera/consulta | No | Valida | Consulta | Consulta |
| Cambio de carrera | No | Solicita | Consulta | Consulta | Autoriza | Consulta |
| Alta alumno | No | No | No | Ejecuta | Consulta | Consulta |
| Grupos | No | Consulta si inscrito | No | Asigna/consulta | Consulta | Propone/consulta |

