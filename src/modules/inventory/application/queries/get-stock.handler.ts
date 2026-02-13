import { Inject, Injectable } from '@nestjs/common';
import {
  INVENTORY_REPOSITORY,
  type InventoryRepositoryPort,
} from '../../domain/ports/inventory.repository.port.js';
import { calculateCurrentStock } from '../../domain/services/stock.service.js';
import type { GetStockQuery } from './get-stock.query.js';
import { StockResponseDto } from '../dtos/stock-response.dto.js';

@Injectable()
export class GetStockHandler {
  constructor(
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepo: InventoryRepositoryPort,
  ) {}

  async execute(query: GetStockQuery): Promise<StockResponseDto> {
    const movements = await this.inventoryRepo.findMovementsByBikeId(
      query.bikeId,
    );
    const currentStock = calculateCurrentStock(movements);

    return new StockResponseDto(query.bikeId, currentStock);
  }
}
