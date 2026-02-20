import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateHealthRecordDto) {
    // Verify ownership via Bird -> Loft -> User
    const bird = await this.prisma.bird.findUnique({
      where: { id: dto.birdId },
      include: { loft: true },
    });

    if (!bird) throw new NotFoundException('Bird not found');
    if (bird.loft.userId !== userId) {
      throw new BadRequestException('Access denied to this bird');
    }

    // Remove birdId from rest to avoid Prisma error
    const { birdId, ...rest } = dto;
    // Determine new bird status based on health record
    let newStatus: string | undefined;
    if (dto.status === 'sick') newStatus = 'SICK';
    else if (dto.status === 'healthy' || dto.status === 'recovered')
      newStatus = 'HEALTHY';
    else if (dto.status === 'under_observation')
      newStatus = 'UNDER_OBSERVATION';

    // Transaction to create record and update bird status
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.healthRecord.create({
        data: {
          ...rest,
          bird: { connect: { id: birdId } },
        },
      });

      if (newStatus) {
        await tx.bird.update({
          where: { id: birdId },
          data: { status: newStatus },
        });
      }

      return record;
    });
  }

  async findAll(userId: string, birdId?: string) {
    return this.prisma.healthRecord.findMany({
      where: {
        bird: {
          id: birdId,
          loft: {
            userId: userId,
          },
        },
      },
      include: {
        bird: {
          select: { name: true, ringNumber: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async update(userId: string, id: string, dto: UpdateHealthRecordDto) {
    const record = await this.prisma.healthRecord.findUnique({
      where: { id },
      include: { bird: { include: { loft: true } } },
    });

    if (!record) throw new NotFoundException('Record not found');
    if (record.bird.loft.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { birdId, ...rest } = dto;
    // birdId usually shouldn't be changed, but if provided we might ignore or handle.
    // For safety, let's ignore birdId change for now or allow it if bird ownership is checked.
    // Simplest is to exclude birdId from update to allow ownership stability.

    // If status changed, we might want to update bird status again?
    // For now, let's just update the record. Logic to update bird status on EDIT is complex (what if it was the *latest* record?)
    // User requested "update statistics" and "save/edit"
    // Let's re-apply the status update logic if status is present in dto

    let newStatus: string | undefined;
    if (dto.status === 'sick') newStatus = 'SICK';
    else if (dto.status === 'healthy' || dto.status === 'recovered')
      newStatus = 'HEALTHY';
    else if (dto.status === 'under_observation')
      newStatus = 'UNDER_OBSERVATION';

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.healthRecord.update({
        where: { id },
        data: rest,
      });

      if (newStatus) {
        await tx.bird.update({
          where: { id: record.birdId },
          data: { status: newStatus },
        });
      }
      return updated;
    });
  }

  async remove(userId: string, id: string) {
    const record = await this.prisma.healthRecord.findUnique({
      where: { id },
      include: { bird: { include: { loft: true } } },
    });

    if (!record) throw new NotFoundException('Record not found');
    if (record.bird.loft.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    return this.prisma.healthRecord.delete({ where: { id } });
  }

  async findAllByUser(userId: string, limit: number = 5) {
    return this.prisma.healthRecord.findMany({
      where: { bird: { loft: { userId } } },
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        bird: {
          select: { name: true, ringNumber: true },
        },
      },
    });
  }
}
