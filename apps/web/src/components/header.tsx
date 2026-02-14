'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

const routeLabels: Record<string, string> = {
  bikes: 'Vélos',
  customers: 'Clients',
  rentals: 'Locations',
  sales: 'Ventes',
  inventory: 'Inventaire',
  new: 'Nouveau',
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment) => ({
    label: routeLabels[segment] ?? segment,
    segment,
  }));
}

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.length === 0 ? (
          <span className="text-foreground font-medium">Accueil</span>
        ) : (
          breadcrumbs.map((crumb, i) => (
            <span key={crumb.segment} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? 'text-foreground font-medium'
                    : ''
                }
              >
                {crumb.label}
              </span>
            </span>
          ))
        )}
      </nav>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
