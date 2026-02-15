import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { RentalForm } from '@/features/rentals/components/rental-form';

export const metadata: Metadata = { title: 'Nouvelle location' };

export default function NewRentalPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nouvelle location"
        actions={
          <Button variant="outline" asChild>
            <Link href="/rentals">Retour</Link>
          </Button>
        }
      />
      <RentalForm />
    </div>
  );
}
