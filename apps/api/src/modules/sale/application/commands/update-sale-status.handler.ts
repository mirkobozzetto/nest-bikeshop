import { Inject, Injectable } from '@nestjs/common';
import {
  SALE_REPOSITORY,
  type SaleRepositoryPort,
} from '../../domain/ports/sale.repository.port.js';
import type { UpdateSaleStatusCommand } from './update-sale-status.command.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import {
  INVENTORY_REPOSITORY,
  type InventoryRepositoryPort,
} from '../../../inventory/domain/ports/inventory.repository.port.js';
import {
  BIKE_REPOSITORY,
  type BikeRepositoryPort,
} from '../../../bike/domain/ports/bike.repository.port.js';
import {
  InventoryMovement,
  MovementType,
  MovementReason,
} from '../../../inventory/domain/entities/inventory-movement.entity.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UpdateSaleStatusHandler {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepo: SaleRepositoryPort,
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepo: InventoryRepositoryPort,
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(command: UpdateSaleStatusCommand): Promise<void> {
    const sale = await this.saleRepo.findById(command.saleId);
    if (!sale) {
      throw new DomainException(
        `Sale ${command.saleId} not found`,
        'SALE_NOT_FOUND',
      );
    }

    switch (command.action) {
      case 'confirm':
        sale.confirm();
        break;
      case 'cancel':
        sale.cancel();
        break;
    }

    await this.saleRepo.save(sale);

    if (command.action === 'confirm') {
      for (const item of sale.items) {
        const movement = InventoryMovement.record({
          id: uuidv4(),
          bikeId: item.bikeId,
          type: MovementType.OUT,
          reason: MovementReason.SALE,
          quantity: 1,
        });
        await this.inventoryRepo.saveMovement(movement);

        const bike = await this.bikeRepo.findById(item.bikeId);
        if (bike) {
          bike.markAsSold();
          await this.bikeRepo.save(bike);
        }
      }
    }
  }
}
