import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OnEvent } from '@nestjs/event-emitter';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('inventory.low_stock')
  async handleLowStockEvent(payload: {
    userId: string;
    itemName: string;
    currentQuantity: number;
    minStock: number;
  }) {
    const messageEn = `Stock is low for ${payload.itemName}. Current: ${payload.currentQuantity}, Min: ${payload.minStock}`;
    const messageAr = `المخزون منخفض لـ ${payload.itemName}. المتوفر: ${payload.currentQuantity}، الحد الأدنى: ${payload.minStock}`;
    await this.notificationsService.create(
      payload.userId,
      'Low Stock Alert',
      messageEn,
      'ALERT',
      'تنبيه مخزون منخفض',
      messageAr
    );
  }
}
