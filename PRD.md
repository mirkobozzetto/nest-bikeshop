# Product Requirements Document: VeloShop

## Product Vision

**Problem Statement**
Independent bike shops manage sales, rentals, and inventory with disconnected tools (spreadsheets, paper, separate POS). This causes stock errors, double-bookings, and lost revenue.

**Solution**
VeloShop is a REST API that unifies bike catalog, inventory tracking, rentals, and sales in a single system with strict business rules enforced at the domain level.

**Success Criteria**

- All API endpoints respond < 100ms under normal load
- Zero stock inconsistencies (inventory movements always match bike status)
- 100% domain logic covered by unit tests
- Build and lint pass on every commit

## Target Users

### Primary Persona: Shop Manager

- **Role**: Owner or manager of a bike shop (5-50 bikes)
- **Pain Points**:
  - Renting a bike that's already rented or sold
  - Losing track of inventory after maintenance cycles
  - Manual price calculations with errors
- **Motivations**: Reliable stock tracking, automated pricing, clear rental/sale history
- **Goals**: Manage full bike lifecycle from purchase to sale/retirement

### Secondary Persona: Shop Employee

- **Role**: Counter staff handling day-to-day operations
- **Pain Points**: Complex workflows for simple rental/sale operations
- **Motivations**: Quick, error-proof rental and sale creation

## Implementation Status

### Phase 1 -- Project Setup [DONE]

- [x] NestJS 11 project with pnpm
- [x] TypeScript 5.9 strict mode
- [x] Prisma 7 with PrismaPg driver adapter
- [x] Vitest 4 configured (unit, integration, e2e)
- [x] ESLint 9 + Prettier
- [x] ESM (`"type": "module"`)

### Phase 2 -- Shared Domain [DONE]

- [x] Money value object (add, subtract, multiply, format)
- [x] DateRange value object (overlaps, durationInDays, contains)
- [x] Entity base class (id, events, reconstitute)
- [x] DomainEvent interface
- [x] DomainException base class

### Phase 3 -- Bike Module [DONE]

- [x] Bike entity with state machine (AVAILABLE -> RENTED/SOLD/MAINTENANCE -> RETIRED)
- [x] Create, Get, List (with filters), UpdateStatus, UpdateBike
- [x] Domain tests (entity invariants, state transitions)
- [x] Handler tests (create, get, list, update-status, update-bike)
- [x] Prisma repository + mapper
- [x] HTTP controller + request DTOs

### Phase 4 -- Inventory Module [DONE]

- [x] InventoryMovement entity (IN/OUT/ADJUSTMENT with reasons)
- [x] StockService (calculateCurrentStock, isAvailableForRental, getLowStockAlerts)
- [x] RecordMovement, GetStock, GetMovements
- [x] Domain tests + all handler tests
- [x] Prisma repository + mapper

### Phase 5 -- Rental Module [DONE]

- [x] Rental entity with items, period (DateRange), status machine
- [x] Create, Get, List, UpdateStatus, Extend
- [x] Domain tests (entity invariants, state transitions, price calculation)
- [x] Handler tests (create, get, list, update-status, extend)
- [x] Prisma repository + mapper

### Phase 6 -- Sale Module [DONE]

- [x] Sale entity with items, status machine, TVA calculation
- [x] Create, Get, List, UpdateStatus
- [x] Domain tests (entity invariants, state transitions, TVA)
- [x] Handler tests (create, get, list, update-status)
- [x] Prisma repository + mapper

### Phase 7 -- Customer Module [DONE]

- [x] Customer entity with Email + PhoneNumber value objects
- [x] Register, Get, List, Update
- [x] Domain tests (entity, value objects)
- [x] Handler tests (register, get, list, update)
- [x] Prisma repository + mapper

### Phase 8 -- Prisma Schema [DONE]

- [x] 7 models: Bike, Customer, InventoryMovement, Rental, RentalItem, Sale, SaleItem
- [x] 6 enums: BikeType, BikeStatus, MovementType, MovementReason, RentalStatus, SaleStatus
- [x] UUID, TIMESTAMPTZ, cents, snake_case conventions
- [x] Indexes on all foreign keys + composite indexes
- [x] Initial migration applied

### Phase 9 -- Missing Handlers & Tests [DONE]

- [x] Sale: ListSales query + handler
- [x] Bike: UpdateBike command + handler
- [x] Customer: UpdateCustomer command + handler
- [x] All handler tests: Rental (5), Sale (4), Bike (3), Customer (3)

### Phase 10 -- Inter-Module Integration [DONE]

