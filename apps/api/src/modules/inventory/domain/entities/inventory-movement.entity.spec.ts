import { describe, it, expect } from 'vitest';
import {
  InventoryMovement,
  MovementType,
  MovementReason,
} from './inventory-movement.entity.js';

describe('InventoryMovement', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    bikeId: '550e8400-e29b-41d4-a716-446655440002',
    type: MovementType.IN,
    reason: MovementReason.PURCHASE,
    quantity: 5,
  };

  describe('record', () => {
    it('should create a movement with valid params', () => {
      const movement = InventoryMovement.record(validParams);
      expect(movement.id).toBe(validParams.id);
      expect(movement.bikeId).toBe(validParams.bikeId);
      expect(movement.type).toBe(MovementType.IN);
      expect(movement.reason).toBe(MovementReason.PURCHASE);
      expect(movement.quantity).toBe(5);
    });

    it('should emit InventoryMovementRecorded event', () => {
      const movement = InventoryMovement.record(validParams);
      const events = movement.releaseEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('InventoryMovementRecorded');
    });

    it('should reject empty bike id', () => {
      expect(() =>
        InventoryMovement.record({ ...validParams, bikeId: '' }),
      ).toThrow();
    });

    it('should reject zero quantity', () => {
      expect(() =>
        InventoryMovement.record({ ...validParams, quantity: 0 }),
      ).toThrow();
    });

    it('should reject negative quantity', () => {
      expect(() =>
        InventoryMovement.record({ ...validParams, quantity: -1 }),
      ).toThrow();
    });

    it('should use provided date if given', () => {
      const customDate = new Date('2025-01-15');
      const movement = InventoryMovement.record({
        ...validParams,
        date: customDate,
      });
      expect(movement.date).toEqual(customDate);
    });

    it('should use current date if not provided', () => {
      const before = new Date();
      const movement = InventoryMovement.record(validParams);
      const after = new Date();
      expect(movement.date.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(movement.date.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should set optional notes', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        notes: 'Test notes',
      });
      expect(movement.notes).toBe('Test notes');
    });

    it('should have undefined notes if not provided', () => {
      const movement = InventoryMovement.record(validParams);
      expect(movement.notes).toBeUndefined();
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute without validation or events', () => {
      const movement = InventoryMovement.reconstitute({
        id: validParams.id,
        bikeId: validParams.bikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 2,
        date: new Date(),
        createdAt: new Date(),
      });
      expect(movement.type).toBe(MovementType.OUT);
      expect(movement.reason).toBe(MovementReason.SALE);
      expect(movement.releaseEvents()).toHaveLength(0);
    });
  });

  describe('movement types', () => {
    it('should support IN movements', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        type: MovementType.IN,
      });
      expect(movement.type).toBe(MovementType.IN);
    });

    it('should support OUT movements', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        type: MovementType.OUT,
      });
      expect(movement.type).toBe(MovementType.OUT);
    });

    it('should support ADJUSTMENT movements', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        type: MovementType.ADJUSTMENT,
      });
      expect(movement.type).toBe(MovementType.ADJUSTMENT);
    });
  });

  describe('movement reasons', () => {
    it('should support PURCHASE reason', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        reason: MovementReason.PURCHASE,
      });
      expect(movement.reason).toBe(MovementReason.PURCHASE);
    });

    it('should support SALE reason', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        reason: MovementReason.SALE,
      });
      expect(movement.reason).toBe(MovementReason.SALE);
    });

    it('should support RENTAL_OUT reason', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        reason: MovementReason.RENTAL_OUT,
      });
      expect(movement.reason).toBe(MovementReason.RENTAL_OUT);
    });

    it('should support RENTAL_RETURN reason', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        reason: MovementReason.RENTAL_RETURN,
      });
      expect(movement.reason).toBe(MovementReason.RENTAL_RETURN);
    });

    it('should support MAINTENANCE reason', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        reason: MovementReason.MAINTENANCE,
      });
      expect(movement.reason).toBe(MovementReason.MAINTENANCE);
    });

    it('should support LOSS reason', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        reason: MovementReason.LOSS,
      });
      expect(movement.reason).toBe(MovementReason.LOSS);
    });

    it('should support ADJUSTMENT reason', () => {
      const movement = InventoryMovement.record({
        ...validParams,
        reason: MovementReason.ADJUSTMENT,
      });
      expect(movement.reason).toBe(MovementReason.ADJUSTMENT);
    });
  });
});
