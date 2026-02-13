import { Inject, Injectable } from '@nestjs/common';
import {
  BIKE_REPOSITORY,
  type BikeRepositoryPort,
} from '../../domain/ports/bike.repository.port.js';
import type { GetBikeQuery } from './get-bike.query.js';
import { BikeResponseDto } from '../dtos/bike-response.dto.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

@Injectable()
export class GetBikeHandler {
  constructor(
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(query: GetBikeQuery): Promise<BikeResponseDto> {
    const bike = await this.bikeRepo.findById(query.id);
    if (!bike) {
      throw new DomainException(`Bike ${query.id} not found`, 'BIKE_NOT_FOUND');
    }
    return BikeResponseDto.fromDomain(bike);
  }
}
