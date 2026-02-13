import { Inject, Injectable } from '@nestjs/common';
import {
  SALE_REPOSITORY,
  type SaleRepositoryPort,
} from '../../domain/ports/sale.repository.port.js';
import type { CreateSaleCommand } from './create-sale.command.js';
import { Sale } from '../../domain/entities/sale.entity.js';
import { SaleItem } from '../../domain/entities/sale-item.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateSaleHandler {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepo: SaleRepositoryPort,
  ) {}

  async execute(command: CreateSaleCommand): Promise<string> {
    const id = uuidv4();
    const items = command.items.map((i) =>
      SaleItem.create(i.bikeId, i.priceCents),
    );

    const sale = Sale.create({ id, customerId: command.customerId, items });
    await this.saleRepo.save(sale);
    return id;
  }
}
