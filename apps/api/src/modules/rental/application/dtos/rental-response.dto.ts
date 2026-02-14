import type { Rental } from '../../domain/entities/rental.entity.js';

export class RentalResponseDto {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: { bikeId: string; dailyRateCents: number }[],
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly status: string,
    public readonly totalCents: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromDomain(rental: Rental): RentalResponseDto {
    return new RentalResponseDto(
      rental.id,
      rental.customerId,
      rental.items.map((i) => ({
        bikeId: i.bikeId,
        dailyRateCents: i.dailyRateCents,
      })),
      rental.period.start,
      rental.period.end,
      rental.status,
      rental.totalCents,
      rental.createdAt,
      rental.updatedAt,
    );
  }
}
