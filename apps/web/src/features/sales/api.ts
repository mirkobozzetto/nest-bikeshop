import { apiFetch } from '@/lib/api';
import type { Sale, CreateSaleInput, SaleStatusAction } from '@/types';

export function fetchSales(filters?: { customerId?: string; status?: string }) {
  const searchParams = new URLSearchParams();
  if (filters?.customerId) searchParams.set('customerId', filters.customerId);
  if (filters?.status) searchParams.set('status', filters.status);
  const query = searchParams.toString();
  return apiFetch<Sale[]>(`/sales${query ? `?${query}` : ''}`);
}

export function fetchSale(id: string) {
  return apiFetch<Sale>(`/sales/${id}`);
}

export function createSale(input: CreateSaleInput) {
  return apiFetch<Sale>('/sales', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateSaleStatus(id: string, action: SaleStatusAction) {
  return apiFetch<Sale>(`/sales/${id}/${action}`, {
    method: 'PATCH',
  });
}
