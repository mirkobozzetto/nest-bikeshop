'use client';

import { useQueryState } from 'nuqs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const bikeTypes = [
  { value: 'ROAD', label: 'Route' },
  { value: 'MOUNTAIN', label: 'VTT' },
  { value: 'CITY', label: 'Ville' },
  { value: 'ELECTRIC', label: 'Électrique' },
  { value: 'KIDS', label: 'Enfant' },
];

const bikeStatuses = [
  { value: 'AVAILABLE', label: 'Disponible' },
  { value: 'RENTED', label: 'En location' },
  { value: 'SOLD', label: 'Vendu' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'RETIRED', label: 'Retiré' },
];

export function BikeFilters() {
  const [type, setType] = useQueryState('type');
  const [status, setStatus] = useQueryState('status');

  return (
    <div className="flex gap-4">
      <Select
        value={type ?? ''}
        onValueChange={(v) => void setType(v === 'ALL' ? null : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tous les types</SelectItem>
          {bikeTypes.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status ?? ''}
        onValueChange={(v) => void setStatus(v === 'ALL' ? null : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tous les statuts</SelectItem>
          {bikeStatuses.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
