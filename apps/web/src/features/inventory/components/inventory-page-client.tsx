'use client';

import { useState } from 'react';
import { useQueryState } from 'nuqs';
import { StockDisplay } from './stock-display';
import { MovementsTable } from './movements-table';
import { MovementForm } from './movement-form';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/empty-state';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export function InventoryPageClient() {
  const [bikeId, setBikeId] = useQueryState('bikeId', { defaultValue: '' });
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Entrer l'ID du vélo..."
            value={bikeId}
            onChange={(e) => void setBikeId(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {!bikeId ? (
        <EmptyState
          icon={Package}
          title="Consultez le stock"
          description="Entrez un ID de vélo pour consulter le stock et les mouvements."
        />
      ) : (
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
              <MovementForm
                bikeId={bikeId}
                onSuccess={() => setShowForm(false)}
              />
            )}
            <MovementsTable bikeId={bikeId} />
          </div>
        </>
      )}
    </div>
  );
}
