import {
  InventoryMovement,
  MovementType,
} from '../entities/inventory-movement.entity.js';

export function calculateCurrentStock(movements: InventoryMovement[]): number {
  return movements.reduce((stock, movement) => {
    if (movement.type === MovementType.OUT) {
      return stock - movement.quantity;
    }
    return stock + movement.quantity;
  }, 0);
}

export function isAvailableForRental(movements: InventoryMovement[]): boolean {
  return calculateCurrentStock(movements) > 0;
}

export interface LowStockAlert {
  readonly bikeId: string;
  readonly stock: number;
}

export function getLowStockAlerts(
  inventory: Map<string, number>,
  threshold: number,
): LowStockAlert[] {
  const alerts: LowStockAlert[] = [];

  for (const [bikeId, stock] of inventory.entries()) {
    if (stock <= threshold) {
      alerts.push({
        bikeId,
        stock,
      });
    }
  }

  return alerts;
}
