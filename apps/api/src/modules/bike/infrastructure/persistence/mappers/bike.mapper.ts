import {
  Bike,
  BikeStatus,
  BikeType,
} from '../../../domain/entities/bike.entity.js';

interface PrismaBikeRow {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: string;
  size: string;
  priceCents: number;
  dailyRateCents: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BikeMapper {
  static toDomain(raw: PrismaBikeRow): Bike {
    return Bike.reconstitute({
      id: raw.id,
      name: raw.name,
      brand: raw.brand,
      model: raw.model,
      type: raw.type as BikeType,
      size: raw.size,
      priceCents: raw.priceCents,
      dailyRateCents: raw.dailyRateCents,
      status: raw.status as BikeStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(bike: Bike) {
    return {
      id: bike.id,
      name: bike.name,
      brand: bike.brand,
      model: bike.model,
      type: bike.type,
      size: bike.size,
      priceCents: bike.priceCents,
      dailyRateCents: bike.dailyRateCents,
      status: bike.status,
      updatedAt: bike.updatedAt,
    };
  }
}
