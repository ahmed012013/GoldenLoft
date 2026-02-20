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
} from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { CreateFeedingPlanDto } from './dto/create-feeding-plan.dto';
import { UpdateFeedingPlanDto } from './dto/update-feeding-plan.dto';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { CreateWaterScheduleDto } from './dto/create-water-schedule.dto';
import { UpdateWaterScheduleDto } from './dto/update-water-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  // ─── Feeding Plans ───────────────────────────────────────

  @Get('feeding-plans')
  findAllFeedingPlans(@Request() req: RequestWithUser) {
    return this.nutritionService.findAllFeedingPlans(req.user.id);
  }

  @Post('feeding-plans')
  createFeedingPlan(
    @Request() req: RequestWithUser,
    @Body() dto: CreateFeedingPlanDto
  ) {
    return this.nutritionService.createFeedingPlan(req.user.id, dto);
  }

  @Patch('feeding-plans/:id')
  updateFeedingPlan(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateFeedingPlanDto
  ) {
    return this.nutritionService.updateFeedingPlan(id, req.user.id, dto);
  }

  @Delete('feeding-plans/:id')
  deleteFeedingPlan(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.nutritionService.deleteFeedingPlan(id, req.user.id);
  }

  // ─── Supplements ─────────────────────────────────────────

  @Get('supplements')
  findAllSupplements(@Request() req: RequestWithUser) {
    return this.nutritionService.findAllSupplements(req.user.id);
  }

  @Post('supplements')
  createSupplement(
    @Request() req: RequestWithUser,
    @Body() dto: CreateSupplementDto
  ) {
    return this.nutritionService.createSupplement(req.user.id, dto);
  }

  @Patch('supplements/:id')
  updateSupplement(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateSupplementDto
  ) {
    return this.nutritionService.updateSupplement(id, req.user.id, dto);
  }

  @Delete('supplements/:id')
  deleteSupplement(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.nutritionService.deleteSupplement(id, req.user.id);
  }

  // ─── Water Schedules ─────────────────────────────────────

  @Get('water-schedules')
  findAllWaterSchedules(@Request() req: RequestWithUser) {
    return this.nutritionService.findAllWaterSchedules(req.user.id);
  }

  @Post('water-schedules')
  createWaterSchedule(
    @Request() req: RequestWithUser,
    @Body() dto: CreateWaterScheduleDto
  ) {
    return this.nutritionService.createWaterSchedule(req.user.id, dto);
  }

  @Patch('water-schedules/:id')
  updateWaterSchedule(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateWaterScheduleDto
  ) {
    return this.nutritionService.updateWaterSchedule(id, req.user.id, dto);
  }

  @Delete('water-schedules/:id')
  deleteWaterSchedule(
    @Request() req: RequestWithUser,
    @Param('id') id: string
  ) {
    return this.nutritionService.deleteWaterSchedule(id, req.user.id);
  }
}
