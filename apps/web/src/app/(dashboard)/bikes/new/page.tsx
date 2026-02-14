import type { Metadata } from 'next';
import { BikeForm } from '@/features/bikes/components/bike-form';

export const metadata: Metadata = { title: 'Nouveau vélo' };

export default function NewBikePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Ajouter un vélo</h1>
      <BikeForm />
    </div>
  );
}
