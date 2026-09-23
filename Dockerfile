FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app
FROM base AS dependencies
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
FROM dependencies AS build
COPY . .
RUN pnpm build
FROM base AS runtime
ARG VERSION=0.0.0-dev
ARG REVISION=unknown
LABEL org.opencontainers.image.source="https://github.com/baobab-platform/nabhold" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${REVISION}"
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=build --chown=nextjs:nodejs /app ./
USER nextjs
EXPOSE 3000
# Probe the host the Next.js server binds to (HOSTNAME, else loopback) so the
# check follows the runtime's network configuration.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "-e", "const h = process.env.HOSTNAME; const host = !h || h === '0.0.0.0' ? '127.0.0.1' : h; fetch('http://' + host + ':' + (process.env.PORT || 3000) + '/api/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["pnpm","start"]
