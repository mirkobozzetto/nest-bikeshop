'use client';

import Link from 'next/link';
import { useQueryState } from 'nuqs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { formatCents, formatDate } from '@/lib/format';
import { useRentals } from '../hooks';
import { RentalStatusBadge } from './rental-status-badge';

export function RentalsTable() {
  const [status] = useQueryState('status');
  const filters = status ? { status } : undefined;
  const { data: rentals, isLoading } = useRentals(filters);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rentals?.length) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Aucune location"
        description="Créez votre première location pour commencer."
        actionLabel="Nouvelle location"
        actionHref="/rentals/new"
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Vélos</TableHead>
              <TableHead>Début</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell className="font-mono text-xs">
                  {rental.customerId.slice(0, 8)}...
                </TableCell>
                <TableCell>{rental.items.length} vélo(s)</TableCell>
                <TableCell>{formatDate(rental.startDate)}</TableCell>
                <TableCell>{formatDate(rental.endDate)}</TableCell>
                <TableCell>{formatCents(rental.totalCents)}</TableCell>
                <TableCell>
                  <RentalStatusBadge status={rental.status} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/rentals/${rental.id}`}>Détails</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
