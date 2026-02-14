'use client';

import { useCustomer } from '../hooks';
import { formatDate } from '@/lib/format';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CustomerDetailProps {
  id: string;
}

export function CustomerDetail({ id }: CustomerDetailProps) {
  const { data: customer, isLoading } = useCustomer(id);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (!customer) {
    return <p className="text-muted-foreground">Client introuvable.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {customer.firstName} {customer.lastName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="font-medium">Email : </span>
          {customer.email}
        </div>
        <div>
          <span className="font-medium">Téléphone : </span>
          {customer.phone}
        </div>
        <div>
          <span className="font-medium">Adresse : </span>
          {customer.address}
        </div>
        <div>
          <span className="font-medium">Créé le : </span>
          {formatDate(customer.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}
