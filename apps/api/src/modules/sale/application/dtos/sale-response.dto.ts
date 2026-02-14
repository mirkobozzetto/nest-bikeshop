import type { Sale } from '../../domain/entities/sale.entity.js';

export class SaleResponseDto {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: { bikeId: string; priceCents: number }[],
    public readonly status: string,
    public readonly totalCents: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromDomain(sale: Sale): SaleResponseDto {
    return new SaleResponseDto(
      sale.id,
      sale.customerId,
      sale.items.map((i) => ({
        bikeId: i.bikeId,
        priceCents: i.priceCents,
      })),
      sale.status,
      sale.totalCents,
      sale.createdAt,
      sale.updatedAt,
    );
  }
}
