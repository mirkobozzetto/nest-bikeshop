import { describe, it, expect } from 'vitest';
import { Bike, BikeType, BikeStatus } from './bike.entity.js';

describe('Bike', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Trek Domane SL 5',
    brand: 'Trek',
    model: 'Domane SL 5',
    type: BikeType.ROAD,
    size: 'M',
    priceCents: 250000,
    dailyRateCents: 5000,
  };

  describe('creation', () => {
    it('should create a bike with valid params', () => {
      const bike = Bike.create(validParams);
      expect(bike.id).toBe(validParams.id);
      expect(bike.name).toBe('Trek Domane SL 5');
      expect(bike.status).toBe(BikeStatus.AVAILABLE);
    });

    it('should emit BikeCreated event', () => {
      const bike = Bike.create(validParams);
      const events = bike.releaseEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('BikeCreated');
    });

    it('should reject empty name', () => {
      expect(() => Bike.create({ ...validParams, name: '' })).toThrow();
    });

    it('should reject zero price', () => {
      expect(() => Bike.create({ ...validParams, priceCents: 0 })).toThrow();
    });

    it('should reject negative price', () => {
      expect(() => Bike.create({ ...validParams, priceCents: -100 })).toThrow();
    });

    it('should reject zero daily rate', () => {
      expect(() =>
        Bike.create({ ...validParams, dailyRateCents: 0 }),
      ).toThrow();
    });

    it('should reject negative daily rate', () => {
      expect(() =>
        Bike.create({ ...validParams, dailyRateCents: -50 }),
      ).toThrow();
    });
  });

  describe('state machine', () => {
    it('should mark as rented from available', () => {
      const bike = Bike.create(validParams);
      bike.markAsRented();
      expect(bike.status).toBe(BikeStatus.RENTED);
    });

    it('should reject renting a non-available bike', () => {
      const bike = Bike.create(validParams);
      bike.markAsRented();
      expect(() => bike.markAsRented()).toThrow();
    });

    it('should mark as returned from rented', () => {
      const bike = Bike.create(validParams);
      bike.markAsRented();
      bike.markAsReturned();
      expect(bike.status).toBe(BikeStatus.AVAILABLE);
    });

    it('should reject returning a non-rented bike', () => {
      const bike = Bike.create(validParams);
      expect(() => bike.markAsReturned()).toThrow();
    });

    it('should mark as sold from available', () => {
      const bike = Bike.create(validParams);
      bike.markAsSold();
      expect(bike.status).toBe(BikeStatus.SOLD);
    });

    it('should reject selling a non-available bike', () => {
      const bike = Bike.create(validParams);
      bike.markAsRented();
      expect(() => bike.markAsSold()).toThrow();
    });

    it('should send to maintenance from available', () => {
      const bike = Bike.create(validParams);
      bike.sendToMaintenance();
      expect(bike.status).toBe(BikeStatus.MAINTENANCE);
    });

    it('should send to maintenance from rented (returned damaged)', () => {
      const bike = Bike.create(validParams);
      bike.markAsRented();
      bike.sendToMaintenance();
      expect(bike.status).toBe(BikeStatus.MAINTENANCE);
    });

    it('should return from maintenance to available', () => {
      const bike = Bike.create(validParams);
      bike.sendToMaintenance();
      bike.markAsReturned();
      expect(bike.status).toBe(BikeStatus.AVAILABLE);
    });

    it('should retire from available', () => {
      const bike = Bike.create(validParams);
      bike.retire();
      expect(bike.status).toBe(BikeStatus.RETIRED);
    });

    it('should retire from maintenance', () => {
      const bike = Bike.create(validParams);
      bike.sendToMaintenance();
      bike.retire();
      expect(bike.status).toBe(BikeStatus.RETIRED);
    });

    it('should reject retiring a rented bike', () => {
      const bike = Bike.create(validParams);
      bike.markAsRented();
      expect(() => bike.retire()).toThrow();
    });

    it('should emit BikeStatusChanged on each transition', () => {
      const bike = Bike.create(validParams);
      bike.releaseEvents();
      bike.markAsRented();
      const events = bike.releaseEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('BikeStatusChanged');
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute without validation or events', () => {
      const bike = Bike.reconstitute({
        id: validParams.id,
        name: validParams.name,
        brand: validParams.brand,
        model: validParams.model,
        type: BikeType.ROAD,
        size: 'M',
        priceCents: 250000,
        dailyRateCents: 5000,
        status: BikeStatus.RENTED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(bike.status).toBe(BikeStatus.RENTED);
      expect(bike.releaseEvents()).toHaveLength(0);
    });
  });
});
