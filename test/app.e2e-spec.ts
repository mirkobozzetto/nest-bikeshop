import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { DomainExceptionFilter } from '../src/libs/filters/domain-exception.filter.js';
import { BIKE_REPOSITORY } from '../src/modules/bike/domain/ports/bike.repository.port.js';
import { CUSTOMER_REPOSITORY } from '../src/modules/customer/domain/ports/customer.repository.port.js';
import { INVENTORY_REPOSITORY } from '../src/modules/inventory/domain/ports/inventory.repository.port.js';
import { RENTAL_REPOSITORY } from '../src/modules/rental/domain/ports/rental.repository.port.js';
import { SALE_REPOSITORY } from '../src/modules/sale/domain/ports/sale.repository.port.js';
import { PrismaService } from '../src/libs/prisma.service.js';
import type { Bike } from '../src/modules/bike/domain/entities/bike.entity.js';
import type { Customer } from '../src/modules/customer/domain/entities/customer.entity.js';
import type { InventoryMovement } from '../src/modules/inventory/domain/entities/inventory-movement.entity.js';
import type { Rental } from '../src/modules/rental/domain/entities/rental.entity.js';
import type { Sale } from '../src/modules/sale/domain/entities/sale.entity.js';

class InMemoryBikeRepository {
  private bikes = new Map<string, Bike>();

  async save(bike: Bike): Promise<void> {
    this.bikes.set(bike.id, bike);
  }

  async findById(id: string): Promise<Bike | null> {
    return this.bikes.get(id) ?? null;
  }

  async findAll(): Promise<Bike[]> {
    return Array.from(this.bikes.values());
  }

  async delete(id: string): Promise<void> {
    this.bikes.delete(id);
  }
}

class InMemoryCustomerRepository {
  private customers = new Map<string, Customer>();

  async save(customer: Customer): Promise<void> {
    this.customers.set(customer.id, customer);
  }

  async findById(id: string): Promise<Customer | null> {
    return this.customers.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    for (const customer of this.customers.values()) {
      if (customer.email.value === email) {
        return customer;
      }
    }
    return null;
  }

  async findAll(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async delete(id: string): Promise<void> {
    this.customers.delete(id);
  }
}

class InMemoryInventoryRepository {
  private movements: InventoryMovement[] = [];

  async saveMovement(movement: InventoryMovement): Promise<void> {
    this.movements.push(movement);
  }

  async findMovementsByBikeId(bikeId: string): Promise<InventoryMovement[]> {
    return this.movements.filter((m) => m.bikeId === bikeId);
  }

  async findMovementById(id: string): Promise<InventoryMovement | null> {
    return this.movements.find((m) => m.id === id) ?? null;
  }
}

class InMemoryRentalRepository {
  private rentals = new Map<string, Rental>();

  async save(rental: Rental): Promise<void> {
    this.rentals.set(rental.id, rental);
  }

  async findById(id: string): Promise<Rental | null> {
    return this.rentals.get(id) ?? null;
  }

  async findAll(): Promise<Rental[]> {
    return Array.from(this.rentals.values());
  }
}

class InMemorySaleRepository {
  private sales = new Map<string, Sale>();

  async save(sale: Sale): Promise<void> {
    this.sales.set(sale.id, sale);
  }

  async findById(id: string): Promise<Sale | null> {
    return this.sales.get(id) ?? null;
  }

