'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCreateBike, useUpdateBike } from '../hooks';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { Bike, BikeType } from '@/types';

const bikeTypes: { value: BikeType; label: string }[] = [
  { value: 'ROAD', label: 'Route' },
  { value: 'MOUNTAIN', label: 'VTT' },
  { value: 'CITY', label: 'Ville' },
  { value: 'ELECTRIC', label: 'Électrique' },
  { value: 'KIDS', label: 'Enfant' },
];

interface BikeFormProps {
  bike?: Bike;
}

export function BikeForm({ bike }: BikeFormProps) {
  const isEdit = !!bike;
  const createMutation = useCreateBike();
  const updateMutation = useUpdateBike(bike?.id ?? '');

  const [name, setName] = useState(bike?.name ?? '');
  const [brand, setBrand] = useState(bike?.brand ?? '');
  const [model, setModel] = useState(bike?.model ?? '');
  const [type, setType] = useState<BikeType>(bike?.type ?? 'CITY');
  const [size, setSize] = useState(bike?.size ?? '');
  const [priceEur, setPriceEur] = useState(
    bike ? (bike.priceCents / 100).toString() : '',
  );
  const [dailyRateEur, setDailyRateEur] = useState(
    bike ? (bike.dailyRateCents / 100).toString() : '',
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = {
      name,
      brand,
      model,
      type,
      size,
      priceCents: Math.round(parseFloat(priceEur) * 100),
      dailyRateCents: Math.round(parseFloat(dailyRateEur) * 100),
    };

    if (isEdit) {
      updateMutation.mutate(input);
    } else {
      createMutation.mutate(input);
    }
  }

  return (
    <Card className="max-w-lg">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Marque</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Modèle</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as BikeType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bikeTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Taille</Label>
            <Input
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prix (EUR)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={priceEur}
              onChange={(e) => setPriceEur(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyRate">Tarif journalier (EUR)</Label>
            <Input
              id="dailyRate"
              type="number"
              step="0.01"
              min="0"
              value={dailyRateEur}
              onChange={(e) => setDailyRateEur(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/bikes">Annuler</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
