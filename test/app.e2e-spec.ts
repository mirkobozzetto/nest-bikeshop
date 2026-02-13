import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';
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

interface IdBody {
  id: string;
}
interface ErrorBody {
  statusCode: number;
  error: string;
  message: string;
}

class InMemoryBikeRepository {
  private bikes = new Map<string, Bike>();

  save(bike: Bike): Promise<void> {
    this.bikes.set(bike.id, bike);
    return Promise.resolve();
  }

  findById(id: string): Promise<Bike | null> {
    return Promise.resolve(this.bikes.get(id) ?? null);
  }

  findAll(): Promise<Bike[]> {
    return Promise.resolve(Array.from(this.bikes.values()));
  }

  delete(id: string): Promise<void> {
    this.bikes.delete(id);
    return Promise.resolve();
  }
}

class InMemoryCustomerRepository {
  private customers = new Map<string, Customer>();

  save(customer: Customer): Promise<void> {
    this.customers.set(customer.id, customer);
    return Promise.resolve();
  }

  findById(id: string): Promise<Customer | null> {
    return Promise.resolve(this.customers.get(id) ?? null);
  }

  findByEmail(email: string): Promise<Customer | null> {
    for (const customer of this.customers.values()) {
      if (customer.email.value === email) {
        return Promise.resolve(customer);
      }
    }
    return Promise.resolve(null);
  }

  findAll(): Promise<Customer[]> {
    return Promise.resolve(Array.from(this.customers.values()));
  }

  delete(id: string): Promise<void> {
    this.customers.delete(id);
    return Promise.resolve();
  }
}

class InMemoryInventoryRepository {
  private movements: InventoryMovement[] = [];

  saveMovement(movement: InventoryMovement): Promise<void> {
    this.movements.push(movement);
    return Promise.resolve();
  }

  findMovementsByBikeId(bikeId: string): Promise<InventoryMovement[]> {
    return Promise.resolve(this.movements.filter((m) => m.bikeId === bikeId));
  }

  findMovementById(id: string): Promise<InventoryMovement | null> {
    return Promise.resolve(this.movements.find((m) => m.id === id) ?? null);
  }
}

class InMemoryRentalRepository {
  private rentals = new Map<string, Rental>();

  save(rental: Rental): Promise<void> {
    this.rentals.set(rental.id, rental);
    return Promise.resolve();
  }

  findById(id: string): Promise<Rental | null> {
    return Promise.resolve(this.rentals.get(id) ?? null);
  }

  findAll(): Promise<Rental[]> {
    return Promise.resolve(Array.from(this.rentals.values()));
  }
}

class InMemorySaleRepository {
  private sales = new Map<string, Sale>();

  save(sale: Sale): Promise<void> {
    this.sales.set(sale.id, sale);
    return Promise.resolve();
  }

  findById(id: string): Promise<Sale | null> {
    return Promise.resolve(this.sales.get(id) ?? null);
  }

  findAll(): Promise<Sale[]> {
    return Promise.resolve(Array.from(this.sales.values()));
  }
}

