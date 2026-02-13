import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreatePairingDto {
  @IsString()
  @IsNotEmpty()
  maleId: string;

  @IsString()
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
