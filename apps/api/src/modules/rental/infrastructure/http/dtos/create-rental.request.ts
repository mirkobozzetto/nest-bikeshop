import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RentalItemRequestDto {
  @IsUUID()
  bikeId!: string;

  @IsInt()
  @Min(1)
  dailyRateCents!: number;
}

export class CreateRentalRequest {
  @IsUUID()
  customerId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RentalItemRequestDto)
  items!: RentalItemRequestDto[];

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
