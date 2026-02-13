# Claude Code — Kit complet pour le projet VéloShop

> CLAUDE.md + Skills + Prompt d'initialisation
> Application NestJS Clean Architecture — Vente, Location & Stock de vélos

---

## 📋 Mode d'emploi

Ce document contient **4 fichiers** à créer dans ton projet. Copie chaque section dans le bon fichier.

```
veloshop/
├── CLAUDE.md                                    ← Fichier 1
├── .claude/
│   └── skills/
│       ├── nestjs-clean-arch/
│       │   └── SKILL.md                         ← Fichier 2
│       ├── db-migration/
│       │   └── SKILL.md                         ← Fichier 3
│       └── feature-module/
│           └── SKILL.md                          ← Fichier 4
```

Puis lance Claude Code dans le dossier `veloshop/` et entre le **prompt d'initialisation** (Fichier 5, tout en bas).

---

## Fichier 1 — `CLAUDE.md` (racine du projet)

```markdown
# VéloShop — NestJS Clean Architecture

## Projet
Application de gestion de vente et location de vélos avec stock.
Stack : NestJS 11 + TypeScript 5.5+ strict + PostgreSQL 16 + Prisma 6.
Runtime : Node.js 22 LTS.

## Architecture
Clean Architecture stricte à 4 couches. Le domaine est du TypeScript PUR — zéro import NestJS.

```
src/
├── modules/
│   ├── bike/           # Vélos (catalogue, caractéristiques)
│   ├── inventory/      # Stock (entrées, sorties, alertes)
│   ├── sale/           # Ventes (commandes, paiement)
│   ├── rental/         # Locations (réservation, retour, tarifs)
│   ├── customer/       # Clients (profil, historique)
│   └── shared/         # Value Objects partagés (Money, DateRange...)
│
│   Chaque module suit cette structure :
│   module-name/
│   ├── domain/
│   │   ├── entities/         # Entités pures TS (pas Prisma models)
│   │   ├── value-objects/    # readonly class, auto-validés
│   │   ├── events/           # Domain events (simples DTOs)
│   │   ├── ports/            # Interfaces (repository, services externes)
│   │   ├── services/         # Fonctions pures de calcul
│   │   └── exceptions/       # Exceptions métier typées
│   ├── application/
│   │   ├── commands/         # Write operations (handler + command DTO)
│   │   ├── queries/          # Read operations (handler + query DTO)
│   │   └── dtos/             # Response DTOs
│   └── infrastructure/
│       ├── persistence/
│       │   ├── prisma/       # Prisma models vivent ICI uniquement
│       │   ├── repositories/ # Implémentation des ports
│       │   └── mappers/      # Entity ↔ Prisma model
│       ├── http/
│       │   ├── controllers/  # Thin controllers (< 15 lignes par méthode)
│       │   ├── guards/
│       │   └── pipes/
│       └── module.ts         # NestJS Module (wiring DI)
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── test/
│   ├── unit/           # Tests domaine — zéro DB, zéro NestJS
│   ├── integration/    # Tests repositories avec DB test
│   └── e2e/            # Tests API endpoints
└── libs/               # Utilitaires partagés cross-modules
```

## Conventions de code

### TypeScript
- `strict: true` dans tsconfig — pas de any, pas de implicit any
- Utiliser `readonly` partout où possible
- Value Objects = `readonly class` auto-validés dans le constructeur
- Entités = classes avec named constructors (`Order.place(...)`, `Rental.start(...)`)
- DTOs = `readonly class` — jamais de setter
- Enums = string enums TypeScript ou union types discriminés
- Prix/montants = entiers en centimes (jamais de float)
- Dates = `Date` avec timezone, préférer les comparaisons explicites

### NestJS
- Injection via `@Inject(TOKEN)` avec des Symbol tokens (pas les classes concrètes)
- Controllers : validation avec class-validator, mapping HTTP ↔ Command/Query, c'est TOUT
- Pas de logique métier dans les controllers
- Pas de logique métier dans les services NestJS — la logique est dans domain/services (fonctions pures)
- Guards pour l'auth, Pipes pour la validation, Interceptors pour le logging

### PostgreSQL / Prisma
- UUID pour tous les identifiants
- `@db.Timestamptz()` pour toutes les dates
- Prix en centimes (`Int`, pas `Float` ni `Decimal`)
- Index sur toutes les foreign keys (Prisma ne le fait PAS automatiquement)
- Index composites pour les requêtes fréquentes
- `@map("snake_case")` sur tous les champs Prisma → snake_case en DB
- `@@map("snake_case")` sur tous les models → snake_case pour les tables
- `select` au lieu de `include` quand possible — jamais de SELECT *
- Cursor-based pagination, pas OFFSET

### Tests
- Tests domaine : PHPUnit style — `describe/it`, pas de DB, pas de NestJS, < 100ms total
- Tests intégration : avec une DB PostgreSQL de test (`@testcontainers` ou DB locale)
- Tests e2e : supertest sur l'app NestJS compilée
- Nommer les tests : `it('should reject rental when bike is not available')`

### Git
- Conventional commits : `feat(rental):`, `fix(inventory):`, `refactor(sale):`
- Un commit par changement logique

## Commandes
- `pnpm install` — installer les dépendances
- `pnpm dev` — lancer en dev (watch mode)
- `pnpm build` — compiler
- `pnpm test` — tests unitaires
- `pnpm test:int` — tests intégration
- `pnpm test:e2e` — tests e2e
- `pnpm prisma:migrate` — appliquer les migrations
- `pnpm prisma:generate` — régénérer le client Prisma
- `pnpm lint` — ESLint + Prettier

## Règles pour Claude
- TOUJOURS proposer un plan en bullets avant de coder. Attendre "OK".
- Ne jamais modifier du code non demandé (pas de refactor surprise).
- Créer les tests AVANT ou EN MÊME TEMPS que le code.
- Vérifier que `pnpm build` et `pnpm test` passent après chaque changement.
- Si une requête SQL est complexe, montrer le EXPLAIN ANALYZE attendu.
- Utiliser les skills disponibles : /nestjs-clean-arch, /db-migration, /feature-module
```

