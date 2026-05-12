# Notas para integrar backend

La base ya esta pensada para que el prototipo deje de usar datos en memoria. El siguiente paso no seria conectar el HTML directamente a PostgreSQL; lo correcto es crear un backend intermedio.

## Arquitectura recomendada

```text
Frontend prueba/ o nueva app
        |
        v
Backend API REST
        |
        v
PostgreSQL
```

## Endpoints minimos

| Metodo | Ruta | Proposito |
| --- | --- | --- |
| `POST` | `/auth/login` | Validar correo/contrasena y devolver sesion. |
| `POST` | `/aspirantes` | Registrar aspirante. |
| `GET` | `/aspirantes/:id` | Consultar expediente del aspirante. |
| `GET` | `/admisiones/aspirantes` | Lista filtrable para admisiones. |
| `POST` | `/aspirantes/:id/pagos/ceneval/generar` | Generar referencia CENEVAL. |
| `POST` | `/aspirantes/:id/pagos/ceneval/comprobante` | Registrar comprobante CENEVAL. |
| `POST` | `/aspirantes/:id/pagos/ceneval/validar` | Validar o rechazar pago CENEVAL. |
| `POST` | `/aspirantes/:id/ceneval` | Capturar resultado CENEVAL. |
| `POST` | `/aspirantes/:id/decision` | Marcar aceptado o no aceptado. |
| `GET` | `/inscripciones/aceptados` | Lista para revision documental. |
| `POST` | `/aspirantes/:id/documentos/:documentoId` | Registrar archivo/documento. |
| `POST` | `/aspirantes/:id/documentos/:documentoId/validar` | Validar, observar o prorrogar documento. |
| `POST` | `/aspirantes/:id/pagos/inscripcion/generar` | Generar ficha de inscripcion. |
| `POST` | `/aspirantes/:id/pagos/inscripcion/validar` | Validar pago de inscripcion. |
| `POST` | `/aspirantes/:id/alta` | Dar de alta como alumno. |

## Seguridad

- Usar `contrasena_hash`, nunca contrasena plana.
- Usar sesiones/JWT con expiracion.
- Validar permisos por rol en backend.
- Registrar acciones criticas en `auditoria_eventos`.
- Los archivos se suben a almacenamiento externo o carpeta controlada; en la base se guarda la ruta.

## Migracion desde el prototipo

1. Mantener el frontend actual como maqueta funcional.
2. Crear backend con conexion a PostgreSQL.
3. Reemplazar `Factory.applicants()` por llamadas a API.
4. Reemplazar mutaciones directas en memoria por peticiones `POST/PATCH`.
5. Probar rol por rol.
6. Finalmente, retirar credenciales mock del frontend.
