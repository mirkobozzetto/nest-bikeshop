'use client';

import { useState } from 'react';
import { useRecordMovement } from '../hooks';
import type { MovementType, MovementReason } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface MovementFormProps {
  bikeId?: string;
  onSuccess?: () => void;
}

const MOVEMENT_TYPES: { value: MovementType; label: string }[] = [
  { value: 'IN', label: 'Entrée' },
  { value: 'OUT', label: 'Sortie' },
  { value: 'ADJUSTMENT', label: 'Ajustement' },
];

const MOVEMENT_REASONS: { value: MovementReason; label: string }[] = [
  { value: 'PURCHASE', label: 'Achat' },
  { value: 'SALE', label: 'Vente' },
  { value: 'RENTAL_OUT', label: 'Location (sortie)' },
  { value: 'RENTAL_RETURN', label: 'Location (retour)' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'LOSS', label: 'Perte' },
  { value: 'ADJUSTMENT', label: 'Ajustement' },
];

export function MovementForm({
  bikeId: initialBikeId,
  onSuccess,
}: MovementFormProps) {
  const [bikeId, setBikeId] = useState(initialBikeId ?? '');
  const [type, setType] = useState<MovementType>('IN');
  const [reason, setReason] = useState<MovementReason>('PURCHASE');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const mutation = useRecordMovement();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(
      {
        bikeId,
        type,
        reason,
        quantity,
        date: date || undefined,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setQuantity(1);
          setDate('');
          setNotes('');
          onSuccess?.();
        },
      },
    );
  }

  return (
    <Card className="max-w-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bikeId">ID du vélo</Label>
            <Input
              id="bikeId"
              value={bikeId}
              onChange={(e) => setBikeId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as MovementType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOVEMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Raison</Label>
            <Select
              value={reason}
              onValueChange={(v) => setReason(v as MovementReason)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOVEMENT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date (optionnel)</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending || !bikeId} className="w-full">
            {mutation.isPending ? 'Enregistrement...' : 'Enregistrer le mouvement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
