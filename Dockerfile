# ─────────────────────────────────────────────
# Stage 1 — base
# ─────────────────────────────────────────────
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ─────────────────────────────────────────────
# Stage 2 — deps (production only)
# ─────────────────────────────────────────────
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# ─────────────────────────────────────────────
# Stage 3 — dev-deps (all deps)
# ─────────────────────────────────────────────
FROM base AS dev-deps
COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────
# Stage 4 — development (hot reload)
# docker compose -f docker-compose.dev.yml up
# ─────────────────────────────────────────────
FROM base AS dev
ENV NODE_ENV=development
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE 3000
# Run migrations then start dev server
CMD sh -c "npx prisma migrate deploy && npm run dev"

# ─────────────────────────────────────────────
# Stage 5 — builder (compile Next.js)
# ─────────────────────────────────────────────
FROM base AS builder
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─────────────────────────────────────────────
# Stage 6 — runner (lean production image)
# ─────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

WORKDIR /app

# Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma: schema + migrations needed at runtime for migrate deploy
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Entrypoint: runs migrations then starts app
COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]
