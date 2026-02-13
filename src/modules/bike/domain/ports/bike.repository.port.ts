import type { Bike } from '../entities/bike.entity.js';
import type { BikeStatus, BikeType } from '../entities/bike.entity.js';

export interface BikeFilters {
  readonly type?: BikeType;
  readonly status?: BikeStatus;
  readonly brand?: string;
}

export interface BikeRepositoryPort {
  save(bike: Bike): Promise<void>;
  findById(id: string): Promise<Bike | null>;
  findAll(filters?: BikeFilters): Promise<Bike[]>;
  delete(id: string): Promise<void>;
}

export const BIKE_REPOSITORY = Symbol('BIKE_REPOSITORY');
