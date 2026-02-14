'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCents, formatDate } from '@/lib/format';
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

  if (isLoading) {
    return (
      <p className="text-muted-foreground py-8 text-center">Chargement...</p>
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Location</h1>
        <Button variant="outline" asChild>
          <Link href="/rentals">Retour</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-sm">Client</p>
          <p className="font-mono text-sm">{rental.customerId}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Statut</p>
          <RentalStatusBadge status={rental.status} />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Début</p>
          <p>{formatDate(rental.startDate)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Fin</p>
          <p>{formatDate(rental.endDate)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Total</p>
          <p className="text-lg font-semibold">
            {formatCents(rental.totalCents)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Vélos</p>
          <p>{rental.items.length} vélo(s)</p>
        </div>
      </div>

      {rental.items.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Vélos loués</h2>
          <ul className="space-y-1">
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
        </div>
      )}

      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map(({ action, label }) => (
            <Button
              key={action}
              variant={action === 'cancel' ? 'destructive' : 'default'}
              onClick={() => updateStatus.mutate(action)}
              disabled={updateStatus.isPending}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      {rental.status === 'ACTIVE' && (
        <form onSubmit={handleExtend} className="flex items-end gap-4">
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
          <Button type="submit" variant="outline" disabled={extend.isPending}>
            Prolonger
          </Button>
        </form>
      )}
    </div>
  );
}
