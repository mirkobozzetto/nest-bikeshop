import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { fetchBikes } from '@/features/bikes/api';
import { bikeKeys } from '@/features/bikes/keys';
import { BikesTable } from '@/features/bikes/components/bikes-table';
import { BikeFilters } from '@/features/bikes/components/bike-filters';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: Promise<{ type?: string; status?: string; brand?: string }>;
}

export default async function BikesPage({ searchParams }: Props) {
  const filters = await searchParams;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: bikeKeys.list(filters),
    queryFn: () => fetchBikes(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Vélos</h1>
          <Button asChild>
            <Link href="/bikes/new">Ajouter un vélo</Link>
          </Button>
        </div>
        <BikeFilters />
        <BikesTable />
      </div>
    </HydrationBoundary>
  );
}
