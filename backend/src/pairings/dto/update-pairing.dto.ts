import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { PairingStatus } from '@prisma/client';

export class UpdatePairingDto {
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(PairingStatus)
  @IsOptional()
  status?: PairingStatus;
}
