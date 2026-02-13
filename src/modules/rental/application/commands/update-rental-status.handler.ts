import { Inject, Injectable } from '@nestjs/common';
import {
  RENTAL_REPOSITORY,
  type RentalRepositoryPort,
} from '../../domain/ports/rental.repository.port.js';
import {
  INVENTORY_REPOSITORY,
  type InventoryRepositoryPort,
} from '../../../inventory/domain/ports/inventory.repository.port.js';
import {
  BIKE_REPOSITORY,
  type BikeRepositoryPort,
} from '../../../bike/domain/ports/bike.repository.port.js';
import type { UpdateRentalStatusCommand } from './update-rental-status.command.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import {
  InventoryMovement,
  MovementType,
  MovementReason,
} from '../../../inventory/domain/entities/inventory-movement.entity.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UpdateRentalStatusHandler {
  constructor(
    @Inject(RENTAL_REPOSITORY)
    private readonly rentalRepo: RentalRepositoryPort,
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepo: InventoryRepositoryPort,
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepo: BikeRepositoryPort,
  ) {}

  async execute(command: UpdateRentalStatusCommand): Promise<void> {
    const rental = await this.rentalRepo.findById(command.rentalId);
    if (!rental) {
      throw new DomainException(
        `Rental ${command.rentalId} not found`,
        'RENTAL_NOT_FOUND',
      );
    }

    switch (command.action) {
      case 'start':
        rental.start();
        for (const item of rental.items) {
          const movement = InventoryMovement.record({
            id: uuidv4(),
            bikeId: item.bikeId,
            type: MovementType.OUT,
            reason: MovementReason.RENTAL_OUT,
            quantity: 1,
          });
          await this.inventoryRepo.saveMovement(movement);
          const bike = await this.bikeRepo.findById(item.bikeId);
          if (bike) {
            bike.markAsRented();
            await this.bikeRepo.save(bike);
          }
        }
        break;
      case 'return':
        rental.return();
        for (const item of rental.items) {
          const movement = InventoryMovement.record({
            id: uuidv4(),
            bikeId: item.bikeId,
            type: MovementType.IN,
            reason: MovementReason.RENTAL_RETURN,
            quantity: 1,
          });
          await this.inventoryRepo.saveMovement(movement);
          const bike = await this.bikeRepo.findById(item.bikeId);
          if (bike) {
            bike.markAsReturned();
            await this.bikeRepo.save(bike);
          }
        }
        break;
      case 'cancel':
        rental.cancel();
        break;
    }

    await this.rentalRepo.save(rental);
  }
}
