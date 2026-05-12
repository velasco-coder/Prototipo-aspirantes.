# Prototipo de prueba - Aspirantes UTeM

Aplicacion estatica para simular el flujo principal de admision:

`Registro -> pago CENEVAL -> validacion -> resultado -> aceptacion -> documentos -> pago inscripcion -> alta como alumno`

## Como ejecutarlo

1. Abre `index.html` en tu navegador.
2. Inicia sesion con alguna cuenta de prueba.
3. Usa los datos mock incluidos para probar el flujo.

No usa base de datos, backend, APIs externas ni autenticacion real. El inicio de sesion es simulado con credenciales mock dentro del codigo. Todos los cambios viven en memoria y se pierden al recargar la pagina.

## Credenciales de prueba

| Tipo de acceso | Correo | Contrasena | Panel |
| --- | --- | --- | --- |
| Aspirante | `aspirante@correo.com` | `Aspirante123` | Panel del aspirante |
| Institucional | `admisiones@utem.edu.mx` | `Admisiones123` | Responsable de Admisiones |
| Institucional | `inscripciones@utem.edu.mx` | `Inscripciones123` | Responsable de Inscripciones |
| Institucional | `director.academico@utem.edu.mx` | `Academico123` | Director Academico |
| Institucional | `director.carrera@utem.edu.mx` | `Carrera123` | Director de Carrera |

## Como subirlo a GitHub y Render

La guia completa esta en `DEPLOY_GITHUB_RENDER.md`.

Para Render, este prototipo se publica como `Static Site`. No requiere comando de build. Si subes solo esta carpeta como repositorio, usa:

```txt
Build Command: dejar vacio
Publish Directory: .
```

Si subes todo el proyecto completo, en Render usa:

```txt
Root Directory: prueba
Build Command: dejar vacio
Publish Directory: .
```

Si la pagina se ve sin diseno en celular, revisa que Render este sirviendo `styles.css`. Abre `/styles.css` en tu URL de Render; si no aparece codigo CSS, corrige `Root Directory` a `prueba`.

## Archivos

- `index.html`: entrada de la aplicacion.
- `styles.css`: estilos del prototipo.
- `app.js`: datos mock, reglas de negocio y renderizado.
- `DEPLOY_GITHUB_RENDER.md`: pasos para subir a GitHub y publicar en Render.
- `render.yaml`: configuracion opcional para Render Blueprint.

## Roles simulados

- Aspirante
- Responsable de Admisiones
- Responsable de Inscripciones
- Director Academico
- Director de Carrera

## Reglas implementadas

- La aplicacion incluye una guia del proyecto, glosario y matriz de estados.
- El prototipo inicia con acceso separado para aspirante e institucional.
- El aspirante solo consulta el expediente asociado a su sesion; ya no ve la lista completa de aspirantes.
- El pago de inscripcion esta separado de los documentos academicos.
- Los documentos requeridos incluyen acta, certificado, comprobante de domicilio y foto del aspirante.
- El registro valida CURP, correo, telefono, promedio y duplicidad de CURP.
- Las acciones criticas muestran confirmacion antes de reiniciar datos, enviar cambio de carrera, aceptar/no aceptar, desactivar aspirantes o validar pagos.
- No se captura resultado CENEVAL si el pago CENEVAL no fue validado.
- No se genera ficha de inscripcion si los documentos obligatorios no estan validados.
- No se inscribe al alumno si faltan documentos validos.
- No se inscribe al alumno si falta pago de inscripcion validado.
- Los estados se muestran visualmente con badges.
- El rol se asigna segun la cuenta mock usada en el login simulado.

## Mejoras aplicadas despues del analisis

- Se agregaron vistas compartidas: `Guia del proyecto`, `Matriz de estados` y `Reglas y permisos`.
- Se agrego una pantalla inicial de acceso aspirante/institucional.
- Se acoto el menu del aspirante a `Registro` y `Panel del aspirante`.
- Se agregaron vistas previas simuladas para documentos y comprobante de inscripcion.
- Se normalizaron conceptos como aspirante, aceptado, nuevo ingreso, alumno, folio y numero de control.
- Se reforzo el flujo de estados para que el prototipo sea mas entendible.
- Se documentaron dentro de la interfaz las reglas de negocio principales.
- Se mejoro la simulacion de inscripcion: primero documentos validos, luego pago de inscripcion y finalmente alta.
