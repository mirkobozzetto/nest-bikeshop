import { IsString, IsNotEmpty, IsEnum, IsInt, Min } from 'class-validator';
import { BikeType } from '../../../domain/entities/bike.entity.js';

export class CreateBikeRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  brand!: string;

  @IsString()
  @IsNotEmpty()
  model!: string;

  @IsEnum(BikeType)
  type!: BikeType;

  @IsString()
  @IsNotEmpty()
  size!: string;

  @IsInt()
  @Min(1)
  priceCents!: number;

  @IsInt()
  @Min(1)
  dailyRateCents!: number;
}