---

## Fichier 2 — `.claude/skills/nestjs-clean-arch/SKILL.md`

```markdown
---
name: nestjs-clean-arch
description: >
  Scaffold ou vérifie l'architecture Clean Architecture NestJS.
  Utiliser quand on crée un nouveau projet, un nouveau module,
  ou qu'on vérifie la conformité architecturale.
  Triggers : "scaffold", "init project", "clean architecture", "vérifier l'archi".
---

# NestJS Clean Architecture — Scaffold & Vérification

## Objectif
Créer ou vérifier un projet NestJS qui respecte strictement la Clean Architecture
avec 4 couches : Domain, Application, Infrastructure, et la couche HTTP.

## Principes fondamentaux

### 1. Direction des dépendances
```
HTTP/Console → Infrastructure → Application → Domain
                                                ↑
                                    RIEN ne dépend de rien
                                    Le Domain est 100% pur TypeScript
```

### 2. Le Domain est SACRÉ
- Aucun import de `@nestjs/*`, `@prisma/*`, ou toute librairie externe
- Uniquement du TypeScript pur
- Les entités contiennent leurs invariants métier
- Les Value Objects sont `readonly` et auto-validés
- Les calculs sont des fonctions pures (même input → même output)
- Les ports (interfaces) définissent les contrats avec l'extérieur

### 3. Structure d'un module

Pour chaque nouveau module, créer EXACTEMENT cette structure :

```
src/modules/{module-name}/
├── domain/
│   ├── entities/
│   │   └── {entity}.entity.ts        # Classe avec named constructor + invariants
│   ├── value-objects/
│   │   └── {vo}.vo.ts                # readonly class, validation au constructeur
│   ├── events/
│   │   └── {entity}-{action}.event.ts # Simple DTO readonly
│   ├── ports/
│   │   └── {entity}.repository.port.ts # Interface TypeScript
│   ├── services/
│   │   └── {name}.service.ts          # Fonctions pures exportées
│   └── exceptions/
│       └── {name}.exception.ts        # extends DomainException
├── application/
│   ├── commands/
│   │   ├── {action}-{entity}.command.ts   # DTO readonly
│   │   └── {action}-{entity}.handler.ts   # @Injectable, dépend des ports
│   ├── queries/
│   │   ├── get-{entity}.query.ts
│   │   └── get-{entity}.handler.ts
│   └── dtos/
│       └── {entity}-response.dto.ts   # Mapping domain → API response
├── infrastructure/
│   ├── persistence/
│   │   ├── repositories/
│   │   │   └── prisma-{entity}.repository.ts  # implements port
│   │   └── mappers/
│   │       └── {entity}.mapper.ts     # Prisma model ↔ Domain entity
│   ├── http/
│   │   ├── controllers/
│   │   │   └── {entity}.controller.ts # Thin: validate → command → response
│   │   └── dtos/
│   │       └── create-{entity}.request.ts # class-validator decorators
│   └── {module-name}.module.ts
└── __tests__/
    ├── unit/
    │   ├── {entity}.entity.spec.ts
    │   └── {service}.service.spec.ts
    └── integration/
        └── prisma-{entity}.repository.spec.ts
```

### 4. Injection de dépendances avec Symbol tokens

```typescript
// Toujours utiliser des Symbol tokens, jamais les classes concrètes
export const BIKE_REPOSITORY = Symbol('BIKE_REPOSITORY');
export const INVENTORY_SERVICE = Symbol('INVENTORY_SERVICE');

// Dans le handler (application layer)
@Injectable()
export class CreateBikeHandler {
  constructor(
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
  ) {}
}

// Dans le module (infrastructure layer)
@Module({
  providers: [
    {
      provide: BIKE_REPOSITORY,
      useClass: PrismaBikeRepository,
    },
    CreateBikeHandler,
  ],
})
export class BikeModule {}
```

### 5. Checklist de vérification

Quand on vérifie l'architecture, contrôler :
- [ ] Le dossier `domain/` n'importe RIEN de `@nestjs` ou `@prisma`
- [ ] Les entités ont des named constructors (pas de `new Entity()` public)
- [ ] Les Value Objects sont `readonly` et se valident eux-mêmes
- [ ] Les handlers dépendent d'interfaces (ports), pas d'implémentations
- [ ] Les controllers font < 15 lignes par méthode
- [ ] Les tokens d'injection sont des Symbols
- [ ] Les tests domain ne nécessitent aucun setup NestJS
- [ ] Les prix sont en centimes (Integer)
- [ ] Les dates sont en TIMESTAMPTZ

## Commandes de vérification

```bash
# Vérifier qu'aucun fichier domain/ n'importe @nestjs ou @prisma
grep -r "@nestjs\|@prisma" src/modules/*/domain/ && echo "❌ VIOLATION" || echo "✅ Domain pur"

