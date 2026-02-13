import { describe, it, expect } from 'vitest';
import { Rental, RentalStatus } from './rental.entity.js';
import { RentalItem } from './rental-item.js';
import { DateRange } from '../../../shared/domain/value-objects/date-range.vo.js';

describe('Rental', () => {
  const jan1 = new Date('2026-01-01');
  const jan5 = new Date('2026-01-05');
  const jan10 = new Date('2026-01-10');
  const period = DateRange.create(jan1, jan5);
  const items = [
    RentalItem.create('bike-1', 5000),
    RentalItem.create('bike-2', 3000),
  ];

  const validParams = {
    id: 'rental-1',
    customerId: 'cust-1',
    items,
    period,
  };

  describe('creation', () => {
    it('should create a rental with valid params', () => {
      const rental = Rental.create(validParams);
      expect(rental.id).toBe('rental-1');
      expect(rental.status).toBe(RentalStatus.RESERVED);
    });

    it('should calculate total correctly', () => {
      const rental = Rental.create(validParams);
      expect(rental.totalCents).toBe((5000 + 3000) * 4);
    });

    it('should emit RentalCreated event', () => {
      const rental = Rental.create(validParams);
      const events = rental.releaseEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('RentalCreated');
    });

    it('should reject empty items', () => {
      expect(() => Rental.create({ ...validParams, items: [] })).toThrow();
    });

    it('should reject empty customerId', () => {
      expect(() => Rental.create({ ...validParams, customerId: '' })).toThrow();
    });
  });

  describe('state machine', () => {
    it('should start a reserved rental', () => {
      const rental = Rental.create(validParams);
      rental.start();
      expect(rental.status).toBe(RentalStatus.ACTIVE);
    });

    it('should reject starting a non-reserved rental', () => {
      const rental = Rental.create(validParams);
      rental.start();
      expect(() => rental.start()).toThrow();
    });

    it('should return an active rental', () => {
      const rental = Rental.create(validParams);
      rental.start();
      rental.return();
      expect(rental.status).toBe(RentalStatus.RETURNED);
    });

    it('should reject returning a non-active rental', () => {
      const rental = Rental.create(validParams);
      expect(() => rental.return()).toThrow();
    });

    it('should cancel a reserved rental', () => {
      const rental = Rental.create(validParams);
      rental.cancel();
      expect(rental.status).toBe(RentalStatus.CANCELLED);
    });

    it('should reject cancelling an active rental', () => {
      const rental = Rental.create(validParams);
      rental.start();
      expect(() => rental.cancel()).toThrow();
    });

    it('should extend an active rental', () => {
      const rental = Rental.create(validParams);
      rental.start();
      rental.extend(jan10);
      expect(rental.period.end.getTime()).toBe(jan10.getTime());
    });

    it('should recalculate total after extend', () => {
      const rental = Rental.create(validParams);
      rental.start();
      rental.extend(jan10);
      expect(rental.totalCents).toBe((5000 + 3000) * 9);
    });

    it('should reject extending with earlier date', () => {
      const rental = Rental.create(validParams);
      rental.start();
      expect(() => rental.extend(new Date('2026-01-03'))).toThrow();
    });

    it('should emit status changed events', () => {
      const rental = Rental.create(validParams);
      rental.releaseEvents();
      rental.start();
      const events = rental.releaseEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('RentalStatusChanged');
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute without events', () => {
      const rental = Rental.reconstitute({
        id: 'rental-1',
        customerId: 'cust-1',
        items,
        period,
        status: RentalStatus.ACTIVE,
        totalCents: 32000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(rental.status).toBe(RentalStatus.ACTIVE);
      expect(rental.releaseEvents()).toHaveLength(0);
    });
  });
});
