import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EggsService } from './eggs.service';
import { CreateEggDto } from './dto/create-egg.dto';
import { UpdateEggDto } from './dto/update-egg.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('eggs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('eggs')
export class EggsController {
  constructor(private readonly eggsService: EggsService) {}

  @Post()
  @ApiOperation({ summary: 'Record a new egg' })
  create(@Request() req: RequestWithUser, @Body() createEggDto: CreateEggDto) {
    return this.eggsService.create(req.user.userId, createEggDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all eggs' })
  findAll(@Request() req: RequestWithUser) {
    return this.eggsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific egg' })
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.eggsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an egg' })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateEggDto: UpdateEggDto
  ) {
    return this.eggsService.update(req.user.userId, id, updateEggDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an egg' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.eggsService.remove(req.user.userId, id);
  }
}
