# Guia para subir este prototipo a GitHub y Render

Esta carpeta `prueba` contiene todo lo necesario para publicar el prototipo como sitio estatico.

No necesita base de datos, backend, autenticacion, variables de entorno ni comando de instalacion.

## Archivos que se deben subir

Sube estos archivos a GitHub:

```txt
prueba/
  index.html
  styles.css
  app.js
  README.md
  DEPLOY_GITHUB_RENDER.md
  render.yaml
```

Si vas a subir solo el prototipo, lo mas limpio es crear un repositorio donde estos archivos queden en la raiz:

```txt
index.html
styles.css
app.js
README.md
DEPLOY_GITHUB_RENDER.md
render.yaml
```

Si vas a subir todo el proyecto completo, tambien funciona, pero en Render tendras que indicar que la carpeta publica es `prueba`.

## Opcion recomendada: subir solo la carpeta `prueba`

1. Crea un repositorio nuevo en GitHub, por ejemplo:

```txt
aspirantes-utem-prueba
```

2. Copia el contenido de esta carpeta `prueba` dentro del repositorio.

3. Ejecuta estos comandos desde la carpeta donde quedo el prototipo:

```powershell
git init
git branch -M main
git add .
git commit -m "Publicar prototipo de admision UTeM"
git remote add origin https://github.com/TU_USUARIO/aspirantes-utem-prueba.git
git push -u origin main
```

Reemplaza `TU_USUARIO` por tu usuario real de GitHub.

## Opcion alternativa: subir todo el proyecto completo

Si quieres subir todo lo que esta en `C:\Curso\Aspirantes_proyecto_UTeM`, usa:

```powershell
cd C:\Curso\Aspirantes_proyecto_UTeM
git add .
git commit -m "Preparar prototipo para despliegue"
git remote add origin https://github.com/TU_USUARIO/aspirantes-utem.git
git push -u origin main
```

Si ya existe el remoto `origin`, usa:

```powershell
git remote set-url origin https://github.com/TU_USUARIO/aspirantes-utem.git
git push -u origin main
```

## Configuracion manual en Render

En Render crea un nuevo servicio:

```txt
New -> Static Site
```

Conecta tu repositorio de GitHub y usa esta configuracion:

### Si subiste solo la carpeta `prueba` como repositorio

```txt
Name: aspirantes-utem-prueba
Branch: main
Root Directory: dejar vacio
Build Command: dejar vacio
Publish Directory: .
```

### Si subiste todo el proyecto completo

```txt
Name: aspirantes-utem-prueba
Branch: main
Root Directory: prueba
Build Command: dejar vacio
Publish Directory: .
```

## Configuracion con Blueprint

Tambien puedes usar el archivo `render.yaml` incluido en esta carpeta.

Si subiste solo la carpeta `prueba` como repositorio, Render puede leer directamente:

```txt
render.yaml
```

Si subiste todo el proyecto completo y el archivo esta dentro de `prueba`, en Render selecciona:

```txt
New -> Blueprint
Blueprint Path: prueba/render.yaml
```

Si Render te pide ruta de publicacion manualmente, usa:

```txt
Publish Directory: prueba
```

o si marcaste `Root Directory` como `prueba`, usa:

```txt
Publish Directory: .
```

## Credenciales

No pongas tokens, contrasenas ni credenciales dentro del codigo.

Para hacer `git push`, GitHub normalmente pide:

```txt
Usuario: tu usuario de GitHub
Password: Personal Access Token de GitHub
```

Tambien puede abrirse Git Credential Manager para iniciar sesion desde el navegador.

## Comprobacion rapida antes de subir

Desde esta carpeta puedes verificar que los archivos principales existan:

```powershell
dir
```

Debe aparecer:

```txt
index.html
styles.css
app.js
README.md
DEPLOY_GITHUB_RENDER.md
render.yaml
```

Para probarlo localmente, abre `index.html` en el navegador.

