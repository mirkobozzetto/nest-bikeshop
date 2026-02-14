import { Module } from '@nestjs/common';
import { BIKE_REPOSITORY } from '../domain/ports/bike.repository.port.js';
import { PrismaBikeRepository } from './persistence/repositories/prisma-bike.repository.js';
import { CreateBikeHandler } from '../application/commands/create-bike.handler.js';
import { UpdateBikeHandler } from '../application/commands/update-bike.handler.js';
import { UpdateBikeStatusHandler } from '../application/commands/update-bike-status.handler.js';
import { GetBikeHandler } from '../application/queries/get-bike.handler.js';
import { ListBikesHandler } from '../application/queries/list-bikes.handler.js';
import { BikeController } from './http/controllers/bike.controller.js';
import { PrismaService } from '../../../libs/prisma.service.js';

@Module({
  controllers: [BikeController],
  providers: [
    PrismaService,
    { provide: BIKE_REPOSITORY, useClass: PrismaBikeRepository },
    CreateBikeHandler,
    UpdateBikeHandler,
    UpdateBikeStatusHandler,
    GetBikeHandler,
    ListBikesHandler,
  ],
  exports: [BIKE_REPOSITORY],
})
export class BikeModule {}
