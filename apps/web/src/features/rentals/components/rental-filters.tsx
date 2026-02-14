'use client';

import { useQueryState } from 'nuqs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STATUS_OPTIONS = [
  { value: 'RESERVED', label: 'Réservée' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'RETURNED', label: 'Retournée' },
  { value: 'CANCELLED', label: 'Annulée' },
] as const;

export function RentalFilters() {
  const [status, setStatus] = useQueryState('status');

  return (
    <div className="flex items-center gap-4">
      <Select
        value={status ?? 'all'}
        onValueChange={(v) => setStatus(v === 'all' ? null : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
