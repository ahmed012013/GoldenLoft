import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

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
}
