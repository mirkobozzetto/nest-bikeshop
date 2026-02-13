import { Inject, Injectable } from '@nestjs/common';
import {
  RENTAL_REPOSITORY,
  type RentalRepositoryPort,
} from '../../domain/ports/rental.repository.port.js';
import type { ExtendRentalCommand } from './extend-rental.command.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

@Injectable()
export class ExtendRentalHandler {
  constructor(
    @Inject(RENTAL_REPOSITORY)
    private readonly rentalRepo: RentalRepositoryPort,
  ) {}

  async execute(command: ExtendRentalCommand): Promise<void> {
    const rental = await this.rentalRepo.findById(command.rentalId);
    if (!rental) {
      throw new DomainException(
        `Rental ${command.rentalId} not found`,
        'RENTAL_NOT_FOUND',
      );
    }

    rental.extend(command.newEndDate);
    await this.rentalRepo.save(rental);
  }
}
