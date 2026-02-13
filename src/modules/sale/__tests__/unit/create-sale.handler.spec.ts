import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateSaleHandler } from '../../application/commands/create-sale.handler.js';
import { CreateSaleCommand } from '../../application/commands/create-sale.command.js';
import type { SaleRepositoryPort } from '../../domain/ports/sale.repository.port.js';

vi.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

describe('CreateSaleHandler', () => {
  let handler: CreateSaleHandler;
  let mockRepo: SaleRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    handler = new CreateSaleHandler(mockRepo);
  });

  it('should create a sale and return its id', async () => {
    const command = new CreateSaleCommand('customer-123', [
      { bikeId: 'bike-1', priceCents: 250000 },
      { bikeId: 'bike-2', priceCents: 150000 },
    ]);

    const id = await handler.execute(command);

    expect(id).toBe('test-uuid-1234');
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledOnce();
  });

  it('should reject sale with empty customer id', async () => {
    const command = new CreateSaleCommand('', [
      { bikeId: 'bike-1', priceCents: 250000 },
    ]);

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should reject sale with no items', async () => {
    const command = new CreateSaleCommand('customer-123', []);

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should reject sale with invalid bike id in item', async () => {
    const command = new CreateSaleCommand('customer-123', [
      { bikeId: '', priceCents: 250000 },
    ]);

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should reject sale item with invalid price', async () => {
    const command = new CreateSaleCommand('customer-123', [
      { bikeId: 'bike-1', priceCents: 0 },
    ]);

    await expect(handler.execute(command)).rejects.toThrow();
  });
});
