import { Badge } from '@/components/ui/badge';
import type { RentalStatus } from '@/types';

const statusConfig: Record<RentalStatus, { label: string; className: string }> = {
  RESERVED: {
    label: 'Réservée',
    className:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
  },
  ACTIVE: {
    label: 'Active',
    className:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
  },
  RETURNED: {
    label: 'Retournée',
    className:
      'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
  },
  CANCELLED: {
    label: 'Annulée',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  },
};

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
