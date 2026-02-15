'use client';

import { use } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { DetailGrid, DetailItem } from '@/components/detail-grid';
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
      <div className="space-y-6">
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
      <PageHeader
        title="Détail de la vente"
        actions={
          <Button variant="outline" asChild>
            <Link href="/sales">Retour</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailGrid>
            <DetailItem label="Client" value={sale.customerId} />
            <DetailItem label="Total" value={formatCents(sale.totalCents)} />
            <DetailItem
              label="Statut"
              value={<SaleStatusBadge status={sale.status} />}
            />
            <DetailItem
              label="Date de création"
              value={formatDateTime(sale.createdAt)}
            />
            <DetailItem
              label="Dernière mise à jour"
              value={formatDateTime(sale.updatedAt)}
            />
          </DetailGrid>
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
