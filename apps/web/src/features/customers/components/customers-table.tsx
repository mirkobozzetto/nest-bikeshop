'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { useCustomers } from '../hooks';
import { EmptyState } from '@/components/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function CustomersTable() {
  const { data: customers, isLoading } = useCustomers();

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (!customers?.length) {
    return (
      <EmptyState
        icon={Users}
        title="Aucun client"
        description="Ajoutez votre premier client pour commencer."
        actionLabel="Ajouter un client"
        actionHref="/customers/new"
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Prénom</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Adresse</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>{customer.firstName}</TableCell>
            <TableCell>{customer.lastName}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>{customer.address}</TableCell>
            <TableCell>
              <Link
                href={`/customers/${customer.id}`}
                className="text-primary hover:underline"
              >
                Voir
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
