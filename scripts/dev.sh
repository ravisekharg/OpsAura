#!/bin/bash
# Start Postgres + Redis via Docker, then run API and Web locally (hot-reload)
set -e

echo "▶ Starting infrastructure (Postgres + Redis)..."
docker compose up -d postgres redis

echo "⏳ Waiting for Postgres to be healthy..."
until docker compose exec -T postgres pg_isready -U opsaura -d platform_db &>/dev/null; do
  sleep 1
done

echo "▶ Running DB migrations..."
cd apps/api
npx prisma migrate deploy --schema=prisma/platform/schema.prisma
cd ../..

echo "▶ Starting API (port 4000)..."
cd apps/api && npm run start:dev &
API_PID=$!

echo "▶ Starting Web (port 3001)..."
cd apps/web && npm run dev &
WEB_PID=$!

echo ""
echo "✅ OpsAura is running:"
echo "   Web  → http://localhost:3001"
echo "   API  → http://localhost:4000/v1"
echo "   Docs → http://localhost:4000/docs"
echo ""
echo "Press Ctrl+C to stop."

trap "kill $API_PID $WEB_PID 2>/dev/null; docker compose stop postgres redis" INT
wait
