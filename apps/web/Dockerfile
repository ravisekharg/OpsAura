FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* vars must be present at build time
ARG NEXT_PUBLIC_API_URL=http://localhost:4100/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN mkdir -p public && npm run build

# ── Runtime ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S opsaura && adduser -S opsaura -G opsaura

COPY --from=builder --chown=opsaura:opsaura /app/.next/standalone ./
COPY --from=builder --chown=opsaura:opsaura /app/.next/static ./.next/static
COPY --from=builder --chown=opsaura:opsaura /app/public ./public

USER opsaura
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
