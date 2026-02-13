import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import {
  prismaTest,
  cleanDatabase,
  closePrisma,
} from '../../../../test-utils/prisma-test.helper.js';
import { PrismaBikeRepository } from '../../infrastructure/persistence/repositories/prisma-bike.repository.js';
import {
  Bike,
  BikeType,
  BikeStatus,
} from '../../domain/entities/bike.entity.js';

describe('PrismaBikeRepository Integration Tests', () => {
  let repository: PrismaBikeRepository;

  beforeAll(() => {
    repository = new PrismaBikeRepository(prismaTest);
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await closePrisma();
  });

  describe('save and findById', () => {
    it('should create a bike and retrieve it by id', async () => {
      const bikeId = uuidv4();
      const bike = Bike.create({
        id: bikeId,
        name: 'Mountain Pro',
        brand: 'Trek',
        model: 'X-Caliber',
        type: BikeType.MOUNTAIN,
        size: 'M',
        priceCents: 150000,
        dailyRateCents: 2500,
      });

      await repository.save(bike);

      const retrieved = await repository.findById(bikeId);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(bikeId);
      expect(retrieved?.name).toBe('Mountain Pro');
      expect(retrieved?.brand).toBe('Trek');
      expect(retrieved?.model).toBe('X-Caliber');
      expect(retrieved?.type).toBe(BikeType.MOUNTAIN);
      expect(retrieved?.size).toBe('M');
      expect(retrieved?.priceCents).toBe(150000);
      expect(retrieved?.dailyRateCents).toBe(2500);
      expect(retrieved?.status).toBe(BikeStatus.AVAILABLE);
    });

    it('should update an existing bike', async () => {
      const bikeId = uuidv4();
      const bike = Bike.create({
        id: bikeId,
        name: 'Road Bike',
        brand: 'Specialized',
        model: 'Tarmac',
        type: BikeType.ROAD,
        size: 'L',
        priceCents: 200000,
        dailyRateCents: 3000,
      });

      await repository.save(bike);

      bike.update({
        name: 'Road Bike Pro',
        priceCents: 220000,
      });

      await repository.save(bike);

      const retrieved = await repository.findById(bikeId);

      expect(retrieved?.name).toBe('Road Bike Pro');
      expect(retrieved?.priceCents).toBe(220000);
      expect(retrieved?.brand).toBe('Specialized');
    });
  });

  describe('findAll', () => {
    it('should return all bikes', async () => {
      const bike1 = Bike.create({
        id: uuidv4(),
        name: 'City Bike 1',
        brand: 'Trek',
        model: 'FX',
        type: BikeType.CITY,
        size: 'M',
        priceCents: 100000,
        dailyRateCents: 1500,
      });

      const bike2 = Bike.create({
        id: uuidv4(),
        name: 'Road Bike',
        brand: 'Specialized',
        model: 'Tarmac',
        type: BikeType.ROAD,
        size: 'L',
        priceCents: 200000,
        dailyRateCents: 3000,
      });

      await repository.save(bike1);
      await repository.save(bike2);

      const all = await repository.findAll();

      expect(all).toHaveLength(2);
      expect(all.map((b) => b.id)).toContain(bike1.id);
      expect(all.map((b) => b.id)).toContain(bike2.id);
    });

    it('should filter bikes by type', async () => {
      const roadBike = Bike.create({
        id: uuidv4(),
        name: 'Road Bike',
        brand: 'Specialized',
        model: 'Tarmac',
        type: BikeType.ROAD,
        size: 'L',
        priceCents: 200000,
        dailyRateCents: 3000,
      });

      const mountainBike = Bike.create({
        id: uuidv4(),
        name: 'Mountain Bike',
        brand: 'Trek',
        model: 'X-Caliber',
        type: BikeType.MOUNTAIN,
        size: 'M',
        priceCents: 150000,
        dailyRateCents: 2500,
      });

      await repository.save(roadBike);
      await repository.save(mountainBike);

      const roadBikes = await repository.findAll({ type: BikeType.ROAD });

      expect(roadBikes).toHaveLength(1);
      expect(roadBikes[0].type).toBe(BikeType.ROAD);
      expect(roadBikes[0].id).toBe(roadBike.id);
    });

    it('should filter bikes by status', async () => {
      const availableBike = Bike.create({
        id: uuidv4(),
        name: 'Available Bike',
        brand: 'Trek',
        model: 'FX',
        type: BikeType.CITY,
        size: 'M',
        priceCents: 100000,
        dailyRateCents: 1500,
      });

      const maintenanceBike = Bike.create({
        id: uuidv4(),
        name: 'Maintenance Bike',
        brand: 'Specialized',
        model: 'Tarmac',
        type: BikeType.ROAD,
        size: 'L',
        priceCents: 200000,
        dailyRateCents: 3000,
      });

      maintenanceBike.sendToMaintenance();

      await repository.save(availableBike);
      await repository.save(maintenanceBike);

      const maintenance = await repository.findAll({
        status: BikeStatus.MAINTENANCE,
      });

      expect(maintenance).toHaveLength(1);
      expect(maintenance[0].status).toBe(BikeStatus.MAINTENANCE);
    });

    it('should filter bikes by brand', async () => {
      const trekBike = Bike.create({
        id: uuidv4(),
        name: 'Trek Bike',
        brand: 'Trek',
        model: 'FX',
        type: BikeType.CITY,
        size: 'M',
        priceCents: 100000,
        dailyRateCents: 1500,
      });

      const specializedBike = Bike.create({
        id: uuidv4(),
        name: 'Specialized Bike',
        brand: 'Specialized',
        model: 'Tarmac',
        type: BikeType.ROAD,
        size: 'L',
        priceCents: 200000,
        dailyRateCents: 3000,
      });

      await repository.save(trekBike);
      await repository.save(specializedBike);

      const trekBikes = await repository.findAll({ brand: 'Trek' });

      expect(trekBikes).toHaveLength(1);
      expect(trekBikes[0].brand).toBe('Trek');
    });
  });

  describe('delete', () => {
    it('should delete a bike', async () => {
      const bikeId = uuidv4();
      const bike = Bike.create({
        id: bikeId,
        name: 'Delete Test Bike',
        brand: 'Trek',
        model: 'FX',
        type: BikeType.CITY,
        size: 'M',
        priceCents: 100000,
        dailyRateCents: 1500,
      });

      await repository.save(bike);

      let retrieved = await repository.findById(bikeId);
      expect(retrieved).not.toBeNull();

      await repository.delete(bikeId);

      retrieved = await repository.findById(bikeId);
      expect(retrieved).toBeNull();
    });
  });
});
