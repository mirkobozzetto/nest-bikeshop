'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateRentalInput,
  ExtendRentalInput,
  RentalStatusAction,
} from '@/types';
import {
  fetchRentals,
  fetchRental,
  createRental,
  updateRentalStatus,
  extendRental,
} from './api';
import { rentalKeys } from './keys';

export { rentalKeys } from './keys';

export function useRentals(filters?: {
  customerId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: rentalKeys.list(filters),
    queryFn: () => fetchRentals(filters),
  });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: rentalKeys.detail(id),
    queryFn: () => fetchRental(id),
    enabled: !!id,
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRentalInput) => createRental(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.lists() });
    },
  });
}

export function useUpdateRentalStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: RentalStatusAction) =>
      updateRentalStatus(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: rentalKeys.lists() });
    },
  });
}

export function useExtendRental(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ExtendRentalInput) => extendRental(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rentalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: rentalKeys.lists() });
    },
  });
}
