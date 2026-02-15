import type { Metadata } from 'next';
import { BikeForm } from '@/features/bikes/components/bike-form';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = { title: 'Nouveau vélo' };

export default function NewBikePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Nouveau vélo" />
      <BikeForm />
    </div>
  );
}
