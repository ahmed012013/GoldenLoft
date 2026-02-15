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
    // 1. Financial: Total Inventory Value (as Expenses for now)
    const inventoryValue = await this.inventoryService.getTotalValue(userId);
    const financial = {
      income: 0, // Placeholder
      expenses: inventoryValue,
    };

    // 2. Recent Activity: Combine LifeEvents, HealthRecords, Completed Tasks
    const [lifeEvents, healthRecords, taskCompletions] = await Promise.all([
      this.lifeEventsService.findAllByUser(userId, 5),
      this.healthService.findAllByUser(userId, 5),
      this.tasksService.findRecentCompletions(userId, 5),
    ]);

    const activityFeed = [
      ...lifeEvents.map((e) => ({
        type: 'event', // Generic event
        id: e.id,
        title: e.type, // e.g. "RACE", "VACCINATION"
        description: e.description,
        date: e.date,
        entityName: e.bird.name || e.bird.ringNumber,
      })),
      ...healthRecords.map((h) => ({
        type: 'health',
        id: h.id,
        title: `Health: ${h.type}`,
        description: h.description,
        date: h.date,
        entityName: h.bird.name || h.bird.ringNumber,
      })),
      ...taskCompletions.map((t) => ({
        type: 'task',
        id: t.id,
        title: `Task: ${t.task.title}`,
        description: t.notes,
        date: t.completedAt,
        entityName: t.task.category,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return {
      financial,
      recentActivity: activityFeed,
    };
  }
}
