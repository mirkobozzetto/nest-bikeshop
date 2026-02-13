import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListCustomersHandler } from '../../application/queries/list-customers.handler.js';
import { ListCustomersQuery } from '../../application/queries/list-customers.query.js';
import { Customer } from '../../domain/entities/customer.entity.js';
import { Email } from '../../domain/value-objects/email.vo.js';
import { PhoneNumber } from '../../domain/value-objects/phone-number.vo.js';
import type { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port.js';

describe('ListCustomersHandler', () => {
  let handler: ListCustomersHandler;
  let mockRepo: CustomerRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new ListCustomersHandler(mockRepo);
  });

  it('should return list of customers', async () => {
    const email1 = Email.create('john@example.com');
    const phone1 = PhoneNumber.create('+33612345678');
    const email2 = Email.create('jane@example.com');
    const phone2 = PhoneNumber.create('+33687654321');

    const customers = [
      Customer.reconstitute({
        id: 'customer-1',
        firstName: 'John',
        lastName: 'Doe',
        email: email1,
        phone: phone1,
        address: '123 Main St',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }),
      Customer.reconstitute({
        id: 'customer-2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: email2,
        phone: phone2,
        address: '456 Oak Ave',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      }),
    ];

    vi.mocked(mockRepo.findAll).mockResolvedValue(customers);

    const query = new ListCustomersQuery(10, 0);
    const result = await handler.execute(query);

    expect(result).toHaveLength(2);
    expect(result[0].firstName).toBe('John');
    expect(result[1].firstName).toBe('Jane');
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith(10, 0);
  });

  it('should return empty list when no customers exist', async () => {
    vi.mocked(mockRepo.findAll).mockResolvedValue([]);

    const query = new ListCustomersQuery(10, 0);
    const result = await handler.execute(query);

    expect(result).toHaveLength(0);
  });

  it('should pass limit and offset to repository', async () => {
    vi.mocked(mockRepo.findAll).mockResolvedValue([]);

    const query = new ListCustomersQuery(20, 40);
    await handler.execute(query);

    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith(20, 40);
  });
});
