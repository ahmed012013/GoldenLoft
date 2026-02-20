import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    title: string,
    message: string,
    type: 'ALERT' | 'INFO' | 'SUCCESS' = 'INFO',
    titleAr?: string,
    messageAr?: string
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        ...(titleAr && { titleAr }),
        ...(messageAr && { messageAr }),
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to recent 20
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}
