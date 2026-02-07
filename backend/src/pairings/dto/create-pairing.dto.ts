import { IsNotEmpty, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePairingDto {
  @ApiProperty({ example: 'male-bird-uuid' })
  @IsUUID('4', { message: 'Invalid male bird ID format' })
  @IsNotEmpty({ message: 'Male bird ID is required' })
  maleId: string;

  @ApiProperty({ example: 'female-bird-uuid' })
  @IsUUID('4', { message: 'Invalid female bird ID format' })
  @IsNotEmpty({ message: 'Female bird ID is required' })
  femaleId: string;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  @IsDateString({}, { message: 'Invalid date format' })
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;
}
