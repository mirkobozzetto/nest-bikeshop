import { Suspense, type ReactNode } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { Skeleton } from '@/components/ui/skeleton';

function LayoutFallback({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <aside className="flex h-full w-64 flex-col border-r bg-background">
          <div className="flex h-14 items-center border-b px-4">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex-1 space-y-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </aside>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-14 items-center border-b px-4">
          <Skeleton className="h-4 w-32" />
        </div>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LayoutFallback>{children}</LayoutFallback>}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
