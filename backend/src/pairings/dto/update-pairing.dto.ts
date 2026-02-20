import { IsDateString, IsOptional, IsEnum, IsString } from 'class-validator';
import { PairingStatus } from '@prisma/client';

export class UpdatePairingDto {
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(PairingStatus)
  @IsOptional()
  status?: PairingStatus;

  @IsString()
  @IsOptional()
  nestBox?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
