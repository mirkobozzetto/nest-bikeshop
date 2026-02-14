import { Badge } from '@/components/ui/badge';
import type { RentalStatus } from '@/types';

const statusConfig: Record<RentalStatus, { label: string; className: string }> =
  {
    RESERVED: {
      label: 'Réservée',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    ACTIVE: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    RETURNED: {
      label: 'Retournée',
      className: 'bg-slate-100 text-slate-800 border-slate-200',
    },
    CANCELLED: {
      label: 'Annulée',
      className: 'bg-red-100 text-red-800 border-red-200',
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
