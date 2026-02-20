import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { EggStatus } from '@prisma/client';

export class CreateEggDto {
  @IsUUID()
  @IsNotEmpty()
  pairingId: string;

  @IsDateString()
  @IsNotEmpty()
  layDate: string;

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
