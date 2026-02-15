import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    console.log('User from req:', req.user);
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Post('complete')
  complete(@Request() req, @Body() completeTaskDto: CompleteTaskDto) {
    return this.tasksService.complete(req.user.id, completeTaskDto);
  }

  @Get()
  @ApiQuery({
    name: 'start',
    required: true,
    description: 'ISO Date string (UTC)',
  })
  @ApiQuery({
    name: 'end',
    required: true,
    description: 'ISO Date string (UTC)',
  })
  findAll(
    @Request() req,
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    // Default to today if not provided (though required)
    const startDate = start || new Date().toISOString();
    const endDate = end || new Date().toISOString();
    return this.tasksService.findAll(req.user.id, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
