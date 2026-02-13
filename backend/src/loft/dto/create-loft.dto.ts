import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoftDto {
  @ApiProperty({ example: 'My Golden Loft' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Cairo, Egypt' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'The best pigeon loft in town' })
  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  capacity?: number;
}
