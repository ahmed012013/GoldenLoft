import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from '../common/repositories/base.repository';

@Injectable()
export class LoftRepository extends BaseRepository<any> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: any) {
    return this.prisma.loft.create({
      data,
    });
  }

  async findOne(where: any) {
    return this.prisma.loft.findUnique({
      where,
    });
  }

  async findAll(params?: any) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.loft.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        _count: {
          select: { birds: true },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.loft.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.loft.delete({
      where: { id },
    });
  }

  async count(where?: any) {
    return this.prisma.loft.count({ where });
  }
}
