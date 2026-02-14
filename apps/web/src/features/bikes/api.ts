import { apiFetch } from '@/lib/api';
import type { Bike, CreateBikeInput, UpdateBikeInput, BikeStatusAction } from '@/types';

export interface BikesFilters {
  type?: string;
  status?: string;
  brand?: string;
}

export function fetchBikes(filters?: BikesFilters): Promise<Bike[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.set('type', filters.type);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.brand) params.set('brand', filters.brand);
  const qs = params.toString();
  return apiFetch<Bike[]>(`/bikes${qs ? `?${qs}` : ''}`);
}

export function fetchBike(id: string): Promise<Bike> {
  return apiFetch<Bike>(`/bikes/${id}`);
}

export function createBike(input: CreateBikeInput): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/bikes', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateBike(id: string, input: UpdateBikeInput): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/bikes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function updateBikeStatus(id: string, action: BikeStatusAction): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/bikes/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}
