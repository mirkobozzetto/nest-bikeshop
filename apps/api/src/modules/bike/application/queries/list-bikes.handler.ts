import { Inject, Injectable } from '@nestjs/common';
import {
  BIKE_REPOSITORY,
  type BikeRepositoryPort,
} from '../../domain/ports/bike.repository.port.js';
import type { ListBikesQuery } from './list-bikes.query.js';
import { BikeResponseDto } from '../dtos/bike-response.dto.js';

@Injectable()
export class ListBikesHandler {
  constructor(
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(query: ListBikesQuery): Promise<BikeResponseDto[]> {
    const bikes = await this.bikeRepo.findAll({
      type: query.type,
      status: query.status,
      brand: query.brand,
    });
    return bikes.map((b) => BikeResponseDto.fromDomain(b));
  }
}
