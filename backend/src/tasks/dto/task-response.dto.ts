import { ApiProperty } from '@nestjs/swagger';
import { TaskFrequency } from '@prisma/client';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  titleEn?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  descriptionEn?: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  priority: string;

  @ApiProperty({ enum: TaskFrequency })
  frequency: TaskFrequency;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  instanceDate: Date; // The specific date for this occurrence

  @ApiProperty({ required: false })
  time?: string;

  @ApiProperty()
  isCompleted: boolean;

  @ApiProperty({ required: false })
  completionId?: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  loftName?: string;

  // Exclude raw helper fields from response to keep it clean
}
