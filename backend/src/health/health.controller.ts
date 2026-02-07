import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Query,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { HealthService } from './health.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { Throttle } from '@nestjs/throttler';
import {
  HealthCheckService,
  HealthCheck,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private prisma: PrismaService
  ) {}

  @Get('status')
  @HealthCheck()
  @ApiOperation({ summary: 'Check system health' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', this.prisma),
    ]);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a health record' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  create(@Request() req: RequestWithUser, @Body() dto: CreateHealthRecordDto) {
    return this.healthService.create(req.user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all health records' })
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  findAll(@Request() req: RequestWithUser, @Query('birdId') birdId?: string) {
    return this.healthService.findAll(req.user.userId, birdId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a health record' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateHealthRecordDto
  ) {
    return this.healthService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a health record' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.healthService.remove(req.user.userId, id);
  }
}
