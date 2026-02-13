import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetBikeHandler } from '../../application/queries/get-bike.handler.js';
import { GetBikeQuery } from '../../application/queries/get-bike.query.js';
import {
  Bike,
  BikeType,
  BikeStatus,
} from '../../domain/entities/bike.entity.js';
import type { BikeRepositoryPort } from '../../domain/ports/bike.repository.port.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

describe('GetBikeHandler', () => {
  let handler: GetBikeHandler;
  let mockRepo: BikeRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new GetBikeHandler(mockRepo);
  });

  it('should return a bike when it exists', async () => {
    const bikeId = 'bike-123';
    const bike = Bike.reconstitute({
      id: bikeId,
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
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(bike);

    const query = new GetBikeQuery(bikeId);
    const result = await handler.execute(query);

    expect(result).toBeDefined();
    expect(result.id).toBe(bikeId);
    expect(result.name).toBe('Trek Domane');
    expect(vi.mocked(mockRepo.findById)).toHaveBeenCalledWith(bikeId);
  });

  it('should throw NotFoundException when bike does not exist', async () => {
    const bikeId = 'non-existent-bike';

    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    const query = new GetBikeQuery(bikeId);

    await expect(handler.execute(query)).rejects.toThrow(DomainException);
  });
});
