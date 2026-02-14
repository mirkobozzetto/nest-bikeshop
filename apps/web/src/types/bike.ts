export type BikeType = 'ROAD' | 'MOUNTAIN' | 'CITY' | 'ELECTRIC' | 'KIDS';

export type BikeStatus = 'AVAILABLE' | 'RENTED' | 'SOLD' | 'MAINTENANCE' | 'RETIRED';

export type BikeStatusAction = 'rent' | 'return' | 'sell' | 'maintenance' | 'retire';

export interface Bike {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: BikeType;
  size: string;
  priceCents: number;
  dailyRateCents: number;
  status: BikeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBikeInput {
  name: string;
  brand: string;
  model: string;
  type: BikeType;
  size: string;
  priceCents: number;
  dailyRateCents: number;
}

export interface UpdateBikeInput {
  name?: string;
  brand?: string;
  model?: string;
  type?: BikeType;
  size?: string;
  priceCents?: number;
  dailyRateCents?: number;
}
