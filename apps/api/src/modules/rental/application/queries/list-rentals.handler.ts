import { Inject, Injectable } from '@nestjs/common';
import {
  RENTAL_REPOSITORY,
  type RentalRepositoryPort,
} from '../../domain/ports/rental.repository.port.js';
import type { ListRentalsQuery } from './list-rentals.query.js';
import { RentalResponseDto } from '../dtos/rental-response.dto.js';

@Injectable()
export class ListRentalsHandler {
  constructor(
    @Inject(RENTAL_REPOSITORY)
    private readonly rentalRepo: RentalRepositoryPort,
  ) {}

  async execute(query: ListRentalsQuery): Promise<RentalResponseDto[]> {
    const rentals = await this.rentalRepo.findAll({
      customerId: query.customerId,
      status: query.status,
    });
    return rentals.map((r) => RentalResponseDto.fromDomain(r));
  }
}
