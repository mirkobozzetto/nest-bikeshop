import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterCustomerHandler } from '../../application/commands/register-customer.handler.js';
import { RegisterCustomerCommand } from '../../application/commands/register-customer.command.js';
import type { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port.js';

vi.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

describe('RegisterCustomerHandler', () => {
  let handler: RegisterCustomerHandler;
  let mockRepo: CustomerRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new RegisterCustomerHandler(mockRepo);
  });

  it('should register a customer and return its id', async () => {
    const command = new RegisterCustomerCommand(
      'John',
      'Doe',
      'john@example.com',
      '+33612345678',
      '123 Main St',
    );

    const id = await handler.execute(command);

    expect(id).toBe('test-uuid-1234');
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledOnce();
  });

  it('should reject invalid customer data', async () => {
    const command = new RegisterCustomerCommand(
      '',
      'Doe',
      'john@example.com',
      '+33612345678',
      '123 Main St',
    );

    await expect(handler.execute(command)).rejects.toThrow();
  });
});
