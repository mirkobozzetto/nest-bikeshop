'use client';

import { useMovements } from '../hooks';
import { formatDate } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MovementsTableProps {
  bikeId: string;
}

export function MovementsTable({ bikeId }: MovementsTableProps) {
  const { data: movements, isLoading } = useMovements(bikeId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-2 pt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!movements?.length) {
    return (
      <p className="text-muted-foreground">Aucun mouvement pour ce vélo.</p>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Raison</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{formatDate(movement.date)}</TableCell>
                <TableCell>{movement.type}</TableCell>
                <TableCell>{movement.reason}</TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>{movement.notes ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
