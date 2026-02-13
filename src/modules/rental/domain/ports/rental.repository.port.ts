import type { Rental } from '../entities/rental.entity.js';
import type { RentalStatus } from '../entities/rental.entity.js';

export interface RentalFilters {
  readonly customerId?: string;
  readonly status?: RentalStatus;
}

export interface RentalRepositoryPort {
  save(rental: Rental): Promise<void>;
  findById(id: string): Promise<Rental | null>;
  findAll(filters?: RentalFilters): Promise<Rental[]>;
}

export const RENTAL_REPOSITORY = Symbol('RENTAL_REPOSITORY');
