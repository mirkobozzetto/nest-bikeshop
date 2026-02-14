import { TableSkeleton } from '@/components/loading-skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <TableSkeleton />
    </div>
  );
}