- [x] CreateRental verifies bikes available via inventory (isAvailableForRental)
- [x] UpdateRentalStatus start: creates RENTAL_OUT movements + marks bikes RENTED
- [x] UpdateRentalStatus return: creates RENTAL_RETURN movements + marks bikes AVAILABLE
- [x] CreateSale verifies bikes exist
- [x] ConfirmSale creates SALE movements + marks bikes SOLD
- [x] All handler tests updated with cross-module mocks

### Phase 11 -- Infrastructure [DONE]

- [x] Global DomainException filter (domain code -> HTTP status mapping)
- [x] Health check endpoint (GET /health)
- [x] CORS enabled
- [x] DomainExceptionFilter unit test

### Phase 12 -- DevOps [DONE]

- [x] Dockerfile (multi-stage build: deps -> build -> production)
- [x] docker-compose.yml (app + PostgreSQL 16)
- [x] .dockerignore
- [x] GitHub Actions CI (lint, build, unit tests)

## Remaining Work

### Phase 13 -- Polish [TODO - MEDIUM PRIORITY]

- [ ] Swagger/OpenAPI documentation (@nestjs/swagger)
- [ ] Cursor-based pagination (replace offset in list queries)
- [ ] Request logging interceptor
- [ ] Prisma seed file (demo data)
- [ ] .env.example with all config variables

### Phase 14 -- Testing Depth [TODO - LOW PRIORITY]

- [ ] Integration tests: all 5 repository implementations against real DB
- [ ] E2E tests: at least 1 per module (main endpoint)
- [ ] Test coverage target: 80%+ domain, 70%+ application

## Out of Scope (v1)

- Authentication / authorization
- Frontend / UI
- Payment processing integration
- Email notifications
- Multi-tenancy (single shop only)
- Reporting / analytics dashboard
- Dynamic pricing engine
- Image upload for bikes
- Audit trail / activity log

## Core Features (MVP)

### 1. Bike Lifecycle Management

**Description**: Full CRUD for bikes with a state machine governing transitions (available -> rented/sold/maintenance -> retired).
**User Value**: Prevents invalid operations (can't sell a rented bike) and provides clear catalog overview.
**Success Metric**: All state transitions validated by domain tests.

### 2. Rental Management

**Description**: Create reservations with date range and multiple bikes, start/return/cancel/extend rentals with automatic price calculation. Inventory checks prevent renting unavailable bikes.
**User Value**: Eliminates double-bookings and manual price errors.
**Success Metric**: Price calculation accurate to the cent across all test cases.

### 3. Sale Processing

**Description**: Create sales with multiple bikes, confirm/cancel with VAT calculation. Confirmation triggers inventory movements and marks bikes as sold.
**User Value**: Clean sales workflow with tax compliance and automatic stock updates.
**Success Metric**: TVA calculation tested at multiple rates (20%, 5.5%).

### 4. Inventory Tracking

**Description**: Record all stock movements (purchase, sale, rental out/return, maintenance, loss) with running stock level per bike. Automatic movements on rental/sale status changes.
**User Value**: Real-time stock visibility, low stock alerts.
**Success Metric**: Stock level always equals sum of movements.

### 5. Customer Registry

**Description**: Customer profiles with validated email and phone, linked to rental and sale history.
**User Value**: Quick customer lookup, history tracking.
**Success Metric**: Email uniqueness enforced, validation on all fields.

## User Flows

### Primary: Rent a Bike

1. Employee searches available bikes (GET /bikes?status=AVAILABLE)
2. Employee looks up or registers customer (POST /customers)
3. Employee creates rental with selected bikes and dates (POST /rentals)
4. System validates availability via inventory and calculates total
5. When customer picks up: employee starts rental (PATCH /rentals/:id/status)
6. System creates RENTAL_OUT inventory movements and marks bikes RENTED
7. When customer returns: employee returns rental (PATCH /rentals/:id/status)
8. System creates RENTAL_RETURN movements and marks bikes AVAILABLE

### Primary: Sell a Bike

1. Employee searches available bikes (GET /bikes?status=AVAILABLE)
2. Employee creates sale with selected bikes (POST /sales)
3. System verifies all bikes exist and calculates total + TVA
4. Employee confirms sale (PATCH /sales/:id/status)
5. System creates SALE inventory movements and marks bikes SOLD

## Success Metrics

**Primary Metrics**:

- Unit test count: 200+ (domain + handler + filter tests)
- Build passes: 100% on every commit (CI enforced)
- Domain purity: 0 framework imports in domain layer

**Secondary Metrics**:

- API response time: < 100ms (p95)
- Test execution time: < 5s for unit tests
