import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../domain/ports/customer.repository.port.js';
import type { UpdateCustomerCommand } from './update-customer.command.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import { Email } from '../../domain/value-objects/email.vo.js';
import { PhoneNumber } from '../../domain/value-objects/phone-number.vo.js';

@Injectable()
export class UpdateCustomerHandler {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: CustomerRepositoryPort,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<void> {
    const customer = await this.customerRepo.findById(command.id);
    if (!customer) {
      throw new DomainException('Customer not found', 'CUSTOMER_NOT_FOUND');
    }

    customer.update({
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email ? Email.create(command.email) : undefined,
      phone: command.phone ? PhoneNumber.create(command.phone) : undefined,
      address: command.address,
    });

    await this.customerRepo.save(customer);
  }
}
