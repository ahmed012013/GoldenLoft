import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateFeedingPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsString()
  @IsNotEmpty()
  targetGroup: string;

  @IsString()
  @IsNotEmpty()
  feedType: string;

  @IsString()
  @IsNotEmpty()
  morningAmount: string;

  @IsString()
  @IsNotEmpty()
  eveningAmount: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  pigeonCount?: number;
}
