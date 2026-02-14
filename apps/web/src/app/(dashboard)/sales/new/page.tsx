import type { Metadata } from 'next';
import { SaleForm } from '@/features/sales/components/sale-form';

export const metadata: Metadata = { title: 'Nouvelle vente' };

export default function NewSalePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nouvelle vente</h1>
      <div className="max-w-2xl">
        <SaleForm />
      </div>
    </div>
  );
}
