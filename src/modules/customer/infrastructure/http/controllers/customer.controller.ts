import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { RegisterCustomerHandler } from '../../../application/commands/register-customer.handler.js';
import { UpdateCustomerHandler } from '../../../application/commands/update-customer.handler.js';
import { GetCustomerHandler } from '../../../application/queries/get-customer.handler.js';
import { ListCustomersHandler } from '../../../application/queries/list-customers.handler.js';
import { RegisterCustomerCommand } from '../../../application/commands/register-customer.command.js';
import { UpdateCustomerCommand } from '../../../application/commands/update-customer.command.js';
import { GetCustomerQuery } from '../../../application/queries/get-customer.query.js';
import { ListCustomersQuery } from '../../../application/queries/list-customers.query.js';
import { RegisterCustomerRequest } from '../dtos/register-customer.request.js';
import { UpdateCustomerRequest } from '../dtos/update-customer.request.js';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly registerCustomerHandler: RegisterCustomerHandler,
    private readonly updateCustomerHandler: UpdateCustomerHandler,
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCustomerRequest) {
    await this.updateCustomerHandler.execute(
      new UpdateCustomerCommand(
        id,
        body.firstName,
        body.lastName,
        body.email,
        body.phone,
        body.address,
      ),
    );
    return { success: true };
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
