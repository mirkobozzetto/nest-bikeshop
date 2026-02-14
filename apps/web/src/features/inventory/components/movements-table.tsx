'use client';

import { useMovements } from '../hooks';
import { formatDate } from '@/lib/format';
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
    return <p>Chargement...</p>;
  }

  if (!movements?.length) {
    return <p className="text-muted-foreground">Aucun mouvement pour ce vélo.</p>;
  }

  return (
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
  );
}
