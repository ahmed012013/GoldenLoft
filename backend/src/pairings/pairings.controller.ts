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
import { PairingsService } from './pairings.service';
import { CreatePairingDto } from './dto/create-pairing.dto';
import { UpdatePairingDto } from './dto/update-pairing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('pairings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pairings')
export class PairingsController {
  constructor(private readonly pairingsService: PairingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pairing' })
  create(
    @Request() req: RequestWithUser,
    @Body() createPairingDto: CreatePairingDto
  ) {
    return this.pairingsService.create(req.user.id, createPairingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pairings' })
  findAll(@Request() req: RequestWithUser) {
    return this.pairingsService.findAll(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get pairing statistics' })
  getStats(@Request() req: RequestWithUser) {
    return this.pairingsService.getStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific pairing' })
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.pairingsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pairing' })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updatePairingDto: UpdatePairingDto
  ) {
    return this.pairingsService.update(req.user.id, id, updatePairingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pairing' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.pairingsService.remove(req.user.id, id);
  }
}
