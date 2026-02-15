# Bikeshop

Bike shop management app — catalog, inventory, rentals, sales and customers.

Monorepo with a **NestJS** API and a **Next.js** dashboard.

## Stack

| Layer    | Tech                                        |
| -------- | ------------------------------------------- |
| Backend  | NestJS 11, Prisma 7, PostgreSQL 16          |
| Frontend | Next.js 16, React 19, Tailwind 4, shadcn/ui |
| Monorepo | pnpm workspaces, Turborepo                  |
| Tests    | Vitest (219 unit tests)                     |
| CI       | GitHub Actions (lint, build, tests)         |

## Architecture

Clean Architecture with pure TypeScript domain — zero framework imports in the domain layer.

```
apps/
├── api/             NestJS backend (port 3000)
│   └── src/modules/
│       ├── bike/        Catalog + status state machine
│       ├── customer/    Customer profiles
│       ├── inventory/   Stock movements (in/out/adjustment)
│       ├── rental/      Rentals (reserve, start, return, extend)
│       ├── sale/        Sales (create, confirm, cancel)
│       └── shared/      Value objects (Money, DateRange, Email…)
│
└── web/             Next.js dashboard (port 3001)
    └── src/
        ├── features/    Feature-based modules (bikes, customers, rentals, sales, inventory)
        ├── components/  Shared UI (sidebar, header, command palette, toasts…)
        └── app/         App Router with Partial Prerendering
```

Each backend module follows: `domain/ → application/ → infrastructure/`

## API

| Module    | Endpoints                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| Bikes     | `POST /bikes` · `GET /bikes` · `GET /bikes/:id` · `PATCH /bikes/:id` · `PATCH /bikes/:id/status`                  |
| Customers | `POST /customers` · `GET /customers` · `GET /customers/:id` · `PATCH /customers/:id`                              |
| Inventory | `POST /inventory/movements` · `GET /inventory/stock/:bikeId` · `GET /inventory/movements/:bikeId`                 |
| Rentals   | `POST /rentals` · `GET /rentals` · `GET /rentals/:id` · `PATCH /rentals/:id/status` · `PATCH /rentals/:id/extend` |
| Sales     | `POST /sales` · `GET /sales` · `GET /sales/:id` · `PATCH /sales/:id/status`                                       |

`GET /health` — Health check. Swagger at `/api` when running.

## Getting Started

```bash
pnpm install
```

Create `apps/api/.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/bikeshop"
PORT=3000
```

```bash
docker compose up -d     # Start PostgreSQL
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev                 # API on :3000, Web on :3001
```

## Commands

```bash
pnpm dev          # Dev (both apps, watch mode)
pnpm build        # Build all
pnpm test         # Unit tests
pnpm lint         # ESLint
```
