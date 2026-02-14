import { Inject, Injectable } from '@nestjs/common';
import {
  SALE_REPOSITORY,
  type SaleRepositoryPort,
} from '../../domain/ports/sale.repository.port.js';
import type { GetSaleQuery } from './get-sale.query.js';
import { SaleResponseDto } from '../dtos/sale-response.dto.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

@Injectable()
export class GetSaleHandler {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepo: SaleRepositoryPort,
  ) {}

  async execute(query: GetSaleQuery): Promise<SaleResponseDto> {
    const sale = await this.saleRepo.findById(query.id);
    if (!sale) {
      throw new DomainException(`Sale ${query.id} not found`, 'SALE_NOT_FOUND');
    }
    return SaleResponseDto.fromDomain(sale);
  }
}
