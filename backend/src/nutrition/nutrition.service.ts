import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedingPlanDto } from './dto/create-feeding-plan.dto';
import { UpdateFeedingPlanDto } from './dto/update-feeding-plan.dto';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { CreateWaterScheduleDto } from './dto/create-water-schedule.dto';
import { UpdateWaterScheduleDto } from './dto/update-water-schedule.dto';

@Injectable()
export class NutritionService {
  private readonly logger = new Logger(NutritionService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Feeding Plans ───────────────────────────────────────

  async findAllFeedingPlans(userId: string) {
    return this.prisma.feedingPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createFeedingPlan(userId: string, dto: CreateFeedingPlanDto) {
    return this.prisma.feedingPlan.create({
      data: { ...dto, userId },
    });
  }

  async updateFeedingPlan(
    id: string,
    userId: string,
    dto: UpdateFeedingPlanDto
  ) {
    const plan = await this.prisma.feedingPlan.findFirst({
      where: { id, userId },
    });
    if (!plan) throw new NotFoundException('Feeding plan not found');
    return this.prisma.feedingPlan.update({
      where: { id },
      data: dto,
    });
  }

  async deleteFeedingPlan(id: string, userId: string) {
    const plan = await this.prisma.feedingPlan.findFirst({
      where: { id, userId },
    });
    if (!plan) throw new NotFoundException('Feeding plan not found');
    return this.prisma.feedingPlan.delete({ where: { id } });
  }

  // ─── Supplements ─────────────────────────────────────────

  async findAllSupplements(userId: string) {
    return this.prisma.supplement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSupplement(userId: string, dto: CreateSupplementDto) {
    return this.prisma.supplement.create({
      data: { ...dto, userId },
    });
  }

  async updateSupplement(id: string, userId: string, dto: UpdateSupplementDto) {
    const item = await this.prisma.supplement.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Supplement not found');
    return this.prisma.supplement.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSupplement(id: string, userId: string) {
    const item = await this.prisma.supplement.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Supplement not found');
    return this.prisma.supplement.delete({ where: { id } });
  }

  // ─── Water Schedules ─────────────────────────────────────

  async findAllWaterSchedules(userId: string) {
    return this.prisma.waterSchedule.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createWaterSchedule(userId: string, dto: CreateWaterScheduleDto) {
    return this.prisma.waterSchedule.create({
      data: {
        ...dto,
        lastChange: new Date(dto.lastChange),
        nextChange: new Date(dto.nextChange),
        userId,
      },
    });
  }

  async updateWaterSchedule(
    id: string,
    userId: string,
    dto: UpdateWaterScheduleDto
  ) {
    const item = await this.prisma.waterSchedule.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Water schedule not found');

    const data: any = { ...dto };
    if (dto.lastChange) data.lastChange = new Date(dto.lastChange);
    if (dto.nextChange) data.nextChange = new Date(dto.nextChange);

    return this.prisma.waterSchedule.update({
      where: { id },
      data,
    });
  }

  async deleteWaterSchedule(id: string, userId: string) {
    const item = await this.prisma.waterSchedule.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Water schedule not found');
    return this.prisma.waterSchedule.delete({ where: { id } });
  }
}
