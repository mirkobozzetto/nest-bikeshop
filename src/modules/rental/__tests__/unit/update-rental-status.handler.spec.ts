import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateRentalStatusHandler } from '../../application/commands/update-rental-status.handler.js';
import { UpdateRentalStatusCommand } from '../../application/commands/update-rental-status.command.js';
import { Rental, RentalStatus } from '../../domain/entities/rental.entity.js';
import { RentalItem } from '../../domain/entities/rental-item.js';
import { DateRange } from '../../../shared/domain/value-objects/date-range.vo.js';
import type { RentalRepositoryPort } from '../../domain/ports/rental.repository.port.js';

describe('UpdateRentalStatusHandler', () => {
  let handler: UpdateRentalStatusHandler;
  let mockRepo: RentalRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    handler = new UpdateRentalStatusHandler(mockRepo);
  });

  it('should start a reserved rental', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-123',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.RESERVED,
      totalCents: 45000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-02-28'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(rental);

    const command = new UpdateRentalStatusCommand('rental-1', 'start');
    await handler.execute(command);

    expect(rental.status).toBe(RentalStatus.ACTIVE);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledWith(rental);
  });

  it('should return an active rental', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-123',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.ACTIVE,
      totalCents: 45000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-03-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(rental);

    const command = new UpdateRentalStatusCommand('rental-1', 'return');
    await handler.execute(command);

    expect(rental.status).toBe(RentalStatus.RETURNED);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledWith(rental);
  });

  it('should cancel a reserved rental', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-123',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.RESERVED,
      totalCents: 45000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-02-28'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(rental);

    const command = new UpdateRentalStatusCommand('rental-1', 'cancel');
    await handler.execute(command);

    expect(rental.status).toBe(RentalStatus.CANCELLED);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledWith(rental);
  });

  it('should throw error when rental not found', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    const command = new UpdateRentalStatusCommand('non-existent-id', 'start');

    await expect(handler.execute(command)).rejects.toThrow(
      'Rental non-existent-id not found',
    );
  });

  it('should throw error when starting non-reserved rental', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-123',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.ACTIVE,
      totalCents: 45000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-03-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(rental);

    const command = new UpdateRentalStatusCommand('rental-1', 'start');

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should throw error when returning non-active rental', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-123',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.RESERVED,
      totalCents: 45000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-02-28'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(rental);

    const command = new UpdateRentalStatusCommand('rental-1', 'return');

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should throw error when cancelling non-reserved rental', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-123',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.ACTIVE,
      totalCents: 45000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-03-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(rental);

    const command = new UpdateRentalStatusCommand('rental-1', 'cancel');

    await expect(handler.execute(command)).rejects.toThrow();
  });
});
