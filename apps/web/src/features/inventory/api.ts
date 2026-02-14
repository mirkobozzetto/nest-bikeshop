import { apiFetch } from '@/lib/api';
import type { Stock, InventoryMovement, RecordMovementInput } from '@/types';

export function fetchStock(bikeId: string): Promise<Stock> {
  return apiFetch<Stock>(`/inventory/stock/${bikeId}`);
}

export function fetchMovements(bikeId: string): Promise<InventoryMovement[]> {
  return apiFetch<InventoryMovement[]>(`/inventory/movements/${bikeId}`);
}

export function recordMovement(input: RecordMovementInput): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/inventory/movements', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