  async findAll(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }
}

describe('VeloShop E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(BIKE_REPOSITORY)
      .useClass(InMemoryBikeRepository)
      .overrideProvider(CUSTOMER_REPOSITORY)
      .useClass(InMemoryCustomerRepository)
      .overrideProvider(INVENTORY_REPOSITORY)
      .useClass(InMemoryInventoryRepository)
      .overrideProvider(RENTAL_REPOSITORY)
      .useClass(InMemoryRentalRepository)
      .overrideProvider(SALE_REPOSITORY)
      .useClass(InMemorySaleRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer()).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Bikes', () => {
    let bikeId: string;

    it('should create a bike with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/bikes')
        .send({
          name: 'Mountain Bike Pro',
          brand: 'Trek',
          model: 'X-Caliber',
          type: 'MOUNTAIN',
          size: 'M',
          priceCents: 150000,
          dailyRateCents: 5000,
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      bikeId = response.body.id;
    });

    it('should reject bike creation with invalid data (missing name)', async () => {
      const response = await request(app.getHttpServer())
        .post('/bikes')
        .send({
          brand: 'Trek',
          model: 'X-Caliber',
          type: 'MOUNTAIN',
          size: 'M',
          priceCents: 150000,
          dailyRateCents: 5000,
        });

      expect(response.status).toBe(400);
    });

    it('should reject bike creation with invalid price', async () => {
      const response = await request(app.getHttpServer())
        .post('/bikes')
        .send({
          name: 'Test Bike',
          brand: 'Trek',
          model: 'X-Caliber',
          type: 'MOUNTAIN',
          size: 'M',
          priceCents: 0,
          dailyRateCents: 5000,
        });

      expect(response.status).toBe(400);
    });

    it('should list bikes', async () => {
      const response = await request(app.getHttpServer()).get('/bikes');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get an existing bike', async () => {
      const response = await request(app.getHttpServer()).get(`/bikes/${bikeId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(bikeId);
      expect(response.body.name).toBe('Mountain Bike Pro');
      expect(response.body.brand).toBe('Trek');
    });

    it('should return 404 for non-existent bike', async () => {
      const response = await request(app.getHttpServer()).get(
        '/bikes/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('BIKE_NOT_FOUND');
    });
  });

  describe('Customers', () => {
    let customerId: string;

    it('should register a customer with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send({
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com',
          phone: '+33123456789',
          address: '123 Rue de la Paix, Paris',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      customerId = response.body.id;
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send({
          firstName: 'Marie',
          lastName: 'Martin',
          email: 'invalid-email',
          phone: '+33123456789',
          address: '456 Avenue des Champs, Paris',
        });

      expect(response.status).toBe(400);
    });

    it('should reject registration with invalid phone', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send({
          firstName: 'Marie',
          lastName: 'Martin',
          email: 'marie.martin@example.com',
          phone: 'invalid-phone',
          address: '456 Avenue des Champs, Paris',
        });

      expect(response.status).toBe(400);
    });

    it('should reject registration with missing firstName', async () => {
      const response = await request(app.getHttpServer())
        .post('/customers')
        .send({
          lastName: 'Martin',
          email: 'marie.martin@example.com',
          phone: '+33123456789',
          address: '456 Avenue des Champs, Paris',
        });

      expect(response.status).toBe(400);
    });

    it('should list customers', async () => {
      const response = await request(app.getHttpServer()).get('/customers');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get an existing customer', async () => {
      const response = await request(app.getHttpServer()).get(
        `/customers/${customerId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(customerId);
      expect(response.body.firstName).toBe('Jean');
      expect(response.body.email).toBe('jean.dupont@example.com');
    });

    it('should return 404 for non-existent customer', async () => {
      const response = await request(app.getHttpServer()).get(
        '/customers/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('CUSTOMER_NOT_FOUND');
    });
  });

  describe('Inventory', () => {
    let bikeId: string;

    beforeAll(async () => {
      const bikeResponse = await request(app.getHttpServer())
        .post('/bikes')
        .send({
          name: 'Road Bike Elite',
          brand: 'Specialized',
          model: 'Tarmac',
          type: 'ROAD',
          size: 'L',
          priceCents: 200000,
          dailyRateCents: 7000,
        });
      bikeId = bikeResponse.body.id;
    });

    it('should record an inventory movement', async () => {
      const response = await request(app.getHttpServer())
        .post('/inventory/movements')
        .send({
          bikeId,
          type: 'IN',
          reason: 'PURCHASE',
          quantity: 5,
          notes: 'Initial stock',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      void response.body.id;
    });

    it('should reject movement with invalid quantity', async () => {
      const response = await request(app.getHttpServer())
        .post('/inventory/movements')
        .send({
          bikeId,
          type: 'IN',
          reason: 'PURCHASE',
          quantity: 0,
        });

      expect(response.status).toBe(400);
    });

    it('should reject movement with missing bikeId', async () => {
      const response = await request(app.getHttpServer())
        .post('/inventory/movements')
        .send({
          type: 'IN',
          reason: 'PURCHASE',
          quantity: 5,
        });

      expect(response.status).toBe(400);
    });

    it('should get stock level for a bike', async () => {
      const response = await request(app.getHttpServer()).get(
        `/inventory/stock/${bikeId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.bikeId).toBe(bikeId);
      expect(response.body.quantity).toBeDefined();
    });

    it('should get movements for a bike', async () => {
      const response = await request(app.getHttpServer()).get(
        `/inventory/movements/${bikeId}`,
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 404 for stock of non-existent bike', async () => {
      const response = await request(app.getHttpServer()).get(
        '/inventory/stock/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(404);
    });
  });

  describe('Rentals', () => {
    let customerId: string;
    let bikeId: string;
    let rentalId: string;

    beforeAll(async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customers')
        .send({
          firstName: 'Pierre',
          lastName: 'Bernard',
          email: 'pierre.bernard@example.com',
          phone: '+33123456789',
          address: '789 Rue de la Liberté, Lyon',
        });
      customerId = customerResponse.body.id;

      const bikeResponse = await request(app.getHttpServer())
        .post('/bikes')
        .send({
          name: 'City Bike Comfort',
          brand: 'Giant',
          model: 'Escape',
          type: 'CITY',
          size: 'M',
          priceCents: 80000,
          dailyRateCents: 3000,
        });
      bikeId = bikeResponse.body.id;
    });

    it('should create a rental', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);

      const response = await request(app.getHttpServer())
        .post('/rentals')
        .send({
          customerId,
          items: [
            {
              bikeId,
              dailyRateCents: 3000,
            },
          ],
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      rentalId = response.body.id;
    });

    it('should reject rental with invalid customerId', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);

      const response = await request(app.getHttpServer())
        .post('/rentals')
        .send({
          customerId: 'invalid-uuid',
          items: [
            {
              bikeId,
              dailyRateCents: 3000,
            },
          ],
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(response.status).toBe(400);
    });

    it('should reject rental without items', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);

      const response = await request(app.getHttpServer())
        .post('/rentals')
        .send({
          customerId,
          items: [],
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

      expect(response.status).toBe(400);
    });

    it('should get a rental', async () => {
      const response = await request(app.getHttpServer()).get(
        `/rentals/${rentalId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(rentalId);
      expect(response.body.customerId).toBe(customerId);
      expect(response.body.status).toBe('RESERVED');
    });

    it('should list rentals', async () => {
      const response = await request(app.getHttpServer()).get('/rentals');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent rental', async () => {
      const response = await request(app.getHttpServer()).get(
        '/rentals/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('RENTAL_NOT_FOUND');
    });
  });

  describe('Sales', () => {
    let customerId: string;
    let bikeId: string;
    let saleId: string;

    beforeAll(async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customers')
        .send({
          firstName: 'Sophie',
          lastName: 'Leclerc',
          email: 'sophie.leclerc@example.com',
          phone: '+33987654321',
          address: '321 Boulevard Saint-Germain, Paris',
        });
      customerId = customerResponse.body.id;

      const bikeResponse = await request(app.getHttpServer())
        .post('/bikes')
        .send({
          name: 'Electric Bike Power',
          brand: 'Riese & Müller',
          model: 'Superdelite',
          type: 'ELECTRIC',
          size: 'L',
          priceCents: 500000,
          dailyRateCents: 15000,
        });
      bikeId = bikeResponse.body.id;
    });

    it('should create a sale', async () => {
      const response = await request(app.getHttpServer())
        .post('/sales')
        .send({
          customerId,
          items: [
            {
              bikeId,
              priceCents: 500000,
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      saleId = response.body.id;
    });

    it('should reject sale with invalid customerId', async () => {
      const response = await request(app.getHttpServer())
        .post('/sales')
        .send({
          customerId: 'invalid-uuid',
          items: [
            {
              bikeId,
              priceCents: 500000,
            },
          ],
        });

      expect(response.status).toBe(400);
    });

    it('should reject sale without items', async () => {
      const response = await request(app.getHttpServer())
        .post('/sales')
        .send({
          customerId,
          items: [],
        });

      expect(response.status).toBe(400);
    });

    it('should get a sale', async () => {
      const response = await request(app.getHttpServer()).get(`/sales/${saleId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(saleId);
      expect(response.body.customerId).toBe(customerId);
      expect(response.body.status).toBe('PENDING');
    });

    it('should list sales', async () => {
      const response = await request(app.getHttpServer()).get('/sales');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should update sale status to CONFIRMED', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/sales/${saleId}/status`)
        .send({
          action: 'confirm',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject status update on non-existent sale', async () => {
      const response = await request(app.getHttpServer())
        .patch('/sales/00000000-0000-0000-0000-000000000000/status')
        .send({
          action: 'confirm',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SALE_NOT_FOUND');
    });

    it('should return 404 for non-existent sale', async () => {
      const response = await request(app.getHttpServer()).get(
        '/sales/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SALE_NOT_FOUND');
    });
  });

  describe('Error Handling', () => {
    it('should handle DomainException with proper HTTP status', async () => {
      const response = await request(app.getHttpServer()).get(
        '/bikes/nonexistent-id',
      );

      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.error).toBeDefined();
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 for validation errors', async () => {
      const response = await request(app.getHttpServer())
        .post('/bikes')
        .send({
          name: '',
          brand: 'Trek',
          model: 'X-Caliber',
          type: 'MOUNTAIN',
          size: 'M',
          priceCents: 150000,
          dailyRateCents: 5000,
        });

      expect(response.status).toBe(400);
    });
  });
});
