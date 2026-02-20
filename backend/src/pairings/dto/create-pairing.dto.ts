import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreatePairingDto {
  @IsUUID()
  @IsNotEmpty()
  maleId: string;

  @IsUUID()
  @IsNotEmpty()
  femaleId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsOptional()
  nestBox?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
