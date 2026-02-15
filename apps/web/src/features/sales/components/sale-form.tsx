'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SaleItem } from '@/types';
import { useCreateSale } from '../hooks';

export function SaleForm() {
  const createSale = useCreateSale();
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<SaleItem[]>([
    { bikeId: '', priceCents: 0 },
  ]);

  function addItem() {
    setItems([...items, { bikeId: '', priceCents: 0 }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof SaleItem, value: string) {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      if (field === 'priceCents') {
        return { ...item, priceCents: Math.round(Number(value) * 100) };
      }
      return { ...item, [field]: value };
    });
    setItems(updated);
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    void createSale.mutateAsync({ customerId, items });
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Articles</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus />
                Ajouter
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex items-end gap-3">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor={`bikeId-${index}`}>ID Vélo</Label>
                  <Input
                    id={`bikeId-${index}`}
                    value={item.bikeId}
                    onChange={(e) => updateItem(index, 'bikeId', e.target.value)}
                    required
                  />
                </div>
                <div className="grid w-40 gap-2">
                  <Label htmlFor={`price-${index}`}>Prix (EUR)</Label>
                  <Input
                    id={`price-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.priceCents / 100}
                    onChange={(e) =>
                      updateItem(index, 'priceCents', e.target.value)
                    }
                    required
                  />
                </div>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button type="submit" disabled={createSale.isPending} className="w-full">
            {createSale.isPending ? 'Enregistrement...' : 'Créer la vente'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
