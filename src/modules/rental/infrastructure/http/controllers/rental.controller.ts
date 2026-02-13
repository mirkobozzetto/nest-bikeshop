import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CreateRentalHandler } from '../../../application/commands/create-rental.handler.js';
import { UpdateRentalStatusHandler } from '../../../application/commands/update-rental-status.handler.js';
import { ExtendRentalHandler } from '../../../application/commands/extend-rental.handler.js';
import { GetRentalHandler } from '../../../application/queries/get-rental.handler.js';
import { ListRentalsHandler } from '../../../application/queries/list-rentals.handler.js';
import { CreateRentalCommand } from '../../../application/commands/create-rental.command.js';
import { UpdateRentalStatusCommand } from '../../../application/commands/update-rental-status.command.js';
import { ExtendRentalCommand } from '../../../application/commands/extend-rental.command.js';
import { GetRentalQuery } from '../../../application/queries/get-rental.query.js';
import { ListRentalsQuery } from '../../../application/queries/list-rentals.query.js';
import { CreateRentalRequest } from '../dtos/create-rental.request.js';
import { UpdateRentalStatusRequest } from '../dtos/update-rental-status.request.js';
import { ExtendRentalRequest } from '../dtos/extend-rental.request.js';
import type { RentalStatus } from '../../../domain/entities/rental.entity.js';

@Controller('rentals')
export class RentalController {
  constructor(
    private readonly createRentalHandler: CreateRentalHandler,
    private readonly updateRentalStatusHandler: UpdateRentalStatusHandler,
    private readonly extendRentalHandler: ExtendRentalHandler,
    private readonly getRentalHandler: GetRentalHandler,
    private readonly listRentalsHandler: ListRentalsHandler,
  ) {}

  @Post()
  async create(@Body() body: CreateRentalRequest) {
    const command = new CreateRentalCommand(
      body.customerId,
      body.items.map((i) => ({
        bikeId: i.bikeId,
        dailyRateCents: i.dailyRateCents,
      })),
      new Date(body.startDate),
      new Date(body.endDate),
    );
    const id = await this.createRentalHandler.execute(command);
    return { id };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getRentalHandler.execute(new GetRentalQuery(id));
  }

  @Get()
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
  ) {
    return this.listRentalsHandler.execute(
      new ListRentalsQuery(customerId, status as RentalStatus),
    );
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateRentalStatusRequest,
  ) {
    await this.updateRentalStatusHandler.execute(
      new UpdateRentalStatusCommand(id, body.action),
    );
    return { success: true };
  }

  @Patch(':id/extend')
  async extend(@Param('id') id: string, @Body() body: ExtendRentalRequest) {
    await this.extendRentalHandler.execute(
      new ExtendRentalCommand(id, new Date(body.newEndDate)),
    );
    return { success: true };
  }
}
