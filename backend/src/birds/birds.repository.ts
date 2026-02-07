import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Bird, Loft, Prisma } from '@prisma/client';

@Injectable()
export class BirdsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BirdCreateInput): Promise<Bird> {
    return this.prisma.bird.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BirdWhereUniqueInput;
    where?: Prisma.BirdWhereInput;
    orderBy?: Prisma.BirdOrderByWithRelationInput;
  }): Promise<(Bird & { loft: Loft })[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.bird.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        ringNumber: true,
        name: true,
        gender: true,
        status: true,
        color: true,
        type: true,
        birthDate: true,
        totalRaces: true,
        wins: true,
        weight: true,
        image: true,
        createdAt: true,
        loft: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
        father: {
          select: {
            id: true,
            ringNumber: true,
            name: true,
          },
        },
        mother: {
          select: {
            id: true,
            ringNumber: true,
            name: true,
          },
        },
      },
    }) as any;
  }

  async findOne(
    where: Prisma.BirdWhereUniqueInput
  ): Promise<(Bird & { loft: Loft }) | null> {
    return this.prisma.bird.findUnique({
      where,
      include: {
        loft: true,
        father: true,
        mother: true,
        fatherChildren: true,
        motherChildren: true,
        healthRecords: true,
        // Pedigree recursion (basic 1 level for now, can extend)
        // Prisma recursive includes can be heavy.
      },
    });
  }

  async count(where?: Prisma.BirdWhereInput): Promise<number> {
    return this.prisma.bird.count({ where });
  }

  async update(id: string, data: Prisma.BirdUpdateInput): Promise<Bird> {
    return this.prisma.bird.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Bird> {
    return this.prisma.bird.delete({
      where: { id },
    });
  }

  async findLoft(id: string) {
    return this.prisma.loft.findUnique({ where: { id } });
  }
}
