import type {
  MovementType,
  MovementReason,
} from '../../domain/entities/inventory-movement.entity.js';

export class RecordMovementCommand {
  constructor(
    public readonly bikeId: string,
    public readonly type: MovementType,
    public readonly reason: MovementReason,
    public readonly quantity: number,
    public readonly date?: Date,
    public readonly notes?: string,
  ) {}
}
