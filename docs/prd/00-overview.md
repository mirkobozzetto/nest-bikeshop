# VeloShop — Roadmap Frontend & Monorepo

## Vue d'ensemble

Le backend NestJS est complet (5 modules, 219 tests, Swagger, Docker, CI).
L'objectif est de restructurer en monorepo et d'ajouter un dashboard admin Next.js 16.

## Ordre d'implémentation

| #   | Feature            | PRD                      | Branche                    | Dépendance |
| --- | ------------------ | ------------------------ | -------------------------- | ---------- |
| 1   | Structure monorepo | `01-monorepo-setup.md`   | `feature/monorepo-setup`   | —          |
| 2   | Setup Next.js 16   | `02-web-setup.md`        | `feature/web-setup`        | 1          |
| 3   | Dashboard MVP      | `03-dashboard-mvp.md`    | `feature/dashboard-mvp`    | 2          |
| 4   | Polish & UX        | `04-dashboard-polish.md` | `feature/dashboard-polish` | 3          |

## Workflow par feature

1. Lire le PRD correspondant
2. Créer la branche `feature/*` depuis `develop`
3. Implémenter avec des commits incrémentaux
4. Vérifier (lint, tests, build)
5. Créer une PR vers `develop`
6. **Attendre la validation de l'utilisateur**
7. Merger dans `develop`

## Skills utilisés

| Skill                                 | Utilité                                                      |
| ------------------------------------- | ------------------------------------------------------------ |
| `/feature-workflow`                   | Orchestration complète (PRD → branche → implémentation → PR) |
| `vercel-react-best-practices`         | Optimisation React/Next.js (Vercel Engineering)              |
| `superpowers:test-driven-development` | TDD — écrire les tests avant le code                         |
| `next-cache-components`               | Cache Components Next.js 16 (`use cache`, PPR)               |
| `building-components`                 | Composants UI accessibles et composables                     |
| `frontend-design`                     | Design d'interfaces production-grade                         |
| `nestjs-clean-arch`                   | Vérifier la conformité Clean Architecture (backend)          |
| `feature-module`                      | Générer un module complet (domaine → infra → tests)          |
| `db-migration`                        | Créer et valider les migrations Prisma 7                     |
| `utils-fix-errors`                    | Corriger les erreurs ESLint/TypeScript en parallèle          |
| `superpowers:systematic-debugging`    | Débogage systématique                                        |
| `git-create-pr`                       | Créer les PRs automatiquement                                |
| `superpowers:brainstorming`           | Brainstorming avant tout travail créatif                     |
| `superpowers:writing-plans`           | Rédaction de plans d'implémentation                          |

## Stack technique

| Package        | Version | Rôle                                  |
| -------------- | ------- | ------------------------------------- |
| Next.js        | 16.x    | Framework frontend (Active LTS)       |
| React          | 19.2.4  | Bibliothèque UI                       |
| Tailwind CSS   | 4.1.18  | Styles (CSS-first, plus de config JS) |
| shadcn/ui      | 3.8.3   | Composants UI (radix-ui unifié)       |
| Turborepo      | 2.8.7   | Orchestration monorepo                |
| TanStack Query | latest  | État serveur (queries, mutations)     |
| nuqs           | latest  | État URL (filtres, pagination)        |
| next-themes    | latest  | Thème dark/light                      |
| TypeScript     | 5.9+    | Typage strict                         |
| NestJS         | 11.1    | Backend API (existant)                |
| Prisma         | 7.4     | ORM (existant)                        |
| Vitest         | 4.0     | Tests (existant)                      |

## Référence des bonnes pratiques

Les best practices Next.js 16 sont documentées dans :
`.claude/skills/feature-workflow/references/nextjs16-best-practices.md`

Points clés :

- **Turbopack** est le bundler par défaut
- **Cache Components** avec `'use cache'` et `cacheComponents: true`
- **proxy.ts** remplace `middleware.ts`
- **Tailwind 4** : configuration CSS-first (`@import "tailwindcss"`, `@theme`)
- **React Compiler** stable (mémoïsation automatique)
- **Server Components** par défaut, `'use client'` seulement quand nécessaire
