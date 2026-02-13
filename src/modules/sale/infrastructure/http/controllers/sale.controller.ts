import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { CreateSaleHandler } from '../../../application/commands/create-sale.handler.js';
import { UpdateSaleStatusHandler } from '../../../application/commands/update-sale-status.handler.js';
import { GetSaleHandler } from '../../../application/queries/get-sale.handler.js';
import { CreateSaleCommand } from '../../../application/commands/create-sale.command.js';
import { UpdateSaleStatusCommand } from '../../../application/commands/update-sale-status.command.js';
import { GetSaleQuery } from '../../../application/queries/get-sale.query.js';
import { CreateSaleRequest } from '../dtos/create-sale.request.js';
import { UpdateSaleStatusRequest } from '../dtos/update-sale-status.request.js';

@Controller('sales')
export class SaleController {
  constructor(
    private readonly createSaleHandler: CreateSaleHandler,
    private readonly updateSaleStatusHandler: UpdateSaleStatusHandler,
    private readonly getSaleHandler: GetSaleHandler,
  ) {}

  @Post()
  async create(@Body() body: CreateSaleRequest) {
    const command = new CreateSaleCommand(body.customerId, body.items);
    const id = await this.createSaleHandler.execute(command);
    return { id };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getSaleHandler.execute(new GetSaleQuery(id));
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateSaleStatusRequest,
  ) {
    await this.updateSaleStatusHandler.execute(
      new UpdateSaleStatusCommand(id, body.action),
    );
    return { success: true };
  }
}
