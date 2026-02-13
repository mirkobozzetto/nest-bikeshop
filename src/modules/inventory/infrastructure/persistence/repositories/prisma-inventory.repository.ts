import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma.service.js';
import type { InventoryRepositoryPort } from '../../../domain/ports/inventory.repository.port.js';
import type { InventoryMovement } from '../../../domain/entities/inventory-movement.entity.js';
import { InventoryMovementMapper } from '../mappers/inventory-movement.mapper.js';

@Injectable()
export class PrismaInventoryRepository implements InventoryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async saveMovement(movement: InventoryMovement): Promise<void> {
    const data = InventoryMovementMapper.toPersistence(movement);
    await this.prisma.inventoryMovement.create({
      data: {
        id: data.id,
        bikeId: data.bikeId,
        type: data.type,
        reason: data.reason,
        quantity: data.quantity,
        date: data.date,
        notes: data.notes,
        createdAt: data.createdAt,
      },
    });
  }

  async findMovementsByBikeId(bikeId: string): Promise<InventoryMovement[]> {
    const raw = await this.prisma.inventoryMovement.findMany({
      where: { bikeId },
      orderBy: { date: 'asc' },
    });
    return raw.map((r) => InventoryMovementMapper.toDomain(r));
  }

  async findMovementById(id: string): Promise<InventoryMovement | null> {
    const raw = await this.prisma.inventoryMovement.findUnique({
      where: { id },
    });
    return raw ? InventoryMovementMapper.toDomain(raw) : null;
  }
}
