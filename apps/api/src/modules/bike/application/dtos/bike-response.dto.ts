import type { Bike } from '../../domain/entities/bike.entity.js';

export class BikeResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly type: string,
    public readonly size: string,
    public readonly priceCents: number,
    public readonly dailyRateCents: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromDomain(bike: Bike): BikeResponseDto {
    return new BikeResponseDto(
      bike.id,
      bike.name,
      bike.brand,
      bike.model,
      bike.type,
      bike.size,
      bike.priceCents,
      bike.dailyRateCents,
      bike.status,
      bike.createdAt,
      bike.updatedAt,
    );
  }
}
