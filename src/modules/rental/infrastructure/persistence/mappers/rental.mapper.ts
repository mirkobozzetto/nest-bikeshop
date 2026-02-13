import {
  Rental,
  RentalStatus,
} from '../../../domain/entities/rental.entity.js';
import { RentalItem } from '../../../domain/entities/rental-item.js';
import { DateRange } from '../../../../shared/domain/value-objects/date-range.vo.js';

interface PrismaRentalRow {
  id: string;
  customerId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  totalCents: number;
  createdAt: Date;
  updatedAt: Date;
  items: PrismaRentalItemRow[];
}

interface PrismaRentalItemRow {
  id: string;
  rentalId: string;
  bikeId: string;
  dailyRateCents: number;
}

export class RentalMapper {
  static toDomain(raw: PrismaRentalRow): Rental {
    const items = raw.items.map((item) =>
      RentalItem.reconstitute({
        bikeId: item.bikeId,
        dailyRateCents: item.dailyRateCents,
      }),
    );

    return Rental.reconstitute({
      id: raw.id,
      customerId: raw.customerId,
      items,
      period: DateRange.create(raw.startDate, raw.endDate),
      status: raw.status as RentalStatus,
      totalCents: raw.totalCents,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(rental: Rental) {
    return {
      id: rental.id,
      customerId: rental.customerId,
      status: rental.status,
      startDate: rental.period.start,
      endDate: rental.period.end,
      totalCents: rental.totalCents,
      updatedAt: rental.updatedAt,
    };
  }
}
