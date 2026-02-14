import type { Metadata } from 'next';
import Link from 'next/link';
import { Bike, Users, CalendarDays, ShoppingCart, Package } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export const metadata: Metadata = { title: 'Tableau de bord' };

const modules = [
  {
    name: 'Vélos',
    description: 'Gérer le catalogue de vélos',
    href: '/bikes',
    icon: Bike,
  },
  {
    name: 'Clients',
    description: 'Gérer les fiches clients',
    href: '/customers',
    icon: Users,
  },
  {
    name: 'Locations',
    description: 'Gérer les locations en cours',
    href: '/rentals',
    icon: CalendarDays,
  },
  {
    name: 'Ventes',
    description: 'Gérer les ventes',
    href: '/sales',
    icon: ShoppingCart,
  },
  {
    name: 'Inventaire',
    description: 'Suivre les mouvements de stock',
    href: '/inventory',
    icon: Package,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <mod.icon className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>{mod.name}</CardTitle>
                    <CardDescription>{mod.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
