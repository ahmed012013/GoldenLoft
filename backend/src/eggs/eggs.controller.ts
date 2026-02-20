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
  ParseUUIDPipe,
} from '@nestjs/common';
import { EggsService } from './eggs.service';
import { CreateEggDto } from './dto/create-egg.dto';
import { UpdateEggDto } from './dto/update-egg.dto';
import { HatchEggDto } from './dto/hatch-egg.dto';
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
    return this.eggsService.create(req.user.id, createEggDto);
  }

  @Post(':id/hatch')
  @ApiOperation({ summary: 'Hatch an egg and create a squab' })
  hatch(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() hatchEggDto: HatchEggDto
  ) {
    return this.eggsService.hatch(req.user.id, id, hatchEggDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all eggs' })
  findAll(@Request() req: RequestWithUser) {
    return this.eggsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific egg' })
  findOne(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.eggsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an egg' })
  update(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEggDto: UpdateEggDto
  ) {
    return this.eggsService.update(req.user.id, id, updateEggDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an egg' })
  remove(
    @Request() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.eggsService.remove(req.user.id, id);
  }
}
