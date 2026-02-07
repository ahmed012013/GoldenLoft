import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(protected prisma: PrismaService) {}

  abstract create(data: any): Promise<T>;
  abstract findOne(where: any): Promise<T | null>;
  abstract findAll(params?: any): Promise<T[]>;
  abstract update(id: string, data: any): Promise<T>;
  abstract remove(id: string): Promise<T>;
  abstract count(where?: any): Promise<number>;
}
