import type { Metadata } from 'next';
import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { getQueryClient } from '@/lib/query';
import { fetchRentals } from '@/features/rentals/api';
import { rentalKeys } from '@/features/rentals/keys';
import { RentalFilters } from '@/features/rentals/components/rental-filters';
import { RentalsTable } from '@/features/rentals/components/rentals-table';

export const metadata: Metadata = { title: 'Locations' };

export default async function RentalsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: rentalKeys.list(),
    queryFn: () => fetchRentals(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Locations"
        description="Gérez vos locations de vélos"
        actions={
          <Button asChild>
            <Link href="/rentals/new">Nouvelle location</Link>
          </Button>
        }
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <RentalFilters />
        <RentalsTable />
      </HydrationBoundary>
    </div>
  );
}
