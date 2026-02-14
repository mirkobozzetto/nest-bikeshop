import { apiFetch } from '@/lib/api';
import type { Customer, CreateCustomerInput, UpdateCustomerInput } from '@/types';

export function fetchCustomers(params?: { limit?: number; offset?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  const query = searchParams.toString();
  return apiFetch<Customer[]>(`/customers${query ? `?${query}` : ''}`);
}

export function fetchCustomer(id: string) {
  return apiFetch<Customer>(`/customers/${id}`);
}

export function createCustomer(input: CreateCustomerInput) {
  return apiFetch<Customer>('/customers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateCustomer(id: string, input: UpdateCustomerInput) {
  return apiFetch<Customer>(`/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
