#!/bin/sh
set -e

echo "▶ Running platform DB migrations..."
npx prisma migrate deploy --schema=prisma/platform/schema.prisma

echo "▶ Seeding platform admin user..."
node dist/scripts/seed-platform-admin.js 2>/dev/null || true

echo "▶ Provisioning demo tenant..."
node dist/scripts/seed-demo-tenant.js 2>/dev/null || true

echo "▶ Starting OpsAura API..."
exec node dist/main
