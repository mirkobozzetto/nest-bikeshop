'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu } from 'lucide-react';
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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  let href = '';
  return segments.map((segment) => {
    href += `/${segment}`;
    const label = UUID_RE.test(segment)
      ? 'Détail'
      : (routeLabels[segment] ?? segment);
    return { label, href };
  });
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
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Accueil
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            {i === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <kbd className="text-muted-foreground hidden items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-mono md:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
        <ThemeToggle />
      </div>
    </header>
  );
}
