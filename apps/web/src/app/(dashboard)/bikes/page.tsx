import type { Metadata } from 'next';
import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { fetchBikes } from '@/features/bikes/api';
import { bikeKeys } from '@/features/bikes/keys';
import { BikesTable } from '@/features/bikes/components/bikes-table';
import { BikeFilters } from '@/features/bikes/components/bike-filters';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Vélos' };

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
      <div className="space-y-6">
        <PageHeader
          title="Vélos"
          description="Gérez votre catalogue de vélos"
          actions={
            <Button asChild>
              <Link href="/bikes/new">Ajouter un vélo</Link>
            </Button>
          }
        />
        <BikeFilters />
        <BikesTable />
      </div>
    </HydrationBoundary>
  );
}
