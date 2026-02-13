import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateBikeHandler } from '../../application/commands/update-bike.handler.js';
import { UpdateBikeCommand } from '../../application/commands/update-bike.command.js';
import { Bike, BikeType, BikeStatus } from '../../domain/entities/bike.entity.js';
import type { BikeRepositoryPort } from '../../domain/ports/bike.repository.port.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

describe('UpdateBikeHandler', () => {
  let handler: UpdateBikeHandler;
  let mockRepo: BikeRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new UpdateBikeHandler(mockRepo);
  });

  it('should update a bike successfully', async () => {
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

    const command = new UpdateBikeCommand(
      bikeId,
      'Trek Domane Updated',
      'Trek',
      'Domane SL 6',
      BikeType.ROAD,
      'L',
      280000,
      5500,
    );

    await handler.execute(command);

    expect(vi.mocked(mockRepo.findById)).toHaveBeenCalledWith(bikeId);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledOnce();
    expect(bike.name).toBe('Trek Domane Updated');
    expect(bike.size).toBe('L');
    expect(bike.priceCents).toBe(280000);
  });

  it('should throw DomainException when bike not found', async () => {
    const bikeId = 'non-existent-bike';

    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    const command = new UpdateBikeCommand(
      bikeId,
      'Trek Domane',
      'Trek',
      'Domane SL 5',
      BikeType.ROAD,
      'M',
      250000,
      5000,
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
    expect(vi.mocked(mockRepo.save)).not.toHaveBeenCalled();
  });

  it('should reject invalid bike name', async () => {
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

    const command = new UpdateBikeCommand(
      bikeId,
      '',
      'Trek',
      'Domane SL 5',
      BikeType.ROAD,
      'M',
      250000,
      5000,
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
  });

  it('should reject invalid price', async () => {
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

    const command = new UpdateBikeCommand(
      bikeId,
      'Trek Domane',
      'Trek',
      'Domane SL 5',
      BikeType.ROAD,
      'M',
      -1000,
      5000,
    );

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
  });
});
