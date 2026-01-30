import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HealthService } from './health.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('health')
@Controller('health')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post()
  @ApiOperation({ summary: 'Add a health record' })
  create(@Request() req: RequestWithUser, @Body() dto: CreateHealthRecordDto) {
    return this.healthService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all health records' })
  findAll(@Request() req: RequestWithUser) {
    return this.healthService.findAll(req.user.userId);
  }
}
