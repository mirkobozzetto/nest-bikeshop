import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetSaleHandler } from '../../application/queries/get-sale.handler.js';
import { GetSaleQuery } from '../../application/queries/get-sale.query.js';
import { Sale, SaleStatus } from '../../domain/entities/sale.entity.js';
import { SaleItem } from '../../domain/entities/sale-item.js';
import type { SaleRepositoryPort } from '../../domain/ports/sale.repository.port.js';

describe('GetSaleHandler', () => {
  let handler: GetSaleHandler;
  let mockRepo: SaleRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    handler = new GetSaleHandler(mockRepo);
  });

  it('should return sale by id', async () => {
    const item = SaleItem.create('bike-1', 250000);
    const sale = Sale.reconstitute({
      id: 'sale-123',
      customerId: 'customer-456',
      items: [item],
      status: SaleStatus.PENDING,
      totalCents: 250000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValueOnce(sale);

    const query = new GetSaleQuery('sale-123');
    const result = await handler.execute(query);

    expect(result.id).toBe('sale-123');
    expect(result.customerId).toBe('customer-456');
    expect(result.status).toBe(SaleStatus.PENDING);
    expect(result.totalCents).toBe(250000);
    expect(vi.mocked(mockRepo.findById)).toHaveBeenCalledWith('sale-123');
  });

  it('should throw when sale not found', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValueOnce(null);

    const query = new GetSaleQuery('nonexistent-123');

    await expect(handler.execute(query)).rejects.toThrow();
  });

  it('should return sale with multiple items', async () => {
    const items = [
      SaleItem.create('bike-1', 250000),
      SaleItem.create('bike-2', 150000),
    ];
    const sale = Sale.reconstitute({
      id: 'sale-789',
      customerId: 'customer-789',
      items,
      status: SaleStatus.CONFIRMED,
      totalCents: 400000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-02'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValueOnce(sale);

    const query = new GetSaleQuery('sale-789');
    const result = await handler.execute(query);

    expect(result.totalCents).toBe(400000);
    expect(result.items).toHaveLength(2);
    expect(result.status).toBe(SaleStatus.CONFIRMED);
  });
});
