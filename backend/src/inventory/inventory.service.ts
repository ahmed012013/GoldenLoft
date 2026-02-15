import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createInventoryItemDto: CreateInventoryItemDto) {
    return this.prisma.inventoryItem.create({
      data: {
        ...createInventoryItemDto,
        userId,
      },
    });
  }

  async findAll(userId: string, filters?: { type?: string; status?: string }) {
    const where: any = { userId };

    if (filters?.type && filters.type !== 'all') {
      where.type = filters.type;
    }

    // Status logic (inStock, lowStock, outOfStock, expiringSoon) would typically be computed
    // or we can filter by quantity directly if status equates to quantity ranges.
    // For now, let's return all and let frontend filter or add specific logic here.

    return this.prisma.inventoryItem.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.inventoryItem.findFirst({
      where: { id, userId },
    });
  }

  async update(
    id: string,
    userId: string,
    updateInventoryItemDto: UpdateInventoryItemDto
  ) {
    return this.prisma.inventoryItem.update({
      where: { id }, // In a real app, ensure userId matches too or use findFirst + update
      data: updateInventoryItemDto,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.inventoryItem.delete({
      where: { id },
    });
  }

  async getTotalValue(userId: string) {
    const result = await this.prisma.inventoryItem.aggregate({
      where: { userId },
      _sum: {
        cost: true,
      },
    });
    return result._sum.cost || 0;
  }
}
