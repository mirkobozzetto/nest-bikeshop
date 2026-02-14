import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateCustomerHandler } from '../../application/commands/update-customer.handler.js';
import { UpdateCustomerCommand } from '../../application/commands/update-customer.command.js';
import { Customer } from '../../domain/entities/customer.entity.js';
import { Email } from '../../domain/value-objects/email.vo.js';
import { PhoneNumber } from '../../domain/value-objects/phone-number.vo.js';
import type { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

describe('UpdateCustomerHandler', () => {
  let handler: UpdateCustomerHandler;
  let mockRepo: CustomerRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new UpdateCustomerHandler(mockRepo);
  });

  it('should update a customer successfully', async () => {
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

    const command = new UpdateCustomerCommand(
      customerId,
      'Jonathan',
      'Smith',
      'jonathan@example.com',
      '+33687654321',
      '456 Oak Ave',
    );

    await handler.execute(command);

    expect(vi.mocked(mockRepo.findById)).toHaveBeenCalledWith(customerId);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledOnce();
    expect(customer.firstName).toBe('Jonathan');
    expect(customer.lastName).toBe('Smith');
    expect(customer.address).toBe('456 Oak Ave');
  });

  it('should throw DomainException when customer not found', async () => {
    const customerId = 'non-existent-customer';

    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    const command = new UpdateCustomerCommand(
      customerId,
      'John',
      'Doe',
      'john@example.com',
      '+33612345678',
      '123 Main St',
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
    expect(vi.mocked(mockRepo.save)).not.toHaveBeenCalled();
  });

  it('should reject invalid customer first name', async () => {
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

    const command = new UpdateCustomerCommand(
      customerId,
      '',
      'Doe',
      'john@example.com',
      '+33612345678',
      '123 Main St',
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
  });

  it('should reject invalid email format', async () => {
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

    const command = new UpdateCustomerCommand(
      customerId,
      'John',
      'Doe',
      'invalid-email',
      '+33612345678',
      '123 Main St',
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
  });

  it('should reject invalid phone format', async () => {
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

    const command = new UpdateCustomerCommand(
      customerId,
      'John',
      'Doe',
      'john@example.com',
      'invalid-phone',
      '123 Main St',
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
  });

  it('should update only provided fields', async () => {
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

    const command = new UpdateCustomerCommand(
      customerId,
      'Jonathan',
      undefined,
      undefined,
      undefined,
      undefined,
    );

    await handler.execute(command);

    expect(customer.firstName).toBe('Jonathan');
    expect(customer.lastName).toBe('Doe');
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledOnce();
  });
});
