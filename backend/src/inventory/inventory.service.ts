import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

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

  async getLowStockItems(userId: string) {
    const items = await this.prisma.inventoryItem.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        quantity: true,
        minStock: true,
        unit: true,
      },
    });
    console.log(
      `[InventoryService] Fetched ${items.length} items for user ${userId}`
    );
    const lowStock = items.filter((item) => item.quantity <= item.minStock);
    console.log(
      `[InventoryService] Found ${lowStock.length} low stock items:`,
      lowStock
    );
    return lowStock;
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
    const item = await this.prisma.inventoryItem.update({
      where: { id },
      data: updateInventoryItemDto,
    });

    if (item.quantity <= item.minStock) {
      this.eventEmitter.emit('inventory.low_stock', {
        userId: item.userId,
        itemName: item.name,
        currentQuantity: item.quantity,
        minStock: item.minStock,
      });
    }

    return item;
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
