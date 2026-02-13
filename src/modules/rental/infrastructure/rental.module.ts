import { Module } from '@nestjs/common';
import { RENTAL_REPOSITORY } from '../domain/ports/rental.repository.port.js';
import { PrismaRentalRepository } from './persistence/repositories/prisma-rental.repository.js';
import { CreateRentalHandler } from '../application/commands/create-rental.handler.js';
import { UpdateRentalStatusHandler } from '../application/commands/update-rental-status.handler.js';
import { ExtendRentalHandler } from '../application/commands/extend-rental.handler.js';
import { GetRentalHandler } from '../application/queries/get-rental.handler.js';
import { ListRentalsHandler } from '../application/queries/list-rentals.handler.js';
import { RentalController } from './http/controllers/rental.controller.js';
import { PrismaService } from '../../../libs/prisma.service.js';

@Module({
  controllers: [RentalController],
  providers: [
    PrismaService,
    { provide: RENTAL_REPOSITORY, useClass: PrismaRentalRepository },
    CreateRentalHandler,
    UpdateRentalStatusHandler,
    ExtendRentalHandler,
    GetRentalHandler,
    ListRentalsHandler,
  ],
  exports: [RENTAL_REPOSITORY],
})
export class RentalModule {}
