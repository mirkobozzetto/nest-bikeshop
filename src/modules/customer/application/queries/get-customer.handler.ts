import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../domain/ports/customer.repository.port.js';
import type { GetCustomerQuery } from './get-customer.query.js';
import { CustomerResponseDto } from '../dtos/customer-response.dto.js';

@Injectable()
export class GetCustomerHandler {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: CustomerRepositoryPort,
  ) {}

  async execute(query: GetCustomerQuery): Promise<CustomerResponseDto> {
    const customer = await this.customerRepo.findById(query.id);

    if (!customer) {
      throw new NotFoundException(`Customer with id ${query.id} not found`);
    }

    return CustomerResponseDto.fromDomain(customer);
  }
}
