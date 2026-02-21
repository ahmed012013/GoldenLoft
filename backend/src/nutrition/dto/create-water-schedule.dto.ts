import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateWaterScheduleDto {
  @IsString()
  @IsNotEmpty()
  loft: string;

  @IsOptional()
  @IsString()
  loftAr?: string;

  @IsDateString()
  lastChange: string;

  @IsDateString()
  nextChange: string;

  @IsString()
  @IsNotEmpty()
  quality: string;

  @IsOptional()
  @IsString()
  additive?: string;

  @IsOptional()
  @IsString()
  additiveAr?: string;
}
