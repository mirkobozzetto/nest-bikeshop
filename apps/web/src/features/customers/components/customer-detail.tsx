'use client';

import { useCustomer } from '../hooks';
import { formatDate } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { DetailGrid, DetailItem } from '@/components/detail-grid';
import { Skeleton } from '@/components/ui/skeleton';

interface CustomerDetailProps {
  id: string;
}

export function CustomerDetail({ id }: CustomerDetailProps) {
  const { data: customer, isLoading } = useCustomer(id);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!customer) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Client introuvable.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">
            {customer.firstName} {customer.lastName}
          </h2>
          <DetailGrid>
            <DetailItem label="Email" value={customer.email} />
            <DetailItem label="Téléphone" value={customer.phone} />
            <DetailItem label="Adresse" value={customer.address} />
            <DetailItem
              label="Créé le"
              value={formatDate(customer.createdAt)}
            />
          </DetailGrid>
        </div>
      </CardContent>
    </Card>
  );
}
