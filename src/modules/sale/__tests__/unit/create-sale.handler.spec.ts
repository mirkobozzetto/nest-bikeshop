import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateSaleHandler } from '../../application/commands/create-sale.handler.js';
import { CreateSaleCommand } from '../../application/commands/create-sale.command.js';
import type { SaleRepositoryPort } from '../../domain/ports/sale.repository.port.js';
import type { BikeRepositoryPort } from '../../../bike/domain/ports/bike.repository.port.js';
import {
  Bike,
  BikeStatus,
  BikeType,
} from '../../../bike/domain/entities/bike.entity.js';

vi.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

describe('CreateSaleHandler', () => {
  let handler: CreateSaleHandler;
  let mockSaleRepo: SaleRepositoryPort;
  let mockBikeRepo: BikeRepositoryPort;

  beforeEach(() => {
    mockSaleRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    mockBikeRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(
        Bike.reconstitute({
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
        }),
      ),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new CreateSaleHandler(mockSaleRepo, mockBikeRepo);
  });

  it('should create a sale and return its id', async () => {
    const command = new CreateSaleCommand('customer-123', [
      { bikeId: 'bike-1', priceCents: 250000 },
      { bikeId: 'bike-2', priceCents: 150000 },
    ]);

    vi.mocked(mockBikeRepo.findById).mockResolvedValue(
      Bike.reconstitute({
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
      }),
    );

    const id = await handler.execute(command);

    expect(id).toBe('test-uuid-1234');
    expect(vi.mocked(mockSaleRepo.save)).toHaveBeenCalledOnce();
    expect(vi.mocked(mockBikeRepo.findById)).toHaveBeenCalledTimes(2);
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

  it('should reject sale when bike not found', async () => {
    vi.mocked(mockBikeRepo.findById).mockResolvedValueOnce(null);

    const command = new CreateSaleCommand('customer-123', [
      { bikeId: 'bike-1', priceCents: 250000 },
    ]);

    await expect(handler.execute(command)).rejects.toThrow('BIKE_NOT_FOUND');
  });
});
