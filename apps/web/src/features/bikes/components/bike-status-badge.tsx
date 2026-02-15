import { Badge } from '@/components/ui/badge';
import type { BikeStatus } from '@/types';

const statusConfig: Record<BikeStatus, { label: string; className: string }> = {
  AVAILABLE: {
    label: 'Disponible',
    className:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
  },
  RENTED: {
    label: 'En location',
    className:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
  },
  SOLD: {
    label: 'Vendu',
    className:
      'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    className:
      'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  },
  RETIRED: {
    label: 'Retiré',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
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
