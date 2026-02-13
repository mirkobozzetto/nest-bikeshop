import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import {
  MovementType,
  MovementReason,
} from '../../../domain/entities/inventory-movement.entity.js';

export class RecordMovementRequest {
  @IsString()
  @IsNotEmpty()
  bikeId!: string;

  @IsEnum(MovementType)
  type!: MovementType;

  @IsEnum(MovementReason)
  reason!: MovementReason;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  date?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
