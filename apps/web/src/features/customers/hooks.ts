'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  fetchCustomers,
  fetchCustomer,
  createCustomer,
  updateCustomer,
} from './api';
import type { CreateCustomerInput, UpdateCustomerInput } from '@/types';
import { customerKeys } from './keys';

export { customerKeys } from './keys';

export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.list(),
    queryFn: () => fetchCustomers(),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => fetchCustomer(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: CreateCustomerInput) => createCustomer(input),
    onSuccess: () => {
      toast.success('Client créé avec succès');
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
      router.push('/customers');
    },
    onError: () => {
      toast.error('Erreur lors de la création du client');
    },
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCustomerInput) => updateCustomer(id, input),
    onSuccess: () => {
      toast.success('Client modifié avec succès');
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: () => {
      toast.error('Erreur lors de la modification du client');
    },
  });
}