describe('VeloShop E2E Tests', () => {
  let app: INestApplication;
  let server: Server;

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
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('should return health status', async () => {
      const response = await request(server).get('/health');
      const body = response.body as { status: string; timestamp: string };

      expect(response.status).toBe(200);
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
    });
  });

  describe('Bikes', () => {
    let bikeId: string;

    it('should create a bike with valid data', async () => {
      const response = await request(server).post('/bikes').send({
        name: 'Mountain Bike Pro',
        brand: 'Trek',
        model: 'X-Caliber',
        type: 'MOUNTAIN',
        size: 'M',
        priceCents: 150000,
        dailyRateCents: 5000,
      });
      const body = response.body as IdBody;

      expect(response.status).toBe(201);
      expect(body.id).toBeDefined();
      bikeId = body.id;
    });

    it('should reject bike creation with invalid data (missing name)', async () => {
      const response = await request(server).post('/bikes').send({
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
      const response = await request(server).post('/bikes').send({
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
      const response = await request(server).get('/bikes');
      const body = response.body as unknown[];

      expect(response.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    it('should get an existing bike', async () => {
      const response = await request(server).get(`/bikes/${bikeId}`);
      const body = response.body as { id: string; name: string; brand: string };

      expect(response.status).toBe(200);
      expect(body.id).toBe(bikeId);
      expect(body.name).toBe('Mountain Bike Pro');
      expect(body.brand).toBe('Trek');
    });

    it('should return 404 for non-existent bike', async () => {
      const response = await request(server).get(
        '/bikes/00000000-0000-0000-0000-000000000000',
      );
      const body = response.body as ErrorBody;

      expect(response.status).toBe(404);
      expect(body.error).toBe('BIKE_NOT_FOUND');
    });
  });

  describe('Customers', () => {
    let customerId: string;

    it('should register a customer with valid data', async () => {
      const response = await request(server).post('/customers').send({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33123456789',
        address: '123 Rue de la Paix, Paris',
      });
      const body = response.body as IdBody;

      expect(response.status).toBe(201);
      expect(body.id).toBeDefined();
      customerId = body.id;
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(server).post('/customers').send({
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'invalid-email',
        phone: '+33123456789',
        address: '456 Avenue des Champs, Paris',
      });

      expect(response.status).toBe(400);
    });

    it('should reject registration with invalid phone', async () => {
      const response = await request(server).post('/customers').send({
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: 'invalid-phone',
        address: '456 Avenue des Champs, Paris',
      });

      expect(response.status).toBe(400);
    });

    it('should reject registration with missing firstName', async () => {
      const response = await request(server).post('/customers').send({
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: '+33123456789',
        address: '456 Avenue des Champs, Paris',
      });

      expect(response.status).toBe(400);
    });

    it('should list customers', async () => {
      const response = await request(server).get('/customers');
      const body = response.body as unknown[];

      expect(response.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    it('should get an existing customer', async () => {
      const response = await request(server).get(`/customers/${customerId}`);
      const body = response.body as {
        id: string;
        firstName: string;
        email: string;
      };

      expect(response.status).toBe(200);
      expect(body.id).toBe(customerId);
      expect(body.firstName).toBe('Jean');
      expect(body.email).toBe('jean.dupont@example.com');
    });

    it('should return 404 for non-existent customer', async () => {
      const response = await request(server).get(
        '/customers/00000000-0000-0000-0000-000000000000',
      );
      const body = response.body as ErrorBody;

      expect(response.status).toBe(404);
      expect(body.error).toBe('CUSTOMER_NOT_FOUND');
    });
  });

  describe('Inventory', () => {
    let bikeId: string;

    beforeAll(async () => {
      const bikeResponse = await request(server).post('/bikes').send({
        name: 'Road Bike Elite',
        brand: 'Specialized',
        model: 'Tarmac',
        type: 'ROAD',
        size: 'L',
        priceCents: 200000,
        dailyRateCents: 7000,
      });
      bikeId = (bikeResponse.body as IdBody).id;
    });

    it('should record an inventory movement', async () => {
      const response = await request(server).post('/inventory/movements').send({
        bikeId,
        type: 'IN',
        reason: 'PURCHASE',
        quantity: 5,
        notes: 'Initial stock',
      });
      const body = response.body as IdBody;

      expect(response.status).toBe(201);
      expect(body.id).toBeDefined();
    });

    it('should reject movement with invalid quantity', async () => {
      const response = await request(server).post('/inventory/movements').send({
        bikeId,
        type: 'IN',
        reason: 'PURCHASE',
        quantity: 0,
      });

      expect(response.status).toBe(400);
    });

    it('should reject movement with missing bikeId', async () => {
      const response = await request(server).post('/inventory/movements').send({
        type: 'IN',
        reason: 'PURCHASE',
        quantity: 5,
      });

      expect(response.status).toBe(400);
    });

    it('should get stock level for a bike', async () => {
      const response = await request(server).get(`/inventory/stock/${bikeId}`);
      const body = response.body as { bikeId: string; quantity: number };

      expect(response.status).toBe(200);
      expect(body.bikeId).toBe(bikeId);
      expect(body.quantity).toBeDefined();
    });

    it('should get movements for a bike', async () => {
      const response = await request(server).get(
        `/inventory/movements/${bikeId}`,
      );
      const body = response.body as unknown[];

      expect(response.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    it('should return 404 for stock of non-existent bike', async () => {
      const response = await request(server).get(
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
      const customerResponse = await request(server).post('/customers').send({
        firstName: 'Pierre',
        lastName: 'Bernard',
        email: 'pierre.bernard@example.com',
        phone: '+33123456789',
        address: '789 Rue de la Liberté, Lyon',
      });
      customerId = (customerResponse.body as IdBody).id;

      const bikeResponse = await request(server).post('/bikes').send({
        name: 'City Bike Comfort',
        brand: 'Giant',
        model: 'Escape',
        type: 'CITY',
        size: 'M',
        priceCents: 80000,
        dailyRateCents: 3000,
      });
      bikeId = (bikeResponse.body as IdBody).id;
    });

    it('should create a rental', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);

      const response = await request(server)
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
      const body = response.body as IdBody;

      expect(response.status).toBe(201);
      expect(body.id).toBeDefined();
      rentalId = body.id;
    });

    it('should reject rental with invalid customerId', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);

      const response = await request(server)
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

      const response = await request(server).post('/rentals').send({
        customerId,
        items: [],
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      expect(response.status).toBe(400);
    });

    it('should get a rental', async () => {
      const response = await request(server).get(`/rentals/${rentalId}`);
      const body = response.body as {
        id: string;
        customerId: string;
        status: string;
      };

      expect(response.status).toBe(200);
      expect(body.id).toBe(rentalId);
      expect(body.customerId).toBe(customerId);
      expect(body.status).toBe('RESERVED');
    });

    it('should list rentals', async () => {
      const response = await request(server).get('/rentals');
      const body = response.body as unknown[];

      expect(response.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent rental', async () => {
      const response = await request(server).get(
        '/rentals/00000000-0000-0000-0000-000000000000',
      );
      const body = response.body as ErrorBody;

      expect(response.status).toBe(404);
      expect(body.error).toBe('RENTAL_NOT_FOUND');
    });
  });

  describe('Sales', () => {
    let customerId: string;
    let bikeId: string;
    let saleId: string;

    beforeAll(async () => {
      const customerResponse = await request(server).post('/customers').send({
        firstName: 'Sophie',
        lastName: 'Leclerc',
        email: 'sophie.leclerc@example.com',
        phone: '+33987654321',
        address: '321 Boulevard Saint-Germain, Paris',
      });
      customerId = (customerResponse.body as IdBody).id;

      const bikeResponse = await request(server).post('/bikes').send({
        name: 'Electric Bike Power',
        brand: 'Riese & Müller',
        model: 'Superdelite',
        type: 'ELECTRIC',
        size: 'L',
        priceCents: 500000,
        dailyRateCents: 15000,
      });
      bikeId = (bikeResponse.body as IdBody).id;
    });

    it('should create a sale', async () => {
      const response = await request(server)
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
      const body = response.body as IdBody;

      expect(response.status).toBe(201);
      expect(body.id).toBeDefined();
      saleId = body.id;
    });

    it('should reject sale with invalid customerId', async () => {
      const response = await request(server)
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
      const response = await request(server).post('/sales').send({
        customerId,
        items: [],
      });

      expect(response.status).toBe(400);
    });

    it('should get a sale', async () => {
      const response = await request(server).get(`/sales/${saleId}`);
      const body = response.body as {
        id: string;
        customerId: string;
        status: string;
      };

      expect(response.status).toBe(200);
      expect(body.id).toBe(saleId);
      expect(body.customerId).toBe(customerId);
      expect(body.status).toBe('PENDING');
    });

    it('should list sales', async () => {
      const response = await request(server).get('/sales');
      const body = response.body as unknown[];

      expect(response.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    it('should update sale status to CONFIRMED', async () => {
      const response = await request(server)
        .patch(`/sales/${saleId}/status`)
        .send({
          action: 'confirm',
        });
      const body = response.body as { success: boolean };

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
    });

    it('should reject status update on non-existent sale', async () => {
      const response = await request(server)
        .patch('/sales/00000000-0000-0000-0000-000000000000/status')
        .send({
          action: 'confirm',
        });
      const body = response.body as ErrorBody;

      expect(response.status).toBe(404);
      expect(body.error).toBe('SALE_NOT_FOUND');
    });

    it('should return 404 for non-existent sale', async () => {
      const response = await request(server).get(
        '/sales/00000000-0000-0000-0000-000000000000',
      );
      const body = response.body as ErrorBody;

      expect(response.status).toBe(404);
      expect(body.error).toBe('SALE_NOT_FOUND');
    });
  });

  describe('Error Handling', () => {
    it('should handle DomainException with proper HTTP status', async () => {
      const response = await request(server).get('/bikes/nonexistent-id');
      const body = response.body as ErrorBody;

      expect(response.status).toBe(404);
      expect(body.statusCode).toBe(404);
      expect(body.error).toBeDefined();
      expect(body.message).toBeDefined();
    });

    it('should return 400 for validation errors', async () => {
      const response = await request(server).post('/bikes').send({
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
