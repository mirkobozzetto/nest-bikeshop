import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma.service.js';
import type { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port.js';
import type { Customer } from '../../../domain/entities/customer.entity.js';
import { CustomerMapper } from '../mappers/customer.mapper.js';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(customer: Customer): Promise<void> {
    const data = CustomerMapper.toPersistence(customer);
    await this.prisma.customer.upsert({
      where: { id: data.id },
      create: {
        ...data,
        createdAt: customer.createdAt,
      },
      update: data,
    });
  }

  async findById(id: string): Promise<Customer | null> {
    const raw = await this.prisma.customer.findUnique({ where: { id } });
    return raw ? CustomerMapper.toDomain(raw) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const raw = await this.prisma.customer.findUnique({ where: { email } });
    return raw ? CustomerMapper.toDomain(raw) : null;
  }

  async findAll(limit?: number, offset?: number): Promise<Customer[]> {
    const raw = await this.prisma.customer.findMany({
      take: limit,
      skip: offset,
    });
    return raw.map((r) => CustomerMapper.toDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({ where: { id } });
  }
}
