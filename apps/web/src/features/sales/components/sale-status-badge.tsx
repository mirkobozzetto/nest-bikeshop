import { Badge } from '@/components/ui/badge';
import type { SaleStatus } from '@/types';

const statusConfig: Record<SaleStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'En attente',
    className:
      'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  },
  CONFIRMED: {
    label: 'Confirmée',
    className:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
  },
  CANCELLED: {
    label: 'Annulée',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  },
};

export function SaleStatusBadge({ status }: { status: SaleStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
