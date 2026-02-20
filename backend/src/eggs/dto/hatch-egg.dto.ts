import { IsDateString, IsOptional } from 'class-validator';

export class HatchEggDto {
  @IsDateString()
  @IsOptional()
  hatchDate?: string;
}
