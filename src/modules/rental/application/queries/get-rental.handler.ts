import { Inject, Injectable } from '@nestjs/common';
import {
  RENTAL_REPOSITORY,
  type RentalRepositoryPort,
} from '../../domain/ports/rental.repository.port.js';
import type { GetRentalQuery } from './get-rental.query.js';
import { RentalResponseDto } from '../dtos/rental-response.dto.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

@Injectable()
export class GetRentalHandler {
  constructor(
    @Inject(RENTAL_REPOSITORY)
    private readonly rentalRepo: RentalRepositoryPort,
  ) {}

  async execute(query: GetRentalQuery): Promise<RentalResponseDto> {
    const rental = await this.rentalRepo.findById(query.id);
    if (!rental) {
      throw new DomainException(
        `Rental ${query.id} not found`,
        'RENTAL_NOT_FOUND',
      );
    }
    return RentalResponseDto.fromDomain(rental);
  }
}
