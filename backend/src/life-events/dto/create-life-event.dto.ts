import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LifeEventType } from '@prisma/client';

export class CreateLifeEventDto {
  @ApiProperty({ example: 'bird-uuid' })
  @IsUUID('4', { message: 'Invalid bird ID format' })
  @IsNotEmpty({ message: 'Bird ID is required' })
  birdId: string;

  @ApiProperty({ enum: LifeEventType })
  @IsEnum(LifeEventType, { message: 'Invalid life event type' })
  @IsNotEmpty({ message: 'Event type is required' })
  type: LifeEventType;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  @IsDateString({}, { message: 'Invalid date format' })
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

  @ApiProperty({ example: 'Bird was weaned successfully' })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description: string;
}
