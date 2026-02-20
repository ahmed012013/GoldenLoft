import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateWaterScheduleDto {
  @IsString()
  loft: string;

  @IsOptional()
  @IsString()
  loftAr?: string;

  @IsDateString()
  lastChange: string;

  @IsDateString()
  nextChange: string;

  @IsString()
  quality: string;

  @IsOptional()
  @IsString()
  additive?: string;

  @IsOptional()
  @IsString()
  additiveAr?: string;
}
