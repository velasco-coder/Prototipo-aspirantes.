# Analisis de la carpeta Aspirantes

## Proposito del documento

Este documento explica, de forma clara y ordenada, que contiene la carpeta original de Aspirantes, que debilidades se observan, que mejoras conviene hacer y como encaminar el material hacia un proyecto universitario entendible, defendible y posible de desarrollar.

La carpeta analizada es:

`Aspirantes-20260502T220828Z-3-001/Aspirantes`

## Resumen general

La carpeta contiene una base importante para construir un sistema de admision y nuevo ingreso. No es todavia un proyecto de software terminado, sino un conjunto de insumos de analisis: prototipos de pantallas, diagramas de flujo, diagramas de secuencia, un modelo E-R parcial y documentos oficiales del procedimiento `PRO-SES-01 Admision a TSU`.

El material permite entender la intencion del sistema: registrar aspirantes, administrar pagos CENEVAL, capturar resultados, determinar aceptados, validar documentos, generar pago de inscripcion y convertir aceptados en alumnos de nuevo ingreso.

Sin embargo, el contenido esta disperso. Hay procesos mezclados, nombres inconsistentes, reglas sin formalizar y pantallas que todavia parecen bocetos. Por eso, antes de desarrollar, conviene ordenar el proyecto y convertir los diagramas en una especificacion funcional clara.

## Contenido principal encontrado

### Diagramas y prototipos

- `Aspirantes`: pantallas del registro publico del aspirante y portal del aspirante.
- `aspirantesResponsable.drawio`: pantallas para el Responsable de Admisiones, listado de aspirantes, agregar aspirantes y carga de resultados CENEVAL.
- `Admitido.drawio`: pantallas del aceptado/admitido, documentos, cambio de carrera y pago de inscripcion.
- `responsableNuevoIngreso.drawio`: pantallas para revisar aceptados, validar documentos y agregar nuevo alumno.
- `DirectorAcademico_AdmisiionesInscripciones`: pantallas del Director Academico, aceptados, cambio de carrera y grupos.
- `DirectorCarrera_Admisiones`: pantallas del Director de Carrera, aspirantes por carrera, aceptados, grupos y proyeccion de matricula.
- `diagramaSecuencia`: secuencias para admisiones, aceptados/inscripciones y reinscripciones.
- `trayectoria_escolares.drawio`: flujo escolar mas amplio: admision, inscripcion, reinscripcion, bajas, convenios, culturales/deportivas y extraordinarios.

### Modelo de datos

El archivo `Diagrama E-R persona-Datos Personales.png` muestra una base de datos parcial centrada en persona:

- `cat_Personas`
- `cat_Aspirantes`
- `cat_Direcciones`
- `cat_Telefonos`
- `cat_Emails`
- `cat_familiares`
- `cat_TelefonosParientes`

Este modelo sirve como punto de partida, pero todavia no cubre todo el proceso operativo.

### Documentos oficiales

La carpeta `PRO-SES-01 ADMISION A TSU` contiene documentos del procedimiento oficial. El punto mas importante es que `PRO-SES-01_r1 Admision a TSU.docx` separa el proceso de admision del proceso de inscripcion. Esto debe tomarse en cuenta porque los diagramas si mezclan admision, aceptados e inscripcion.

## Lo que ya esta bien encaminado

El proyecto tiene varias fortalezas:

- Ya se identificaron actores importantes: aspirante, aceptado, responsable de admisiones, responsable de inscripciones, director academico, director de carrera y servicios escolares.
- Existen pantallas pensadas para cada rol.
- Hay una idea clara del flujo principal: registro, pago CENEVAL, resultados, aceptacion, documentos, pago de inscripcion y alta.
- Existe un primer modelo de datos para personas y aspirantes.
- Hay soporte documental institucional mediante el procedimiento `PRO-SES-01`.
- Los diagramas permiten reconstruir el proceso aunque todavia no esten listos como especificacion tecnica.

Estas fortalezas hacen que el proyecto sea aprovechable. No se parte de cero; lo que hace falta es ordenar, reducir alcance y formalizar reglas.

