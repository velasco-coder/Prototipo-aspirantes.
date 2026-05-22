#!/usr/bin/env bash
set -e

cd /var/www/html

php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan migrate --force
php artisan db:seed --force

php artisan config:cache
php artisan route:cache
php artisan view:cache

php-fpm -D
nginx -g "daemon off;"
