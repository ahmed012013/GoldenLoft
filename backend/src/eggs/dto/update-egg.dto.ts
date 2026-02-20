import { IsDateString, IsOptional, IsEnum, IsString } from 'class-validator';
import { EggStatus } from '@prisma/client';

export class UpdateEggDto {
  @IsDateString()
  @IsOptional()
  hatchDateActual?: string;

  @IsEnum(EggStatus)
  @IsOptional()
  status?: EggStatus;

  @IsDateString()
  @IsOptional()
  candlingDate?: string;

  @IsString()
  @IsOptional()
  candlingResult?: string;
}
