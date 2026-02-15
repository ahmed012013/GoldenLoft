import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(
    @Request() req: RequestWithUser,
    @Body() createInventoryItemDto: CreateInventoryItemDto
  ) {
    return this.inventoryService.create(req.user.id, createInventoryItemDto);
  }

  @Get()
  findAll(
    @Request() req: RequestWithUser,
    @Query('type') type?: string,
    @Query('status') status?: string
  ) {
    return this.inventoryService.findAll(req.user.id, { type, status });
  }

  @Get(':id')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.inventoryService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateInventoryItemDto: UpdateInventoryItemDto
  ) {
    return this.inventoryService.update(
      id,
      req.user.id,
      updateInventoryItemDto
    );
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.inventoryService.remove(id, req.user.id);
  }
}
