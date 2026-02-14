'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchCustomers, fetchCustomer, createCustomer, updateCustomer } from './api';
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
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      router.push('/customers');
    },
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCustomerInput) => updateCustomer(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}
