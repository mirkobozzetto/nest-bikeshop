'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStock, fetchMovements, recordMovement } from './api';
import type { RecordMovementInput } from '@/types';
import { inventoryKeys } from './keys';

export { inventoryKeys } from './keys';

export function useStock(bikeId: string) {
  return useQuery({
    queryKey: inventoryKeys.stock(bikeId),
    queryFn: () => fetchStock(bikeId),
    enabled: !!bikeId,
  });
}

export function useMovements(bikeId: string) {
  return useQuery({
    queryKey: inventoryKeys.movements(bikeId),
    queryFn: () => fetchMovements(bikeId),
    enabled: !!bikeId,
  });
}

export function useRecordMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RecordMovementInput) => recordMovement(input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: inventoryKeys.stock(variables.bikeId),
      });
      void queryClient.invalidateQueries({
        queryKey: inventoryKeys.movements(variables.bikeId),
      });
    },
  });
}
