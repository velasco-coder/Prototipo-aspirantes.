# Despliegue en Render

Este modulo esta preparado para desplegarse en Render usando Docker.

## Archivos agregados

- `Dockerfile`: construye la imagen PHP/Laravel con NGINX.
- `deploy/nginx.conf`: configuracion del servidor web.
- `deploy/start.sh`: arranque de PHP-FPM y NGINX.
- `render.yaml`: Blueprint del modulo.
- `../render.yaml`: Blueprint en la raiz del repositorio para que Render lo detecte mas facil.

## Subir a GitHub

Desde la raiz del repositorio:

```powershell
git add render.yaml modulo-seguimiento-aspirantes
git commit -m "Preparar modulo de seguimiento para Render"
git push origin main
```

## Crear servicio en Render

1. Entrar a Render.
2. Ir a `New +`.
3. Elegir `Blueprint`.
4. Seleccionar el repositorio de GitHub.
5. Render debe detectar el archivo `render.yaml` de la raiz.
6. Crear el servicio.

Render creara:

- Un Web Service Docker.
- Una base de datos PostgreSQL.
- Variables de entorno para Laravel.
- Migraciones y datos de prueba mediante `preDeployCommand`.

## Despues del primer despliegue

Cuando Render te de la URL publica, entra al servicio y agrega la variable:

```text
APP_URL=https://tu-url-de-render.onrender.com
```

Luego redeploy.

## Credenciales de prueba

```text
Aspirante:
aspirante@utem.test
Aspirante123

Escolares:
escolares@utem.test
Escolares123
```

## Nota

El seeder es repetible para que el despliegue no falle si Render ejecuta migraciones y datos de prueba mas de una vez.
