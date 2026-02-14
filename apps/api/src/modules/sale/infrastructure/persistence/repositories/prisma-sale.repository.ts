import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma.service.js';
import type {
  SaleRepositoryPort,
  SaleFilters,
} from '../../../domain/ports/sale.repository.port.js';
import type { Sale } from '../../../domain/entities/sale.entity.js';
import { SaleMapper } from '../mappers/sale.mapper.js';

@Injectable()
export class PrismaSaleRepository implements SaleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(sale: Sale): Promise<void> {
    const data = SaleMapper.toPersistence(sale);
    await this.prisma.sale.upsert({
      where: { id: data.id },
      create: {
        ...data,
        createdAt: sale.createdAt,
        items: {
          create: sale.items.map((item) => ({
            bikeId: item.bikeId,
            priceCents: item.priceCents,
          })),
        },
      },
      update: {
        ...data,
        items: {
          deleteMany: {},
          create: sale.items.map((item) => ({
            bikeId: item.bikeId,
            priceCents: item.priceCents,
          })),
        },
      },
    });
  }

  async findById(id: string): Promise<Sale | null> {
    const raw = await this.prisma.sale.findUnique({
      where: { id },
      include: { items: true },
    });
    return raw ? SaleMapper.toDomain(raw) : null;
  }

  async findAll(filters?: SaleFilters): Promise<Sale[]> {
    const where: Record<string, unknown> = {};
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.status) where.status = filters.status;

    const raw = await this.prisma.sale.findMany({
      where,
      include: { items: true },
    });
    return raw.map((r: Parameters<typeof SaleMapper.toDomain>[0]) =>
      SaleMapper.toDomain(r),
    );
  }
}
