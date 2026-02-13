import type { Customer } from '../entities/customer.entity.js';

export interface CustomerRepositoryPort {
  save(customer: Customer): Promise<void>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(limit?: number, offset?: number): Promise<Customer[]>;
  delete(id: string): Promise<void>;
}

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');
