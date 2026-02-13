import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CreateBikeHandler } from '../../../application/commands/create-bike.handler.js';
import { UpdateBikeStatusHandler } from '../../../application/commands/update-bike-status.handler.js';
import { GetBikeHandler } from '../../../application/queries/get-bike.handler.js';
import { ListBikesHandler } from '../../../application/queries/list-bikes.handler.js';
import { CreateBikeCommand } from '../../../application/commands/create-bike.command.js';
import { UpdateBikeStatusCommand } from '../../../application/commands/update-bike-status.command.js';
import { GetBikeQuery } from '../../../application/queries/get-bike.query.js';
import { ListBikesQuery } from '../../../application/queries/list-bikes.query.js';
import { CreateBikeRequest } from '../dtos/create-bike.request.js';
import { UpdateBikeStatusRequest } from '../dtos/update-bike-status.request.js';
import type {
  BikeType,
  BikeStatus,
} from '../../../domain/entities/bike.entity.js';

@Controller('bikes')
export class BikeController {
  constructor(
    private readonly createBikeHandler: CreateBikeHandler,
    private readonly updateBikeStatusHandler: UpdateBikeStatusHandler,
    private readonly getBikeHandler: GetBikeHandler,
    private readonly listBikesHandler: ListBikesHandler,
  ) {}

  @Post()
  async create(@Body() body: CreateBikeRequest) {
    const command = new CreateBikeCommand(
      body.name,
      body.brand,
      body.model,
      body.type,
      body.size,
      body.priceCents,
      body.dailyRateCents,
    );
    const id = await this.createBikeHandler.execute(command);
    return { id };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getBikeHandler.execute(new GetBikeQuery(id));
  }

  @Get()
  async findAll(
    @Query('type') type?: BikeType,
    @Query('status') status?: BikeStatus,
    @Query('brand') brand?: string,
  ) {
    return this.listBikesHandler.execute(
      new ListBikesQuery(type, status, brand),
    );
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateBikeStatusRequest,
  ) {
    await this.updateBikeStatusHandler.execute(
      new UpdateBikeStatusCommand(id, body.action),
    );
    return { success: true };
  }
}
