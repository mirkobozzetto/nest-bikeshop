export type RentalStatus = 'RESERVED' | 'ACTIVE' | 'RETURNED' | 'CANCELLED';

export type RentalStatusAction = 'start' | 'return' | 'cancel';

export interface RentalItem {
  bikeId: string;
  dailyRateCents: number;
}

export interface Rental {
  id: string;
  customerId: string;
  items: RentalItem[];
  startDate: string;
  endDate: string;
  status: RentalStatus;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalInput {
  customerId: string;
  items: RentalItem[];
  startDate: string;
  endDate: string;
}

export interface ExtendRentalInput {
  newEndDate: string;
}
