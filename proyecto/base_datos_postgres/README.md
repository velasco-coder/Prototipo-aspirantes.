# Base de datos PostgreSQL - Sistema de admision UTeM

Esta carpeta prepara la base de datos para convertir el prototipo de `prueba/` en un sistema con persistencia real.

El prototipo actual guarda todo en memoria dentro de `app.js`; aqui se transforma ese modelo en tablas, relaciones, reglas, datos de prueba y vistas para PostgreSQL.

## Orden recomendado de ejecucion

Desde una terminal con `psql` instalado:

```bash
psql -U postgres -f proyecto/base_datos_postgres/00_crear_base_datos.sql
psql -U postgres -d utem_admisiones -f proyecto/base_datos_postgres/01_esquema.sql
psql -U postgres -d utem_admisiones -f proyecto/base_datos_postgres/02_datos_prueba.sql
psql -U postgres -d utem_admisiones -f proyecto/base_datos_postgres/03_vistas_consultas.sql
```

Si ya tienes la base creada en Render, Supabase, Neon, Railway u otro proveedor, omite `00_crear_base_datos.sql` y ejecuta desde `01_esquema.sql` sobre la base existente.

## Opcion local con Docker

Si no tienes PostgreSQL instalado, puedes levantar una base local con Docker:

```bash
cd proyecto/base_datos_postgres
docker compose up -d
```

Esto crea:

- PostgreSQL en `localhost:5432`;
- base `utem_admisiones`;
- usuario `utem`;
- contrasena `utem_dev_123`;
- Adminer en `http://localhost:8080`.

Al iniciar por primera vez, Docker ejecuta automaticamente `01_esquema.sql`, `02_datos_prueba.sql` y `03_vistas_consultas.sql`.

## Archivos

- `00_crear_base_datos.sql`: crea la base local `utem_admisiones`.
- `01_esquema.sql`: crea schema, tipos, tablas, llaves, indices, triggers y funciones principales.
- `02_datos_prueba.sql`: carga carreras, roles, usuarios mock, aspirantes, pagos, documentos, resultados y alumno inscrito.
- `03_vistas_consultas.sql`: crea vistas pensadas para los paneles del prototipo y deja consultas utiles de prueba.
- `MER.md`: explicacion del modelo entidad-relacion y diagrama Mermaid.
- `notas_integracion_backend.md`: como conectar esta base con un backend despues.
- `docker-compose.yml`: ambiente local opcional con PostgreSQL y Adminer.
- `conexion.env.example`: ejemplo de variables de entorno para backend.

## Entidades principales

- Periodo de admision
- Rol
- Usuario
- Carrera
- Bachillerato
- Aspirante
- Pago
- Resultado CENEVAL
- Documento requerido
- Documento del aspirante
- Solicitud de cambio de carrera
- Grupo
- Alumno
- Historial de estados
- Transicion de estado
- Auditoria de eventos

## Decisiones de diseno

1. El estado actual vive en `aspirantes.estado`.
2. El historial de cambios vive en `historial_estados`.
3. Los pagos CENEVAL e inscripcion usan una sola tabla `pagos` con campo `tipo`.
4. Los documentos obligatorios se separan en catalogo y documentos cargados por aspirante.
5. El catalogo documental distingue archivos tipo documento e imagen; esto permite manejar la foto del aspirante.
6. El certificado de bachillerato permite fecha limite y prorroga, porque en la practica algunas preparatorias lo entregan tarde.
7. Los archivos no se guardan como binarios en la base; se guardan nombre, ruta o URL del archivo.
8. Las contrasenas no deben guardarse en texto plano; el campo correcto es `contrasena_hash`.

## Documentos obligatorios seed

- Acta de nacimiento.
- Certificado de bachillerato.
- Comprobante de domicilio.
- Foto del aspirante.

## Credenciales seed

El seed incluye usuarios equivalentes al prototipo. Las contrasenas del prototipo se documentan solo para pruebas, pero en base real deben convertirse a hash con el backend.

| Rol | Correo de prueba |
| --- | --- |
| Aspirante | `aspirante@correo.com` |
| Admisiones | `admisiones@utem.edu.mx` |
| Inscripciones | `inscripciones@utem.edu.mx` |
| Director Academico | `director.academico@utem.edu.mx` |
| Director de Carrera | `director.carrera@utem.edu.mx` |

## Siguiente paso recomendado

Antes de conectar el frontend, conviene crear un backend pequeno con endpoints para:

- iniciar sesion;
- registrar aspirante;
- consultar panel por rol;
- generar/cargar/validar pagos;
- cargar/validar documentos;
- capturar CENEVAL;
- aceptar/no aceptar aspirante;
- dar de alta alumno.

La base ya queda preparada para ese paso.
