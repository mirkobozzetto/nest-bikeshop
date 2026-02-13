import { Inject, Injectable } from '@nestjs/common';
import {
  BIKE_REPOSITORY,
  type BikeRepositoryPort,
} from '../../domain/ports/bike.repository.port.js';
import type { UpdateBikeStatusCommand } from './update-bike-status.command.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

@Injectable()
export class UpdateBikeStatusHandler {
  constructor(
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(command: UpdateBikeStatusCommand): Promise<void> {
    const bike = await this.bikeRepo.findById(command.bikeId);
    if (!bike) {
      throw new DomainException(
        `Bike ${command.bikeId} not found`,
        'BIKE_NOT_FOUND',
      );
    }

    switch (command.action) {
      case 'rent':
        bike.markAsRented();
        break;
      case 'return':
        bike.markAsReturned();
        break;
      case 'sell':
        bike.markAsSold();
        break;
      case 'maintenance':
        bike.sendToMaintenance();
        break;
      case 'retire':
        bike.retire();
        break;
    }

    await this.bikeRepo.save(bike);
  }
}
