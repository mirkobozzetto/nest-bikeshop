import { Inject, Injectable } from '@nestjs/common';
import {
  RENTAL_REPOSITORY,
  type RentalRepositoryPort,
} from '../../domain/ports/rental.repository.port.js';
import {
  INVENTORY_REPOSITORY,
  type InventoryRepositoryPort,
} from '../../../inventory/domain/ports/inventory.repository.port.js';
import type { CreateRentalCommand } from './create-rental.command.js';
import { Rental } from '../../domain/entities/rental.entity.js';
import { RentalItem } from '../../domain/entities/rental-item.js';
import { DateRange } from '../../../shared/domain/value-objects/date-range.vo.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import { isAvailableForRental } from '../../../inventory/domain/services/stock.service.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateRentalHandler {
  constructor(
    @Inject(RENTAL_REPOSITORY)
    private readonly rentalRepo: RentalRepositoryPort,
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepo: InventoryRepositoryPort,
  ) {}

  async execute(command: CreateRentalCommand): Promise<string> {
    for (const item of command.items) {
      const movements = await this.inventoryRepo.findMovementsByBikeId(
        item.bikeId,
      );
      if (!isAvailableForRental(movements)) {
        throw new DomainException(
          `Bike ${item.bikeId} is not available for rental`,
          'BIKE_NOT_AVAILABLE',
        );
      }
    }

    const id = uuidv4();
    const period = DateRange.create(command.startDate, command.endDate);
    const items = command.items.map((i) =>
      RentalItem.create(i.bikeId, i.dailyRateCents),
    );

    const rental = Rental.create({
      id,
      customerId: command.customerId,
      items,
      period,
    });
    await this.rentalRepo.save(rental);
    return id;
  }
}
