import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum HealthType {
  CHECKUP = 'checkup',
  TREATMENT = 'treatment',
  ILLNESS = 'illness',
  VACCINATION = 'vaccination',
  INJURY = 'injury',
  OTHER = 'other',
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  SICK = 'sick',
  UNDER_OBSERVATION = 'under_observation',
  RECOVERED = 'recovered',
  DECEASED = 'deceased',
}

export class CreateHealthRecordDto {
  @ApiProperty({ example: 'bird-uuid' })
  @IsUUID('4', { message: 'Invalid bird ID format' })
  @IsNotEmpty({ message: 'Bird ID is required' })
  birdId: string;

  @ApiProperty({ example: '2023-11-01T10:00:00.000Z' })
  @IsDateString({}, { message: 'Invalid date format' })
  date: string;

  @ApiProperty({ example: 'Routine vaccination for PMV' })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description: string;

  @ApiPropertyOptional({ example: 'Dr. Smith' })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Vet name must not exceed 100 characters' })
  vetName?: string;

  @ApiPropertyOptional({ example: 'Additional notes' })
  @IsString()
  @IsOptional()
<<<<<<< HEAD
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
=======
>>>>>>> 88e78687a30bce7452bdae409be33945f90fcfc2
  notes?: string;

  @ApiProperty({ enum: HealthType })
  @IsEnum(HealthType, { message: 'Invalid health record type' })
  type: HealthType;

  @ApiProperty({ enum: HealthStatus })
  @IsEnum(HealthStatus, { message: 'Invalid health status' })
  status: HealthStatus;
}
