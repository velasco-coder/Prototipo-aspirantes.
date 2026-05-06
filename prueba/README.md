# Prototipo de prueba - Aspirantes UTeM

Aplicacion estatica para simular el flujo principal de admision:

`Registro -> pago CENEVAL -> validacion -> resultado -> aceptacion -> documentos -> pago inscripcion -> alta como alumno`

## Como ejecutarlo

1. Abre `index.html` en tu navegador.
2. Cambia de rol desde la barra superior.
3. Usa los datos mock incluidos para probar el flujo.

No usa base de datos, backend, APIs externas ni login real. Todos los cambios viven en memoria y se pierden al recargar la pagina.

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
- El pago de inscripcion esta separado de los documentos academicos.
- El registro valida CURP, correo, telefono, promedio y duplicidad de CURP.
- No se captura resultado CENEVAL si el pago CENEVAL no fue validado.
- No se genera ficha de inscripcion si los documentos obligatorios no estan validados.
- No se inscribe al alumno si faltan documentos validos.
- No se inscribe al alumno si falta pago de inscripcion validado.
- Los estados se muestran visualmente con badges.
- El cambio de rol no requiere autenticacion real.

## Mejoras aplicadas despues del analisis

- Se agregaron vistas compartidas: `Guia del proyecto`, `Matriz de estados` y `Reglas y permisos`.
- Se normalizaron conceptos como aspirante, aceptado, nuevo ingreso, alumno, folio y numero de control.
- Se reforzo el flujo de estados para que el prototipo sea mas entendible.
- Se documentaron dentro de la interfaz las reglas de negocio principales.
- Se mejoro la simulacion de inscripcion: primero documentos validos, luego pago de inscripcion y finalmente alta.
