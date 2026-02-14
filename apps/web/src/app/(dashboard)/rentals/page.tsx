import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { getQueryClient } from '@/lib/query';
import { fetchRentals } from '@/features/rentals/api';
import { rentalKeys } from '@/features/rentals/keys';
import { RentalFilters } from '@/features/rentals/components/rental-filters';
import { RentalsTable } from '@/features/rentals/components/rentals-table';

export default async function RentalsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: rentalKeys.list(),
    queryFn: () => fetchRentals(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
        <Button asChild>
          <Link href="/rentals/new">Nouvelle location</Link>
        </Button>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <RentalFilters />
        <RentalsTable />
      </HydrationBoundary>
    </div>
  );
}
