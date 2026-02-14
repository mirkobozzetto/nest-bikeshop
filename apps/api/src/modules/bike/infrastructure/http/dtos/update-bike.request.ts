import { IsString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { BikeType } from '../../../domain/entities/bike.entity.js';

export class UpdateBikeRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsEnum(BikeType)
  type?: BikeType;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  priceCents?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  dailyRateCents?: number;
}
