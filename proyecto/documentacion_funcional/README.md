# Documentacion Funcional - Proyecto Aspirantes UTeM

Esta carpeta concentra la primera organizacion funcional del proyecto de aspirantes, tomando como base los diagramas Draw.io, el modelo E-R y el procedimiento `PRO-SES-01 Admision a TSU`.

## Orden recomendado de lectura

1. `01_flujo_mvp.md`: define el flujo principal que conviene construir primero.
2. `02_estados_aspirante.md`: normaliza los estados por los que pasa un aspirante.
3. `03_roles_permisos.md`: separa responsabilidades por rol.
4. `04_modulos_funcionales.md`: agrupa las pantallas y procesos en modulos.
5. `05_modelo_datos_inicial.md`: propone una base de datos inicial para implementar el MVP.

## Decision inicial

El primer alcance recomendable es un MVP de admision e inscripcion de nuevo ingreso:

`Registro de aspirante -> pago CENEVAL -> validacion de pago -> carga de resultados -> aceptacion -> carga de documentos -> validacion documental -> pago de inscripcion -> alta como alumno`

Los procesos de reinscripcion, bajas, actividades culturales/deportivas, extraordinarios y titulacion aparecen en los diagramas, pero quedan fuera del primer MVP salvo que se decida ampliar el alcance.

