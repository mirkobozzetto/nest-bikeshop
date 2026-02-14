import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma.service.js';
import type {
  BikeRepositoryPort,
  BikeFilters,
} from '../../../domain/ports/bike.repository.port.js';
import type { Bike } from '../../../domain/entities/bike.entity.js';
import { BikeMapper } from '../mappers/bike.mapper.js';

@Injectable()
export class PrismaBikeRepository implements BikeRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(bike: Bike): Promise<void> {
    const data = BikeMapper.toPersistence(bike);
    await this.prisma.bike.upsert({
      where: { id: data.id },
      create: {
        ...data,
        createdAt: bike.createdAt,
      },
      update: data,
    });
  }

  async findById(id: string): Promise<Bike | null> {
    const raw = await this.prisma.bike.findUnique({ where: { id } });
    return raw ? BikeMapper.toDomain(raw) : null;
  }

  async findAll(filters?: BikeFilters): Promise<Bike[]> {
    const where: Record<string, unknown> = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;
    if (filters?.brand) where.brand = filters.brand;

    const raw = await this.prisma.bike.findMany({ where });
    return raw.map((r) => BikeMapper.toDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.bike.delete({ where: { id } });
  }
}
