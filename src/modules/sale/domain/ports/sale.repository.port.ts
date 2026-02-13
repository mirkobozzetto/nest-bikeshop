import type { Sale } from '../entities/sale.entity.js';
import type { SaleStatus } from '../entities/sale.entity.js';

export interface SaleFilters {
  readonly customerId?: string;
  readonly status?: SaleStatus;
}

export interface SaleRepositoryPort {
  save(sale: Sale): Promise<void>;
  findById(id: string): Promise<Sale | null>;
  findAll(filters?: SaleFilters): Promise<Sale[]>;
}

export const SALE_REPOSITORY = Symbol('SALE_REPOSITORY');
