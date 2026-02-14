import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RentalForm } from '@/features/rentals/components/rental-form';

export default function NewRentalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle location</h1>
        <Button variant="outline" asChild>
          <Link href="/rentals">Retour</Link>
        </Button>
      </div>
      <RentalForm />
    </div>
  );
}
