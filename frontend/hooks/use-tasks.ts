"use client";

import { useState, useCallback } from "react";
import apiClient from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface Task {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  time?: string;
  instanceDate: string; // From virtual generation
  status: string; // 'pending' | 'completed' | 'skipped'
  isCompleted: boolean;
  completionId?: string;
  category: string;
  priority: string;
  frequency: string;
  notes?: string;
  loft?: { id: string; name: string };
}

export interface CreateTaskData {
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  time?: string;
  category: string;
  priority: string;
  frequency?: string;
  loftId?: string;
  startDate?: string;
  endDate?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTasks = useCallback(
    async (start: Date, end: Date) => {
      setLoading(true);
      try {
        const startStr = start.toISOString();
        const endStr = end.toISOString();
        const res = await apiClient.get<Task[]>(
          `/tasks?start=${startStr}&end=${endStr}`,
        );
        setTasks(res.data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error fetching tasks",
          description: "Could not load tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const createTask = async (data: CreateTaskData) => {
    try {
      await apiClient.post("/tasks", data);
      toast({
        title: "Task created",
        description: "New task has been added successfully.",
      });
      // Refresh done by caller usually
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating task",
        description: "Could not create task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const completeTask = async (taskId: string, date: Date, notes?: string) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => {
        if (
          t.id === taskId &&
          new Date(t.instanceDate).toDateString() === date.toDateString()
        ) {
          return { ...t, status: "completed", isCompleted: true };
        }
        return t;
      }),
    );

    try {
      await apiClient.post("/tasks/complete", {
        taskId,
        date: date.toISOString(), // Send UTC
        notes,
      });
      toast({ title: "Task completed" });
    } catch (error) {
      // Revert
      console.error(error);
      toast({ title: "Error", variant: "destructive" });
      // Ideally refetch or revert state
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      toast({
        title: "Task deleted",
        description: "Task has been removed successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting task",
        description: "Could not delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (taskId: string, data: Partial<CreateTaskData>) => {
    try {
      await apiClient.patch(`/tasks/${taskId}`, data);
      toast({
        title: "Task updated",
        description: "Task has been updated successfully.",
      });
      // Ideally refetch or update local state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...data } : t)),
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating task",
        description: "Could not update task. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
  };
}
