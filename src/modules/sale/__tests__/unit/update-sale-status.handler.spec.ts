import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateSaleStatusHandler } from '../../application/commands/update-sale-status.handler.js';
import { UpdateSaleStatusCommand } from '../../application/commands/update-sale-status.command.js';
import { Sale, SaleStatus } from '../../domain/entities/sale.entity.js';
import { SaleItem } from '../../domain/entities/sale-item.js';
import type { SaleRepositoryPort } from '../../domain/ports/sale.repository.port.js';

describe('UpdateSaleStatusHandler', () => {
  let handler: UpdateSaleStatusHandler;
  let mockRepo: SaleRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    handler = new UpdateSaleStatusHandler(mockRepo);
  });

  it('should confirm a pending sale', async () => {
    const items = [SaleItem.create('bike-1', 250000)];
    const sale = Sale.reconstitute({
      id: 'sale-123',
      customerId: 'customer-456',
      items,
      status: SaleStatus.PENDING,
      totalCents: 250000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValueOnce(sale);

    const command = new UpdateSaleStatusCommand('sale-123', 'confirm');
    await handler.execute(command);

    expect(sale.status).toBe(SaleStatus.CONFIRMED);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledOnce();
  });

  it('should cancel a pending sale', async () => {
    const items = [SaleItem.create('bike-1', 250000)];
    const sale = Sale.reconstitute({
      id: 'sale-123',
      customerId: 'customer-456',
      items,
      status: SaleStatus.PENDING,
      totalCents: 250000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValueOnce(sale);

    const command = new UpdateSaleStatusCommand('sale-123', 'cancel');
    await handler.execute(command);

    expect(sale.status).toBe(SaleStatus.CANCELLED);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledOnce();
  });

  it('should throw when sale not found', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValueOnce(null);

    const command = new UpdateSaleStatusCommand('nonexistent-123', 'confirm');

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should reject confirming already confirmed sale', async () => {
    const items = [SaleItem.create('bike-1', 250000)];
    const sale = Sale.reconstitute({
      id: 'sale-123',
      customerId: 'customer-456',
      items,
      status: SaleStatus.CONFIRMED,
      totalCents: 250000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValueOnce(sale);

    const command = new UpdateSaleStatusCommand('sale-123', 'confirm');

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should reject cancelling already cancelled sale', async () => {
    const items = [SaleItem.create('bike-1', 250000)];
    const sale = Sale.reconstitute({
      id: 'sale-123',
      customerId: 'customer-456',
      items,
      status: SaleStatus.CANCELLED,
      totalCents: 250000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValueOnce(sale);

    const command = new UpdateSaleStatusCommand('sale-123', 'cancel');

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should reject cancelling confirmed sale', async () => {
    const items = [SaleItem.create('bike-1', 250000)];
    const sale = Sale.reconstitute({
      id: 'sale-123',
      customerId: 'customer-456',
      items,
      status: SaleStatus.CONFIRMED,
      totalCents: 250000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValueOnce(sale);

    const command = new UpdateSaleStatusCommand('sale-123', 'cancel');

    await expect(handler.execute(command)).rejects.toThrow();
  });
});
