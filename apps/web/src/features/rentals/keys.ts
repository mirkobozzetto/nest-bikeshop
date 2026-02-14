export const rentalKeys = {
  all: ['rentals'] as const,
  lists: () => [...rentalKeys.all, 'list'] as const,
  list: (filters?: { customerId?: string; status?: string }) =>
    [...rentalKeys.lists(), filters] as const,
  details: () => [...rentalKeys.all, 'detail'] as const,
  detail: (id: string) => [...rentalKeys.details(), id] as const,
};