## Debilidades principales

### 1. Alcance demasiado amplio

La carpeta no solo habla de admision. Tambien incluye inscripcion, reinscripcion, baja de alumnos, convenios, actividades culturales y deportivas, extraordinarios, titulados, egresados, grupos y proyeccion de matricula.

Esto es demasiado para una primera version. Si se intenta construir todo, el proyecto puede volverse confuso, largo y dificil de terminar.

Mejora recomendada:

Definir un MVP enfocado solo en admision y nuevo ingreso:

`Registro de aspirante -> pago CENEVAL -> validacion CENEVAL -> resultado -> aceptacion -> documentos -> pago de inscripcion -> alta como alumno`

Los demas procesos deben quedar como fases futuras.

### 2. Diferencia entre procedimiento oficial y diagramas

El procedimiento oficial `PRO-SES-01` se enfoca en Admision a TSU. En cambio, varios diagramas incluyen inscripcion y nuevo ingreso.

Esto puede generar una contradiccion al presentar el proyecto: oficialmente se documenta una cosa, pero los prototipos muestran otra mas amplia.

Mejora recomendada:

Separar el proyecto en dos capas:

- Alcance oficial: Admision a TSU.
- Alcance funcional del sistema: Admision + Nuevo Ingreso.

En la documentacion universitaria se debe explicar que el sistema toma como base el procedimiento de admision, pero agrega modulos de seguimiento e inscripcion para completar el flujo digital.

### 3. Terminologia inconsistente

En los archivos aparecen terminos como:

- Aspirante
- Admitido
- Aceptado
- Nuevo ingreso
- Alumno
- Matricula
- Numero de control
- Folio

El problema es que no siempre queda claro si significan lo mismo o si representan etapas diferentes.

Mejora recomendada:

Crear un glosario oficial:

- Aspirante: persona registrada para participar en admision.
- Aceptado: aspirante seleccionado despues de evaluacion/resultados.
- Nuevo ingreso: aceptado en proceso de inscripcion.
- Alumno: persona ya inscrita oficialmente.
- Folio: identificador de solicitud.
- Numero de control: identificador academico del alumno.

Tambien se recomienda usar un solo termino en la interfaz. Por ejemplo, elegir `aceptado` y no alternar entre `admitido` y `aceptado`.

### 4. Falta una maquina de estados formal

Los diagramas muestran pantallas y acciones, pero no definen formalmente los estados por los que pasa un aspirante.

Sin estados claros, es dificil programar reglas como:

- Cuando puede subir comprobante.
- Cuando Admisiones puede capturar resultado.
- Cuando puede considerarse aceptado.
- Cuando puede subir documentos.
- Cuando puede darse de alta como alumno.

Mejora recomendada:

Definir una matriz de estados:

- `registrado`
- `pendiente_pago_ceneval`
- `pago_ceneval_cargado`
- `pago_ceneval_validado`
- `evaluado`
- `aceptado`
- `documentos_pendientes`
- `documentos_cargados`
- `documentos_validados`
- `pendiente_pago_inscripcion`
- `pago_inscripcion_validado`
- `inscrito`
- `rechazado`
- `inactivo`

Cada estado debe tener acciones permitidas, rol responsable y condicion para avanzar.

### 5. Reglas de negocio incompletas

Los diagramas dicen que se validan pagos, documentos y resultados, pero no explican las reglas exactas.

Ejemplos de reglas que faltan:

- Que documentos son obligatorios.
- Que tipos de archivo se aceptan.
- Que pasa si un documento es rechazado.
- Que puntaje CENEVAL permite aceptar a un aspirante.
- Si se puede aceptar manualmente a alguien.
- Si un aspirante puede cambiar de carrera antes o despues de ser aceptado.
- Quien autoriza el cambio de carrera.
- Cuando se genera numero de control.
- Si se permite duplicidad de CURP en diferentes periodos.

Mejora recomendada:

Crear un documento de reglas de negocio con formato:

