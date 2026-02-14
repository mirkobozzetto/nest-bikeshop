'use client';

import { useState } from 'react';
import { useQueryState } from 'nuqs';
import { StockDisplay } from './stock-display';
import { MovementsTable } from './movements-table';
import { MovementForm } from './movement-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function InventoryPageClient() {
  const [bikeId, setBikeId] = useQueryState('bikeId', { defaultValue: '' });
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Entrer l'ID du vélo..."
          value={bikeId}
          onChange={(e) => setBikeId(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {bikeId && (
        <>
          <StockDisplay bikeId={bikeId} />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Mouvements</h2>
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Fermer' : 'Nouveau mouvement'}
              </Button>
            </div>
            {showForm && (
              <MovementForm bikeId={bikeId} onSuccess={() => setShowForm(false)} />
            )}
            <MovementsTable bikeId={bikeId} />
          </div>
        </>
      )}
    </div>
  );
}
