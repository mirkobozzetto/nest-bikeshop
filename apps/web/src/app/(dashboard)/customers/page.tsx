import type { Metadata } from 'next';
import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { fetchCustomers } from '@/features/customers/api';
import { customerKeys } from '@/features/customers/keys';
import { CustomersTable } from '@/features/customers/components/customers-table';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Clients' };

export default async function CustomersPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: customerKeys.list(),
    queryFn: () => fetchCustomers(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Clients</h1>
          <Button asChild>
            <Link href="/customers/new">Ajouter un client</Link>
          </Button>
        </div>
        <CustomersTable />
      </div>
    </HydrationBoundary>
  );
}
