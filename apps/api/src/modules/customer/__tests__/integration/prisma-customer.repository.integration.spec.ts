import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import {
  prismaTest,
  cleanDatabase,
  closePrisma,
} from '../../../../test-utils/prisma-test.helper.js';
import { PrismaCustomerRepository } from '../../infrastructure/persistence/repositories/prisma-customer.repository.js';
import { Customer } from '../../domain/entities/customer.entity.js';

describe('PrismaCustomerRepository Integration Tests', () => {
  let repository: PrismaCustomerRepository;

  beforeAll(() => {
    repository = new PrismaCustomerRepository(prismaTest);
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await closePrisma();
  });

  describe('save and findById', () => {
    it('should create a customer and retrieve it by id', async () => {
      const customer = Customer.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+33612345678',
        address: '123 Main Street',
      });

      await repository.save(customer);

      const retrieved = await repository.findById(customer.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(customer.id);
      expect(retrieved?.firstName).toBe('John');
      expect(retrieved?.lastName).toBe('Doe');
      expect(retrieved?.email.value).toBe('john.doe@example.com');
      expect(retrieved?.phone.value).toBe('+33612345678');
      expect(retrieved?.address).toBe('123 Main Street');
    });

    it('should update an existing customer', async () => {
      const customer = Customer.register({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+33687654321',
        address: '456 Oak Avenue',
      });

      await repository.save(customer);

      customer.update({
        firstName: 'Janet',
        address: '789 Pine Road',
      });

      await repository.save(customer);

      const retrieved = await repository.findById(customer.id);

      expect(retrieved?.firstName).toBe('Janet');
      expect(retrieved?.address).toBe('789 Pine Road');
      expect(retrieved?.lastName).toBe('Smith');
    });
  });

  describe('findByEmail', () => {
    it('should find a customer by email', async () => {
      const customer = Customer.register({
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '+33611223344',
        address: '999 Elm Street',
      });

      await repository.save(customer);

      const retrieved = await repository.findByEmail(
        'alice.johnson@example.com',
      );

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(customer.id);
      expect(retrieved?.firstName).toBe('Alice');
    });

    it('should return null if customer not found by email', async () => {
      const retrieved = await repository.findByEmail('nonexistent@example.com');
      expect(retrieved).toBeNull();
    });

    it('should find correct customer when multiple customers exist', async () => {
      const customer1 = Customer.register({
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob.wilson@example.com',
        phone: '+33655443322',
        address: '111 Maple Drive',
      });

      const customer2 = Customer.register({
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@example.com',
        phone: '+33644556677',
        address: '222 Cedar Lane',
      });

      await repository.save(customer1);
      await repository.save(customer2);

      const retrieved = await repository.findByEmail(
        'charlie.brown@example.com',
      );

      expect(retrieved?.id).toBe(customer2.id);
      expect(retrieved?.firstName).toBe('Charlie');
    });
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const customer1 = Customer.register({
        firstName: 'David',
        lastName: 'Miller',
        email: 'david.miller@example.com',
        phone: '+33699887766',
        address: '333 Birch Avenue',
      });

      const customer2 = Customer.register({
        firstName: 'Eve',
        lastName: 'Davis',
        email: 'eve.davis@example.com',
        phone: '+33688776655',
        address: '444 Spruce Way',
      });

      await repository.save(customer1);
      await repository.save(customer2);

      const all = await repository.findAll();

      expect(all).toHaveLength(2);
      expect(all.map((c) => c.id)).toContain(customer1.id);
      expect(all.map((c) => c.id)).toContain(customer2.id);
    });

    it('should support pagination with limit', async () => {
      const customers = [];
      for (let i = 0; i < 5; i++) {
        const customer = Customer.register({
          firstName: `Customer${i}`,
          lastName: 'Test',
          email: `customer${i}@example.com`,
          phone: `+336${i}${i}${i}${i}${i}${i}${i}${i}`,
          address: `${100 + i} Test Street`,
        });
        customers.push(customer);
        await repository.save(customer);
      }

      const page = await repository.findAll(2, 0);

      expect(page).toHaveLength(2);
    });

    it('should support pagination with offset', async () => {
      const customers = [];
      for (let i = 0; i < 5; i++) {
        const customer = Customer.register({
          firstName: `Pagination${i}`,
          lastName: 'Test',
          email: `pagination${i}@example.com`,
          phone: `+337${i}${i}${i}${i}${i}${i}${i}${i}`,
          address: `${200 + i} Pagination Way`,
        });
        customers.push(customer);
        await repository.save(customer);
      }

      const page = await repository.findAll(2, 1);

      expect(page).toHaveLength(2);
      expect(page[0].firstName).not.toBe(customers[0].firstName);
    });

    it('should return empty array if no customers exist', async () => {
      const all = await repository.findAll();
      expect(all).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      const customer = Customer.register({
        firstName: 'Frank',
        lastName: 'Garcia',
        email: 'frank.garcia@example.com',
        phone: '+33677554433',
        address: '555 Willow Court',
      });

      await repository.save(customer);

      let retrieved = await repository.findById(customer.id);
      expect(retrieved).not.toBeNull();

      await repository.delete(customer.id);

      retrieved = await repository.findById(customer.id);
      expect(retrieved).toBeNull();
    });
  });
});
