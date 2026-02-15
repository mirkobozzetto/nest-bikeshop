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
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import { PageHeader } from '@/components/page-header';
import { DetailGrid, DetailItem } from '@/components/detail-grid';
import { Skeleton } from '@/components/ui/skeleton';
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
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={bike.name}
        actions={
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
        }
      />

      <Card>
        <CardContent className="pt-6">
          <DetailGrid>
            <DetailItem label="Marque" value={bike.brand} />
            <DetailItem label="Modèle" value={bike.model} />
            <DetailItem
              label="Type"
              value={typeLabels[bike.type] ?? bike.type}
            />
            <DetailItem label="Taille" value={bike.size} />
            <DetailItem label="Prix" value={formatCents(bike.priceCents)} />
            <DetailItem
              label="Tarif journalier"
              value={formatCents(bike.dailyRateCents)}
            />
            <DetailItem
              label="Statut"
              value={<BikeStatusBadge status={bike.status} />}
            />
            <DetailItem label="Créé le" value={formatDate(bike.createdAt)} />
          </DetailGrid>
        </CardContent>
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
