import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TaskFrequency } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
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
  format,
} from 'date-fns';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
        startDate: createTaskDto.startDate
          ? new Date(createTaskDto.startDate)
          : new Date(),
        endDate: createTaskDto.endDate ? new Date(createTaskDto.endDate) : null,
        frequency: createTaskDto.frequency as TaskFrequency, // Cast to Prisma enum
      },
    });
  }

  async findAll(userId: string, startStr: string, endStr: string) {
    try {
      const parsedStart = parseISO(startStr);
      const parsedEnd = parseISO(endStr);

      if (!isValid(parsedStart) || !isValid(parsedEnd)) {
        throw new BadRequestException('Invalid date format for start or end');
      }

      const start = startOfDay(parsedStart);
      const end = endOfDay(parsedEnd);

      // 1. Fetch Task Templates
      const tasks = await this.prisma.task.findMany({
        where: {
          userId,
          isActive: true,
          startDate: { lte: end },
          OR: [{ endDate: null }, { endDate: { gte: start } }],
        },
        include: { loft: true },
      });

      // 2. Fetch Completions in range
      const completions = await this.prisma.taskCompletion.findMany({
        where: {
          userId,
          completedAt: {
            gte: start,
            lte: end,
          },
        },
      });

      // 3. Generate Virtual Instances
      const instances: any[] = [];

      for (const task of tasks) {
        if (task.frequency === TaskFrequency.NONE) {
          // One-off task: show if it's created within the range or if it's pending and created before
          // One-off task logic
          // If it falls in range (checking startDate)
          const isCompleted = completions.some((c) => c.taskId === task.id);

          // Only include if startDate is within range
          if (task.startDate >= start && task.startDate <= end) {
            instances.push({
              ...task,
              instanceDate: task.startDate,
              isCompleted,
              completionId: completions.find((c) => c.taskId === task.id)?.id,
              notes: completions.find((c) => c.taskId === task.id)?.notes,
            });
          }
        } else {
          // Recurring Task
          let currentDate = startOfDay(task.startDate);

          // Fast forward to start if needed
          while (isBefore(currentDate, start)) {
            if (task.frequency === TaskFrequency.DAILY)
              currentDate = addDays(currentDate, 1);
            else if (task.frequency === TaskFrequency.WEEKLY)
              currentDate = addWeeks(currentDate, 1);
            else if (task.frequency === TaskFrequency.MONTHLY)
              currentDate = addMonths(currentDate, 1);
          }

          // Generate instances until end
          while (currentDate <= end) {
            if (task.endDate && isAfter(currentDate, task.endDate)) break;

            // Check if completed
            // We match by comparing the date string (YYYY-MM-DD or ISO)
            // Since we store UTC, we should compare exact ISO string or day match.
            // The prompt says "completedAt represents the actual date the task was intended for".
            const completion = completions.find(
              (c) =>
                c.taskId === task.id &&
                startOfDay(c.completedAt).getTime() === currentDate.getTime()
            );

            instances.push({
              ...task,
              instanceDate: currentDate,
              isCompleted: !!completion,
              completionId: completion?.id,
              status: completion ? 'completed' : 'pending',
              notes: completion?.notes,
            });

            // Next iteration
            if (task.frequency === TaskFrequency.DAILY)
              currentDate = addDays(currentDate, 1);
            else if (task.frequency === TaskFrequency.WEEKLY)
              currentDate = addWeeks(currentDate, 1);
            else if (task.frequency === TaskFrequency.MONTHLY)
              currentDate = addMonths(currentDate, 1);
          }
        }
      }

      // Sort by date then priority
      // Sort by date then priority then time
      return instances.sort((a, b) => {
        const dateA = new Date(a.instanceDate).getTime();
        const dateB = new Date(b.instanceDate).getTime();
        if (dateA !== dateB) return dateA - dateB;

        // If same date, sort by time (string "HH:MM")
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        return 0;
      });
    } catch (error) {
      console.error('Error in findAll tasks:', error);
      throw error;
    }
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

    // Create completion record
    const completion = await this.prisma.taskCompletion.create({
      data: {
        taskId: dto.taskId,
        userId,
        completedAt: completionDate,
        notes: dto.notes,
        status: 'COMPLETED',
      },
    });

    // If it's a one-off task, we might want to mark it inactive or handled
    if (task.frequency === TaskFrequency.NONE) {
      // Optional: Mark main task as inactive if you don't want it to show up anymore
      // await this.prisma.task.update({ where: { id: task.id }, data: { isActive: false } });
    }

    return completion;
  }
}
