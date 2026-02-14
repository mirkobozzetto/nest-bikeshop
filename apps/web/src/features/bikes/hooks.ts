'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchBikes, fetchBike, createBike, updateBike, updateBikeStatus } from './api';
import type { BikesFilters } from './api';
import type { CreateBikeInput, UpdateBikeInput, BikeStatusAction } from '@/types';
import { bikeKeys } from './keys';

export { bikeKeys } from './keys';

export function useBikes(filters?: BikesFilters) {
  return useQuery({
    queryKey: bikeKeys.list(filters),
    queryFn: () => fetchBikes(filters),
  });
}

export function useBike(id: string) {
  return useQuery({
    queryKey: bikeKeys.detail(id),
    queryFn: () => fetchBike(id),
  });
}

export function useCreateBike() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (input: CreateBikeInput) => createBike(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bikeKeys.all });
      router.push('/bikes');
      router.refresh();
    },
  });
}

export function useUpdateBike(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBikeInput) => updateBike(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bikeKeys.all });
      queryClient.invalidateQueries({ queryKey: bikeKeys.detail(id) });
    },
  });
}

export function useUpdateBikeStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: BikeStatusAction) => updateBikeStatus(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bikeKeys.all });
      queryClient.invalidateQueries({ queryKey: bikeKeys.detail(id) });
    },
  });
}
