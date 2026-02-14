# Bikeshop Management API

Bike shop management API handling catalog, inventory, rentals, sales and customers. Built with NestJS following strict Clean Architecture and CQRS.

## Architecture

The domain layer is pure TypeScript with zero framework imports. Each module follows the same structure:

```
apps/api/src/modules/
├── bike/           Catalog (CRUD + status state machine)
├── customer/       Customer profiles
├── inventory/      Stock movements (in/out/adjustment)
├── rental/         Rentals (reserve, start, return, extend)
├── sale/           Sales (create, confirm, cancel)
└── shared/         Shared value objects (Money, DateRange, Email…)
```

```
module/
├── domain/           Entities, value objects, events, ports, exceptions
├── application/      Commands + Queries (CQRS), response DTOs
└── infrastructure/   Controllers, request DTOs, Prisma repos, mappers
```

Key design decisions:

- **Symbol token injection** — No coupling to concrete classes
- **Named constructors** — `Bike.create()`, `Rental.start()`
- **Prices in cents** — No floating point
- **Domain events** on every aggregate
- **State machines** for status transitions (Bike, Rental, Sale)
- **Inter-module integration** — Rentals and sales manage inventory movements and bike status

## API

### Bikes

| Method  | Endpoint            | Description                             |
| ------- | ------------------- | --------------------------------------- |
| `POST`  | `/bikes`            | Create a bike                           |
| `GET`   | `/bikes`            | List bikes (filter: type, status, brand)|
| `GET`   | `/bikes/:id`        | Get bike                                |
| `PATCH` | `/bikes/:id`        | Update bike                             |
| `PATCH` | `/bikes/:id/status` | Change status (rent, return, sell…)      |

### Customers

| Method  | Endpoint         | Description      |
| ------- | ---------------- | ---------------- |
| `POST`  | `/customers`     | Register         |
| `GET`   | `/customers`     | List             |
| `GET`   | `/customers/:id` | Get              |
| `PATCH` | `/customers/:id` | Update           |

### Inventory

| Method | Endpoint                       | Description          |
| ------ | ------------------------------ | -------------------- |
| `POST` | `/inventory/movements`         | Record movement      |
| `GET`  | `/inventory/stock/:bikeId`     | Current stock        |
| `GET`  | `/inventory/movements/:bikeId` | Movement history     |

### Rentals

| Method  | Endpoint              | Description              |
| ------- | --------------------- | ------------------------ |
| `POST`  | `/rentals`            | Create rental            |
| `GET`   | `/rentals`            | List (filter: customer, status) |
| `GET`   | `/rentals/:id`        | Get rental               |
| `PATCH` | `/rentals/:id/status` | Start / return / cancel  |
| `PATCH` | `/rentals/:id/extend` | Extend rental            |

### Sales

| Method  | Endpoint            | Description              |
| ------- | ------------------- | ------------------------ |
| `POST`  | `/sales`            | Create sale              |
| `GET`   | `/sales`            | List (filter: customer, status) |
| `GET`   | `/sales/:id`        | Get sale                 |
| `PATCH` | `/sales/:id/status` | Confirm / cancel         |

`GET /health` — Returns `{ status: 'ok' }`

Swagger docs available at `/api` when the server is running.

## Getting Started

```bash
pnpm install
```

Create `.env` in `apps/api/`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/bikeshop"
PORT=3000
```

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

Or with Docker:

```bash
docker compose up -d
```

## Tests

```bash
pnpm test        # Unit
pnpm test:int    # Integration
pnpm test:e2e    # E2E
```
