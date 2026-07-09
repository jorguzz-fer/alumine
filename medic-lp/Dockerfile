# =============================================================================
# Método MEDIC — LP (Next.js 15, static/standalone) · deploy Coolify
# LP estática: sem Prisma, sem banco, sem migrations.
# =============================================================================

# ─── Stage 1: deps ───────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
# NODE_ENV=development aqui é necessário para instalar as devDependencies
# (typescript, @types) usadas pelo `next build`.
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN npm ci

# ─── Stage 2: builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# ⚠️ NÃO defina NODE_ENV=development aqui — o `next build` já usa production
# internamente. Deixar development faz o React usar o build de dev no prerender
# e pode quebrar a geração da /404 com o erro <Html>.
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ─── Stage 3: runner ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# output: "standalone" gera um server.js mínimo + só as deps necessárias.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
