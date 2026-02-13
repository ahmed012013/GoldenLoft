import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;

  @IsNumber()
  @IsOptional()
  minStock?: number;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  condition?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