# Vérifier que les tests passent
pnpm test
pnpm build
```
```

---

## Fichier 3 — `.claude/skills/db-migration/SKILL.md`

```markdown
---
name: db-migration
description: >
  Créer et valider des migrations Prisma PostgreSQL.
  Utiliser quand on ajoute/modifie des tables, des colonnes, des index,
  ou qu'on crée le schema initial.
  Triggers : "migration", "schema", "base de données", "ajouter une table", "ajouter un champ".
---

# Prisma Migration — Bonnes pratiques PostgreSQL

## Règles Prisma pour ce projet

### Types obligatoires
| Donnée | Type Prisma | Type PostgreSQL |
|--------|-------------|-----------------|
| Identifiants | `String @id @default(uuid()) @db.Uuid` | `UUID` |
| Prix/Montants | `Int` (centimes) | `INTEGER` |
| Dates | `DateTime @db.Timestamptz()` | `TIMESTAMPTZ` |
| Texte libre | `String` (sans @db.VarChar) | `TEXT` |
| JSON structuré | `Json @default("{}")` via `@db.JsonB` | `JSONB` |
| Booléens | `Boolean @default(false)` | `BOOLEAN` |
| Statuts | `enum` Prisma | `TEXT` avec CHECK |

### Nommage
- Models : `PascalCase` + `@@map("snake_case")`
- Champs : `camelCase` + `@map("snake_case")`
- Tables de liaison : `{table1}_{table2}` en snake_case

### Index obligatoires
- **Toute foreign key** doit avoir un `@@index([fkField])`
- **Requêtes fréquentes** : index composite dans l'ordre de sélectivité
- **Filtres récurrents** : index partiel si possible (via `@@index` + raw SQL)
- **Recherche texte** : GIN index sur `to_tsvector` (migration SQL raw)

### Template de migration

Après chaque modification du schema :
1. `pnpm prisma:migrate` pour créer la migration
2. Vérifier le SQL généré dans `prisma/migrations/`
3. Ajouter manuellement si nécessaire :
   - Index partiels
   - Index GIN pour JSONB ou full-text
   - Contraintes CHECK complexes
   - Triggers si besoin

### Exemple de schema bien structuré

```prisma
model Bike {
  id            String      @id @default(uuid()) @db.Uuid
  name          String      @map("name")
  brand         String      @map("brand")
  model         String      @map("model_name")
  type          BikeType    @map("type")
  size          String      @map("size")
  priceCents    Int         @map("price_cents")
  dailyRateCents Int        @map("daily_rate_cents")
  status        BikeStatus  @default(AVAILABLE) @map("status")
  metadata      Json        @default("{}") @map("metadata") @db.JsonB
  createdAt     DateTime    @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt     DateTime    @updatedAt @map("updated_at") @db.Timestamptz()

  inventoryMovements InventoryMovement[]
  rentalItems        RentalItem[]
  saleItems          SaleItem[]

  @@index([status])
  @@index([type, status])
  @@index([brand, model])
  @@map("bikes")
}
```

### Vérification post-migration
```bash
# Vérifier que la migration s'applique proprement
pnpm prisma migrate dev --name {description}

