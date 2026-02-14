import Link from 'next/link';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { fetchCustomer } from '@/features/customers/api';
import { customerKeys } from '@/features/customers/hooks';
import { CustomerDetail } from '@/features/customers/components/customer-detail';
import { Button } from '@/components/ui/button';

interface CustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => fetchCustomer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Fiche client</h1>
          <Button asChild variant="outline">
            <Link href={`/customers/${id}/edit`}>Modifier</Link>
          </Button>
        </div>
        <CustomerDetail id={id} />
      </div>
    </HydrationBoundary>
  );
}
