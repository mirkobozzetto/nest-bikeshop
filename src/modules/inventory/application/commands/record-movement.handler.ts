import { Inject, Injectable } from '@nestjs/common';
import {
  INVENTORY_REPOSITORY,
  type InventoryRepositoryPort,
} from '../../domain/ports/inventory.repository.port.js';
import { InventoryMovement } from '../../domain/entities/inventory-movement.entity.js';
import type { RecordMovementCommand } from './record-movement.command.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RecordMovementHandler {
  constructor(
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepo: InventoryRepositoryPort,
  ) {}

  async execute(command: RecordMovementCommand): Promise<string> {
    const id = uuidv4();
    const movement = InventoryMovement.record({
      id,
      bikeId: command.bikeId,
      type: command.type,
      reason: command.reason,
      quantity: command.quantity,
      date: command.date,
      notes: command.notes,
    });

    await this.inventoryRepo.saveMovement(movement);
    return id;
  }
}
