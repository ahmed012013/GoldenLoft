import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LifeEventsService } from './life-events.service';
import { CreateLifeEventDto } from './dto/create-life-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('life-events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('life-events')
export class LifeEventsController {
  constructor(private readonly lifeEventsService: LifeEventsService) {}

  @Post()
  @ApiOperation({ summary: 'Record a new life event' })
  create(
    @Request() req: RequestWithUser,
    @Body() createLifeEventDto: CreateLifeEventDto
  ) {
    return this.lifeEventsService.create(req.user.id, createLifeEventDto);
  }

  @Get('bird/:birdId')
  @ApiOperation({ summary: 'Get all events for a specific bird' })
  findAllByBird(
    @Request() req: RequestWithUser,
    @Param('birdId') birdId: string
  ) {
    return this.lifeEventsService.findAllByBird(req.user.id, birdId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a life event' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.lifeEventsService.remove(req.user.id, id);
  }
}
