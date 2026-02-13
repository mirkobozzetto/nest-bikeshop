---
name: nestjs-clean-arch
description: >
  Scaffold ou verifie l'architecture Clean Architecture NestJS.
  Utiliser quand on cree un nouveau projet, un nouveau module,
  ou qu'on verifie la conformite architecturale.
  Triggers : "scaffold", "init project", "clean architecture", "verifier l'archi".
---

# NestJS Clean Architecture -- Scaffold & Verification

## Principes fondamentaux

### Direction des dependances
```
HTTP/Console -> Infrastructure -> Application -> Domain
                                                  ^
                                      RIEN ne depend de rien
                                      Le Domain est 100% pur TypeScript
```

### Le Domain est SACRE
- Aucun import de `@nestjs/*`, `@prisma/*`, ou toute librairie externe
- Uniquement du TypeScript pur
- Les entites contiennent leurs invariants metier
- Les Value Objects sont `readonly` et auto-valides
- Les calculs sont des fonctions pures
- Les ports (interfaces) definissent les contrats avec l'exterieur

### Structure d'un module

```
src/modules/{module-name}/
├── domain/
│   ├── entities/
│   │   └── {entity}.entity.ts
│   ├── value-objects/
│   │   └── {vo}.vo.ts
│   ├── events/
│   │   └── {entity}-{action}.event.ts
│   ├── ports/
│   │   └── {entity}.repository.port.ts
│   ├── services/
│   │   └── {name}.service.ts
│   └── exceptions/
│       └── {name}.exception.ts
├── application/
│   ├── commands/
│   │   ├── {action}-{entity}.command.ts
│   │   └── {action}-{entity}.handler.ts
│   ├── queries/
│   │   ├── get-{entity}.query.ts
│   │   └── get-{entity}.handler.ts
│   └── dtos/
│       └── {entity}-response.dto.ts
├── infrastructure/
│   ├── persistence/
│   │   ├── repositories/
│   │   │   └── prisma-{entity}.repository.ts
│   │   └── mappers/
│   │       └── {entity}.mapper.ts
│   ├── http/
│   │   ├── controllers/
│   │   │   └── {entity}.controller.ts
│   │   └── dtos/
│   │       └── create-{entity}.request.ts
│   └── {module-name}.module.ts
└── __tests__/
    ├── unit/
    │   ├── {entity}.entity.spec.ts
    │   └── {service}.service.spec.ts
    └── integration/
        └── prisma-{entity}.repository.spec.ts
```

### Injection avec Symbol tokens

```typescript
export const BIKE_REPOSITORY = Symbol('BIKE_REPOSITORY');

@Injectable()
export class CreateBikeHandler {
  constructor(
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
  ) {}
}

@Module({
  providers: [
    { provide: BIKE_REPOSITORY, useClass: PrismaBikeRepository },
    CreateBikeHandler,
  ],
})
export class BikeModule {}
```

### Checklist de verification
- [ ] `domain/` n'importe RIEN de `@nestjs` ou `@prisma`
- [ ] Entites ont des named constructors
- [ ] Value Objects sont `readonly` et auto-valides
- [ ] Handlers dependent d'interfaces (ports), pas d'implementations
- [ ] Controllers font < 15 lignes par methode
- [ ] Tokens d'injection sont des Symbols
- [ ] Tests domain ne necessitent aucun setup NestJS
- [ ] Prix en centimes (Integer)
- [ ] Dates en TIMESTAMPTZ
