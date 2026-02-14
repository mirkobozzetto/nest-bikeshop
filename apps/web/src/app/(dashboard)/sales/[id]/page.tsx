'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCents, formatDateTime } from '@/lib/format';
import { useSale, useUpdateSaleStatus } from '@/features/sales/hooks';
import { SaleStatusBadge } from '@/features/sales/components/sale-status-badge';

export default function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: sale, isLoading } = useSale(id);
  const updateStatus = useUpdateSaleStatus(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!sale) {
    return <p className="text-muted-foreground">Vente introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/sales">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Vente</h1>
        <SaleStatusBadge status={sale.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm">Client</p>
            <p className="font-medium">{sale.customerId}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total</p>
            <p className="font-medium">{formatCents(sale.totalCents)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Date de création</p>
            <p className="font-medium">{formatDateTime(sale.createdAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Dernière mise à jour</p>
            <p className="font-medium">{formatDateTime(sale.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Vélo</TableHead>
                <TableHead>Prix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.bikeId}</TableCell>
                  <TableCell>{formatCents(item.priceCents)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {sale.status === 'PENDING' && (
        <div className="flex gap-3">
          <Button
            onClick={() => updateStatus.mutate('confirm')}
            disabled={updateStatus.isPending}
          >
            <CheckCircle />
            Confirmer
          </Button>
          <Button
            variant="destructive"
            onClick={() => updateStatus.mutate('cancel')}
            disabled={updateStatus.isPending}
          >
            <XCircle />
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
}
