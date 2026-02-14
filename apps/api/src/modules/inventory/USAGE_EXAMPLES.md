# Inventory Module - Usage Examples

## Enregistrer un mouvement de stock

```bash
curl -X POST http://localhost:3000/inventory/movements \
  -H "Content-Type: application/json" \
  -d '{
    "bikeId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "IN",
    "reason": "PURCHASE",
    "quantity": 5,
    "notes": "Nouveau stock Trek Domane"
  }'
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003"
}
```

## Consulter le stock d'un vélo

```bash
curl http://localhost:3000/inventory/stock/550e8400-e29b-41d4-a716-446655440002
```

Response:
```json
{
  "bikeId": "550e8400-e29b-41d4-a716-446655440002",
  "quantity": 5
}
```

## Consulter l'historique des mouvements

```bash
curl http://localhost:3000/inventory/movements/550e8400-e29b-41d4-a716-446655440002
```

Response:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "bikeId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "IN",
    "reason": "PURCHASE",
    "quantity": 5,
    "date": "2025-01-15T10:00:00Z",
    "notes": "Nouveau stock Trek Domane",
    "createdAt": "2025-01-15T10:00:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "bikeId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "OUT",
    "reason": "SALE",
    "quantity": 2,
    "date": "2025-01-15T12:00:00Z",
    "notes": null,
    "createdAt": "2025-01-15T12:00:00Z"
  }
]
```

## Utiliser les services de domaine (TypeScript pur)

```typescript
import {
  calculateCurrentStock,
  isAvailableForRental,
  getLowStockAlerts,
  InventoryMovement,
  MovementType,
  MovementReason,
} from '@inventory/domain';

const movements = [
  InventoryMovement.record({
    id: '1',
    bikeId: 'bike-1',
    type: MovementType.IN,
    reason: MovementReason.PURCHASE,
    quantity: 10,
  }),
  InventoryMovement.record({
    id: '2',
    bikeId: 'bike-1',
    type: MovementType.OUT,
    reason: MovementReason.SALE,
    quantity: 3,
  }),
];

const currentStock = calculateCurrentStock(movements);
console.log(currentStock); // 7

const available = isAvailableForRental(movements);
console.log(available); // true

const inventory = new Map([
  ['bike-1', 7],
  ['bike-2', 2],
  ['bike-3', 0],
]);

const lowStockAlerts = getLowStockAlerts(inventory, 3);
console.log(lowStockAlerts);
// [
//   { bikeId: 'bike-2', stock: 2 },
//   { bikeId: 'bike-3', stock: 0 }
// ]
```

## Types de mouvements supportés

### MovementType
- `IN`: Entrée de stock
- `OUT`: Sortie de stock
- `ADJUSTMENT`: Ajustement de stock

### MovementReason
- `PURCHASE`: Achat d'une nouvelle unité
- `SALE`: Vente d'une unité
- `RENTAL_OUT`: Départ en location
- `RENTAL_RETURN`: Retour de location
- `MAINTENANCE`: Mise à l'inventaire pour maintenance
- `LOSS`: Perte ou dégât
- `ADJUSTMENT`: Ajustement d'inventaire

## Architecture

### Domain Layer (TypeScript pur)
- `InventoryMovement` entity avec invariants
- `StockService` avec fonctions pures de calcul
- `InventoryRepositoryPort` interface

### Application Layer
- Commands: `RecordMovementCommand` + handler
- Queries: `GetStockQuery`, `GetMovementsQuery` + handlers
- DTOs pour les réponses

### Infrastructure Layer
- NestJS Module avec injection de dépendances
- `PrismaInventoryRepository` implémentation du port
- `InventoryMovementMapper` pour la sérialisation
- HTTP Controller pour l'API REST
- Enums et DTOs pour la validation

## Tests

Tous les tests domaine sont dans `__tests__/unit/` et exécutables sans DB:

```bash
pnpm test  # Exécute les specs .spec.ts
```

Tests inclus:
- `inventory-movement.entity.spec.ts` - Tests de l'entité
- `stock.service.spec.ts` - Tests des fonctions pures
- `record-movement.handler.spec.ts` - Tests du handler de commande
- `get-stock.handler.spec.ts` - Tests du handler de query
- `get-movements.handler.spec.ts` - Tests du handler de query
