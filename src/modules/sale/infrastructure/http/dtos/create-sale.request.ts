import { IsUUID, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemRequestDto {
  @IsUUID()
  bikeId!: string;

  @IsInt()
  @Min(1)
  priceCents!: number;
}

export class CreateSaleRequest {
  @IsUUID()
  customerId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemRequestDto)
  items!: SaleItemRequestDto[];
}
