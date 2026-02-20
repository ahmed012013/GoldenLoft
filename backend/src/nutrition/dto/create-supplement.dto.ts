import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSupplementDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsString()
  type: string;

  @IsString()
  dosage: string;

  @IsString()
  frequency: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  purposeAr?: string;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;
}
