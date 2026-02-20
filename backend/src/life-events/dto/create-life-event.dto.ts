import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { LifeEventType } from '@prisma/client';

export class CreateLifeEventDto {
  @IsUUID()
  @IsNotEmpty()
  birdId: string;

  @IsEnum(LifeEventType)
  @IsNotEmpty()
  type: LifeEventType;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
