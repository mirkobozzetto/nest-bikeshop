import { Sale, SaleStatus } from '../../../domain/entities/sale.entity.js';
import { SaleItem } from '../../../domain/entities/sale-item.js';

interface PrismaSaleRow {
  id: string;
  customerId: string;
  status: string;
  totalCents: number;
  createdAt: Date;
  updatedAt: Date;
  items: PrismaSaleItemRow[];
}

interface PrismaSaleItemRow {
  id: string;
  saleId: string;
  bikeId: string;
  priceCents: number;
}

export class SaleMapper {
  static toDomain(raw: PrismaSaleRow): Sale {
    const items = raw.items.map((item) =>
      SaleItem.reconstitute({
        bikeId: item.bikeId,
        priceCents: item.priceCents,
      }),
    );

    return Sale.reconstitute({
      id: raw.id,
      customerId: raw.customerId,
      items,
      status: raw.status as SaleStatus,
      totalCents: raw.totalCents,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(sale: Sale) {
    return {
      id: sale.id,
      customerId: sale.customerId,
      status: sale.status,
      totalCents: sale.totalCents,
      updatedAt: sale.updatedAt,
    };
  }
}
