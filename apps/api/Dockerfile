FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
# --ignore-scripts: prisma folder not copied yet, run db:generate manually after
RUN npm ci --ignore-scripts

COPY prisma ./prisma
RUN npm run db:generate

COPY . .
RUN npm run build

# ── Runtime ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl && \
    addgroup -S opsaura && adduser -S opsaura -G opsaura

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Schemas use custom output paths (@prisma/platform-client, @prisma/tenant-client)
# so only @prisma exists — there is no .prisma folder to copy
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh && chown -R opsaura:opsaura /app

USER opsaura
EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]
