import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListSalesHandler } from '../../application/queries/list-sales.handler.js';
import { ListSalesQuery } from '../../application/queries/list-sales.query.js';
import { Sale, SaleStatus } from '../../domain/entities/sale.entity.js';
import { SaleItem } from '../../domain/entities/sale-item.js';
import type { SaleRepositoryPort } from '../../domain/ports/sale.repository.port.js';

describe('ListSalesHandler', () => {
  let handler: ListSalesHandler;
  let mockRepo: SaleRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    handler = new ListSalesHandler(mockRepo);
  });

  it('should return all sales without filters', async () => {
    const items1 = [SaleItem.create('bike-1', 250000)];
    const items2 = [SaleItem.create('bike-2', 150000)];

    const sales = [
      Sale.reconstitute({
        id: 'sale-1',
        customerId: 'customer-1',
        items: items1,
        status: SaleStatus.PENDING,
        totalCents: 250000,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      }),
      Sale.reconstitute({
        id: 'sale-2',
        customerId: 'customer-2',
        items: items2,
        status: SaleStatus.CONFIRMED,
        totalCents: 150000,
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-02'),
      }),
    ];

    vi.mocked(mockRepo.findAll).mockResolvedValueOnce(sales);

    const query = new ListSalesQuery();
    const result = await handler.execute(query);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('sale-1');
    expect(result[1].id).toBe('sale-2');
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith({
      customerId: undefined,
      status: undefined,
    });
  });

  it('should filter sales by customer id', async () => {
    const items = [SaleItem.create('bike-1', 250000)];
    const sale = Sale.reconstitute({
      id: 'sale-1',
      customerId: 'customer-1',
      items,
      status: SaleStatus.PENDING,
      totalCents: 250000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    });

    vi.mocked(mockRepo.findAll).mockResolvedValueOnce([sale]);

    const query = new ListSalesQuery('customer-1');
    const result = await handler.execute(query);

    expect(result).toHaveLength(1);
    expect(result[0].customerId).toBe('customer-1');
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith({
      customerId: 'customer-1',
      status: undefined,
    });
  });

  it('should filter sales by status', async () => {
    const items = [SaleItem.create('bike-1', 250000)];
    const sale = Sale.reconstitute({
      id: 'sale-1',
      customerId: 'customer-1',
      items,
      status: SaleStatus.CONFIRMED,
      totalCents: 250000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    });

    vi.mocked(mockRepo.findAll).mockResolvedValueOnce([sale]);

    const query = new ListSalesQuery(undefined, SaleStatus.CONFIRMED);
    const result = await handler.execute(query);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(SaleStatus.CONFIRMED);
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith({
      customerId: undefined,
      status: SaleStatus.CONFIRMED,
    });
  });

  it('should filter sales by customer id and status', async () => {
    const items = [SaleItem.create('bike-1', 250000)];
    const sale = Sale.reconstitute({
      id: 'sale-1',
      customerId: 'customer-1',
      items,
      status: SaleStatus.CONFIRMED,
      totalCents: 250000,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    });

    vi.mocked(mockRepo.findAll).mockResolvedValueOnce([sale]);

    const query = new ListSalesQuery('customer-1', SaleStatus.CONFIRMED);
    const result = await handler.execute(query);

    expect(result).toHaveLength(1);
    expect(result[0].customerId).toBe('customer-1');
    expect(result[0].status).toBe(SaleStatus.CONFIRMED);
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith({
      customerId: 'customer-1',
      status: SaleStatus.CONFIRMED,
    });
  });

  it('should return empty list when no sales match filters', async () => {
    vi.mocked(mockRepo.findAll).mockResolvedValueOnce([]);

    const query = new ListSalesQuery('nonexistent-customer');
    const result = await handler.execute(query);

    expect(result).toHaveLength(0);
  });
});
