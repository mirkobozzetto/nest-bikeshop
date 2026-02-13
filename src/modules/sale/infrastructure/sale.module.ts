import { Module } from '@nestjs/common';
import { SALE_REPOSITORY } from '../domain/ports/sale.repository.port.js';
import { PrismaSaleRepository } from './persistence/repositories/prisma-sale.repository.js';
import { CreateSaleHandler } from '../application/commands/create-sale.handler.js';
import { UpdateSaleStatusHandler } from '../application/commands/update-sale-status.handler.js';
import { GetSaleHandler } from '../application/queries/get-sale.handler.js';
import { ListSalesHandler } from '../application/queries/list-sales.handler.js';
import { SaleController } from './http/controllers/sale.controller.js';
import { PrismaService } from '../../../libs/prisma.service.js';

@Module({
  controllers: [SaleController],
  providers: [
    PrismaService,
    { provide: SALE_REPOSITORY, useClass: PrismaSaleRepository },
    CreateSaleHandler,
    UpdateSaleStatusHandler,
    GetSaleHandler,
    ListSalesHandler,
  ],
  exports: [SALE_REPOSITORY],
})
export class SaleModule {}
