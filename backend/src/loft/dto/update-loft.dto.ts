import { PartialType } from '@nestjs/swagger';
import { CreateLoftDto } from './create-loft.dto';

export class UpdateLoftDto extends PartialType(CreateLoftDto) {}
