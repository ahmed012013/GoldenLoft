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
    const result = await this.prisma.feedingPlan.updateMany({
      where: { id, userId },
      data: dto,
    });

    if (result.count === 0) {
      throw new NotFoundException('Feeding plan not found');
    }

    return this.prisma.feedingPlan.findUnique({ where: { id } });
  }

  async deleteFeedingPlan(id: string, userId: string) {
    const result = await this.prisma.feedingPlan.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Feeding plan not found');
    }

    return { id };
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
    const result = await this.prisma.supplement.updateMany({
      where: { id, userId },
      data: dto,
    });

    if (result.count === 0) {
      throw new NotFoundException('Supplement not found');
    }

    return this.prisma.supplement.findUnique({ where: { id } });
  }

  async deleteSupplement(id: string, userId: string) {
    const result = await this.prisma.supplement.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Supplement not found');
    }

    return { id };
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
    const data: any = { ...dto };
    if (dto.lastChange) data.lastChange = new Date(dto.lastChange);
    if (dto.nextChange) data.nextChange = new Date(dto.nextChange);

    const result = await this.prisma.waterSchedule.updateMany({
      where: { id, userId },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException('Water schedule not found');
    }

    return this.prisma.waterSchedule.findUnique({ where: { id } });
  }

  async deleteWaterSchedule(id: string, userId: string) {
    const result = await this.prisma.waterSchedule.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Water schedule not found');
    }

    return { id };
  }
}
