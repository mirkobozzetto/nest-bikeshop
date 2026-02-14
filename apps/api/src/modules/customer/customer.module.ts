import { Module } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from './domain/ports/customer.repository.port.js';
import { PrismaCustomerRepository } from './infrastructure/persistence/repositories/prisma-customer.repository.js';
import { RegisterCustomerHandler } from './application/commands/register-customer.handler.js';
import { UpdateCustomerHandler } from './application/commands/update-customer.handler.js';
import { GetCustomerHandler } from './application/queries/get-customer.handler.js';
import { ListCustomersHandler } from './application/queries/list-customers.handler.js';
import { CustomerController } from './infrastructure/http/controllers/customer.controller.js';
import { PrismaService } from '../../libs/prisma.service.js';

@Module({
  controllers: [CustomerController],
  providers: [
    PrismaService,
    { provide: CUSTOMER_REPOSITORY, useClass: PrismaCustomerRepository },
    RegisterCustomerHandler,
    UpdateCustomerHandler,
    GetCustomerHandler,
    ListCustomersHandler,
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomerModule {}
