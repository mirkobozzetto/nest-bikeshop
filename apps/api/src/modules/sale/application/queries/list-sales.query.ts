import type { SaleStatus } from '../../domain/entities/sale.entity.js';

export class ListSalesQuery {
  constructor(
    public readonly customerId?: string,
    public readonly status?: SaleStatus,
  ) {}
}
