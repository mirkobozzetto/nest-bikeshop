import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExtendRentalHandler } from '../../application/commands/extend-rental.handler.js';
import { ExtendRentalCommand } from '../../application/commands/extend-rental.command.js';
import { Rental, RentalStatus } from '../../domain/entities/rental.entity.js';
import { RentalItem } from '../../domain/entities/rental-item.js';
import { DateRange } from '../../../shared/domain/value-objects/date-range.vo.js';
import type { RentalRepositoryPort } from '../../domain/ports/rental.repository.port.js';

describe('ExtendRentalHandler', () => {
  let handler: ExtendRentalHandler;
  let mockRepo: RentalRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    handler = new ExtendRentalHandler(mockRepo);
  });

  it('should extend an active rental', async () => {
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

    const newEndDate = new Date('2024-03-15');
    const command = new ExtendRentalCommand('rental-1', newEndDate);
    await handler.execute(command);

    expect(rental.period.end).toEqual(newEndDate);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledWith(rental);
  });

  it('should recalculate total price when extending', async () => {
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

    const newEndDate = new Date('2024-03-15');
    const command = new ExtendRentalCommand('rental-1', newEndDate);
    await handler.execute(command);

    const expectedTotal = 5000 * 14;
    expect(rental.totalCents).toBe(expectedTotal);
  });

  it('should extend with multiple items', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-123',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
        RentalItem.reconstitute({ bikeId: 'bike-2', dailyRateCents: 3000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.ACTIVE,
      totalCents: 72000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-03-01'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(rental);

    const newEndDate = new Date('2024-03-12');
    const command = new ExtendRentalCommand('rental-1', newEndDate);
    await handler.execute(command);

    const expectedTotal = (5000 + 3000) * 11;
    expect(rental.totalCents).toBe(expectedTotal);
    expect(vi.mocked(mockRepo.save)).toHaveBeenCalledWith(rental);
  });

  it('should throw error when rental not found', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    const newEndDate = new Date('2024-03-15');
    const command = new ExtendRentalCommand('non-existent-id', newEndDate);

    await expect(handler.execute(command)).rejects.toThrow(
      'Rental non-existent-id not found',
    );
  });

  it('should throw error when extending non-active rental', async () => {
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

    const newEndDate = new Date('2024-03-15');
    const command = new ExtendRentalCommand('rental-1', newEndDate);

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should throw error when new end date is before or equal to current end date', async () => {
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

    const newEndDate = new Date('2024-03-10');
    const command = new ExtendRentalCommand('rental-1', newEndDate);

    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should throw error when extending returned rental', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-123',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.RETURNED,
      totalCents: 45000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-03-10'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(rental);

    const newEndDate = new Date('2024-03-15');
    const command = new ExtendRentalCommand('rental-1', newEndDate);

    await expect(handler.execute(command)).rejects.toThrow();
  });
});
