import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { RegisterCustomerHandler } from '../../../application/commands/register-customer.handler.js';
import { GetCustomerHandler } from '../../../application/queries/get-customer.handler.js';
import { ListCustomersHandler } from '../../../application/queries/list-customers.handler.js';
import { RegisterCustomerCommand } from '../../../application/commands/register-customer.command.js';
import { GetCustomerQuery } from '../../../application/queries/get-customer.query.js';
import { ListCustomersQuery } from '../../../application/queries/list-customers.query.js';
import { RegisterCustomerRequest } from '../dtos/register-customer.request.js';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly registerCustomerHandler: RegisterCustomerHandler,
    private readonly getCustomerHandler: GetCustomerHandler,
    private readonly listCustomersHandler: ListCustomersHandler,
  ) {}

  @Post()
  async register(@Body() body: RegisterCustomerRequest) {
    const command = new RegisterCustomerCommand(
      body.firstName,
      body.lastName,
      body.email,
      body.phone,
      body.address,
    );
    const id = await this.registerCustomerHandler.execute(command);
    return { id };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getCustomerHandler.execute(new GetCustomerQuery(id));
  }

  @Get()
  async findAll(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.listCustomersHandler.execute(
      new ListCustomersQuery(limit, offset),
    );
  }
}
