import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Bike,
  Users,
  CalendarDays,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Tableau de bord' };

const stats = [
  { label: 'Vélos', value: '—', icon: Bike, href: '/bikes' },
  { label: 'Clients', value: '—', icon: Users, href: '/customers' },
  { label: 'Locations', value: '—', icon: CalendarDays, href: '/rentals' },
  { label: 'Ventes', value: '—', icon: ShoppingCart, href: '/sales' },
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
            <Link key={stat.label} href={stat.href}>
              <Card className="group transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className="rounded-lg bg-muted p-2">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Voir tout <ArrowRight className="h-3 w-3" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
