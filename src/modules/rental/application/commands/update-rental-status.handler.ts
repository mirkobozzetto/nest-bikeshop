import { Inject, Injectable } from '@nestjs/common';
import {
  RENTAL_REPOSITORY,
  type RentalRepositoryPort,
} from '../../domain/ports/rental.repository.port.js';
import type { UpdateRentalStatusCommand } from './update-rental-status.command.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

@Injectable()
export class UpdateRentalStatusHandler {
  constructor(
    @Inject(RENTAL_REPOSITORY)
    private readonly rentalRepo: RentalRepositoryPort,
  ) {}

  async execute(command: UpdateRentalStatusCommand): Promise<void> {
    const rental = await this.rentalRepo.findById(command.rentalId);
    if (!rental) {
      throw new DomainException(
        `Rental ${command.rentalId} not found`,
        'RENTAL_NOT_FOUND',
      );
    }

    switch (command.action) {
      case 'start':
        rental.start();
        break;
      case 'return':
        rental.return();
        break;
      case 'cancel':
        rental.cancel();
        break;
    }

    await this.rentalRepo.save(rental);
  }
}
