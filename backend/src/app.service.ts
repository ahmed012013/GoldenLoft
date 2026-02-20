import { Injectable } from '@nestjs/common';
import { InventoryService } from './inventory/inventory.service';
import { HealthService } from './health/health.service';
import { LifeEventsService } from './life-events/life-events.service';
import { TasksService } from './tasks/tasks.service';

@Injectable()
export class AppService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly healthService: HealthService,
    private readonly lifeEventsService: LifeEventsService,
    private readonly tasksService: TasksService
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDashboardData(userId: string) {
    try {
      // 1. Financial: Total Inventory Value (as Expenses for now)
      let inventoryValue = 0;
      try {
        inventoryValue = await this.inventoryService.getTotalValue(userId);
      } catch (e) {
        console.error('[Dashboard] Error fetching inventory value:', e);
      }

      const financial = {
        income: 0, // Placeholder
        expenses: inventoryValue,
      };

      // 2. Recent Activity: Combine LifeEvents, HealthRecords, Completed Tasks
      // Fetch individually to prevent one failure from breaking the whole dashboard
      let lifeEvents: any[] = [];
      let healthRecords: any[] = [];
      let taskCompletions: any[] = [];
      let lowStockItems: any[] = [];

      try {
        lifeEvents = await this.lifeEventsService.findAllByUser(userId, 5);
      } catch (e) {
        console.error('[Dashboard] Error fetching life events:', e);
      }

      try {
        healthRecords = await this.healthService.findAllByUser(userId, 5);
      } catch (e) {
        console.error('[Dashboard] Error fetching health records:', e);
      }

      try {
        taskCompletions = await this.tasksService.findRecentCompletions(
          userId,
          5
        );
      } catch (e) {
        console.error('[Dashboard] Error fetching task completions:', e);
      }

      try {
        lowStockItems = await this.inventoryService.getLowStockItems(userId);
      } catch (e) {
        console.error('[Dashboard] Error fetching low stock items:', e);
      }

      const activityFeed = [
        ...lifeEvents.map((e) => ({
          type: 'event', // Generic event
          id: e.id,
          title: e.type, // e.g. "RACE", "VACCINATION"
          description: e.description,
          date: e.date,
          entityName: e.bird?.name || e.bird?.ringNumber || 'Unknown Bird',
        })),
        ...healthRecords.map((h) => ({
          type: 'health',
          id: h.id,
          title: `Health: ${h.type}`,
          description: h.description,
          date: h.date,
          entityName: h.bird?.name || h.bird?.ringNumber || 'Unknown Bird',
        })),
        ...taskCompletions.map((t) => ({
          type: 'task',
          id: t.id,
          title: `Task: ${t.task?.title || 'Untitled'}`,
          description: t.notes,
          date: t.completedAt,
          entityName: t.task?.category || 'General',
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      return {
        financial,
        recentActivity: activityFeed,
        lowStockItems, // Add this
      };
    } catch (error) {
      console.error(
        '[Dashboard] Critical error building dashboard data:',
        error
      );
      throw error;
    }
  }
}
