import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RecordMovementHandler } from '../../../application/commands/record-movement.handler.js';
import { GetStockHandler } from '../../../application/queries/get-stock.handler.js';
import { GetMovementsHandler } from '../../../application/queries/get-movements.handler.js';
import { RecordMovementCommand } from '../../../application/commands/record-movement.command.js';
import { GetStockQuery } from '../../../application/queries/get-stock.query.js';
import { GetMovementsQuery } from '../../../application/queries/get-movements.query.js';
import { RecordMovementRequest } from '../dtos/record-movement.request.js';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly recordMovementHandler: RecordMovementHandler,
    private readonly getStockHandler: GetStockHandler,
    private readonly getMovementsHandler: GetMovementsHandler,
  ) {}

  @Post('movements')
  async recordMovement(@Body() body: RecordMovementRequest) {
    const command = new RecordMovementCommand(
      body.bikeId,
      body.type,
      body.reason,
      body.quantity,
      body.date,
      body.notes,
    );
    const id = await this.recordMovementHandler.execute(command);
    return { id };
  }

  @Get('stock/:bikeId')
  async getStock(@Param('bikeId') bikeId: string) {
    return this.getStockHandler.execute(new GetStockQuery(bikeId));
  }

  @Get('movements/:bikeId')
  async getMovements(@Param('bikeId') bikeId: string) {
    return this.getMovementsHandler.execute(new GetMovementsQuery(bikeId));
  }
}
