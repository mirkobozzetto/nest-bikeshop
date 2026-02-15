'use client';

import { useStock } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StockDisplayProps {
  bikeId: string;
}

export function StockDisplay({ bikeId }: StockDisplayProps) {
  const { data: stock, isLoading } = useStock(bikeId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock actuel</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock actuel</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{stock?.quantity ?? 0}</p>
      </CardContent>
    </Card>
  );
}
