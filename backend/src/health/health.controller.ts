import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
<<<<<<< HEAD
} from '@nestjs/common';
import { HealthService } from './health.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
=======
  Query,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { HealthService } from './health.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
>>>>>>> c7e00d1 (swap)
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
<<<<<<< HEAD
  findAll(@Request() req: RequestWithUser) {
    return this.healthService.findAll(req.user.userId);
=======
  findAll(@Request() req: RequestWithUser, @Query('birdId') birdId?: string) {
    return this.healthService.findAll(req.user.userId, birdId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a health record' })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateHealthRecordDto
  ) {
    return this.healthService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a health record' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.healthService.remove(req.user.userId, id);
>>>>>>> c7e00d1 (swap)
  }
}
