import { Injectable } from '@nestjs/common';
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
    const count = await this.prisma.loft.count({ where: { id, userId } });
    if (count === 0) throw new Error('Loft not found or access denied');

    return this.prisma.loft.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const count = await this.prisma.loft.count({ where: { id, userId } });
    if (count === 0) throw new Error('Loft not found or access denied');

    return this.prisma.loft.delete({
      where: { id },
    });
  }
}
