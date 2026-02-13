import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { EggStatus } from '@prisma/client';

export class CreateEggDto {
  @IsString()
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
