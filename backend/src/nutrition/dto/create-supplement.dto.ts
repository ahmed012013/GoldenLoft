import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSupplementDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsString()
  @IsNotEmpty()
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
