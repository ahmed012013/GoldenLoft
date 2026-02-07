import {
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EggStatus } from '@prisma/client';

export class CreateEggDto {
  @ApiProperty({ example: 'pairing-uuid' })
  @IsUUID('4', { message: 'Invalid pairing ID format' })
  @IsNotEmpty({ message: 'Pairing ID is required' })
  pairingId: string;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  @IsDateString({}, { message: 'Invalid date format' })
  @IsNotEmpty({ message: 'Lay date is required' })
  layDate: string;

  @ApiPropertyOptional({ enum: EggStatus, default: EggStatus.LAID })
  @IsEnum(EggStatus, { message: 'Invalid egg status' })
  @IsOptional()
  status?: EggStatus;
}