- Codigo de regla.
- Descripcion.
- Actor responsable.
- Condicion.
- Resultado esperado.

Ejemplo:

`RN-01: No se puede capturar resultado CENEVAL si el pago CENEVAL no esta validado.`

### 6. Modelo de datos parcial

El modelo E-R actual es util para datos personales, pero no cubre procesos completos como pagos, documentos, resultados, solicitudes, usuarios, roles y grupos.

Mejora recomendada:

Extender el modelo con tablas como:

- `periodos`
- `carreras`
- `usuarios`
- `roles`
- `aspirantes`
- `aspirante_estados`
- `pagos`
- `resultados_ceneval`
- `documentos_aspirante`
- `solicitudes_cambio_carrera`
- `alumnos`
- `grupos`
- `grupo_alumnos`
- `archivos`

Tambien se deben definir llaves primarias, llaves foraneas, campos obligatorios, indices y valores permitidos.

### 7. Roles y permisos poco detallados

Los diagramas muestran varios roles, pero no definen permisos exactos.

Por ejemplo, falta diferenciar:

- Ver informacion.
- Crear registros.
- Editar registros.
- Validar pagos.
- Rechazar pagos.
- Validar documentos.
- Autorizar cambios de carrera.
- Exportar reportes.
- Desactivar usuarios.

Mejora recomendada:

Crear una matriz de permisos por rol:

| Funcion | Aspirante | Admisiones | Inscripciones | Director Academico | Director Carrera |
| --- | --- | --- | --- | --- | --- |
| Registrar aspirante | Si | Si | No | Consulta | Consulta |
| Validar CENEVAL | No | Si | No | Consulta | Consulta |
| Validar documentos | No | No | Si | Consulta | Consulta |
| Autorizar cambio carrera | No | Consulta | Consulta | Si | Consulta |
| Alta alumno | No | No | Si | Consulta | Consulta |

### 8. Pagos y documentos estan mezclados

En algunos diagramas, la ficha o comprobante de pago de inscripcion aparece como documento. En otros aparece como pago.

Esto puede causar problemas en la base de datos y en la logica.

Mejora recomendada:

Separar conceptos:

- Pago: referencia, monto, fecha, estado, validacion.
- Documento: archivo cargado, tipo, estado, observacion.

El comprobante de pago puede ser un archivo asociado a un pago, no necesariamente un documento academico del expediente.

### 9. Pantallas con errores de texto y baja consistencia

Hay errores visibles como:

- `Incorreta`
- `Nacimento`
- `Soliicitar`
- `Aspitantes`
- `CEVENAL`
- `Juistificacion`
- `Bachilleraro`
- `Preinsctibir`

Tambien hay nombres de paginas con errores o mezclas de idioma.

Mejora recomendada:

Hacer una revision de redaccion antes de pasar a desarrollo. En un proyecto universitario, la calidad textual importa porque comunica seriedad y cuidado.

### 10. Falta seguridad y privacidad

El sistema manejaria CURP, domicilios, telefonos, correos, documentos oficiales y datos familiares. Eso requiere un enfoque minimo de seguridad.

Mejora recomendada:

Definir:

- Autenticacion real.
- Recuperacion de contrasena.
- Roles y permisos.
- Auditoria de acciones.
- Proteccion de archivos.
- Control de acceso a documentos.
- Politica de baja logica.
- Historial de cambios.

### 11. Falta plan de pruebas

No se observan casos de prueba. Para un proyecto universitario, esto es clave para demostrar que el sistema funciona.

Mejora recomendada:

Crear pruebas por escenario:

- Registro correcto.
- Registro con CURP duplicada.
- Pago CENEVAL rechazado.
- Intento de capturar resultado sin pago validado.
- Aspirante aceptado.
- Aspirante no aceptado.
- Documento rechazado.
- Intento de alta sin documentos.
- Intento de alta sin pago.
- Alta correcta como alumno.
- Cambio de carrera aceptado.
- Cambio de carrera rechazado.

## Mejoras recomendadas para hacerlo entendible

