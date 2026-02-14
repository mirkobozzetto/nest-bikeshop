import { Inject, Injectable } from '@nestjs/common';
import {
  SALE_REPOSITORY,
  type SaleRepositoryPort,
} from '../../domain/ports/sale.repository.port.js';
import type { ListSalesQuery } from './list-sales.query.js';
import { SaleResponseDto } from '../dtos/sale-response.dto.js';

@Injectable()
export class ListSalesHandler {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepo: SaleRepositoryPort,
  ) {}

  async execute(query: ListSalesQuery): Promise<SaleResponseDto[]> {
    const sales = await this.saleRepo.findAll({
      customerId: query.customerId,
      status: query.status,
    });
    return sales.map((s) => SaleResponseDto.fromDomain(s));
  }
}
