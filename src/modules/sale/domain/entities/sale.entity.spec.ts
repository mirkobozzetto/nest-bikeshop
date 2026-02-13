import { describe, it, expect } from 'vitest';
import { Sale, SaleStatus } from './sale.entity.js';
import { SaleItem } from './sale-item.js';

describe('Sale', () => {
  const items = [
    SaleItem.create('bike-1', 250000),
    SaleItem.create('bike-2', 180000),
  ];

  const validParams = {
    id: 'sale-1',
    customerId: 'cust-1',
    items,
  };

  describe('creation', () => {
    it('should create a sale with valid params', () => {
      const sale = Sale.create(validParams);
      expect(sale.id).toBe('sale-1');
      expect(sale.status).toBe(SaleStatus.PENDING);
    });

    it('should calculate total', () => {
      const sale = Sale.create(validParams);
      expect(sale.totalCents).toBe(430000);
    });

    it('should emit SaleCreated event', () => {
      const sale = Sale.create(validParams);
      const events = sale.releaseEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('SaleCreated');
    });

    it('should reject empty items', () => {
      expect(() => Sale.create({ ...validParams, items: [] })).toThrow();
    });

    it('should reject empty customerId', () => {
      expect(() => Sale.create({ ...validParams, customerId: '' })).toThrow();
    });
  });

  describe('TVA calculation', () => {
    it('should calculate TVA at 20%', () => {
      const sale = Sale.create(validParams);
      expect(sale.calculateTVA(20)).toBe(86000);
    });

    it('should calculate TVA at 5.5%', () => {
      const sale = Sale.create(validParams);
      expect(sale.calculateTVA(5.5)).toBe(23650);
    });
  });

  describe('state machine', () => {
    it('should confirm a pending sale', () => {
      const sale = Sale.create(validParams);
      sale.confirm();
      expect(sale.status).toBe(SaleStatus.CONFIRMED);
    });

    it('should reject confirming a non-pending sale', () => {
      const sale = Sale.create(validParams);
      sale.confirm();
      expect(() => sale.confirm()).toThrow();
    });

    it('should cancel a pending sale', () => {
      const sale = Sale.create(validParams);
      sale.cancel();
      expect(sale.status).toBe(SaleStatus.CANCELLED);
    });

    it('should reject cancelling a confirmed sale', () => {
      const sale = Sale.create(validParams);
      sale.confirm();
      expect(() => sale.cancel()).toThrow();
    });

    it('should emit status changed events', () => {
      const sale = Sale.create(validParams);
      sale.releaseEvents();
      sale.confirm();
      const events = sale.releaseEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('SaleStatusChanged');
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute without events', () => {
      const sale = Sale.reconstitute({
        id: 'sale-1',
        customerId: 'cust-1',
        items,
        status: SaleStatus.CONFIRMED,
        totalCents: 430000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(sale.status).toBe(SaleStatus.CONFIRMED);
      expect(sale.releaseEvents()).toHaveLength(0);
    });
  });
});
