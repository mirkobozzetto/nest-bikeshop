import { IsDateString } from 'class-validator';

export class ExtendRentalRequest {
  @IsDateString()
  newEndDate!: string;
}
