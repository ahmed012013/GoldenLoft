import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PairingStatus } from '@prisma/client';

export class UpdatePairingDto {
  @ApiPropertyOptional({ example: '2024-03-15T10:00:00.000Z' })
  @IsDateString({}, { message: 'Invalid date format' })
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ enum: PairingStatus })
  @IsEnum(PairingStatus, { message: 'Invalid pairing status' })
  @IsOptional()
  status?: PairingStatus;
}
