import type { InventoryMovement } from '../entities/inventory-movement.entity.js';

export interface InventoryRepositoryPort {
  saveMovement(movement: InventoryMovement): Promise<void>;
  findMovementsByBikeId(bikeId: string): Promise<InventoryMovement[]>;
  findMovementById(id: string): Promise<InventoryMovement | null>;
}

export const INVENTORY_REPOSITORY = Symbol('INVENTORY_REPOSITORY');
