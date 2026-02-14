# PRD: monorepo-setup

## Objective

Restructurer le projet en monorepo pnpm workspaces + Turborepo. Deplacer le backend NestJS dans `apps/api/`, preparer `apps/web/` et `packages/`. Adapter CI, Docker, et configs.

## Scope

### In scope

- Creer la structure `apps/api/`, `apps/web/` (vide), `packages/`
- Deplacer tout le code NestJS dans `apps/api/`
- Creer `pnpm-workspace.yaml` a la racine
- Creer `turbo.json` avec les pipelines (build, lint, test, dev)
- `package.json` racine (scripts workspace, devDeps turbo)
- `apps/api/package.json` (deps NestJS, scripts locaux)
- Adapter `tsconfig.json` dans `apps/api/`
- Adapter `Dockerfile` pour le monorepo
- Adapter `docker-compose.yml`
- Adapter `.github/workflows/ci.yml`
- Adapter `.gitignore`
- Deplacer `.prettierrc`, `eslint.config.mjs` a la racine (partages)
- Verifier que build, lint, et tests passent toujours

### Out of scope

- Installation de Next.js (feature 2)
- Code frontend (features 3-4)
- Modification de la DB ou du schema Prisma
- Package partage `packages/shared` (futur)

## Tasks

| #   | Task                                                    | Files                                           | Taille |
| --- | ------------------------------------------------------- | ----------------------------------------------- | ------ |
| 1   | Creer la structure de dossiers                          | apps/, packages/                                | S      |
| 2   | Deplacer NestJS dans apps/api/                          | Tous les fichiers src/, test/, prisma/, configs | L      |
| 3   | Creer pnpm-workspace.yaml                               | pnpm-workspace.yaml                             | S      |
| 4   | Creer turbo.json                                        | turbo.json                                      | S      |
| 5   | Creer package.json racine                               | package.json                                    | S      |
| 6   | Adapter apps/api/package.json                           | apps/api/package.json                           | M      |
| 7   | Adapter tsconfig dans apps/api                          | apps/api/tsconfig.json, tsconfig.build.json     | M      |
| 8   | Adapter les chemins (imports, vitest configs, nest-cli) | Multiples                                       | M      |
| 9   | Adapter Dockerfile                                      | Dockerfile                                      | M      |
| 10  | Adapter docker-compose.yml                              | docker-compose.yml                              | S      |
| 11  | Adapter CI GitHub Actions                               | .github/workflows/ci.yml                        | M      |
| 12  | Adapter .gitignore                                      | .gitignore                                      | S      |
| 13  | Verifier build + lint + tests                           | -                                               | M      |

## Acceptance Criteria

- [ ] `pnpm install` depuis la racine installe tout
- [ ] `turbo build` compile le backend sans erreur
- [ ] `turbo lint` passe sans erreur
- [ ] `turbo test` fait passer les 219 tests
- [ ] `docker-compose build` fonctionne
- [ ] CI GitHub Actions passe
- [ ] Aucune regression fonctionnelle

## Tech Stack

- pnpm workspaces
- Turborepo 2.8.7
- Configs existantes (NestJS 11, Prisma 7, Vitest 4, ESLint 9)