Para que el proyecto sea facil de entender, se recomienda crear una documentacion en capas:

### 1. Documento de vision

Debe explicar en una pagina:

- Que problema resuelve.
- A quien ayuda.
- Que proceso digitaliza.
- Que queda dentro y fuera del alcance.

### 2. Alcance MVP

Debe definir exactamente que se construira primero. La recomendacion es:

- Registro de aspirantes.
- Portal del aspirante.
- Validacion CENEVAL.
- Resultados CENEVAL.
- Lista de aceptados.
- Carga y validacion de documentos.
- Pago de inscripcion.
- Alta como alumno.

### 3. Glosario

Debe normalizar palabras importantes:

- Aspirante.
- Aceptado.
- Alumno.
- Folio.
- Numero de control.
- Periodo.
- Carrera.
- Expediente.

### 4. Flujo principal

Debe mostrar el camino completo en texto y diagrama:

`Registro -> CENEVAL -> Resultado -> Aceptacion -> Documentos -> Inscripcion -> Alumno`

### 5. Matriz de estados

Debe decir que acciones se permiten en cada estado.

### 6. Historias de usuario

Cada modulo debe convertirse en historias de usuario con criterios de aceptacion.

Ejemplo:

`Como Responsable de Admisiones, quiero validar el comprobante CENEVAL de un aspirante para permitir que avance a evaluacion.`

Criterios:

- Solo se puede validar si existe comprobante cargado.
- Al validar, el estado cambia a `pago_ceneval_validado`.
- Se guarda usuario y fecha de validacion.

### 7. Modelo de datos

Debe pasar de un E-R parcial a un modelo completo del MVP.

### 8. Plan de pruebas

Debe demostrar que el sistema funciona y que bloquea acciones incorrectas.

## Recomendacion para proyecto universitario

La recomendacion principal es no presentar el proyecto como "todo el sistema escolar", porque eso seria demasiado amplio. Conviene presentarlo como:

`Sistema Web de Gestion de Aspirantes y Nuevo Ingreso para la Universidad Tecnologica de Manzanillo`

El objetivo seria:

Digitalizar y organizar el proceso de admision de aspirantes TSU, desde el registro inicial hasta el alta como alumno de nuevo ingreso, integrando seguimiento de pagos, resultados CENEVAL, validacion documental y control por roles.

## Fases sugeridas

### Fase 1: Analisis

- Revisar documentos oficiales.
- Identificar actores.
- Definir alcance.
- Crear glosario.
- Crear reglas de negocio.

### Fase 2: Diseno

- Diseñar base de datos.
- Diseñar pantallas principales.
- Definir estados.
- Definir permisos por rol.
- Definir flujos alternativos.

### Fase 3: Prototipo

- Construir prototipo sin base de datos.
- Validar flujo con datos simulados.
- Ajustar pantallas y reglas.

### Fase 4: Implementacion

- Crear backend.
- Crear frontend.
- Integrar base de datos.
- Implementar autenticacion.
- Implementar carga de archivos.

### Fase 5: Pruebas

- Probar flujo feliz.
- Probar errores y bloqueos.
- Probar permisos por rol.
- Probar reportes basicos.

### Fase 6: Documentacion final

- Manual de usuario.
- Manual tecnico.
- Diccionario de datos.
- Evidencias de pruebas.
- Conclusiones.

## Conclusion

La carpeta de Aspirantes tiene suficiente informacion para iniciar un buen proyecto universitario, pero necesita orden. El mayor riesgo no es tecnico; es de alcance y claridad. Hay muchas ideas juntas, pero todavia no estan convertidas en una especificacion unica.

La mejor ruta es reducir el alcance, definir estados, escribir reglas de negocio, limpiar terminologia y construir primero un MVP. Con eso, el proyecto se vuelve entendible, defendible y desarrollable.

Si se trabaja de esa manera, el resultado puede ser un sistema coherente para gestionar aspirantes y nuevo ingreso, con valor real para una universidad y con una estructura suficientemente clara para presentarse academicamente.

