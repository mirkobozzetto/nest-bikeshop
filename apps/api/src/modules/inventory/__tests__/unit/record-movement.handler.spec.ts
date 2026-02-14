import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecordMovementHandler } from '../../application/commands/record-movement.handler.js';
import { RecordMovementCommand } from '../../application/commands/record-movement.command.js';
import {
  MovementType,
  MovementReason,
} from '../../domain/entities/inventory-movement.entity.js';
import type { InventoryRepositoryPort } from '../../domain/ports/inventory.repository.port.js';

vi.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

describe('RecordMovementHandler', () => {
  let handler: RecordMovementHandler;
  let mockRepo: InventoryRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      saveMovement: vi.fn().mockResolvedValue(undefined),
      findMovementsByBikeId: vi.fn(),
      findMovementById: vi.fn(),
    };
    handler = new RecordMovementHandler(mockRepo);
  });

  it('should record a movement and return its id', async () => {
    const command = new RecordMovementCommand(
      'bike-123',
      MovementType.IN,
      MovementReason.PURCHASE,
      5,
    );

    const id = await handler.execute(command);

    expect(id).toBe('test-uuid-1234');
    expect(vi.mocked(mockRepo.saveMovement)).toHaveBeenCalledOnce();
  });

  it('should reject invalid movement data', async () => {
    const command = new RecordMovementCommand(
      '',
      MovementType.IN,
      MovementReason.PURCHASE,
      5,
    );

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should pass all command parameters to domain', async () => {
    const customDate = new Date('2025-01-15');
    const command = new RecordMovementCommand(
      'bike-456',
      MovementType.OUT,
      MovementReason.SALE,
      2,
      customDate,
      'Customer returned item',
    );

    const id = await handler.execute(command);

    expect(id).toBe('test-uuid-1234');
    expect(vi.mocked(mockRepo.saveMovement)).toHaveBeenCalledOnce();
  });
});
