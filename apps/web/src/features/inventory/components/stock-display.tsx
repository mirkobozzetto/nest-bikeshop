'use client';

import { useStock } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StockDisplayProps {
  bikeId: string;
}

export function StockDisplay({ bikeId }: StockDisplayProps) {
  const { data: stock, isLoading } = useStock(bikeId);

  if (isLoading) {
    return <p>Chargement...</p>;
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
