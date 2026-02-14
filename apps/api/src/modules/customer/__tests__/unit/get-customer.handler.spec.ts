import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetCustomerHandler } from '../../application/queries/get-customer.handler.js';
import { GetCustomerQuery } from '../../application/queries/get-customer.query.js';
import { Customer } from '../../domain/entities/customer.entity.js';
import { Email } from '../../domain/value-objects/email.vo.js';
import { PhoneNumber } from '../../domain/value-objects/phone-number.vo.js';
import type { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port.js';
import { NotFoundException } from '@nestjs/common';

describe('GetCustomerHandler', () => {
  let handler: GetCustomerHandler;
  let mockRepo: CustomerRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new GetCustomerHandler(mockRepo);
  });

  it('should return a customer when it exists', async () => {
    const customerId = 'customer-123';
    const email = Email.create('john@example.com');
    const phone = PhoneNumber.create('+33612345678');
    const customer = Customer.reconstitute({
      id: customerId,
      firstName: 'John',
      lastName: 'Doe',
      email,
      phone,
      address: '123 Main St',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(customer);

    const query = new GetCustomerQuery(customerId);
    const result = await handler.execute(query);

    expect(result).toBeDefined();
    expect(result.id).toBe(customerId);
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(vi.mocked(mockRepo.findById)).toHaveBeenCalledWith(customerId);
  });

  it('should throw NotFoundException when customer does not exist', async () => {
    const customerId = 'non-existent-customer';

    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    const query = new GetCustomerQuery(customerId);

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
  });
});
