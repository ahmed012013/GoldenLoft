import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  async update(id: string, userId: string, data: UpdateLoftDto) {
    const loft = await this.prisma.loft.findUnique({
      where: { id },
    });

    if (!loft) {
      throw new NotFoundException('Loft not found');
    }

    if (loft.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.loft.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const loft = await this.prisma.loft.findUnique({
      where: { id },
    });

    if (!loft) {
      throw new NotFoundException('Loft not found');
    }

    if (loft.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.loft.delete({
      where: { id },
    });
  }
}
