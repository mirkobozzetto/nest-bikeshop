# Bikeshop Management API

Bike shop management API built with NestJS and Clean Architecture. Handles bike catalog, inventory tracking, rentals, sales, and customer management with full inter-module integration.

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
├── customer/       Customer profiles (register, update)
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
- Inter-module integration: rentals and sales verify inventory and update bike status

## API Endpoints

### Health

| Method | Endpoint  | Description        |
| ------ | --------- | ------------------ |
| `GET`  | `/health` | Health check (200) |

### Bikes

| Method  | Endpoint            | Description                                               |
| ------- | ------------------- | --------------------------------------------------------- |
| `POST`  | `/bikes`            | Create a new bike                                         |
| `GET`   | `/bikes`            | List bikes (filter by type, status, brand)                |
| `GET`   | `/bikes/:id`        | Get bike by ID                                            |
| `PATCH` | `/bikes/:id`        | Update bike details (name, brand, price, etc.)            |
| `PATCH` | `/bikes/:id/status` | Update bike status (rent, return, sell, maintain, retire) |

### Customers

| Method  | Endpoint         | Description             |
| ------- | ---------------- | ----------------------- |
| `POST`  | `/customers`     | Register a new customer |
| `GET`   | `/customers`     | List customers          |
| `GET`   | `/customers/:id` | Get customer by ID      |
| `PATCH` | `/customers/:id` | Update customer details |

### Inventory

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| `POST` | `/inventory/movements`         | Record a stock movement            |
| `GET`  | `/inventory/stock/:bikeId`     | Get current stock level for a bike |
| `GET`  | `/inventory/movements/:bikeId` | Get movement history for a bike    |

### Rentals

| Method  | Endpoint              | Description                                                          |
| ------- | --------------------- | -------------------------------------------------------------------- |
| `POST`  | `/rentals`            | Create rental (validates bike availability via inventory)             |
| `GET`   | `/rentals`            | List rentals (filter by customerId, status)                          |
| `GET`   | `/rentals/:id`        | Get rental by ID                                                     |
| `PATCH` | `/rentals/:id/status` | Update status (start -> RENTAL_OUT movement, return -> RENTAL_RETURN) |
| `PATCH` | `/rentals/:id/extend` | Extend rental end date                                               |

### Sales

| Method  | Endpoint            | Description                                             |
| ------- | ------------------- | ------------------------------------------------------- |
| `POST`  | `/sales`            | Create sale (validates all bikes exist)                  |
| `GET`   | `/sales`            | List sales (filter by customerId, status)                |
| `GET`   | `/sales/:id`        | Get sale by ID                                           |
| `PATCH` | `/sales/:id/status` | Update status (confirm -> SALE movement + bikes SOLD)    |

## Domain Models

### Bike

Types: `ROAD`, `MOUNTAIN`, `CITY`, `ELECTRIC`, `KIDS`
Status flow: `AVAILABLE` -> `RENTED` | `SOLD` | `MAINTENANCE` -> `RETIRED`

### Rental

Status flow: `RESERVED` -> `ACTIVE` -> `RETURNED`
Pricing: sum of (daily rate x number of days) for each bike in the rental.
Integration: start creates RENTAL_OUT movements, return creates RENTAL_RETURN movements.

### Sale

Status flow: `PENDING` -> `CONFIRMED` | `CANCELLED`
Supports VAT calculation.
Integration: confirm creates SALE movements and marks bikes as SOLD.

### Inventory Movement

Types: `IN`, `OUT`, `ADJUSTMENT`
Reasons: `PURCHASE`, `SALE`, `RENTAL_OUT`, `RENTAL_RETURN`, `MAINTENANCE`, `LOSS`, `ADJUSTMENT`

## Error Handling

Domain exceptions are mapped to HTTP status codes by a global filter:

| Domain Code         | HTTP Status |
| ------------------- | ----------- |
| `*_NOT_FOUND`       | 404         |
| `*_NOT_AVAILABLE`   | 409         |
| `*_INVALID_TRANSITION` | 409      |
| Other domain errors | 422         |

## Getting Started

### Prerequisites

- Node.js >= 22
- PostgreSQL 16
- pnpm

### Setup

```bash
pnpm install
```

Create a `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/veloshop"
PORT=3000
```

Generate the Prisma client and run migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

### Docker

```bash
docker compose up -d       # Start app + PostgreSQL
docker compose up -d db    # Start only PostgreSQL
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

## CI/CD

GitHub Actions runs on every push and PR to main:

- Lint + type check + build
- Unit tests

## License

UNLICENSED
