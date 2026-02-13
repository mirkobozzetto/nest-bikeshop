import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateBikeStatusHandler } from '../../application/commands/update-bike-status.handler.js';
import { UpdateBikeStatusCommand } from '../../application/commands/update-bike-status.command.js';
import {
  Bike,
  BikeType,
  BikeStatus,
} from '../../domain/entities/bike.entity.js';
import type { BikeRepositoryPort } from '../../domain/ports/bike.repository.port.js';

describe('UpdateBikeStatusHandler', () => {
  let handler: UpdateBikeStatusHandler;
  let mockRepo: BikeRepositoryPort;

  const makeBike = (status: BikeStatus = BikeStatus.AVAILABLE) =>
    Bike.reconstitute({
      id: 'bike-1',
      name: 'Test Bike',
      brand: 'Trek',
      model: 'Domane',
      type: BikeType.ROAD,
      size: 'M',
      priceCents: 250000,
      dailyRateCents: 5000,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new UpdateBikeStatusHandler(mockRepo);
  });

  it('should rent an available bike', async () => {
    const bike = makeBike(BikeStatus.AVAILABLE);
    vi.mocked(mockRepo.findById).mockResolvedValue(bike);

    await handler.execute(new UpdateBikeStatusCommand('bike-1', 'rent'));

    expect(bike.status).toBe(BikeStatus.RENTED);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledWith(bike);
  });

  it('should return a rented bike', async () => {
    const bike = makeBike(BikeStatus.RENTED);
    vi.mocked(mockRepo.findById).mockResolvedValue(bike);

    await handler.execute(new UpdateBikeStatusCommand('bike-1', 'return'));

    expect(bike.status).toBe(BikeStatus.AVAILABLE);
  });

  it('should throw when bike not found', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    await expect(
      handler.execute(new UpdateBikeStatusCommand('unknown', 'rent')),
    ).rejects.toThrow('not found');
  });

  it('should throw on invalid transition', async () => {
    const bike = makeBike(BikeStatus.SOLD);
    vi.mocked(mockRepo.findById).mockResolvedValue(bike);

    await expect(
      handler.execute(new UpdateBikeStatusCommand('bike-1', 'rent')),
    ).rejects.toThrow();
  });
});
