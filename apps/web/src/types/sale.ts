export type SaleStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type SaleStatusAction = 'confirm' | 'cancel';

export interface SaleItem {
  bikeId: string;
  priceCents: number;
}

export interface Sale {
  id: string;
  customerId: string;
  items: SaleItem[];
  status: SaleStatus;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleInput {
  customerId: string;
  items: SaleItem[];
}