# Régénérer le client
pnpm prisma generate

# Vérifier les index en DB
psql -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = '{table}';"
```
```

---

## Fichier 4 — `.claude/skills/feature-module/SKILL.md`

```markdown
---
name: feature-module
description: >
  Génère un module fonctionnel complet (domain + application + infrastructure + tests)
  en respectant la Clean Architecture. Utiliser pour ajouter une nouvelle fonctionnalité
  comme "créer une vente", "démarrer une location", "gérer le stock".
  Triggers : "nouvelle feature", "ajouter la fonctionnalité", "créer le use case",
  "implémenter le module", "CRUD".
---

# Feature Module Generator

## Processus de création d'une feature

### Étape 1 — Comprendre le besoin
Avant de coder, répondre à :
1. Quelle est l'**entité métier** principale ?
2. Quelles sont les **règles métier** (invariants) ?
3. Quelles sont les **opérations** (commands et queries) ?
4. Quelles sont les **dépendances** vers d'autres modules ?

### Étape 2 — Commencer par le Domain (inside-out)

Créer dans cet ordre :
1. **Value Objects** — les types métier (Money, BikeSize, RentalPeriod...)
2. **Entity** — avec named constructor, invariants, domain events
3. **Exceptions** — typées, avec contexte
4. **Ports** — interfaces repository et services externes
5. **Domain Services** — fonctions pures de calcul

### Étape 3 — Application layer

1. **Command DTO** — `readonly class` avec les données d'entrée
2. **Command Handler** — orchestre les ports, ne contient PAS de logique métier
3. **Query DTO + Handler** — pour les lectures
4. **Response DTO** — mapping domain → API, avec `static fromDomain(entity)`

### Étape 4 — Infrastructure layer

1. **Prisma schema** — ajouter/modifier le schema + migration
2. **Mapper** — conversion bidirectionnelle Prisma model ↔ Domain entity
3. **Repository** — implémente le port, utilise Prisma + Mapper
4. **Controller** — thin, validation class-validator, mapping HTTP ↔ Command
5. **NestJS Module** — wiring DI avec Symbol tokens

### Étape 5 — Tests

1. **Tests domain** (unit) — tester les invariants, calculs, transitions d'état
2. **Tests handler** (unit) — mock des ports, vérifier l'orchestration
3. **Tests repository** (integration) — avec vraie DB de test
4. **Tests controller** (e2e) — supertest sur endpoint complet

### Template d'entité

```typescript
// domain/entities/{name}.entity.ts
export class {Name} {
  private readonly domainEvents: DomainEvent[] = [];

  private constructor(
    private readonly props: {Name}Props,
  ) {}

  // Named constructor — intention explicite
  static create(params: Create{Name}Params): {Name} {
    // Validation des invariants
    // Construction
    // Domain event
    const entity = new {Name}({ ...params, status: '{initial}', createdAt: new Date() });
    entity.addEvent(new {Name}CreatedEvent(entity.id));
    return entity;
  }

  // Reconstitution depuis DB — pas de validation ni events
  static reconstitute(props: {Name}Props): {Name} {
    return new {Name}(props);
  }

