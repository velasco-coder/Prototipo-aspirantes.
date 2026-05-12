-- Crear base local para el sistema de admision.
-- Ejecutar con un usuario administrador, por ejemplo:
-- psql -U postgres -f proyecto/base_datos_postgres/00_crear_base_datos.sql

SELECT 'CREATE DATABASE utem_admisiones'
WHERE NOT EXISTS (
  SELECT 1
  FROM pg_database
  WHERE datname = 'utem_admisiones'
)\gexec
