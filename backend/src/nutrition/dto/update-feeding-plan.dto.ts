import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedingPlanDto } from './create-feeding-plan.dto';

export class UpdateFeedingPlanDto extends PartialType(CreateFeedingPlanDto) {}
