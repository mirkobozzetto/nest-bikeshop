import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListRentalsHandler } from '../../application/queries/list-rentals.handler.js';
import { ListRentalsQuery } from '../../application/queries/list-rentals.query.js';
import { Rental, RentalStatus } from '../../domain/entities/rental.entity.js';
import { RentalItem } from '../../domain/entities/rental-item.js';
import { DateRange } from '../../../shared/domain/value-objects/date-range.vo.js';
import type { RentalRepositoryPort } from '../../domain/ports/rental.repository.port.js';

describe('ListRentalsHandler', () => {
  let handler: ListRentalsHandler;
  let mockRepo: RentalRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    handler = new ListRentalsHandler(mockRepo);
  });

  it('should return all rentals when no filters provided', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental1 = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-1',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.ACTIVE,
      totalCents: 45000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-03-01'),
    });

    const rental2 = Rental.reconstitute({
      id: 'rental-2',
      customerId: 'customer-2',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-2', dailyRateCents: 3000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.RESERVED,
      totalCents: 27000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-02-28'),
    });

    vi.mocked(mockRepo.findAll).mockResolvedValue([rental1, rental2]);

    const query = new ListRentalsQuery();
    const result = await handler.execute(query);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('rental-1');
    expect(result[1].id).toBe('rental-2');
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith({
      customerId: undefined,
      status: undefined,
    });
  });

  it('should filter rentals by customer id', async () => {
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

    vi.mocked(mockRepo.findAll).mockResolvedValue([rental]);

    const query = new ListRentalsQuery('customer-123');
    const result = await handler.execute(query);

    expect(result).toHaveLength(1);
    expect(result[0].customerId).toBe('customer-123');
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith({
      customerId: 'customer-123',
      status: undefined,
    });
  });

  it('should filter rentals by status', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-10');

    const rental = Rental.reconstitute({
      id: 'rental-1',
      customerId: 'customer-1',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-1', dailyRateCents: 5000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.ACTIVE,
      totalCents: 45000,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-03-01'),
    });

    vi.mocked(mockRepo.findAll).mockResolvedValue([rental]);

    const query = new ListRentalsQuery(undefined, RentalStatus.ACTIVE);
    const result = await handler.execute(query);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(RentalStatus.ACTIVE);
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith({
      customerId: undefined,
      status: RentalStatus.ACTIVE,
    });
  });

  it('should filter rentals by both customer id and status', async () => {
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

    vi.mocked(mockRepo.findAll).mockResolvedValue([rental]);

    const query = new ListRentalsQuery('customer-123', RentalStatus.RETURNED);
    const result = await handler.execute(query);

    expect(result).toHaveLength(1);
    expect(result[0].customerId).toBe('customer-123');
    expect(result[0].status).toBe(RentalStatus.RETURNED);
    expect(vi.mocked(mockRepo.findAll)).toHaveBeenCalledWith({
      customerId: 'customer-123',
      status: RentalStatus.RETURNED,
    });
  });

  it('should return empty list when no rentals match filters', async () => {
    vi.mocked(mockRepo.findAll).mockResolvedValue([]);

    const query = new ListRentalsQuery('non-existent-customer');
    const result = await handler.execute(query);

    expect(result).toHaveLength(0);
  });
});
