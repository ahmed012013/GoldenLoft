import { PartialType } from '@nestjs/mapped-types';
import { CreateWaterScheduleDto } from './create-water-schedule.dto';

export class UpdateWaterScheduleDto extends PartialType(
  CreateWaterScheduleDto
) {}
