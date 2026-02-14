'use client';

import Link from 'next/link';
import { useBike, useUpdateBikeStatus } from '../hooks';
import { BikeStatusBadge } from './bike-status-badge';
import { formatCents, formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import type { BikeStatusAction } from '@/types';

const typeLabels: Record<string, string> = {
  ROAD: 'Route',
  MOUNTAIN: 'VTT',
  CITY: 'Ville',
  ELECTRIC: 'Électrique',
  KIDS: 'Enfant',
};

const statusActions: { action: BikeStatusAction; label: string }[] = [
  { action: 'rent', label: 'Louer' },
  { action: 'return', label: 'Retourner' },
  { action: 'sell', label: 'Vendre' },
  { action: 'maintenance', label: 'Maintenance' },
  { action: 'retire', label: 'Retirer' },
];

const destructiveActions = new Set<BikeStatusAction>(['sell', 'retire']);

export function BikeDetail({ id }: { id: string }) {
  const { data: bike, isLoading } = useBike(id);
  const statusMutation = useUpdateBikeStatus(id);
  const dialog = useConfirmDialog();

  function handleStatusAction(action: BikeStatusAction) {
    if (destructiveActions.has(action)) {
      dialog.confirm(() => statusMutation.mutate(action));
    } else {
      statusMutation.mutate(action);
    }
  }

  if (isLoading || !bike) {
    return (
      <p className="text-muted-foreground py-8 text-center">Chargement...</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{bike.name}</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Changer le statut</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusActions.map((sa) => (
                <DropdownMenuItem
                  key={sa.action}
                  onClick={() => handleStatusAction(sa.action)}
                >
                  {sa.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" asChild>
            <Link href="/bikes">Retour</Link>
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-muted-foreground text-sm">Marque</dt>
            <dd className="font-medium">{bike.brand}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Modèle</dt>
            <dd className="font-medium">{bike.model}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Type</dt>
            <dd className="font-medium">
              {typeLabels[bike.type] ?? bike.type}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Taille</dt>
            <dd className="font-medium">{bike.size}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Prix</dt>
            <dd className="font-medium">{formatCents(bike.priceCents)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Tarif journalier</dt>
            <dd className="font-medium">{formatCents(bike.dailyRateCents)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Statut</dt>
            <dd>
              <BikeStatusBadge status={bike.status} />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Créé le</dt>
            <dd className="font-medium">{formatDate(bike.createdAt)}</dd>
          </div>
        </dl>
      </Card>

      <ConfirmDialog
        open={dialog.open}
        onOpenChange={dialog.onOpenChange}
        onConfirm={dialog.onConfirm}
        title="Confirmer l'action"
        description="Cette action va changer le statut du vélo de manière irréversible. Continuer ?"
        confirmLabel="Confirmer"
        isPending={statusMutation.isPending}
      />
    </div>
  );
}
