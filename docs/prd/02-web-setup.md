# PRD: web-setup

## Objective

Installer et configurer Next.js 16 dans `apps/web/` avec Tailwind CSS 4, shadcn/ui, TanStack Query, nuqs, et next-themes. Page placeholder fonctionnelle.

## Scope

### In scope

- Creer le projet Next.js 16 dans `apps/web/`
- Configurer Tailwind CSS 4 (CSS-first, `@import "tailwindcss"`)
- Initialiser shadcn/ui (components, utils)
- Installer et configurer TanStack Query (provider)
- Installer nuqs
- Installer next-themes (theme toggle dark/light)
- Configurer TypeScript strict
- Configurer ESLint (flat config, coherent avec le backend)
- Configurer `turbo.json` pour inclure les tasks web (dev, build, lint, ts)
- Page placeholder `/` avec le theme toggle fonctionnel
- Configurer `cacheComponents: true` dans next.config.ts
- Ajouter `apps/web` dans le CI

### Out of scope

- Pages du dashboard (feature 3)
- Appels API vers le backend (feature 3)
- Auth, landing page, i18n
- Composants shadcn specifiques (feature 3)

## Tasks

| #   | Task                                                   | Files                               | Taille |
| --- | ------------------------------------------------------ | ----------------------------------- | ------ |
| 1   | Creer Next.js dans apps/web/                           | apps/web/                           | M      |
| 2   | Configurer Tailwind 4                                  | globals.css, postcss.config.mjs     | S      |
| 3   | Initialiser shadcn/ui                                  | components.json, src/components/ui/ | M      |
| 4   | Installer composants de base shadcn                    | button, input, card                 | S      |
| 5   | Configurer TanStack Query provider                     | src/providers/, app/layout.tsx      | M      |
| 6   | Installer et configurer nuqs                           | package.json, provider              | S      |
| 7   | Configurer next-themes + theme toggle                  | src/components/theme-toggle.tsx     | S      |
| 8   | Configurer next.config.ts (cacheComponents, turbopack) | next.config.ts                      | S      |
| 9   | Configurer TypeScript + ESLint                         | tsconfig.json, eslint.config.mjs    | M      |
| 10  | Adapter turbo.json pour apps/web                       | turbo.json                          | S      |
| 11  | Adapter CI pour apps/web                               | .github/workflows/ci.yml            | S      |
| 12  | Page placeholder + theme toggle                        | app/page.tsx, app/layout.tsx        | S      |
| 13  | Verifier build + lint + ts                             | -                                   | M      |

## Acceptance Criteria

- [ ] `pnpm --filter web dev` demarre sans erreur
- [ ] `pnpm --filter web build` compile sans erreur
- [ ] `pnpm --filter web lint` passe
- [ ] Theme toggle fonctionne (dark/light)
- [ ] shadcn/ui components renderent correctement
- [ ] Tailwind 4 CSS-first fonctionne
- [ ] `turbo build lint` passe pour api ET web
- [ ] CI passe

## Tech Stack

- Next.js 16.x, React 19.2.4
- Tailwind CSS 4.1.18 (CSS-first)
- shadcn/ui 3.8.3 (radix-ui unifie)
- TanStack Query, nuqs, next-themes
- TypeScript 5.9+
