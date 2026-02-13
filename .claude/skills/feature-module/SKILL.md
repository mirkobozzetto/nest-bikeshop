---
name: feature-module
description: >
  Genere un module fonctionnel complet (domain + application + infrastructure + tests)
  en respectant la Clean Architecture. Utiliser pour ajouter une nouvelle fonctionnalite.
  Triggers : "nouvelle feature", "ajouter la fonctionnalite", "creer le use case",
  "implementer le module", "CRUD".
---

# Feature Module Generator

## Processus de creation

### Etape 1 -- Comprendre le besoin
1. Quelle est l'entite metier principale ?
2. Quelles sont les regles metier (invariants) ?
3. Quelles sont les operations (commands et queries) ?
4. Quelles sont les dependances vers d'autres modules ?

### Etape 2 -- Domain (inside-out)
1. **Value Objects** -- types metier (Money, BikeSize, RentalPeriod...)
2. **Entity** -- named constructor, invariants, domain events
3. **Exceptions** -- typees, avec contexte
4. **Ports** -- interfaces repository et services externes
5. **Domain Services** -- fonctions pures de calcul

### Etape 3 -- Application layer
1. **Command DTO** -- `readonly class` avec les donnees d'entree
2. **Command Handler** -- orchestre les ports, PAS de logique metier
3. **Query DTO + Handler** -- pour les lectures
4. **Response DTO** -- mapping domain -> API, avec `static fromDomain(entity)`

### Etape 4 -- Infrastructure layer
1. **Prisma schema** -- ajouter/modifier + migration
2. **Mapper** -- Prisma model <-> Domain entity
3. **Repository** -- implemente le port, utilise Prisma + Mapper
4. **Controller** -- thin, class-validator, mapping HTTP <-> Command
5. **NestJS Module** -- wiring DI avec Symbol tokens

### Etape 5 -- Tests (TDD)
1. **Tests domain** (unit) -- invariants, calculs, transitions d'etat
2. **Tests handler** (unit) -- mock des ports, verifier l'orchestration
3. **Tests repository** (integration) -- vraie DB de test
4. **Tests controller** (e2e) -- supertest sur endpoint complet

### Template entite

```typescript
export class {Name} {
  private readonly domainEvents: DomainEvent[] = [];

  private constructor(private readonly props: {Name}Props) {}

  static create(params: Create{Name}Params): {Name} {
    const entity = new {Name}({ ...params, createdAt: new Date() });
    entity.addEvent(new {Name}CreatedEvent(entity.id));
    return entity;
  }

  static reconstitute(props: {Name}Props): {Name} {
    return new {Name}(props);
  }

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

### Template handler

```typescript
@Injectable()
export class {Action}{Entity}Handler {
  constructor(
    @Inject({ENTITY}_REPOSITORY)
    private readonly repo: {Entity}RepositoryPort,
  ) {}

  async execute(command: {Action}{Entity}Command): Promise<string> {
    // 1. Charger via les ports
    // 2. Logique domaine
    // 3. Persister via le port
    // 4. Dispatcher domain events
    // 5. Retourner l'identifiant
  }
}
```
