import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { fetchBike } from '@/features/bikes/api';
import { bikeKeys } from '@/features/bikes/hooks';
import { BikeDetail } from '@/features/bikes/components/bike-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BikeDetailPage({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: bikeKeys.detail(id),
    queryFn: () => fetchBike(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BikeDetail id={id} />
    </HydrationBoundary>
  );
}
