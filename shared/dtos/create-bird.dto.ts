import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';
import { BirdGender, BirdStatus, BirdType } from '../enums/bird.enums';

export class CreateBirdDto {
  @IsString()
  @IsNotEmpty()
  ringNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(BirdGender)
  @IsOptional()
  gender?: BirdGender;

  @IsEnum(BirdStatus)
  @IsOptional()
  status?: BirdStatus;

  @IsString()
  @IsOptional()
  color?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsUUID('4', { message: 'Invalid Loft ID' })
  @IsNotEmpty()
  loftId: string;

  @IsUUID()
  @IsOptional()
  fatherId?: string;

  @IsUUID()
  @IsOptional()
  motherId?: string;

  @IsEnum(BirdType)
  @IsOptional()
  type?: BirdType;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  totalRaces?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  wins?: number;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
