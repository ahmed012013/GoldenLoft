import { IsOptional, IsEnum, IsString } from 'class-validator';
import { BirdGender, BirdStatus } from '../enums/bird.enums';

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
  skip?: number;

  @IsOptional()
  take?: number;
}
