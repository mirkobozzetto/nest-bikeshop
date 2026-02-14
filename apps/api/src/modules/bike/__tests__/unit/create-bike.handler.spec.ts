import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateBikeHandler } from '../../application/commands/create-bike.handler.js';
import { CreateBikeCommand } from '../../application/commands/create-bike.command.js';
import { BikeType } from '../../domain/entities/bike.entity.js';
import type { BikeRepositoryPort } from '../../domain/ports/bike.repository.port.js';

vi.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

describe('CreateBikeHandler', () => {
  let handler: CreateBikeHandler;
  let mockRepo: BikeRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };
    handler = new CreateBikeHandler(mockRepo);
  });

  it('should create a bike and return its id', async () => {
    const command = new CreateBikeCommand(
      'Trek Domane',
      'Trek',
      'Domane SL 5',
      BikeType.ROAD,
      'M',
      250000,
      5000,
    );

    const id = await handler.execute(command);

    expect(id).toBe('test-uuid-1234');
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledOnce();
  });

  it('should reject invalid bike data', async () => {
    const command = new CreateBikeCommand(
      '',
      'Trek',
      'Domane SL 5',
      BikeType.ROAD,
      'M',
      250000,
      5000,
    );

    await expect(handler.execute(command)).rejects.toThrow();
  });
});
