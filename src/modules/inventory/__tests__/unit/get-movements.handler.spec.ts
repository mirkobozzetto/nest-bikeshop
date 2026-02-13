import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetMovementsHandler } from '../../application/queries/get-movements.handler.js';
import { GetMovementsQuery } from '../../application/queries/get-movements.query.js';
import {
  InventoryMovement,
  MovementType,
  MovementReason,
} from '../../domain/entities/inventory-movement.entity.js';
import type { InventoryRepositoryPort } from '../../domain/ports/inventory.repository.port.js';

describe('GetMovementsHandler', () => {
  let handler: GetMovementsHandler;
  let mockRepo: InventoryRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      saveMovement: vi.fn(),
      findMovementsByBikeId: vi.fn(),
      findMovementById: vi.fn(),
    };
    handler = new GetMovementsHandler(mockRepo);
  });

  it('should return empty array when no movements exist', async () => {
    const bikeId = 'bike-123';
    vi.mocked(mockRepo.findMovementsByBikeId).mockResolvedValue([]);

    const query = new GetMovementsQuery(bikeId);
    const result = await handler.execute(query);

    expect(result).toHaveLength(0);
  });

  it('should return all movements for a bike', async () => {
    const bikeId = 'bike-123';
    const movements = [
      InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 10,
      }),
      InventoryMovement.record({
        id: '2',
        bikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 3,
      }),
    ];
    vi.mocked(mockRepo.findMovementsByBikeId).mockResolvedValue(movements);

    const query = new GetMovementsQuery(bikeId);
    const result = await handler.execute(query);

    expect(result).toHaveLength(2);
    expect(result[0].quantity).toBe(10);
    expect(result[1].quantity).toBe(3);
  });

  it('should convert movements to DTOs', async () => {
    const bikeId = 'bike-123';
    const movement = InventoryMovement.record({
      id: 'mov-1',
      bikeId,
      type: MovementType.IN,
      reason: MovementReason.PURCHASE,
      quantity: 5,
      notes: 'Test notes',
    });
    vi.mocked(mockRepo.findMovementsByBikeId).mockResolvedValue([movement]);

    const query = new GetMovementsQuery(bikeId);
    const result = await handler.execute(query);

    expect(result[0].id).toBe('mov-1');
    expect(result[0].bikeId).toBe(bikeId);
    expect(result[0].type).toBe(MovementType.IN);
    expect(result[0].reason).toBe(MovementReason.PURCHASE);
    expect(result[0].quantity).toBe(5);
    expect(result[0].notes).toBe('Test notes');
  });

  it('should fetch movements for the specified bike', async () => {
    const bikeId = 'bike-456';
    vi.mocked(mockRepo.findMovementsByBikeId).mockResolvedValue([]);

    const query = new GetMovementsQuery(bikeId);
    await handler.execute(query);

    expect(vi.mocked(mockRepo.findMovementsByBikeId)).toHaveBeenCalledWith(
      bikeId,
    );
  });
});
