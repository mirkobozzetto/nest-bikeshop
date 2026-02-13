import type { InventoryMovement } from '../../domain/entities/inventory-movement.entity.js';

export class InventoryMovementResponseDto {
  constructor(
    public readonly id: string,
    public readonly bikeId: string,
    public readonly type: string,
    public readonly reason: string,
    public readonly quantity: number,
    public readonly date: Date,
    public readonly notes: string | undefined,
    public readonly createdAt: Date,
  ) {}

  static fromDomain(movement: InventoryMovement): InventoryMovementResponseDto {
    return new InventoryMovementResponseDto(
      movement.id,
      movement.bikeId,
      movement.type,
      movement.reason,
      movement.quantity,
      movement.date,
      movement.notes,
      movement.createdAt,
    );
  }
}
