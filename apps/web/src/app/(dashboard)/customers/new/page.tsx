import type { Metadata } from 'next';
import { CustomerForm } from '@/features/customers/components/customer-form';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = { title: 'Nouveau client' };

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Nouveau client" />
      <CustomerForm />
    </div>
  );
}
