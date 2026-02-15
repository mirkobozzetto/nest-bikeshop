'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { DetailGrid, DetailItem } from '@/components/detail-grid';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCents, formatDate } from '@/lib/format';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import type { RentalStatus, RentalStatusAction } from '@/types';
import { useRental, useUpdateRentalStatus, useExtendRental } from '../hooks';
import { RentalStatusBadge } from './rental-status-badge';

const statusActions: Record<
  RentalStatus,
  { action: RentalStatusAction; label: string }[]
> = {
  RESERVED: [
    { action: 'start', label: 'Démarrer' },
    { action: 'cancel', label: 'Annuler' },
  ],
  ACTIVE: [
    { action: 'return', label: 'Retourner' },
    { action: 'cancel', label: 'Annuler' },
  ],
  RETURNED: [],
  CANCELLED: [],
};

export function RentalDetail({ id }: { id: string }) {
  const { data: rental, isLoading } = useRental(id);
  const updateStatus = useUpdateRentalStatus(id);
  const extend = useExtendRental(id);
  const [newEndDate, setNewEndDate] = useState('');
  const dialog = useConfirmDialog();

  function handleStatusAction(action: RentalStatusAction) {
    if (action === 'cancel') {
      dialog.confirm(() => updateStatus.mutate(action));
    } else {
      updateStatus.mutate(action);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!rental) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        Location introuvable.
      </p>
    );
  }

  const actions = statusActions[rental.status];

  function handleExtend(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    void extend.mutateAsync({ newEndDate }).then(() => setNewEndDate(''));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Location"
        actions={
          <Button variant="outline" asChild>
            <Link href="/rentals">Retour</Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <DetailGrid>
            <DetailItem
              label="Client"
              value={<span className="font-mono text-sm">{rental.customerId}</span>}
            />
            <DetailItem
              label="Statut"
              value={<RentalStatusBadge status={rental.status} />}
            />
            <DetailItem
              label="Début"
              value={formatDate(rental.startDate)}
            />
            <DetailItem
              label="Fin"
              value={formatDate(rental.endDate)}
            />
            <DetailItem
              label="Total"
              value={
                <span className="text-lg font-semibold">
                  {formatCents(rental.totalCents)}
                </span>
              }
            />
            <DetailItem
              label="Vélos"
              value={`${rental.items.length} vélo(s)`}
            />
          </DetailGrid>
        </CardContent>
      </Card>

      {rental.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vélos loués</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {rental.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded border p-2 text-sm"
                >
                  <span className="font-mono">{item.bikeId.slice(0, 8)}...</span>
                  <span>{formatCents(item.dailyRateCents)}/jour</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map(({ action, label }) => (
            <Button
              key={action}
              variant={action === 'cancel' ? 'destructive' : 'default'}
              onClick={() => handleStatusAction(action)}
              disabled={updateStatus.isPending}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      {rental.status === 'ACTIVE' && (
        <Card>
          <CardHeader>
            <CardTitle>Prolonger la location</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleExtend} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newEndDate">Prolonger jusqu&apos;au</Label>
                <Input
                  id="newEndDate"
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={extend.isPending}>
                Prolonger
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={dialog.open}
        onOpenChange={dialog.onOpenChange}
        onConfirm={dialog.onConfirm}
        title="Annuler la location"
        description="Cette action est irréversible. La location sera définitivement annulée."
        confirmLabel="Annuler la location"
        isPending={updateStatus.isPending}
      />
    </div>
  );
}
