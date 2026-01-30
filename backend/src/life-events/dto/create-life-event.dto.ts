import { IsString, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { LifeEventType } from '@prisma/client';

export class CreateLifeEventDto {
  @IsString()
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
