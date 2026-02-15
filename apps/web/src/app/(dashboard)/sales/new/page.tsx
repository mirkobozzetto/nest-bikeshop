import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { SaleForm } from '@/features/sales/components/sale-form';

export const metadata: Metadata = { title: 'Nouvelle vente' };

export default function NewSalePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Nouvelle vente" />
      <SaleForm />
    </div>
  );
}
