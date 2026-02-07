import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from '../common/repositories/base.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class PairingsRepository extends BaseRepository<any> {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: any) {
    return this.prisma.pairing.create({
      data,
      include: {
        male: true,
        female: true,
        eggs: true,
      },
    });
  }

  async findOne(where: Prisma.PairingWhereUniqueInput) {
    return this.prisma.pairing.findUnique({
      where,
      select: {
        id: true,
        maleId: true,
        femaleId: true,
        startDate: true,
        endDate: true,
        status: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        male: {
          select: {
            id: true,
            ringNumber: true,
            name: true,
            gender: true,
            status: true,
          },
        },
        female: {
          select: {
            id: true,
            ringNumber: true,
            name: true,
            gender: true,
            status: true,
          },
        },
        eggs: {
          select: {
            id: true,
            layDate: true,
            hatchDateExpected: true,
            hatchDateActual: true,
            status: true,
          },
        },
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.PairingWhereInput;
    orderBy?: Prisma.PairingOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.pairing.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { startDate: 'desc' },
      select: {
        id: true,
        maleId: true,
        femaleId: true,
        startDate: true,
        endDate: true,
        status: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        male: {
          select: {
            id: true,
            ringNumber: true,
            name: true,
            gender: true,
            status: true,
          },
        },
        female: {
          select: {
            id: true,
            ringNumber: true,
            name: true,
            gender: true,
            status: true,
          },
        },
        eggs: {
          select: {
            id: true,
            layDate: true,
            hatchDateExpected: true,
            hatchDateActual: true,
            status: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.pairing.update({
      where: { id },
      data,
      include: {
        male: true,
        female: true,
        eggs: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.pairing.delete({
      where: { id },
      include: {
        male: true,
        female: true,
        eggs: true,
      },
    });
  }

  async count(where?: any) {
    return this.prisma.pairing.count({ where });
  }
}
