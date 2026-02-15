import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { InventoryPageClient } from '@/features/inventory/components/inventory-page-client';

export const metadata: Metadata = { title: 'Inventaire' };

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventaire"
        description="Suivez le stock de vos vélos"
      />
      <InventoryPageClient />
    </div>
  );
}