  // Méthodes métier
  // ...

  // Getters (jamais de setters publics)
  get id(): string { return this.props.id; }

  releaseEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  private addEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
```

### Template de handler

```typescript
// application/commands/{action}-{entity}.handler.ts
@Injectable()
export class {Action}{Entity}Handler {
  constructor(
    @Inject({ENTITY}_REPOSITORY)
    private readonly repo: {Entity}RepositoryPort,
    // autres ports injectés...
  ) {}

  async execute(command: {Action}{Entity}Command): Promise<string> {
    // 1. Charger les données nécessaires via les ports
    // 2. Exécuter la logique domaine (appel entité/service)
    // 3. Persister via le port
    // 4. Dispatcher les domain events
    // 5. Retourner l'identifiant ou void
  }
}
```

### Vérification post-feature
```bash
# Architecture propre
grep -r "@nestjs\|@prisma" src/modules/*/domain/ && echo "❌" || echo "✅"

# Build + Tests
pnpm build && pnpm test && echo "✅ Feature OK"
```
```

---

## Fichier 5 — Prompt d'initialisation (à entrer dans Claude Code)

Copie et colle ce prompt directement dans Claude Code après avoir créé les fichiers ci-dessus :

````
Initialise le projet VéloShop — une application NestJS Clean Architecture
pour la gestion de vente et location de vélos avec gestion de stock.

Lis d'abord le CLAUDE.md à la racine, puis les skills disponibles.

## Ce que tu dois créer

### Phase 1 — Setup du projet

1. Initialiser un projet NestJS avec pnpm :
   - `nest new veloshop --package-manager pnpm --strict`
   - TypeScript strict mode
   - ESLint + Prettier configurés

2. Installer les dépendances :
   - `prisma` + `@prisma/client`
   - `class-validator` + `class-transformer`
   - `@nestjs/config` pour les env vars
   - `uuid` pour la génération d'UUID
   - Dev : `@types/uuid`, vitest (à la place de jest)

3. Configurer le tsconfig.json :
   - `strict: true`
   - `paths` pour les imports propres (`@modules/*`, `@shared/*`, `@libs/*`)

4. Créer la structure de dossiers selon le CLAUDE.md.

### Phase 2 — Shared Domain (Value Objects communs)

Créer dans `src/modules/shared/` :
- `Money` — value object pour les montants en centimes (add, subtract, multiply, format)
- `DateRange` — value object pour les périodes (start, end, overlaps, durationInDays)
- `DomainEvent` — interface de base pour les domain events
- `DomainException` — classe de base pour les exceptions métier
- `Entity` — classe abstraite de base (id, events, reconstitute)

### Phase 3 — Module Bike (catalogue)

Créer le module complet avec le skill /feature-module :

Entité `Bike` :
- Propriétés : id, name, brand, model, type (ROAD, MOUNTAIN, CITY, ELECTRIC, KIDS), size, priceCents (prix de vente), dailyRateCents (tarif location/jour), status (AVAILABLE, RENTED, SOLD, MAINTENANCE, RETIRED)
- Invariants : prix > 0, tarif journalier > 0, name non vide
- Méthodes : `markAsRented()`, `markAsReturned()`, `markAsSold()`, `sendToMaintenance()`, `retire()` — avec state machine (transitions autorisées)
- Domain events : BikeCreated, BikeStatusChanged

CRUD complet : Create, Read (by id, list with filters), Update, plus les actions de changement de statut.

### Phase 4 — Module Inventory (stock)

Entité `InventoryMovement` :
- Type : IN (entrée), OUT (sortie), ADJUSTMENT
- Lié à un Bike
- Raison : PURCHASE, SALE, RENTAL_OUT, RENTAL_RETURN, MAINTENANCE, LOSS, ADJUSTMENT
- Quantity, date, notes

Service domaine `StockService` (fonction pure) :
- `calculateCurrentStock(movements: InventoryMovement[]): number`
- `isAvailableForRental(bike: Bike, movements: InventoryMovement[]): boolean`
- `getLowStockAlerts(inventory: Map<string, number>, threshold: number): Alert[]`

### Phase 5 — Module Rental (location)

Entité `Rental` :
- Propriétés : id, customerId, items (RentalItem[]), period (DateRange), status (RESERVED, ACTIVE, RETURNED, CANCELLED), totalCents
- Invariants : au moins 1 item, period valide (end > start), tous les vélos doivent être AVAILABLE
- Méthodes : `start()`, `return()`, `cancel()`, `extend(newEndDate)`, `calculateTotal()`
- Calcul du prix : somme de (dailyRateCents × nbJours) pour chaque vélo

`RentalItem` : bikeId, dailyRateCents au moment de la réservation (snapshot du prix)

### Phase 6 — Module Sale (vente)

Entité `Sale` :
- Propriétés : id, customerId, items (SaleItem[]), status (PENDING, CONFIRMED, CANCELLED), totalCents, tvaCents
- Invariants : au moins 1 item, vélos doivent être AVAILABLE
- Méthodes : `confirm()`, `cancel()`, `calculateTotal()`, `calculateTVA(rate)`

### Phase 7 — Module Customer

Entité `Customer` :
- Propriétés : id, firstName, lastName, email, phone, address, createdAt
- Value Objects : `Email` (validé), `PhoneNumber` (validé)

### Phase 8 — Prisma Schema complet

Créer le schema avec le skill /db-migration :
- Toutes les tables avec les bonnes conventions (UUID, TIMESTAMPTZ, centimes, snake_case)
- Les relations entre tables
- Les index sur TOUTES les foreign keys
- Les index composites pertinents
- La migration initiale

### Phase 9 — Tests

Pour chaque module, créer :
1. Tests unitaires du domaine (entités, value objects, domain services)
2. Tests des handlers (avec mocks des ports)
3. Au moins 1 test e2e par module (endpoint principal)

## Contraintes

- Propose d'abord un PLAN complet en bullets. Attends mon "OK" avant de coder.
- Commence par Phase 1-2-3 puis on itère.
- Vérifie que `pnpm build` passe après chaque phase.
- Respecte STRICTEMENT le CLAUDE.md et les skills.
- Commite après chaque phase avec un message conventionnel.
````

---

## Bonus — Commande rapide `/new-feature`

Si tu veux une commande rapide pour ajouter des features plus tard, crée aussi :

**`.claude/commands/new-feature.md`**

```markdown
---
description: Génère une nouvelle feature complète (domain → infra → tests)
---

Utilise le skill /feature-module pour créer la feature suivante : $ARGUMENTS

Respecte strictement le CLAUDE.md du projet.
Propose d'abord un plan en bullets, attends "OK", puis implémente.
Vérifie que `pnpm build && pnpm test` passent à la fin.
```

Usage dans Claude Code :
```
> /new-feature ajouter un système de remise fidélité sur les locations
```

---

## Récap de la structure complète

```
veloshop/
├── CLAUDE.md                              # Mémoire projet (conventions, commandes, règles)
├── .claude/
│   ├── skills/
│   │   ├── nestjs-clean-arch/
│   │   │   └── SKILL.md                   # Scaffold/vérification archi
│   │   ├── db-migration/
│   │   │   └── SKILL.md                   # Migrations Prisma PostgreSQL
│   │   └── feature-module/
│   │       └── SKILL.md                   # Générateur de feature complète
│   └── commands/
│       └── new-feature.md                 # Raccourci /new-feature {desc}
└── src/
    └── modules/
        ├── shared/                         # Value Objects, base classes
        ├── bike/                           # Catalogue vélos
        ├── inventory/                      # Gestion stock
        ├── rental/                         # Locations
        ├── sale/                           # Ventes
        └── customer/                       # Clients
```

### Comment les skills interagissent

```
Toi : "ajoute le module rental"
        │
        ▼
Claude Code lit CLAUDE.md (conventions globales)
        │
        ▼
Claude Code charge /feature-module (SKILL.md)
  → Suit le processus inside-out (domain → app → infra → tests)
        │
        ├── Quand il crée le schema → charge /db-migration
        │   → Applique les conventions PostgreSQL
        │
        └── Quand il structure le module → charge /nestjs-clean-arch
            → Vérifie la conformité Clean Architecture
```

**Les 3 skills sont complémentaires** :
- `/nestjs-clean-arch` = les RÈGLES d'architecture
- `/db-migration` = les RÈGLES de base de données
- `/feature-module` = le PROCESSUS de création (qui utilise les 2 autres)
