import { IsString, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';

export class CreateFeedingPlanDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameAr?: string;

  @IsString()
  targetGroup: string;

  @IsString()
  feedType: string;

  @IsString()
  morningAmount: string;

  @IsString()
  eveningAmount: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  pigeonCount?: number;
}
