import {
  InventoryMovement,
  MovementType,
  MovementReason,
} from '../../../domain/entities/inventory-movement.entity.js';

interface PrismaRow {
  id: string;
  bikeId: string;
  type: string;
  reason: string;
  quantity: number;
  date: Date;
  notes?: string | null;
  createdAt: Date;
}

export class InventoryMovementMapper {
  static toDomain(raw: PrismaRow): InventoryMovement {
    return InventoryMovement.reconstitute({
      id: raw.id,
      bikeId: raw.bikeId,
      type: raw.type as MovementType,
      reason: raw.reason as MovementReason,
      quantity: raw.quantity,
      date: raw.date,
      notes: raw.notes ?? undefined,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(movement: InventoryMovement) {
    return {
      id: movement.id,
      bikeId: movement.bikeId,
      type: movement.type,
      reason: movement.reason,
      quantity: movement.quantity,
      date: movement.date,
      notes: movement.notes,
      createdAt: movement.createdAt,
    };
  }
}
