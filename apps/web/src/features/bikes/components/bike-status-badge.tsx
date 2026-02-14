import { Badge } from '@/components/ui/badge';
import type { BikeStatus } from '@/types';

const statusConfig: Record<BikeStatus, { label: string; className: string }> = {
  AVAILABLE: {
    label: 'Disponible',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  RENTED: {
    label: 'En location',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  SOLD: {
    label: 'Vendu',
    className:
      'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  RETIRED: {
    label: 'Retiré',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
};

export function BikeStatusBadge({ status }: { status: BikeStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
