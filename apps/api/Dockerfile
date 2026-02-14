FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --filter @veloshop/api

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN cd apps/api && pnpm prisma:generate
RUN cd apps/api && pnpm build

FROM base AS production
ENV NODE_ENV=production
WORKDIR /app/apps/api
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/src/generated ./src/generated
COPY apps/api/package.json ./
COPY apps/api/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]
