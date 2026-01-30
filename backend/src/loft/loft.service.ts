import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoftDto } from './dto/create-loft.dto';
import { UpdateLoftDto } from './dto/update-loft.dto';

@Injectable()
export class LoftService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateLoftDto) {
    return this.prisma.loft.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findManyByUserId(userId: string) {
    return this.prisma.loft.findMany({
      where: { userId },
      include: {
        _count: {
          select: { birds: true },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.loft.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { birds: true },
        },
        birds: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async update(id: string, userId: string, data: UpdateLoftDto) {
    const count = await this.prisma.loft.count({ where: { id, userId } });
    if (count === 0) throw new Error('Loft not found or access denied');

    return this.prisma.loft.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const loft = await this.prisma.loft.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: { birds: true },
        },
      },
    });

    if (!loft) throw new Error('Loft not found or access denied');

    if (loft._count.birds > 0) {
      throw new BadRequestException(
        `Cannot delete loft with ${loft._count.birds} birds. Please move or delete the birds first.`
      );
    }

    return this.prisma.loft.delete({
      where: { id },
    });
  }
}
