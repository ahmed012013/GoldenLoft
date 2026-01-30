import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { EggStatus } from '@prisma/client';

export class UpdateEggDto {
  @IsDateString()
  @IsOptional()
  hatchDateActual?: string;

  @IsEnum(EggStatus)
  @IsOptional()
  status?: EggStatus;
}
