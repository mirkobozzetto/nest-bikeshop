import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateRentalHandler } from '../../application/commands/create-rental.handler.js';
import { CreateRentalCommand } from '../../application/commands/create-rental.command.js';
import { RentalStatus } from '../../domain/entities/rental.entity.js';
import type { RentalRepositoryPort } from '../../domain/ports/rental.repository.port.js';
import type { InventoryRepositoryPort } from '../../../inventory/domain/ports/inventory.repository.port.js';
import {
  InventoryMovement,
  MovementType,
  MovementReason,
} from '../../../inventory/domain/entities/inventory-movement.entity.js';

vi.mock('uuid', () => ({ v4: () => 'test-uuid-1234' }));

describe('CreateRentalHandler', () => {
  let handler: CreateRentalHandler;
  let mockRepo: RentalRepositoryPort;
  let mockInventoryRepo: InventoryRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    mockInventoryRepo = {
      saveMovement: vi.fn().mockResolvedValue(undefined),
      findMovementsByBikeId: vi.fn(),
      findMovementById: vi.fn(),
    };
    handler = new CreateRentalHandler(mockRepo, mockInventoryRepo);
  });

  it('should create a rental and return its id', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    vi.mocked(mockInventoryRepo.findMovementsByBikeId).mockResolvedValue([
      InventoryMovement.reconstitute({
        id: 'mov-1',
        bikeId: 'bike-1',
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
        date: new Date(),
        createdAt: new Date(),
      }),
      InventoryMovement.reconstitute({
        id: 'mov-2',
        bikeId: 'bike-2',
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 3,
        date: new Date(),
        createdAt: new Date(),
      }),
    ]);

    const command = new CreateRentalCommand(
      'customer-123',
      [
        { bikeId: 'bike-1', dailyRateCents: 5000 },
        { bikeId: 'bike-2', dailyRateCents: 4000 },
      ],
      startDate,
      endDate,
    );

    const id = await handler.execute(command);

    expect(id).toBe('test-uuid-1234');
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledOnce();

    const savedRental = vi.mocked(mockRepo.save).mock.calls[0][0];
    expect(savedRental.id).toBe('test-uuid-1234');
    expect(savedRental.customerId).toBe('customer-123');
    expect(savedRental.status).toBe(RentalStatus.RESERVED);
    expect(savedRental.items).toHaveLength(2);
  });

  it('should reject when customer id is empty', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    vi.mocked(mockInventoryRepo.findMovementsByBikeId).mockResolvedValue([
      InventoryMovement.reconstitute({
        id: 'mov-1',
        bikeId: 'bike-1',
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
        date: new Date(),
        createdAt: new Date(),
      }),
    ]);

    const command = new CreateRentalCommand(
      '',
      [{ bikeId: 'bike-1', dailyRateCents: 5000 }],
      startDate,
      endDate,
    );

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should reject when no items provided', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const command = new CreateRentalCommand(
      'customer-123',
      [],
      startDate,
      endDate,
    );

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should calculate total price correctly', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-11');

    vi.mocked(mockInventoryRepo.findMovementsByBikeId).mockResolvedValue([
      InventoryMovement.reconstitute({
        id: 'mov-1',
        bikeId: 'bike-1',
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
        date: new Date(),
        createdAt: new Date(),
      }),
      InventoryMovement.reconstitute({
        id: 'mov-2',
        bikeId: 'bike-2',
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 3,
        date: new Date(),
        createdAt: new Date(),
      }),
    ]);

    const command = new CreateRentalCommand(
      'customer-123',
      [
        { bikeId: 'bike-1', dailyRateCents: 5000 },
        { bikeId: 'bike-2', dailyRateCents: 3000 },
      ],
      startDate,
      endDate,
    );

    await handler.execute(command);

    const savedRental = vi.mocked(mockRepo.save).mock.calls[0][0];
    const expectedTotal = (5000 + 3000) * 10;
    expect(savedRental.totalCents).toBe(expectedTotal);
  });

  it('should reject rental when bike is not available', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    vi.mocked(mockInventoryRepo.findMovementsByBikeId).mockResolvedValue([]);

    const command = new CreateRentalCommand(
      'customer-123',
      [{ bikeId: 'bike-1', dailyRateCents: 5000 }],
      startDate,
      endDate,
    );

    await expect(handler.execute(command)).rejects.toThrow(
      'is not available for rental',
    );
  });
});
