import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from '../common/repositories/base.repository';

@Injectable()
export class EggsRepository extends BaseRepository<any> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: any) {
    return this.prisma.egg.create({
      data,
      include: {
        pairing: true,
      },
    });
  }

  async findOne(where: any) {
    return this.prisma.egg.findUnique({
      where,
      include: {
        pairing: true,
      },
    });
  }

  async findAll(params?: any) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.egg.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        pairing: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.egg.update({
      where: { id },
      data,
      include: {
        pairing: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.egg.delete({
      where: { id },
      include: {
        pairing: true,
      },
    });
  }

  async count(where?: any) {
    return this.prisma.egg.count({ where });
  }
}
