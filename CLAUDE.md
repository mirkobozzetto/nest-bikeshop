# VeloShop -- NestJS Clean Architecture

## Projet
Application de gestion de vente et location de velos avec stock.
Stack : NestJS 11 + TypeScript 5.5+ strict + PostgreSQL 16 + Prisma 6.
Runtime : Node.js 22 LTS.

## Architecture
Clean Architecture stricte a 4 couches. Le domaine est du TypeScript PUR -- zero import NestJS.

```
src/
├── modules/
│   ├── bike/           # Velos (catalogue, caracteristiques)
│   ├── inventory/      # Stock (entrees, sorties, alertes)
│   ├── sale/           # Ventes (commandes, paiement)
│   ├── rental/         # Locations (reservation, retour, tarifs)
│   ├── customer/       # Clients (profil, historique)
│   └── shared/         # Value Objects partages (Money, DateRange...)
│
│   Chaque module suit cette structure :
│   module-name/
│   ├── domain/
│   │   ├── entities/         # Entites pures TS (pas Prisma models)
│   │   ├── value-objects/    # readonly class, auto-valides
│   │   ├── events/           # Domain events (simples DTOs)
│   │   ├── ports/            # Interfaces (repository, services externes)
│   │   ├── services/         # Fonctions pures de calcul
│   │   └── exceptions/       # Exceptions metier typees
│   ├── application/
│   │   ├── commands/         # Write operations (handler + command DTO)
│   │   ├── queries/          # Read operations (handler + query DTO)
│   │   └── dtos/             # Response DTOs
│   └── infrastructure/
│       ├── persistence/
│       │   ├── prisma/       # Prisma models vivent ICI uniquement
│       │   ├── repositories/ # Implementation des ports
│       │   └── mappers/      # Entity <-> Prisma model
│       ├── http/
│       │   ├── controllers/  # Thin controllers (< 15 lignes par methode)
│       │   ├── guards/
│       │   └── pipes/
│       └── module.ts         # NestJS Module (wiring DI)
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── test/
│   ├── unit/           # Tests domaine -- zero DB, zero NestJS
│   ├── integration/    # Tests repositories avec DB test
│   └── e2e/            # Tests API endpoints
└── libs/               # Utilitaires partages cross-modules
```

## Conventions de code

### TypeScript
- `strict: true` dans tsconfig -- pas de any, pas de implicit any
- Utiliser `readonly` partout ou possible
- Value Objects = `readonly class` auto-valides dans le constructeur
- Entites = classes avec named constructors (`Order.place(...)`, `Rental.start(...)`)
- DTOs = `readonly class` -- jamais de setter
- Enums = string enums TypeScript ou union types discrimines
- Prix/montants = entiers en centimes (jamais de float)
- Dates = `Date` avec timezone, preferer les comparaisons explicites

### NestJS
- Injection via `@Inject(TOKEN)` avec des Symbol tokens (pas les classes concretes)
- Controllers : validation avec class-validator, mapping HTTP <-> Command/Query, c'est TOUT
- Pas de logique metier dans les controllers
- Pas de logique metier dans les services NestJS -- la logique est dans domain/services (fonctions pures)
- Guards pour l'auth, Pipes pour la validation, Interceptors pour le logging

### PostgreSQL / Prisma
- UUID pour tous les identifiants
- `@db.Timestamptz()` pour toutes les dates
- Prix en centimes (`Int`, pas `Float` ni `Decimal`)
- Index sur toutes les foreign keys (Prisma ne le fait PAS automatiquement)
- Index composites pour les requetes frequentes
- `@map("snake_case")` sur tous les champs Prisma -> snake_case en DB
- `@@map("snake_case")` sur tous les models -> snake_case pour les tables
- `select` au lieu de `include` quand possible -- jamais de SELECT *
- Cursor-based pagination, pas OFFSET

### Tests
- Tests domaine : vitest -- `describe/it`, pas de DB, pas de NestJS, < 100ms total
- Tests integration : avec une DB PostgreSQL de test
- Tests e2e : supertest sur l'app NestJS compilee
- Nommer les tests : `it('should reject rental when bike is not available')`

### Git
- Conventional commits : `feat(rental):`, `fix(inventory):`, `refactor(sale):`
- Un commit par changement logique

## Commandes
- `pnpm install` -- installer les dependances
- `pnpm dev` -- lancer en dev (watch mode)
- `pnpm build` -- compiler
- `pnpm test` -- tests unitaires
- `pnpm test:int` -- tests integration
- `pnpm test:e2e` -- tests e2e
- `pnpm prisma:migrate` -- appliquer les migrations
- `pnpm prisma:generate` -- regenerer le client Prisma
- `pnpm lint` -- ESLint + Prettier
