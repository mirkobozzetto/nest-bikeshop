import type { BikeType } from '../../domain/entities/bike.entity.js';

export class UpdateBikeCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly brand?: string,
    public readonly model?: string,
    public readonly type?: BikeType,
    public readonly size?: string,
    public readonly priceCents?: number,
    public readonly dailyRateCents?: number,
  ) {}
}
