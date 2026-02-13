import { IsIn } from 'class-validator';
import type { BikeAction } from '../../../application/commands/update-bike-status.command.js';

export class UpdateBikeStatusRequest {
  @IsIn(['rent', 'return', 'sell', 'maintenance', 'retire'])
  action!: BikeAction;
}
