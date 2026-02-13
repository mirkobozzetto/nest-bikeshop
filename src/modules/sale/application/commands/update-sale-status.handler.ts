import { Inject, Injectable } from '@nestjs/common';
import {
  SALE_REPOSITORY,
  type SaleRepositoryPort,
} from '../../domain/ports/sale.repository.port.js';
import type { UpdateSaleStatusCommand } from './update-sale-status.command.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

@Injectable()
export class UpdateSaleStatusHandler {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepo: SaleRepositoryPort,
  ) {}

  async execute(command: UpdateSaleStatusCommand): Promise<void> {
    const sale = await this.saleRepo.findById(command.saleId);
    if (!sale) {
      throw new DomainException(
        `Sale ${command.saleId} not found`,
        'SALE_NOT_FOUND',
      );
    }

    switch (command.action) {
      case 'confirm':
        sale.confirm();
        break;
      case 'cancel':
        sale.cancel();
        break;
    }

    await this.saleRepo.save(sale);
  }
}
