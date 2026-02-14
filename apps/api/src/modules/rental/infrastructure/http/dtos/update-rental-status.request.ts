import { IsIn } from 'class-validator';
import type { RentalAction } from '../../../application/commands/update-rental-status.command.js';

export class UpdateRentalStatusRequest {
  @IsIn(['start', 'return', 'cancel'])
  action!: RentalAction;
}
