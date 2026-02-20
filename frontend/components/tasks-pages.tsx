"use client";

import { useState, useEffect } from "react";
import { useTasks, CreateTaskData } from "@/hooks/use-tasks";
import { useLofts } from "@/hooks/useLofts";
import {
  ArrowLeft,
  Plus,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskStats } from "@/components/tasks/TaskStats";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskDialogs } from "@/components/tasks/TaskDialogs";

interface TasksPagesProps {
  currentPage: "today" | "schedule" | "completed";
  onBack: () => void;
}

export function TasksPages({ currentPage, onBack }: TasksPagesProps) {
  const { language, t, dir } = useLanguage();
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Completion with Dialog State
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [selectedTaskForCompletion, setSelectedTaskForCompletion] = useState<{
    id: string;
    instanceDate: string;
  } | null>(null);

  // Edit State
  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - ((day + 1) % 7);
    return new Date(d.setDate(diff));
  });

  const {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
  } = useTasks();
  const { lofts } = useLofts();

  useEffect(() => {
    let start = new Date();
    let end = new Date();

    if (currentPage === "today") {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date();
      end.setHours(23, 59, 59, 999);
    } else if (currentPage === "schedule") {
      start = new Date(currentWeekStart);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (currentPage === "completed") {
      end = new Date();
      end.setHours(23, 59, 59, 999);
      start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    }

    fetchTasks(start, end);
  }, [fetchTasks, currentPage, currentWeekStart]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: CreateTaskData = {
      title: formData.get("name") as string,
      titleEn: formData.get("name") as string,
      description: formData.get("description") as string,
      descriptionEn: formData.get("description") as string,
      time: formData.get("time") as string,
      category: formData.get("category") as string,
      priority: formData.get("priority") as string,
      frequency: formData.get("repeat") as string,
      loftId:
        (formData.get("loft") as string) === "all"
          ? undefined
          : (formData.get("loft") as string),
      startDate: (formData.get("startDate") as string)
        ? new Date(formData.get("startDate") as string).toISOString()
        : new Date().toISOString(),
      endDate: (formData.get("endDate") as string)
        ? new Date(formData.get("endDate") as string).toISOString()
        : undefined,
    };

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, data);
      } else {
        await createTask(data);
      }
      setIsAddDialogOpen(false);
      setTaskToEdit(null);

      let start = new Date();
      if (currentPage === "schedule") start = new Date(currentWeekStart);
      const end = new Date(start);
      if (currentPage === "schedule") end.setDate(end.getDate() + 6);
      fetchTasks(start, end);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (task: any) => {
    setTaskToEdit(task);
    setIsAddDialogOpen(true);
  };

  const handleToggleComplete = async (
    taskId: string,
    currentStatus: string,
    dateStr: string,
  ) => {
    if (currentStatus !== "completed") {
      await completeTask(taskId, new Date(dateStr));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm(t("confirmDelete" as any))) {
      await deleteTask(taskId);
    }
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const renderTodayTasks = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl"
            onClick={onBack}
          >
            <ArrowLeft
              className={cn("h-5 w-5", dir === "rtl" && "rotate-180")}
            />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {t("todayTasksTitle" as any)}
            </h1>
            <p className="text-muted-foreground">
              {t("dailyTasksManagement" as any)}
            </p>
          </div>
        </div>

        <Button
          className="rounded-2xl"
          onClick={() => {
            setTaskToEdit(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {t("addNewTask" as any)}
        </Button>
      </div>

      <TaskStats
        totalCount={totalCount}
        pendingCount={pendingCount}
        completedCount={completedCount}
        progressPercent={progressPercent}
      />

      <Card className="rounded-3xl">
        <TaskFilters
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />
        <CardContent>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.status !== "completed") // Hide completed tasks from Today view
              .filter(
                (t) =>
                  filterCategory === "all" || t.category === filterCategory,
              )
              .map((task) => (
                <TaskCard
                  key={`${task.id}-${task.instanceDate}`}
                  task={task as any}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTask}
                  onCompleteWithNotes={(task) => {
                    setSelectedTaskForCompletion({
                      id: task.id,
                      instanceDate: task.instanceDate,
                    });
                    setIsCompleteDialogOpen(true);
                  }}
                />
              ))}
            {tasks.filter((t) => t.status !== "completed").length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {t("noPendingTasks" as any) || "No pending tasks"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        taskToEdit={taskToEdit}
        handleCreateTask={handleCreateTask}
        lofts={lofts}
      />
    </div>
  );

  const renderCompletedTasks = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl"
            onClick={onBack}
          >
            <ArrowLeft
              className={cn("h-5 w-5", dir === "rtl" && "rotate-180")}
            />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {t("completedTasksTitle" as any) || "Completed Tasks"}
            </h1>
            <p className="text-muted-foreground">
              {t("historyReview" as any) || "Review your task history"}
            </p>
          </div>
        </div>
      </div>

      <Card className="rounded-3xl">
        <CardContent>
          <div className="space-y-3 pt-6">
            {tasks.map((task) => (
              <TaskCard
                key={`${task.id}-${task.instanceDate}`}
                task={task as any}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onCompleteWithNotes={() => {}} // Already completed
              />
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {t("noCompletedTasks" as any) || "No completed tasks found"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        taskToEdit={taskToEdit}
        handleCreateTask={handleCreateTask}
        lofts={lofts}
      />
    </div>
  );

  const renderTaskSchedule = () => {
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      return date;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl"
              onClick={onBack}
            >
              <ArrowLeft
                className={cn("h-5 w-5", dir === "rtl" && "rotate-180")}
              />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {t("taskScheduleTitle" as any)}
              </h1>
              <p className="text-muted-foreground">
                {t("dailyTasksManagement" as any)}
              </p>
            </div>
          </div>
          <Button
            className="rounded-2xl"
            onClick={() => {
              setTaskToEdit(null);
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
            {t("addNewTask" as any)}
          </Button>
        </div>

        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => {
                  const newDate = new Date(currentWeekStart);
                  newDate.setDate(currentWeekStart.getDate() - 7);
                  setCurrentWeekStart(newDate);
                }}
              >
                <ChevronLeft
                  className={cn("h-5 w-5", dir === "rtl" && "rotate-180")}
                />
              </Button>
              <h2 className="text-lg font-semibold">
                {weekDates[0].toLocaleDateString(language, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {weekDates[6].toLocaleDateString(language, {
                  month: "short",
                  day: "numeric",
                })}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => {
                  const newDate = new Date(currentWeekStart);
                  newDate.setDate(currentWeekStart.getDate() + 7);
                  setCurrentWeekStart(newDate);
                }}
              >
                <ChevronRight
                  className={cn("h-5 w-5", dir === "rtl" && "rotate-180")}
                />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => {
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const dayTasks = tasks.filter(
                  (t) =>
                    new Date(t.instanceDate).toDateString() ===
                    date.toDateString(),
                );

                const dayName = date.toLocaleDateString(language, {
                  weekday: "long",
                });

                return (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-2xl border text-center min-h-[120px] transition-colors",
                      isToday
                        ? "bg-primary/5 border-primary ring-1 ring-primary"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground uppercase font-medium">
                        {dayName}
                      </p>
                      <p
                        className={cn(
                          "text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1",
                          isToday && "bg-primary text-primary-foreground",
                        )}
                      >
                        {date.getDate()}
                      </p>
                    </div>
                    {dayTasks.length > 0 ? (
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              "text-xs truncate px-2 py-1 rounded-md text-left",
                              task.status === "completed"
                                ? "bg-muted text-muted-foreground line-through"
                                : "bg-primary/10 text-primary",
                            )}
                          >
                            {language === "ar"
                              ? task.title
                              : task.titleEn || task.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayTasks.length - 3} {t("more" as any)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-4">
                        {t("noTasks" as any)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 pb-20 md:pb-6 max-w-7xl animate-in fade-in zoom-in duration-500">
      {currentPage === "today" && renderTodayTasks()}
      {currentPage === "schedule" && renderTaskSchedule()}
      {currentPage === "completed" && renderCompletedTasks()}

      <TaskDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        taskToEdit={taskToEdit}
        handleCreateTask={handleCreateTask}
        lofts={lofts}
      />
    </div>
  );
}
