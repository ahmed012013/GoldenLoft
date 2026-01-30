import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';

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
    return this.prisma.healthRecord.create({
      data: {
        ...rest,
        bird: { connect: { id: birdId } },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.healthRecord.findMany({
      where: {
        bird: {
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
}
