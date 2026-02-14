'use client';

import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCents, formatDate } from '@/lib/format';
import { useSales } from '../hooks';
import { SaleStatusBadge } from './sale-status-badge';

export function SalesTable() {
  const [status] = useQueryState('status');
  const filters = status ? { status } : undefined;
  const { data: sales, isLoading } = useSales(filters);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!sales?.length) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Aucune vente"
        description="Enregistrez votre première vente pour commencer."
        actionLabel="Nouvelle vente"
        actionHref="/sales/new"
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Vélos</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[70px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>{sale.customerId}</TableCell>
            <TableCell>{sale.items.length}</TableCell>
            <TableCell>{formatCents(sale.totalCents)}</TableCell>
            <TableCell>
              <SaleStatusBadge status={sale.status} />
            </TableCell>
            <TableCell>{formatDate(sale.createdAt)}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon-xs" asChild>
                <Link href={`/sales/${sale.id}`}>
                  <Eye />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
