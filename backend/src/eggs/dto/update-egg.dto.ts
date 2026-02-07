import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EggStatus } from '@prisma/client';

export class UpdateEggDto {
  @ApiPropertyOptional({ example: '2024-02-01T10:00:00.000Z' })
  @IsDateString({}, { message: 'Invalid date format' })
  @IsOptional()
  hatchDateActual?: string;

  @ApiPropertyOptional({ enum: EggStatus })
  @IsEnum(EggStatus, { message: 'Invalid egg status' })
  @IsOptional()
  status?: EggStatus;
}
