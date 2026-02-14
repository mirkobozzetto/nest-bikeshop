import { describe, it, expect } from 'vitest';
import {
  calculateCurrentStock,
  isAvailableForRental,
  getLowStockAlerts,
} from './stock.service.js';
import {
  InventoryMovement,
  MovementType,
  MovementReason,
} from '../entities/inventory-movement.entity.js';

describe('StockService', () => {
  const bikeId = '550e8400-e29b-41d4-a716-446655440002';

  describe('calculateCurrentStock', () => {
    it('should return 0 for empty movements', () => {
      const stock = calculateCurrentStock([]);
      expect(stock).toBe(0);
    });

    it('should add quantity for IN movements', () => {
      const movement = InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
      });
      const stock = calculateCurrentStock([movement]);
      expect(stock).toBe(5);
    });

    it('should subtract quantity for OUT movements', () => {
      const inMovement = InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 10,
      });
      const outMovement = InventoryMovement.record({
        id: '2',
        bikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 3,
      });
      const stock = calculateCurrentStock([inMovement, outMovement]);
      expect(stock).toBe(7);
    });

    it('should add quantity for ADJUSTMENT movements with positive impact', () => {
      const movement = InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.ADJUSTMENT,
        reason: MovementReason.ADJUSTMENT,
        quantity: 2,
      });
      const stock = calculateCurrentStock([movement]);
      expect(stock).toBe(2);
    });

    it('should handle multiple movements in sequence', () => {
      const m1 = InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 10,
      });
      const m2 = InventoryMovement.record({
        id: '2',
        bikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 2,
      });
      const m3 = InventoryMovement.record({
        id: '3',
        bikeId,
        type: MovementType.OUT,
        reason: MovementReason.RENTAL_OUT,
        quantity: 3,
      });
      const m4 = InventoryMovement.record({
        id: '4',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.RENTAL_RETURN,
        quantity: 1,
      });
      const stock = calculateCurrentStock([m1, m2, m3, m4]);
      expect(stock).toBe(6);
    });

    it('should handle negative stock', () => {
      const inMovement = InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 3,
      });
      const outMovement = InventoryMovement.record({
        id: '2',
        bikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 5,
      });
      const stock = calculateCurrentStock([inMovement, outMovement]);
      expect(stock).toBe(-2);
    });
  });

  describe('isAvailableForRental', () => {
    it('should return false for empty movements', () => {
      const available = isAvailableForRental([]);
      expect(available).toBe(false);
    });

    it('should return true when stock is positive', () => {
      const movement = InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
      });
      const available = isAvailableForRental([movement]);
      expect(available).toBe(true);
    });

    it('should return false when stock is zero', () => {
      const inMovement = InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
      });
      const outMovement = InventoryMovement.record({
        id: '2',
        bikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 5,
      });
      const available = isAvailableForRental([inMovement, outMovement]);
      expect(available).toBe(false);
    });

    it('should return false when stock is negative', () => {
      const inMovement = InventoryMovement.record({
        id: '1',
        bikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 2,
      });
      const outMovement = InventoryMovement.record({
        id: '2',
        bikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 5,
      });
      const available = isAvailableForRental([inMovement, outMovement]);
      expect(available).toBe(false);
    });
  });

  describe('getLowStockAlerts', () => {
    it('should return empty array when no bikes are low', () => {
      const inventory = new Map([
        ['bike-1', 10],
        ['bike-2', 5],
      ]);
      const alerts = getLowStockAlerts(inventory, 3);
      expect(alerts).toHaveLength(0);
    });

    it('should return bikes with stock at or below threshold', () => {
      const inventory = new Map([
        ['bike-1', 10],
        ['bike-2', 3],
        ['bike-3', 2],
        ['bike-4', 0],
      ]);
      const alerts = getLowStockAlerts(inventory, 3);
      expect(alerts).toHaveLength(3);
      expect(alerts).toContainEqual({ bikeId: 'bike-2', stock: 3 });
      expect(alerts).toContainEqual({ bikeId: 'bike-3', stock: 2 });
      expect(alerts).toContainEqual({ bikeId: 'bike-4', stock: 0 });
    });

    it('should not include bikes above threshold', () => {
      const inventory = new Map([
        ['bike-1', 10],
        ['bike-2', 5],
      ]);
      const alerts = getLowStockAlerts(inventory, 4);
      expect(alerts).toHaveLength(0);
    });

    it('should handle empty inventory', () => {
      const inventory = new Map<string, number>();
      const alerts = getLowStockAlerts(inventory, 5);
      expect(alerts).toHaveLength(0);
    });

    it('should include bikes with zero stock', () => {
      const inventory = new Map([
        ['bike-1', 0],
        ['bike-2', 1],
      ]);
      const alerts = getLowStockAlerts(inventory, 1);
      expect(alerts).toHaveLength(2);
    });
  });
});
