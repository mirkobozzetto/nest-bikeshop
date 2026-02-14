import { Badge } from '@/components/ui/badge';
import type { SaleStatus } from '@/types';

const statusConfig: Record<SaleStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'En attente',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  CONFIRMED: {
    label: 'Confirmée',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  CANCELLED: {
    label: 'Annulée',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
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
