import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum HealthType {
<<<<<<< HEAD
  CHECKUP = 'CHECKUP',
  TREATMENT = 'TREATMENT',
  DISEASE = 'DISEASE',
  VACCINATION = 'VACCINATION',
}

export enum HealthStatus {
  RECOVERED = 'RECOVERED',
  ONGOING = 'ONGOING',
=======
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
>>>>>>> c7e00d1 (swap)
}

export class CreateHealthRecordDto {
  @ApiProperty({ example: 'bird-uuid' })
  @IsUUID()
  @IsNotEmpty()
  birdId: string;

  @ApiProperty({ example: '2023-11-01T10:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Routine vaccination for PMV' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Dr. Smith' })
  @IsString()
  @IsOptional()
  vetName?: string;

<<<<<<< HEAD
=======
  @ApiPropertyOptional({ example: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

>>>>>>> c7e00d1 (swap)
  @ApiProperty({ enum: HealthType })
  @IsEnum(HealthType)
  type: HealthType;

  @ApiProperty({ enum: HealthStatus })
  @IsEnum(HealthStatus)
  status: HealthStatus;
}
