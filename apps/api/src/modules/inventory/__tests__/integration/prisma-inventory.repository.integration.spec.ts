import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import {
  prismaTest,
  cleanDatabase,
  closePrisma,
} from '../../../../test-utils/prisma-test.helper.js';
import { PrismaInventoryRepository } from '../../infrastructure/persistence/repositories/prisma-inventory.repository.js';
import {
  InventoryMovement,
  MovementType,
  MovementReason,
} from '../../domain/entities/inventory-movement.entity.js';

describe('PrismaInventoryRepository Integration Tests', () => {
  let repository: PrismaInventoryRepository;
  let testBikeId: string;

  beforeAll(() => {
    repository = new PrismaInventoryRepository(prismaTest);
    testBikeId = uuidv4();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await closePrisma();
  });

  describe('saveMovement and findMovementById', () => {
    it('should create an inventory movement and retrieve it by id', async () => {
      const movementId = uuidv4();
      const now = new Date();

      const movement = InventoryMovement.record({
        id: movementId,
        bikeId: testBikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
        date: now,
        notes: 'Initial stock purchase',
      });

      await repository.saveMovement(movement);

      const retrieved = await repository.findMovementById(movementId);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(movementId);
      expect(retrieved?.bikeId).toBe(testBikeId);
      expect(retrieved?.type).toBe(MovementType.IN);
      expect(retrieved?.reason).toBe(MovementReason.PURCHASE);
      expect(retrieved?.quantity).toBe(5);
      expect(retrieved?.notes).toBe('Initial stock purchase');
    });

    it('should save and retrieve movement without notes', async () => {
      const movementId = uuidv4();

      const movement = InventoryMovement.record({
        id: movementId,
        bikeId: testBikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 1,
      });

      await repository.saveMovement(movement);

      const retrieved = await repository.findMovementById(movementId);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.quantity).toBe(1);
      expect(retrieved?.notes).toBeUndefined();
    });

    it('should return null if movement not found', async () => {
      const retrieved = await repository.findMovementById(uuidv4());
      expect(retrieved).toBeNull();
    });
  });

  describe('findMovementsByBikeId', () => {
    it('should return all movements for a bike', async () => {
      const movement1 = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
        date: new Date('2025-01-01'),
      });

      const movement2 = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 1,
        date: new Date('2025-01-15'),
      });

      await repository.saveMovement(movement1);
      await repository.saveMovement(movement2);

      const movements = await repository.findMovementsByBikeId(testBikeId);

      expect(movements).toHaveLength(2);
      expect(movements.map((m) => m.id)).toContain(movement1.id);
      expect(movements.map((m) => m.id)).toContain(movement2.id);
    });

    it('should return movements ordered by date ascending', async () => {
      const movement1 = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
        date: new Date('2025-03-01'),
      });

      const movement2 = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 1,
        date: new Date('2025-01-01'),
      });

      const movement3 = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.ADJUSTMENT,
        reason: MovementReason.LOSS,
        quantity: 1,
        date: new Date('2025-02-15'),
      });

      await repository.saveMovement(movement1);
      await repository.saveMovement(movement2);
      await repository.saveMovement(movement3);

      const movements = await repository.findMovementsByBikeId(testBikeId);

      expect(movements).toHaveLength(3);
      expect(movements[0].date).toEqual(movement2.date);
      expect(movements[1].date).toEqual(movement3.date);
      expect(movements[2].date).toEqual(movement1.date);
    });

    it('should return empty array if bike has no movements', async () => {
      const movements = await repository.findMovementsByBikeId(uuidv4());
      expect(movements).toHaveLength(0);
    });

    it('should only return movements for the specified bike', async () => {
      const otherBikeId = uuidv4();

      const movement1 = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
      });

      const movement2 = InventoryMovement.record({
        id: uuidv4(),
        bikeId: otherBikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 1,
      });

      await repository.saveMovement(movement1);
      await repository.saveMovement(movement2);

      const movementsForTestBike =
        await repository.findMovementsByBikeId(testBikeId);
      const movementsForOtherBike =
        await repository.findMovementsByBikeId(otherBikeId);

      expect(movementsForTestBike).toHaveLength(1);
      expect(movementsForTestBike[0].id).toBe(movement1.id);

      expect(movementsForOtherBike).toHaveLength(1);
      expect(movementsForOtherBike[0].id).toBe(movement2.id);
    });

    it('should handle different movement types', async () => {
      const inMovement = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
      });

      const outMovement = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.OUT,
        reason: MovementReason.RENTAL_OUT,
        quantity: 1,
      });

      const adjustmentMovement = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.ADJUSTMENT,
        reason: MovementReason.ADJUSTMENT,
        quantity: 2,
      });

      await repository.saveMovement(inMovement);
      await repository.saveMovement(outMovement);
      await repository.saveMovement(adjustmentMovement);

      const movements = await repository.findMovementsByBikeId(testBikeId);

      expect(movements).toHaveLength(3);
      expect(movements.some((m) => m.type === MovementType.IN)).toBe(true);
      expect(movements.some((m) => m.type === MovementType.OUT)).toBe(true);
      expect(movements.some((m) => m.type === MovementType.ADJUSTMENT)).toBe(
        true,
      );
    });

    it('should handle different movement reasons', async () => {
      const purchaseMovement = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.IN,
        reason: MovementReason.PURCHASE,
        quantity: 5,
      });

      const saleMovement = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
        quantity: 1,
      });

      const maintenanceMovement = InventoryMovement.record({
        id: uuidv4(),
        bikeId: testBikeId,
        type: MovementType.OUT,
        reason: MovementReason.MAINTENANCE,
        quantity: 1,
      });

      await repository.saveMovement(purchaseMovement);
      await repository.saveMovement(saleMovement);
      await repository.saveMovement(maintenanceMovement);

      const movements = await repository.findMovementsByBikeId(testBikeId);

      expect(movements).toHaveLength(3);
      expect(movements.some((m) => m.reason === MovementReason.PURCHASE)).toBe(
        true,
      );
      expect(movements.some((m) => m.reason === MovementReason.SALE)).toBe(
        true,
      );
      expect(
        movements.some((m) => m.reason === MovementReason.MAINTENANCE),
      ).toBe(true);
    });
  });
});
