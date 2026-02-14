import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateSaleStatusHandler } from '../../application/commands/update-sale-status.handler.js';
import { UpdateSaleStatusCommand } from '../../application/commands/update-sale-status.command.js';
import { Sale, SaleStatus } from '../../domain/entities/sale.entity.js';
import { SaleItem } from '../../domain/entities/sale-item.js';
import type { SaleRepositoryPort } from '../../domain/ports/sale.repository.port.js';
import type { InventoryRepositoryPort } from '../../../inventory/domain/ports/inventory.repository.port.js';
import type { BikeRepositoryPort } from '../../../bike/domain/ports/bike.repository.port.js';
import {
  Bike,
  BikeStatus,
  BikeType,
} from '../../../bike/domain/entities/bike.entity.js';

describe('UpdateSaleStatusHandler', () => {
  let handler: UpdateSaleStatusHandler;
  let mockSaleRepo: SaleRepositoryPort;
  let mockInventoryRepo: InventoryRepositoryPort;
  let mockBikeRepo: BikeRepositoryPort;

  beforeEach(() => {
    mockSaleRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    mockInventoryRepo = {
      saveMovement: vi.fn().mockResolvedValue(undefined),
      findMovementsByBikeId: vi.fn(),
      findMovementById: vi.fn(),
    };
    mockBikeRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new UpdateSaleStatusHandler(
      mockSaleRepo,
      mockInventoryRepo,
      mockBikeRepo,
    );
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

    const bike = Bike.reconstitute({
      id: 'bike-1',
      name: 'Test Bike',
      brand: 'Brand',
      model: 'Model',
      type: BikeType.ROAD,
      size: 'M',
      priceCents: 100000,
      dailyRateCents: 5000,
      status: BikeStatus.AVAILABLE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockSaleRepo.findById).mockResolvedValueOnce(sale);
    vi.mocked(mockBikeRepo.findById).mockResolvedValueOnce(bike);

    const command = new UpdateSaleStatusCommand('sale-123', 'confirm');
    await handler.execute(command);

    expect(sale.status).toBe(SaleStatus.CONFIRMED);
    expect(vi.mocked(mockSaleRepo.save)).toHaveBeenCalledOnce();
    expect(vi.mocked(mockInventoryRepo.saveMovement)).toHaveBeenCalledOnce();
    expect(vi.mocked(mockBikeRepo.save)).toHaveBeenCalledOnce();
    expect(bike.status).toBe(BikeStatus.SOLD);
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

    vi.mocked(mockSaleRepo.findById).mockResolvedValueOnce(sale);

    const command = new UpdateSaleStatusCommand('sale-123', 'cancel');
    await handler.execute(command);

    expect(sale.status).toBe(SaleStatus.CANCELLED);
    expect(vi.mocked(mockSaleRepo.save)).toHaveBeenCalledOnce();
    expect(vi.mocked(mockInventoryRepo.saveMovement)).not.toHaveBeenCalled();
  });

  it('should throw when sale not found', async () => {
    vi.mocked(mockSaleRepo.findById).mockResolvedValueOnce(null);

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

    vi.mocked(mockSaleRepo.findById).mockResolvedValueOnce(sale);

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

    vi.mocked(mockSaleRepo.findById).mockResolvedValueOnce(sale);

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

    vi.mocked(mockSaleRepo.findById).mockResolvedValueOnce(sale);

    const command = new UpdateSaleStatusCommand('sale-123', 'cancel');

    await expect(handler.execute(command)).rejects.toThrow();
  });
});
