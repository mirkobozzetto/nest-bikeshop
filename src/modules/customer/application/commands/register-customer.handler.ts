import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../domain/ports/customer.repository.port.js';
import { Customer } from '../../domain/entities/customer.entity.js';
import type { RegisterCustomerCommand } from './register-customer.command.js';

@Injectable()
export class RegisterCustomerHandler {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: CustomerRepositoryPort,
  ) {}

  async execute(command: RegisterCustomerCommand): Promise<string> {
    const customer = Customer.register({
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      phone: command.phone,
      address: command.address,
    });

    await this.customerRepo.save(customer);
    return customer.id;
  }
}
