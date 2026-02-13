import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const connectionString = process.env.DATABASE_TEST_URL;

if (!connectionString) {
  throw new Error('DATABASE_TEST_URL environment variable is not set');
}

const adapter = new PrismaPg({ connectionString });

export const prismaTest = new PrismaClient({ adapter });

export async function cleanDatabase(): Promise<void> {
  await prismaTest.$executeRawUnsafe(
    'TRUNCATE TABLE sale_items, rental_items, sales, rentals, inventory_movements, customers, bikes CASCADE',
  );
}

export async function closePrisma(): Promise<void> {
  await prismaTest.$disconnect();
}
