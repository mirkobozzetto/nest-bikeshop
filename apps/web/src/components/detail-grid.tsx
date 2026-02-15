import type { ReactNode } from 'react';

interface DetailItemProps {
  label: string;
  value: ReactNode;
}

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="space-y-1">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export function DetailGrid({ children }: { children: ReactNode }) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </dl>
  );
}
