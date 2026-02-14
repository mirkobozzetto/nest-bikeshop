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
import { Button } from '@/components/ui/button';
import { formatCents, formatDate } from '@/lib/format';
import { useRentals } from '../hooks';
import { RentalStatusBadge } from './rental-status-badge';

export function RentalsTable() {
  const [status] = useQueryState('status');
  const filters = status ? { status } : undefined;
  const { data: rentals, isLoading } = useRentals(filters);

  if (isLoading) {
    return (
      <p className="text-muted-foreground py-8 text-center">Chargement...</p>
    );
  }

  if (!rentals?.length) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        Aucune location trouvée.
      </p>
    );
  }

  return (
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
  );
}
