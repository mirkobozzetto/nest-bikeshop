'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SaleStatusAction } from '@/types';
import { fetchSales, fetchSale, createSale, updateSaleStatus } from './api';
import { saleKeys } from './keys';

export { saleKeys } from './keys';

export function useSales(filters?: { customerId?: string; status?: string }) {
  return useQuery({
    queryKey: saleKeys.list(filters),
    queryFn: () => fetchSales(filters),
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: saleKeys.detail(id),
    queryFn: () => fetchSale(id),
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
    },
  });
}

export function useUpdateSaleStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: SaleStatusAction) => updateSaleStatus(id, action),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: saleKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
    },
  });
}
