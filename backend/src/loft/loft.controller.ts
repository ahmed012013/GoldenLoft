import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LoftService } from './loft.service';
import { CreateLoftDto } from './dto/create-loft.dto';
import { UpdateLoftDto } from './dto/update-loft.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

interface RequestWithUser {
  user: { userId: string; id: string };
}

@UseGuards(JwtAuthGuard)
@ApiTags('lofts')
@ApiBearerAuth()
@Controller('lofts')
export class LoftController {
  constructor(private readonly loftService: LoftService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loft' })
  create(@Request() req: RequestWithUser, @Body() dto: CreateLoftDto) {
    return this.loftService.create(req.user.id, dto);
  }

  @Get('my-loft')
  @ApiOperation({ summary: 'Get lofts belonging to the current user' })
  getMyLofts(@Request() req: RequestWithUser) {
    return this.loftService.findManyByUserId(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a loft' })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateLoftDto: UpdateLoftDto
  ) {
    return this.loftService.update(id, req.user.id, updateLoftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a loft' })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.loftService.remove(id, req.user.id);
  }
}
