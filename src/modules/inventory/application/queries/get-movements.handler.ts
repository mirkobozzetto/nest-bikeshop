import { Inject, Injectable } from '@nestjs/common';
import {
  INVENTORY_REPOSITORY,
  type InventoryRepositoryPort,
} from '../../domain/ports/inventory.repository.port.js';
import type { GetMovementsQuery } from './get-movements.query.js';
import { InventoryMovementResponseDto } from '../dtos/inventory-movement-response.dto.js';

@Injectable()
export class GetMovementsHandler {
  constructor(
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepo: InventoryRepositoryPort,
  ) {}

  async execute(
    query: GetMovementsQuery,
  ): Promise<InventoryMovementResponseDto[]> {
    const movements = await this.inventoryRepo.findMovementsByBikeId(
      query.bikeId,
    );
    return movements.map((m) => InventoryMovementResponseDto.fromDomain(m));
  }
}
