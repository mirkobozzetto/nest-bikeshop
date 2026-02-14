import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetRentalHandler } from '../../application/queries/get-rental.handler.js';
import { GetRentalQuery } from '../../application/queries/get-rental.query.js';
import { Rental, RentalStatus } from '../../domain/entities/rental.entity.js';
import { RentalItem } from '../../domain/entities/rental-item.js';
import { DateRange } from '../../../shared/domain/value-objects/date-range.vo.js';
import type { RentalRepositoryPort } from '../../domain/ports/rental.repository.port.js';

describe('GetRentalHandler', () => {
  let handler: GetRentalHandler;
  let mockRepo: RentalRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    handler = new GetRentalHandler(mockRepo);
  });

  it('should return rental dto when found', async () => {
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

    const query = new GetRentalQuery('rental-1');
    const result = await handler.execute(query);

    expect(result.id).toBe('rental-1');
    expect(result.customerId).toBe('customer-123');
    expect(result.status).toBe(RentalStatus.ACTIVE);
    expect(result.totalCents).toBe(45000);
    expect(result.items).toHaveLength(1);
    expect(vi.mocked(mockRepo.findById)).toHaveBeenCalledWith('rental-1');
  });

  it('should throw error when rental not found', async () => {
    vi.mocked(mockRepo.findById).mockResolvedValue(null);

    const query = new GetRentalQuery('non-existent-id');

    await expect(handler.execute(query)).rejects.toThrow(
      'Rental non-existent-id not found',
    );
  });

  it('should map rental entity to response dto correctly', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-05');

    const rental = Rental.reconstitute({
      id: 'rental-456',
      customerId: 'customer-456',
      items: [
        RentalItem.reconstitute({ bikeId: 'bike-2', dailyRateCents: 3000 }),
        RentalItem.reconstitute({ bikeId: 'bike-3', dailyRateCents: 4000 }),
      ],
      period: DateRange.create(startDate, endDate),
      status: RentalStatus.RETURNED,
      totalCents: 28000,
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-03-05'),
    });

    vi.mocked(mockRepo.findById).mockResolvedValue(rental);

    const query = new GetRentalQuery('rental-456');
    const result = await handler.execute(query);

    expect(result.id).toBe('rental-456');
    expect(result.customerId).toBe('customer-456');
    expect(result.items).toHaveLength(2);
    expect(result.items[0].bikeId).toBe('bike-2');
    expect(result.items[1].bikeId).toBe('bike-3');
  });
});
