import { CustomerForm } from '@/features/customers/components/customer-form';

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nouveau client</h1>
      <CustomerForm />
    </div>
  );
}
