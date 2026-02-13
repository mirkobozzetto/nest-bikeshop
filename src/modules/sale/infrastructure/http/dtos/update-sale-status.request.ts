import { IsIn } from 'class-validator';

export class UpdateSaleStatusRequest {
  @IsIn(['confirm', 'cancel'])
  action!: 'confirm' | 'cancel';
}
