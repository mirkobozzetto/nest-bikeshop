import { Entity } from '../../../shared/domain/entities/entity.base.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum MovementReason {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  RENTAL_OUT = 'RENTAL_OUT',
  RENTAL_RETURN = 'RENTAL_RETURN',
  MAINTENANCE = 'MAINTENANCE',
  LOSS = 'LOSS',
  ADJUSTMENT = 'ADJUSTMENT',
}

export interface InventoryMovementProps {
  readonly id: string;
  readonly bikeId: string;
  readonly type: MovementType;
  readonly reason: MovementReason;
  readonly quantity: number;
  readonly date: Date;
  readonly notes?: string;
  readonly createdAt: Date;
}

export interface RecordMovementParams {
  readonly id: string;
  readonly bikeId: string;
  readonly type: MovementType;
  readonly reason: MovementReason;
  readonly quantity: number;
  readonly date?: Date;
  readonly notes?: string;
}

export class InventoryMovement extends Entity<InventoryMovementProps> {
  private constructor(props: InventoryMovementProps) {
    super(props);
  }

  static record(params: RecordMovementParams): InventoryMovement {
    if (!params.bikeId || params.bikeId.trim().length === 0) {
      throw new DomainException(
        'Bike ID cannot be empty',
        'INVENTORY_BIKE_ID_EMPTY',
      );
    }

    if (params.quantity <= 0) {
      throw new DomainException(
        'Quantity must be positive',
        'INVENTORY_QUANTITY_INVALID',
      );
    }

    const now = new Date();
    const movement = new InventoryMovement({
      id: params.id,
      bikeId: params.bikeId,
      type: params.type,
      reason: params.reason,
      quantity: params.quantity,
      date: params.date || now,
      notes: params.notes,
      createdAt: now,
    });

    movement.addEvent({
      eventName: 'InventoryMovementRecorded',
      occurredAt: now,
      aggregateId: params.id,
    });

    return movement;
  }

  static reconstitute(props: InventoryMovementProps): InventoryMovement {
    return new InventoryMovement(props);
  }

  get id(): string {
    return this.props.id;
  }

  get bikeId(): string {
    return this.props.bikeId;
  }

  get type(): MovementType {
    return this.props.type;
  }

  get reason(): MovementReason {
    return this.props.reason;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get date(): Date {
    return this.props.date;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
