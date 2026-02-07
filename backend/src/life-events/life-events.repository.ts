import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from '../common/repositories/base.repository';

@Injectable()
export class LifeEventsRepository extends BaseRepository<any> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: any) {
    return this.prisma.lifeEvent.create({
      data,
    });
  }

  async findOne(where: any) {
    return this.prisma.lifeEvent.findUnique({
      where,
    });
  }

  async findAll(params?: any) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.lifeEvent.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { date: 'desc' },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.lifeEvent.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.lifeEvent.delete({
      where: { id },
    });
  }

  async count(where?: any) {
    return this.prisma.lifeEvent.count({ where });
  }
}
