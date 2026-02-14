import { Module } from '@nestjs/common';
import { INVENTORY_REPOSITORY } from '../domain/ports/inventory.repository.port.js';
import { PrismaInventoryRepository } from './persistence/repositories/prisma-inventory.repository.js';
import { RecordMovementHandler } from '../application/commands/record-movement.handler.js';
import { GetStockHandler } from '../application/queries/get-stock.handler.js';
import { GetMovementsHandler } from '../application/queries/get-movements.handler.js';
import { InventoryController } from './http/controllers/inventory.controller.js';
import { PrismaService } from '../../../libs/prisma.service.js';

@Module({
  controllers: [InventoryController],
  providers: [
    PrismaService,
    { provide: INVENTORY_REPOSITORY, useClass: PrismaInventoryRepository },
    RecordMovementHandler,
    GetStockHandler,
    GetMovementsHandler,
  ],
  exports: [INVENTORY_REPOSITORY],
})
export class InventoryModule {}
