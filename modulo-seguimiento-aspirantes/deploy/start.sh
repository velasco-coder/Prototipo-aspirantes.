#!/usr/bin/env bash
set -e

cd /var/www/html

if [ -z "${APP_KEY:-}" ] || ! printf '%s' "$APP_KEY" | grep -q '^base64:'; then
  export APP_KEY="base64:$(php -r 'echo base64_encode(random_bytes(32));')"
fi

php artisan config:clear
php artisan route:clear
php artisan view:clear

for attempt in 1 2 3 4 5; do
  if php artisan migrate --force; then
    break
  fi

  if [ "$attempt" = "5" ]; then
    echo "Database migrations failed after 5 attempts."
    exit 1
  fi

  echo "Database not ready. Retrying migrations in 5 seconds..."
  sleep 5
done

php artisan db:seed --force

php artisan config:cache
php artisan route:cache
php artisan view:cache

php-fpm -D
nginx -g "daemon off;"
