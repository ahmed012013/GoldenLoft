import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoftDto {
  @ApiProperty({ example: 'My Golden Loft' })
  @IsString()
  @IsNotEmpty({ message: 'Loft name is required' })
  @MinLength(2, { message: 'Loft name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Loft name must not exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({ example: 'Cairo, Egypt' })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Location must not exceed 200 characters' })
  location?: string;

  @ApiPropertyOptional({ example: 'The best pigeon loft in town' })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
