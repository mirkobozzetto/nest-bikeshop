import type { Metadata } from 'next';
import Link from 'next/link';
import { Bike, Users, CalendarDays, ShoppingCart } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Tableau de bord' };

const stats = [
  { label: 'Vélos', value: '—', icon: Bike },
  { label: 'Clients', value: '—', icon: Users },
  { label: 'Locations', value: '—', icon: CalendarDays },
  { label: 'Ventes', value: '—', icon: ShoppingCart },
];

const shortcuts = [
  { label: 'Nouveau vélo', href: '/bikes/new' },
  { label: 'Nouveau client', href: '/customers/new' },
  { label: 'Nouvelle location', href: '/rentals/new' },
  { label: 'Nouvelle vente', href: '/sales/new' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre activité"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Raccourcis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((shortcut) => (
            <Card
              key={shortcut.href}
              className="transition-colors hover:bg-accent/50"
            >
              <CardContent className="p-0">
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-full justify-center"
                >
                  <Link href={shortcut.href}>{shortcut.label}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
