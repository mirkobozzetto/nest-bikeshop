import { Inject, Injectable } from '@nestjs/common';
import {
  BIKE_REPOSITORY,
  type BikeRepositoryPort,
} from '../../domain/ports/bike.repository.port.js';
import type { UpdateBikeCommand } from './update-bike.command.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

@Injectable()
export class UpdateBikeHandler {
  constructor(
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(command: UpdateBikeCommand): Promise<void> {
    const bike = await this.bikeRepo.findById(command.id);
    if (!bike) {
      throw new DomainException('Bike not found', 'BIKE_NOT_FOUND');
    }

    bike.update({
      name: command.name,
      brand: command.brand,
      model: command.model,
      type: command.type,
      size: command.size,
      priceCents: command.priceCents,
      dailyRateCents: command.dailyRateCents,
    });

    await this.bikeRepo.save(bike);
  }
}
