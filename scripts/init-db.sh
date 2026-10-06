#!/bin/bash
# Creates extra tenant databases on first Postgres boot.
# The platform_db is already created by POSTGRES_DB env var.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  -- Demo tenant DB (slug: demo)
  SELECT 'CREATE DATABASE demo_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'demo_db')\gexec
  GRANT ALL PRIVILEGES ON DATABASE demo_db TO opsaura;
EOSQL
