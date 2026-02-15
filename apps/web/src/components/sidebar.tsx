'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Bike,
  Users,
  CalendarDays,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Vélos', href: '/bikes', icon: Bike },
  { name: 'Clients', href: '/customers', icon: Users },
  { name: 'Locations', href: '/rentals', icon: CalendarDays },
  { name: 'Ventes', href: '/sales', icon: ShoppingCart },
  { name: 'Inventaire', href: '/inventory', icon: Package },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Bike className="h-4 w-4" />
      </div>
      <span className="text-lg font-bold tracking-tight">VeloShop</span>
    </Link>
  );
}

function NavItems({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Navigation principale" className="flex-1 space-y-0.5 p-2">
      {navigation.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center px-4">
        <Logo />
      </div>
      <NavItems pathname={pathname} />
    </aside>
  );
}

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden',
        open ? 'block' : 'hidden',
      )}
      onClick={() => onOpenChange(false)}
    >
      <aside
        className="fixed inset-y-0 left-0 w-60 border-r bg-sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-14 items-center px-4">
          <Logo />
        </div>
        <NavItems pathname={pathname} onNavigate={() => onOpenChange(false)} />
      </aside>
    </div>
  );
}
