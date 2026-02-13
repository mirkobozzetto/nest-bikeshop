import { Inject, Injectable } from '@nestjs/common';
import {
  BIKE_REPOSITORY,
  type BikeRepositoryPort,
} from '../../domain/ports/bike.repository.port.js';
import type { CreateBikeCommand } from './create-bike.command.js';
import { Bike } from '../../domain/entities/bike.entity.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateBikeHandler {
  constructor(
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(command: CreateBikeCommand): Promise<string> {
    const id = uuidv4();
    const bike = Bike.create({
      id,
      name: command.name,
      brand: command.brand,
      model: command.model,
      type: command.type,
      size: command.size,
      priceCents: command.priceCents,
      dailyRateCents: command.dailyRateCents,
    });

    await this.bikeRepo.save(bike);
    return id;
  }
}
