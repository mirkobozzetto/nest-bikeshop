import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetStockHandler } from '../../application/queries/get-stock.handler.js';
import { GetStockQuery } from '../../application/queries/get-stock.query.js';
import {
  InventoryMovement,
  MovementType,
  MovementReason,
} from '../../domain/entities/inventory-movement.entity.js';
import type { InventoryRepositoryPort } from '../../domain/ports/inventory.repository.port.js';

describe('GetStockHandler', () => {
  let handler: GetStockHandler;
  let mockRepo: InventoryRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      saveMovement: vi.fn(),
      findMovementsByBikeId: vi.fn(),
      findMovementById: vi.fn(),
    };
    handler = new GetStockHandler(mockRepo);
  });

  it('should return zero stock when no movements exist', async () => {
    const bikeId = 'bike-123';
    vi.mocked(mockRepo.findMovementsByBikeId).mockResolvedValue([]);

    const query = new GetStockQuery(bikeId);
    const result = await handler.execute(query);

    expect(result.bikeId).toBe(bikeId);
    expect(result.quantity).toBe(0);
  });

  it('should calculate stock from movements', async () => {
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

    const query = new GetStockQuery(bikeId);
    const result = await handler.execute(query);

    expect(result.bikeId).toBe(bikeId);
    expect(result.quantity).toBe(7);
  });

  it('should return negative stock if out movements exceed in', async () => {
    const bikeId = 'bike-123';
    const movements = [
      InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
      }),
      InventoryMovement.record({
        id: '2',
        bikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 10,
      }),
    ];
    vi.mocked(mockRepo.findMovementsByBikeId).mockResolvedValue(movements);

    const query = new GetStockQuery(bikeId);
    const result = await handler.execute(query);

    expect(result.quantity).toBe(-5);
  });

  it('should fetch movements for the specified bike', async () => {
    const bikeId = 'bike-456';
    vi.mocked(mockRepo.findMovementsByBikeId).mockResolvedValue([]);

    const query = new GetStockQuery(bikeId);
    await handler.execute(query);

    expect(vi.mocked(mockRepo.findMovementsByBikeId)).toHaveBeenCalledWith(
      bikeId,
    );
  });
});
