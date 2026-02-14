# Design: Monorepo + Frontend Dashboard

**Date:** 2026-02-14
**Status:** Approved

## Context

VeloShop est une API REST NestJS (Clean Architecture) gerant velos, locations, ventes, stock et clients. Le backend est complet (219 tests, lint clean, Swagger, Docker, CI). L'objectif est d'ajouter un frontend dashboard admin et de restructurer le projet en monorepo.

## Decisions

### Monorepo

- **Outil:** pnpm workspaces + Turborepo 2.8.7
- **Structure:** `apps/api/` (NestJS), `apps/web/` (Next.js), `packages/` (futur)
- **Raison:** Un seul repo, deps partagees, builds paralleles caches

### Frontend

- **Framework:** Next.js 16.x (Active LTS) + React 19.2
- **UI:** Tailwind CSS 4.x (CSS-first) + shadcn/ui 3.8 (radix-ui unifie)
- **State:** TanStack Query (server state) + nuqs (URL state)
- **Scope MVP:** Dashboard admin (CRUD velos, locations, ventes, clients, stock)
- **Pas dans le MVP:** Auth, landing page publique, i18n, payments

### Branching

- `main` -> `develop` -> `feature/*`
- PRs de feature vers develop, user valide chaque PR
- Release : PR develop -> main

### Extensibilite

- Route group `(dashboard)/` pour proteger avec auth plus tard
- Root layout avec slots pour analytics/notifications futures
- Pas de code mort preemptif, juste la structure qui ne bloque pas

## Features (ordre d'implementation)

| #   | Feature          | Branche                    | Dependance |
| --- | ---------------- | -------------------------- | ---------- |
| 1   | Monorepo setup   | `feature/monorepo-setup`   | -          |
| 2   | Next.js setup    | `feature/web-setup`        | 1          |
| 3   | Dashboard MVP    | `feature/dashboard-mvp`    | 2          |
| 4   | Dashboard polish | `feature/dashboard-polish` | 3          |

## Stack Versions

| Package        | Version |
| -------------- | ------- |
| Next.js        | 16.x    |
| React          | 19.2.4  |
| Tailwind CSS   | 4.1.18  |
| shadcn/ui CLI  | 3.8.3   |
| Turborepo      | 2.8.7   |
| TanStack Query | latest  |
| nuqs           | latest  |
| next-themes    | latest  |
| TypeScript     | 5.9+    |
