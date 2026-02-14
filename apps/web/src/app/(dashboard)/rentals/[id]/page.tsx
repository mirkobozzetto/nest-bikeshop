import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { fetchRental } from '@/features/rentals/api';
import { rentalKeys } from '@/features/rentals/hooks';
import { RentalDetail } from '@/features/rentals/components/rental-detail';

export default async function RentalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: rentalKeys.detail(id),
    queryFn: () => fetchRental(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RentalDetail id={id} />
    </HydrationBoundary>
  );
}
