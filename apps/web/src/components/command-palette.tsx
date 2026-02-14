'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Bike,
  Users,
  CalendarDays,
  ShoppingCart,
  Package,
  Plus,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const pages = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Vélos', href: '/bikes', icon: Bike },
  { name: 'Clients', href: '/customers', icon: Users },
  { name: 'Locations', href: '/rentals', icon: CalendarDays },
  { name: 'Ventes', href: '/sales', icon: ShoppingCart },
  { name: 'Inventaire', href: '/inventory', icon: Package },
];

const actions = [
  { name: 'Nouveau vélo', href: '/bikes/new', icon: Plus },
  { name: 'Nouveau client', href: '/customers/new', icon: Plus },
  { name: 'Nouvelle location', href: '/rentals/new', icon: Plus },
  { name: 'Nouvelle vente', href: '/sales/new', icon: Plus },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Palette de commandes">
      <CommandInput placeholder="Rechercher une page ou une action..." />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem key={page.href} onSelect={() => navigate(page.href)}>
              <page.icon className="mr-2 h-4 w-4" />
              {page.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          {actions.map((action) => (
            <CommandItem key={action.href} onSelect={() => navigate(action.href)}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
