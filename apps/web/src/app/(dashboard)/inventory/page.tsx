import { InventoryPageClient } from '@/features/inventory/components/inventory-page-client';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventaire</h1>
      <InventoryPageClient />
    </div>
  );
}
