import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TaskFrequency, TaskCompletion } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import {
  addDays,
  addWeeks,
  addMonths,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  parseISO,
  isValid,
  isSameDay,
} from 'date-fns';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
        // Ensure dates are stored correctly
        startDate: new Date(createTaskDto.startDate as string),
        endDate: createTaskDto.endDate
          ? new Date(createTaskDto.endDate as string)
          : null,
        frequency: createTaskDto.frequency as TaskFrequency,
      },
    });
  }

  async findAll(
    userId: string,
    startStr: string,
    endStr: string
  ): Promise<TaskResponseDto[]> {
    const { start, end } = this.validateDateRange(startStr, endStr);

    // 1. Fetch relevant tasks (templates)
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        isActive: true,
        startDate: { lte: end }, // Task must start before the query period ends
        OR: [{ endDate: null }, { endDate: { gte: start } }], // Task must not end before the query period starts
      },
      include: { loft: true },
    });

    // 2. Fetch completions within the range
    const completions = await this.prisma.taskCompletion.findMany({
      where: {
        userId,
        completedAt: {
          gte: start,
          lte: end,
        },
      },
    });

    // 3. Generate instances
    const instances: TaskResponseDto[] = [];

    for (const task of tasks) {
      const taskInstances = this.generateTaskInstances(
        task,
        start,
        end,
        completions
      );
      instances.push(...taskInstances);
    }

    // 4. Sort by date, then priority, then time
    return this.sortInstances(instances);
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { loft: true },
    });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async complete(userId: string, dto: CompleteTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: dto.taskId },
    });
    if (!task) throw new NotFoundException('Task not found');

    const completionDate = new Date(dto.date);

    // Check for existing completion to avoid duplicates
    const existing = await this.prisma.taskCompletion.findFirst({
      where: {
        taskId: dto.taskId,
        userId,
        completedAt: completionDate,
      },
    });

    if (existing) {
      // Idempotency: If already completed, return existing
      return existing;
    }

    return this.prisma.taskCompletion.create({
      data: {
        completedAt: completionDate,
        notes: dto.notes,
        status: 'COMPLETED',
        task: { connect: { id: dto.taskId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async findRecentCompletions(userId: string, limit: number) {
    return this.prisma.taskCompletion.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: limit,
      include: {
        task: {
          select: {
            title: true,
            category: true,
          },
        },
      },
    });
  }

  // --- Helper Methods ---

  private validateDateRange(startStr: string, endStr: string) {
    const parsedStart = parseISO(startStr);
    const parsedEnd = parseISO(endStr);

    if (!isValid(parsedStart) || !isValid(parsedEnd)) {
      throw new BadRequestException('Invalid date format for start or end');
    }

    return {
      start: startOfDay(parsedStart),
      end: endOfDay(parsedEnd),
    };
  }

  private generateTaskInstances(
    task: Task & { loft?: { name: string } | null },
    rangeStart: Date,
    rangeEnd: Date,
    completions: TaskCompletion[]
  ): TaskResponseDto[] {
    const instances: TaskResponseDto[] = [];

    if (task.frequency === TaskFrequency.NONE) {
      // One-off task
      if (task.startDate >= rangeStart && task.startDate <= rangeEnd) {
        instances.push(this.mapToDto(task, task.startDate, completions));
      }
    } else {
      // Recurring task
      let currentDate = startOfDay(task.startDate);

      // Fast-forward to range start
      while (isBefore(currentDate, rangeStart)) {
        currentDate = this.getNextOccurrence(currentDate, task.frequency);
      }

      // Generate instances within range
      while (currentDate <= rangeEnd) {
        if (task.endDate && isAfter(currentDate, task.endDate)) break;

        instances.push(this.mapToDto(task, currentDate, completions));
        currentDate = this.getNextOccurrence(currentDate, task.frequency);
      }
    }

    return instances;
  }

  private getNextOccurrence(date: Date, frequency: TaskFrequency): Date {
    switch (frequency) {
      case TaskFrequency.DAILY:
        return addDays(date, 1);
      case TaskFrequency.WEEKLY:
        return addWeeks(date, 1);
      case TaskFrequency.MONTHLY:
        return addMonths(date, 1);
      default:
        return addDays(date, 1); // Should not happen for NONE/valid freqs
    }
  }

  private mapToDto(
    task: Task & { loft?: { name: string } | null },
    instanceDate: Date,
    completions: TaskCompletion[]
  ): TaskResponseDto {
    const completion = completions.find(
      (c) => c.taskId === task.id && isSameDay(c.completedAt, instanceDate)
    );

    return {
      id: task.id,
      title: task.title,
      titleEn: task.titleEn || undefined,
      description: task.description || undefined,
      descriptionEn: task.descriptionEn || undefined,
      category: task.category,
      priority: task.priority,
      frequency: task.frequency,
      startDate: task.startDate,
      instanceDate: instanceDate,
      time: task.time || undefined,
      isCompleted: !!completion,
      completionId: completion?.id,
      notes: completion?.notes || undefined,
      loftName: task.loft?.name,
    };
  }

  private sortInstances(instances: TaskResponseDto[]): TaskResponseDto[] {
    return instances.sort((a, b) => {
      const dateA = new Date(a.instanceDate).getTime();
      const dateB = new Date(b.instanceDate).getTime();
      if (dateA !== dateB) return dateA - dateB;

      // Priority sort (High > Medium > Low) - crude approach
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      const pA = priorityWeight[a.priority] || 0;
      const pB = priorityWeight[b.priority] || 0;
      if (pA !== pB) return pB - pA;

      if (a.time && b.time) return a.time.localeCompare(b.time);
      return 0;
    });
  }
}
