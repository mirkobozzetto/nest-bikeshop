import type { BikesFilters } from './api';

export const bikeKeys = {
  all: ['bikes'] as const,
  list: (filters?: BikesFilters) => [...bikeKeys.all, 'list', filters] as const,
  detail: (id: string) => [...bikeKeys.all, 'detail', id] as const,
};
