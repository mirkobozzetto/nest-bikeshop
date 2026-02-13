import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListBikesHandler } from '../../application/queries/list-bikes.handler.js';
import { ListBikesQuery } from '../../application/queries/list-bikes.query.js';
import { Bike, BikeType, BikeStatus } from '../../domain/entities/bike.entity.js';
import type { BikeRepositoryPort } from '../../domain/ports/bike.repository.port.js';

describe('ListBikesHandler', () => {
  let handler: ListBikesHandler;
  let mockRepo: BikeRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new ListBikesHandler(mockRepo);
  });

  it('should return list of bikes', async () => {
    const bikes = [
      Bike.reconstitute({
        id: 'bike-1',
        name: 'Trek Domane',
        brand: 'Trek',
        model: 'Domane SL 5',
        type: BikeType.ROAD,
        size: 'M',
        priceCents: 250000,
        dailyRateCents: 5000,
        status: BikeStatus.AVAILABLE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }),
      Bike.reconstitute({
        id: 'bike-2',
        name: 'Specialized Rockhopper',
        brand: 'Specialized',
        model: 'Rockhopper Expert',
        type: BikeType.MOUNTAIN,
        size: 'L',
        priceCents: 180000,
        dailyRateCents: 3500,
        status: BikeStatus.AVAILABLE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }),
    ];

    vi.mocked(mockRepo.findAll).mockResolvedValue(bikes);

    const query = new ListBikesQuery();
    const result = await handler.execute(query);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Trek Domane');
    expect(result[1].name).toBe('Specialized Rockhopper');
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalled();
  });

  it('should return empty list when no bikes exist', async () => {
    vi.mocked(mockRepo.findAll).mockResolvedValue([]);

    const query = new ListBikesQuery();
    const result = await handler.execute(query);

    expect(result).toHaveLength(0);
  });

  it('should filter bikes by type', async () => {
    const bikes = [
      Bike.reconstitute({
        id: 'bike-1',
        name: 'Trek Domane',
        brand: 'Trek',
        model: 'Domane SL 5',
        type: BikeType.ROAD,
        size: 'M',
        priceCents: 250000,
        dailyRateCents: 5000,
        status: BikeStatus.AVAILABLE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }),
    ];

    vi.mocked(mockRepo.findAll).mockResolvedValue(bikes);

    const query = new ListBikesQuery(BikeType.ROAD);
    const result = await handler.execute(query);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(BikeType.ROAD);
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith({
      type: BikeType.ROAD,
      status: undefined,
      brand: undefined,
    });
  });
});
