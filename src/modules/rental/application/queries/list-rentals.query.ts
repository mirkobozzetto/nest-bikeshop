import type { RentalStatus } from '../../domain/entities/rental.entity.js';

export class ListRentalsQuery {
  constructor(
    public readonly customerId?: string,
    public readonly status?: RentalStatus,
  ) {}
}
