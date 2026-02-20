import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { BirdGender, BirdStatus } from '../enums/bird.enums';
import { Type } from 'class-transformer';

export class GetBirdsDto {
  @IsEnum(BirdGender)
  @IsOptional()
  gender?: BirdGender;

  @IsEnum(BirdStatus)
  @IsOptional()
  status?: BirdStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
