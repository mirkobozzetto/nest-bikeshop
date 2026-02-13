import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma.service.js';
import type {
  RentalRepositoryPort,
  RentalFilters,
} from '../../../domain/ports/rental.repository.port.js';
import type { Rental } from '../../../domain/entities/rental.entity.js';
import { RentalMapper } from '../mappers/rental.mapper.js';

@Injectable()
export class PrismaRentalRepository implements RentalRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(rental: Rental): Promise<void> {
    const data = RentalMapper.toPersistence(rental);
    await this.prisma.rental.upsert({
      where: { id: data.id },
      create: {
        ...data,
        createdAt: rental.createdAt,
        items: {
          create: rental.items.map((item) => ({
            bikeId: item.bikeId,
            dailyRateCents: item.dailyRateCents,
          })),
        },
      },
      update: {
        ...data,
        items: {
          deleteMany: {},
          create: rental.items.map((item) => ({
            bikeId: item.bikeId,
            dailyRateCents: item.dailyRateCents,
          })),
        },
      },
    });
  }

  async findById(id: string): Promise<Rental | null> {
    const raw = await this.prisma.rental.findUnique({
      where: { id },
      include: { items: true },
    });
    return raw ? RentalMapper.toDomain(raw) : null;
  }

  async findAll(filters?: RentalFilters): Promise<Rental[]> {
    const where: Record<string, unknown> = {};
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.status) where.status = filters.status;

    const raw = await this.prisma.rental.findMany({
      where,
      include: { items: true },
    });
    return raw.map((r: Parameters<typeof RentalMapper.toDomain>[0]) =>
      RentalMapper.toDomain(r),
    );
  }
}
