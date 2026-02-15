import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLifeEventDto } from './dto/create-life-event.dto';

@Injectable()
export class LifeEventsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateLifeEventDto) {
    // Verify Bird Ownership
    const bird = await this.prisma.bird.findUnique({
      where: { id: dto.birdId },
      include: { loft: true },
    });

    if (!bird) throw new NotFoundException('Bird not found');
    if (bird.loft.userId !== userId) {
      throw new BadRequestException('You do not own this bird');
    }

    return this.prisma.lifeEvent.create({
      data: {
        birdId: dto.birdId,
        type: dto.type,
        date: new Date(dto.date),
        description: dto.description,
      },
    });
  }

  async findAllByBird(userId: string, birdId: string) {
    // Verify Bird Ownership first
    const bird = await this.prisma.bird.findUnique({
      where: { id: birdId },
      include: { loft: true },
    });
    if (!bird || bird.loft.userId !== userId) {
      throw new NotFoundException('Bird not found');
    }

    return this.prisma.lifeEvent.findMany({
      where: { birdId },
      orderBy: { date: 'desc' },
    });
  }

  async remove(userId: string, id: string) {
    const event = await this.prisma.lifeEvent.findUnique({
      where: { id },
      include: { bird: { include: { loft: true } } },
    });

    if (!event || event.bird.loft.userId !== userId) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.lifeEvent.delete({ where: { id } });
  }

  async findAllByUser(userId: string, limit: number = 5) {
    return this.prisma.lifeEvent.findMany({
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
