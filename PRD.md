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
- [x] Create, Get, List (with filters), UpdateStatus
- [x] Domain tests (entity invariants, state transitions)
- [x] Handler tests (create, update-status)
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
- [x] Prisma repository + mapper

### Phase 6 -- Sale Module [DONE]

- [x] Sale entity with items, status machine, TVA calculation
- [x] Create, Get, UpdateStatus
- [x] Domain tests (entity invariants, state transitions, TVA)
- [x] Prisma repository + mapper

### Phase 7 -- Customer Module [DONE]

- [x] Customer entity with Email + PhoneNumber value objects
- [x] Register, Get, List
- [x] Domain tests (entity, value objects)
- [x] Handler test (register)
- [x] Prisma repository + mapper

### Phase 8 -- Prisma Schema [DONE]

- [x] 7 models: Bike, Customer, InventoryMovement, Rental, RentalItem, Sale, SaleItem
- [x] 6 enums: BikeType, BikeStatus, MovementType, MovementReason, RentalStatus, SaleStatus
- [x] UUID, TIMESTAMPTZ, cents, snake_case conventions
- [x] Indexes on all foreign keys + composite indexes
- [x] Initial migration applied

## Remaining Work

### Phase 9 -- Missing Handlers & Tests [TODO - HIGH PRIORITY]

- [ ] Sale: ListSales query + handler + test
- [ ] Bike: UpdateBike command + handler (edit name, brand, price, etc.)
- [ ] Customer: UpdateCustomer command + handler
- [ ] Handler tests: Rental (5 handlers: create, get, list, update-status, extend)
- [ ] Handler tests: Sale (3 handlers: create, get, update-status)
- [ ] Handler tests: Bike (2 missing: get, list)
- [ ] Handler tests: Customer (2 missing: get, list)

### Phase 10 -- Inter-Module Integration [TODO - HIGH PRIORITY]

- [ ] CreateRental must verify bikes are AVAILABLE via inventory
- [ ] CreateRental must create RENTAL_OUT inventory movements
- [ ] ReturnRental must create RENTAL_RETURN movements + mark bikes AVAILABLE
- [ ] CreateSale must verify bikes are AVAILABLE
- [ ] ConfirmSale must create SALE movements + mark bikes SOLD
- [ ] CancelSale must reverse inventory movements
- [ ] Domain events dispatching between modules

### Phase 11 -- Infrastructure [TODO - MEDIUM PRIORITY]

- [ ] Global exception filter (DomainException -> HTTP 4xx)
- [ ] Cursor-based pagination (replace offset in Customer list)
- [ ] Swagger/OpenAPI documentation (@nestjs/swagger)
- [ ] Health check endpoint (/health)
- [ ] CORS configuration
- [ ] Request logging interceptor
- [ ] Prisma seed file (demo data)

### Phase 12 -- Testing [TODO - MEDIUM PRIORITY]

- [ ] Integration tests: all 5 repository implementations against real DB
- [ ] E2E tests: at least 1 per module (main endpoint)
- [ ] Test coverage target: 80%+ domain, 70%+ application

### Phase 13 -- DevOps [TODO - LOW PRIORITY]

- [ ] Dockerfile (multi-stage build)
- [ ] docker-compose.yml (app + PostgreSQL)
- [ ] GitHub Actions CI (lint, build, test)
- [ ] .env.example updates for all config

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

**Description**: Create reservations with date range and multiple bikes, start/return/cancel/extend rentals with automatic price calculation.
**User Value**: Eliminates double-bookings and manual price errors.
**Success Metric**: Price calculation accurate to the cent across all test cases.

### 3. Sale Processing

**Description**: Create sales with multiple bikes, confirm/cancel with VAT calculation.
**User Value**: Clean sales workflow with tax compliance.
**Success Metric**: TVA calculation tested at multiple rates (20%, 5.5%).

### 4. Inventory Tracking

**Description**: Record all stock movements (purchase, sale, rental out/return, maintenance, loss) with running stock level per bike.
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
4. System validates availability and calculates total
5. When customer picks up: employee starts rental (PATCH /rentals/:id/status)
6. When customer returns: employee returns rental (PATCH /rentals/:id/status)

### Primary: Sell a Bike

1. Employee searches available bikes (GET /bikes?status=AVAILABLE)
2. Employee creates sale with selected bikes (POST /sales)
3. System calculates total + TVA
4. Employee confirms sale (PATCH /sales/:id/status)
5. System marks bikes as SOLD

## Success Metrics

**Primary Metrics**:

- Unit test count: 200+ (currently 149)
- Build passes: 100% on every commit
- Domain purity: 0 framework imports in domain layer

**Secondary Metrics**:

- API response time: < 100ms (p95)
- Test execution time: < 5s for unit tests
