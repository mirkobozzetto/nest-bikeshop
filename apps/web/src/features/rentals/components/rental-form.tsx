'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import type { RentalItem } from '@/types';
import { useCreateRental } from '../hooks';

export function RentalForm() {
  const createRental = useCreateRental();

  const [customerId, setCustomerId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState<RentalItem[]>([
    { bikeId: '', dailyRateCents: 0 },
  ]);

  function updateItem(index: number, field: keyof RentalItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === 'dailyRateCents' ? Number(value) : value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { bikeId: '', dailyRateCents: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    void createRental.mutateAsync({
      customerId,
      items,
      startDate,
      endDate,
    });
  }

  return (
    <Card className="max-w-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customerId">ID Client</Label>
            <Input
              id="customerId"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Vélos</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                Ajouter un vélo
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label>ID Vélo</Label>
                  <Input
                    value={item.bikeId}
                    onChange={(e) => updateItem(index, 'bikeId', e.target.value)}
                    required
                  />
                </div>
                <div className="w-40 space-y-2">
                  <Label>Tarif/jour (cts)</Label>
                  <Input
                    type="number"
                    value={item.dailyRateCents}
                    onChange={(e) =>
                      updateItem(index, 'dailyRateCents', e.target.value)
                    }
                    required
                  />
                </div>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    Retirer
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button type="submit" disabled={createRental.isPending}>
            {createRental.isPending ? 'Création...' : 'Créer la location'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
