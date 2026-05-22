# Modulo Seguimiento Aspirantes

Modulo complementario para apoyar el proceso de aspirantes de UTeM sin reemplazar las paginas existentes de SIIUTEM.

## Objetivo

Centralizar el seguimiento previo a CENEVAL:

- Aviso para realizar el tramite desde computadora.
- Enlaces a registro y ficha CENEVAL de SIIUTEM.
- Control del pago de admision de $630.
- Advertencia de numeros rojos en el concepto de pago.
- Carga simulada de documentos.
- Revision, observacion, prevalidacion y validacion por Escolares.
- Registro simulado del correo de indicaciones para CENEVAL.

## Ejecutar localmente

```bash
composer install
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8001
```

Abrir:

```text
http://127.0.0.1:8001/login
```

## Credenciales de prueba

```text
Aspirante:
aspirante@utem.test
Aspirante123

Escolares:
escolares@utem.test
Escolares123
```

## Despliegue

Ver [DEPLOY_RENDER.md](DEPLOY_RENDER.md).
