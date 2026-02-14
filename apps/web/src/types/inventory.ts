export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export type MovementReason =
  | 'PURCHASE'
  | 'SALE'
  | 'RENTAL_OUT'
  | 'RENTAL_RETURN'
  | 'MAINTENANCE'
  | 'LOSS'
  | 'ADJUSTMENT';

export interface Stock {
  bikeId: string;
  quantity: number;
}

export interface InventoryMovement {
  id: string;
  bikeId: string;
  type: MovementType;
  reason: MovementReason;
  quantity: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface RecordMovementInput {
  bikeId: string;
  type: MovementType;
  reason: MovementReason;
  quantity: number;
  date?: string;
  notes?: string;
}
