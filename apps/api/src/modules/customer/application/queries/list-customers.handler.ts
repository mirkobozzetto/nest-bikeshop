import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../domain/ports/customer.repository.port.js';
import type { ListCustomersQuery } from './list-customers.query.js';
import { CustomerResponseDto } from '../dtos/customer-response.dto.js';

@Injectable()
export class ListCustomersHandler {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: CustomerRepositoryPort,
  ) {}

  async execute(query: ListCustomersQuery): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepo.findAll(
      query.limit,
      query.offset,
    );
    return customers.map((customer) =>
      CustomerResponseDto.fromDomain(customer),
    );
  }
}
