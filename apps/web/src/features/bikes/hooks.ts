'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  fetchBikes,
  fetchBike,
  createBike,
  updateBike,
  updateBikeStatus,
} from './api';
import type { BikesFilters } from './api';
import type {
  CreateBikeInput,
  UpdateBikeInput,
  BikeStatusAction,
} from '@/types';
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
      toast.success('Vélo créé avec succès');
      void queryClient.invalidateQueries({ queryKey: bikeKeys.all });
      router.push('/bikes');
      router.refresh();
    },
    onError: () => {
      toast.error('Erreur lors de la création du vélo');
    },
  });
}

export function useUpdateBike(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBikeInput) => updateBike(id, input),
    onSuccess: () => {
      toast.success('Vélo modifié avec succès');
      void queryClient.invalidateQueries({ queryKey: bikeKeys.all });
      void queryClient.invalidateQueries({ queryKey: bikeKeys.detail(id) });
    },
    onError: () => {
      toast.error('Erreur lors de la modification du vélo');
    },
  });
}

export function useUpdateBikeStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: BikeStatusAction) => updateBikeStatus(id, action),
    onSuccess: () => {
      toast.success('Statut du vélo mis à jour');
      void queryClient.invalidateQueries({ queryKey: bikeKeys.all });
      void queryClient.invalidateQueries({ queryKey: bikeKeys.detail(id) });
    },
    onError: () => {
      toast.error('Erreur lors du changement de statut');
    },
  });
}
