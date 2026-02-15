import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { getQueryClient } from '@/lib/query';
import { fetchSales } from '@/features/sales/api';
import { saleKeys } from '@/features/sales/keys';
import { SaleFilters } from '@/features/sales/components/sale-filters';
import { SalesTable } from '@/features/sales/components/sales-table';

export const metadata: Metadata = { title: 'Ventes' };

export default async function SalesPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: saleKeys.list(),
    queryFn: () => fetchSales(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <PageHeader
          title="Ventes"
          description="Gérez vos ventes"
          actions={
            <Button asChild>
              <Link href="/sales/new">
                <Plus />
                Nouvelle vente
              </Link>
            </Button>
          }
        />
        <SaleFilters />
        <SalesTable />
      </div>
    </HydrationBoundary>
  );
}
