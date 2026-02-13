# Bikeshop Management API

Bike shop management API built with NestJS and Clean Architecture. Handles bike catalog, inventory tracking, rentals, sales, and customer management.

## Tech Stack

- **Runtime**: Node.js 22 LTS
- **Framework**: NestJS 11
- **Language**: TypeScript 5.9 (strict mode)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 7 (with `@prisma/adapter-pg` driver)
- **Testing**: Vitest 4
- **Package Manager**: pnpm

## Architecture

Strict Clean Architecture with 4 layers. The domain layer is pure TypeScript with zero framework imports.

```
src/modules/
├── bike/           Bike catalog (CRUD, status state machine)
├── customer/       Customer profiles
├── inventory/      Stock movements (in/out/adjustment)
├── rental/         Bike rentals (reserve, start, return, extend)
├── sale/           Bike sales (create, confirm, cancel)
└── shared/         Shared value objects (Money, DateRange)
```

Each module follows the same structure:

```
module-name/
├── domain/
│   ├── entities/         Pure TS entities with named constructors
│   ├── value-objects/    Immutable, self-validating
│   ├── events/           Domain events
│   ├── ports/            Repository interfaces
│   ├── services/         Pure computation functions
│   └── exceptions/       Typed domain exceptions
├── application/
│   ├── commands/         Write operations (handler + command DTO)
│   ├── queries/          Read operations (handler + query DTO)
│   └── dtos/             Response DTOs with fromDomain() mapping
└── infrastructure/
    ├── persistence/
    │   ├── repositories/ Port implementations (Prisma)
    │   └── mappers/      Entity <-> Prisma model conversion
    ├── http/
    │   ├── controllers/  Thin controllers (< 15 lines per method)
    │   └── dtos/         Request validation (class-validator)
    └── module.ts         NestJS module (DI wiring with Symbol tokens)
```

**Key design decisions:**

- Dependency injection via Symbol tokens, not concrete classes
- Entities use named constructors (`Bike.create()`, `Rental.start()`)
- Prices stored as integers in cents (no floating point)
- All dates use `TIMESTAMPTZ`
- Domain layer has zero imports from NestJS or Prisma

## API Endpoints

### Bikes

| Method  | Endpoint            | Description                                               |
| ------- | ------------------- | --------------------------------------------------------- |
| `POST`  | `/bikes`            | Create a new bike                                         |
| `GET`   | `/bikes`            | List bikes (filter by type, status, brand)                |
| `GET`   | `/bikes/:id`        | Get bike by ID                                            |
| `PATCH` | `/bikes/:id/status` | Update bike status (rent, return, sell, maintain, retire) |

### Customers

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| `POST` | `/customers`     | Register a new customer |
| `GET`  | `/customers`     | List customers          |
| `GET`  | `/customers/:id` | Get customer by ID      |

### Inventory

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| `POST` | `/inventory/movements`         | Record a stock movement            |
| `GET`  | `/inventory/stock/:bikeId`     | Get current stock level for a bike |
| `GET`  | `/inventory/movements/:bikeId` | Get movement history for a bike    |

### Rentals

| Method  | Endpoint              | Description                                  |
| ------- | --------------------- | -------------------------------------------- |
| `POST`  | `/rentals`            | Create a rental reservation                  |
| `GET`   | `/rentals`            | List rentals (filter by customerId, status)  |
| `GET`   | `/rentals/:id`        | Get rental by ID                             |
| `PATCH` | `/rentals/:id/status` | Update rental status (start, return, cancel) |
| `PATCH` | `/rentals/:id/extend` | Extend rental end date                       |

### Sales

| Method  | Endpoint            | Description                          |
| ------- | ------------------- | ------------------------------------ |
| `POST`  | `/sales`            | Create a sale                        |
| `GET`   | `/sales/:id`        | Get sale by ID                       |
| `PATCH` | `/sales/:id/status` | Update sale status (confirm, cancel) |

## Domain Models

### Bike

Types: `ROAD`, `MOUNTAIN`, `CITY`, `ELECTRIC`, `KIDS`
Status flow: `AVAILABLE` -> `RENTED` | `SOLD` | `MAINTENANCE` -> `RETIRED`

### Rental

Status flow: `RESERVED` -> `ACTIVE` -> `RETURNED`
Pricing: sum of (daily rate x number of days) for each bike in the rental.

### Sale

Status flow: `PENDING` -> `CONFIRMED` | `CANCELLED`
Supports VAT calculation.

### Inventory Movement

Types: `IN`, `OUT`, `ADJUSTMENT`
Reasons: `PURCHASE`, `SALE`, `RENTAL_OUT`, `RENTAL_RETURN`, `MAINTENANCE`, `LOSS`, `ADJUSTMENT`

## Getting Started

### Prerequisites

- Node.js >= 22
- PostgreSQL 16
- pnpm

### Setup

```bash
pnpm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Configure your database URL in `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/veloshop"
```

Generate the Prisma client and run migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

### Run

```bash
pnpm dev         # Development (watch mode)
pnpm start:prod  # Production
```

### Test

```bash
pnpm test        # Unit tests
pnpm test:cov    # Unit tests with coverage
pnpm test:int    # Integration tests
pnpm test:e2e    # End-to-end tests
```

### Lint

```bash
pnpm lint        # ESLint
pnpm format      # Prettier
```

## Database

The Prisma schema defines 7 models with proper PostgreSQL conventions:

- UUIDs for all primary keys
- `TIMESTAMPTZ` for all date fields
- Prices in cents (`INTEGER`)
- `snake_case` column and table names
- Indexes on all foreign keys and common query patterns

```bash
pnpm prisma:migrate  # Run migrations
pnpm prisma:generate # Regenerate client
pnpm prisma:studio   # Open Prisma Studio
```

## Project Status

**Completed:**

- All 5 domain modules (Bike, Customer, Inventory, Rental, Sale)
- Shared value objects (Money, DateRange)
- Full Prisma schema with migrations
- 149 unit tests passing
- Build and lint clean

**In Progress:**

- Inter-module integration (inventory checks on rental/sale)
- Integration and E2E tests
- API documentation (Swagger)

## License

UNLICENSED
