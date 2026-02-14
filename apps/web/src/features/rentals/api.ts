import { apiFetch } from '@/lib/api';
import type {
  Rental,
  CreateRentalInput,
  ExtendRentalInput,
  RentalStatusAction,
} from '@/types';

export function fetchRentals(filters?: {
  customerId?: string;
  status?: string;
}): Promise<Rental[]> {
  const params = new URLSearchParams();
  if (filters?.customerId) params.set('customerId', filters.customerId);
  if (filters?.status) params.set('status', filters.status);
  const qs = params.toString();
  return apiFetch<Rental[]>(`/rentals${qs ? `?${qs}` : ''}`);
}

export function fetchRental(id: string): Promise<Rental> {
  return apiFetch<Rental>(`/rentals/${id}`);
}

export function createRental(input: CreateRentalInput): Promise<Rental> {
  return apiFetch<Rental>('/rentals', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateRentalStatus(
  id: string,
  action: RentalStatusAction,
): Promise<Rental> {
  return apiFetch<Rental>(`/rentals/${id}/${action}`, {
    method: 'PATCH',
  });
}

export function extendRental(
  id: string,
  input: ExtendRentalInput,
): Promise<Rental> {
  return apiFetch<Rental>(`/rentals/${id}/extend`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
