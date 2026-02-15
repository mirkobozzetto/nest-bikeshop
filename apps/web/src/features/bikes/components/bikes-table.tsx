'use client';

import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { MoreHorizontal } from 'lucide-react';
import { useBikes } from '../hooks';
import { BikeStatusBadge } from './bike-status-badge';
import { formatCents } from '@/lib/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUpdateBikeStatus } from '../hooks';
import { EmptyState } from '@/components/empty-state';
import { Bike as BikeIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { BikeStatusAction } from '@/types';

const typeLabels: Record<string, string> = {
  ROAD: 'Route',
  MOUNTAIN: 'VTT',
  CITY: 'Ville',
  ELECTRIC: 'Électrique',
  KIDS: 'Enfant',
};

export function BikesTable() {
  const [type] = useQueryState('type');
  const [status] = useQueryState('status');
  const filters = {
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
  };
  const { data: bikes, isLoading } = useBikes(filters);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Marque</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Tarif/jour</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (!bikes?.length) {
    return (
      <EmptyState
        icon={BikeIcon}
        title="Aucun vélo"
        description="Commencez par ajouter votre premier vélo au catalogue."
        actionLabel="Ajouter un vélo"
        actionHref="/bikes/new"
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Marque</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Tarif/jour</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bikes.map((bike) => (
              <BikeRow key={bike.id} bike={bike} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function BikeRow({
  bike,
}: {
  bike: {
    id: string;
    name: string;
    brand: string;
    type: string;
    size: string;
    priceCents: number;
    dailyRateCents: number;
    status: 'AVAILABLE' | 'RENTED' | 'SOLD' | 'MAINTENANCE' | 'RETIRED';
  };
}) {
  const { mutate: updateStatus } = useUpdateBikeStatus(bike.id);

  const statusActions: { action: BikeStatusAction; label: string }[] = [
    { action: 'rent', label: 'Louer' },
    { action: 'return', label: 'Retourner' },
    { action: 'sell', label: 'Vendre' },
    { action: 'maintenance', label: 'Maintenance' },
    { action: 'retire', label: 'Retirer' },
  ];

  return (
    <TableRow>
      <TableCell>
        <Link
          href={`/bikes/${bike.id}`}
          className="font-medium hover:underline"
        >
          {bike.name}
        </Link>
      </TableCell>
      <TableCell>{bike.brand}</TableCell>
      <TableCell>{typeLabels[bike.type] ?? bike.type}</TableCell>
      <TableCell>{bike.size}</TableCell>
      <TableCell>{formatCents(bike.priceCents)}</TableCell>
      <TableCell>{formatCents(bike.dailyRateCents)}</TableCell>
      <TableCell>
        <BikeStatusBadge status={bike.status} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/bikes/${bike.id}`}>Voir</Link>
            </DropdownMenuItem>
            {statusActions.map((sa) => (
              <DropdownMenuItem
                key={sa.action}
                onClick={() => updateStatus(sa.action)}
              >
                {sa.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
