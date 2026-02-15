"use client";

import { useState, useEffect } from "react";
import { useTasks, CreateTaskData } from "@/hooks/use-tasks";
import { useLofts } from "@/hooks/useLofts";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Search,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Repeat,
  MoreHorizontal,
  Edit,
  Trash,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { OnboardingGuard } from "@/components/onboarding-guard";

interface TasksPagesProps {
  currentPage: "today" | "schedule" | "completed";
  onBack: () => void;
}

export function TasksPages({ currentPage, onBack }: TasksPagesProps) {
  const { language, t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Completion with Dialog State
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [selectedTaskForCompletion, setSelectedTaskForCompletion] = useState<{
    id: string;
    instanceDate: string;
  } | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");

  // Edit State
  const [taskToEdit, setTaskToEdit] = useState<any>(null); // Using any for simplicity with complex Task type intersection

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    // Week starts on Saturday (common in MENA)
    // If today is Saturday (6), diff is 0. If Sunday (0), diff is 1. If Friday (5), diff is 6.
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
  // We use the imported toast from use-toast, or if provided by context.
  // actually useTasks used toast directly. We can use it here for other things if needed.

  useEffect(() => {
    // Determine range based on current page
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
      // Default history range: last 30 days
      end = new Date(); // To end of today
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
      frequency: formData.get("repeat") as string, // Maps to Enum
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
      // Refetch
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
    // If pending, mark complete. If completed, maybe un-complete (not implemented in backend yet, but UI can toggle)
    if (currentStatus !== "completed") {
      await completeTask(taskId, new Date(dateStr));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm(t("confirmDelete" as any))) {
      await deleteTask(taskId);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "feeding":
        return "🍽️";
      case "cleaning":
        return "🧹";
      case "health":
        return "🏥";
      case "training":
        return "🏃";
      case "medication":
        return "💊";
      case "water":
        return "💧";
      case "maintenance":
        return "🔧";
      default:
        return "📋";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      default:
        return "";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return t("priorityHigh" as any);
      case "medium":
        return t("priorityMedium" as any);
      case "low":
        return t("priorityLow" as any);
      default:
        return "";
    }
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Today's Tasks Page
  const renderTodayTasks = () => (
    <div className="space-y-6">
      {/* Header */}
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl">
              <Plus
                className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")}
              />
              {t("addNewTask" as any)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-3xl">
            <DialogHeader>
              <DialogTitle>
                {taskToEdit ? t("editTask" as any) : t("addNewTask" as any)}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t("taskName" as any)}</Label>
                <Input
                  name="name"
                  required
                  defaultValue={taskToEdit?.title}
                  placeholder={t("taskNamePlaceholder" as any)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("taskDescription" as any)}</Label>
                <Textarea
                  name="description"
                  defaultValue={taskToEdit?.description}
                  placeholder={t("taskDescriptionPlaceholder" as any)}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("taskTime" as any)}</Label>
                  <Input
                    name="time"
                    type="time"
                    defaultValue={taskToEdit?.time}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("taskCategory" as any)}</Label>
                  <Select name="category" defaultValue="feeding">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={t("selectCategory" as any)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feeding">
                        {t("categoryFeeding" as any)}
                      </SelectItem>
                      <SelectItem value="cleaning">
                        {t("categoryCleaning" as any)}
                      </SelectItem>
                      <SelectItem value="health">
                        {t("categoryHealth" as any)}
                      </SelectItem>
                      <SelectItem value="training">
                        {t("categoryTraining" as any)}
                      </SelectItem>
                      <SelectItem value="medication">
                        {t("categoryMedication" as any)}
                      </SelectItem>
                      <SelectItem value="water">
                        {t("categoryWater" as any)}
                      </SelectItem>
                      <SelectItem value="maintenance">
                        {t("categoryMaintenance" as any)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("taskPriority" as any)}</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={t("selectPriority" as any)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        {t("priorityHigh" as any)}
                      </SelectItem>
                      <SelectItem value="medium">
                        {t("priorityMedium" as any)}
                      </SelectItem>
                      <SelectItem value="low">
                        {t("priorityLow" as any)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("assignedLoft" as any)}</Label>
                  <Select name="loft" defaultValue="all">
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={t("selectLoft" as any)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("allLoftsAssign" as any)}
                      </SelectItem>
                      {lofts?.map((loft: any) => (
                        <SelectItem key={loft.id} value={loft.id}>
                          {loft.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("repeatTask" as any)}</Label>
                <Select name="repeat" defaultValue="NONE">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={t("repeatNone" as any)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">
                      {t("repeatNone" as any)}
                    </SelectItem>
                    <SelectItem value="DAILY">
                      {t("repeatDaily" as any)}
                    </SelectItem>
                    <SelectItem value="WEEKLY">
                      {t("repeatWeekly" as any)}
                    </SelectItem>
                    <SelectItem value="MONTHLY">
                      {t("repeatMonthly" as any)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("startDate" as any)}</Label>
                  <Input
                    name="startDate"
                    type="date"
                    className="rounded-xl"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("endDate" as any)}</Label>
                  <Input name="endDate" type="date" className="rounded-xl" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 rounded-2xl">
                  {t("saveTask" as any)}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl bg-transparent"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  {t("cancel" as any)}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Card */}
      <Card className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {t("todayTasksTitle" as any)}
              </h2>
              <p className="text-white/80">
                {completedCount} {language === "ar" ? "من" : "of"} {totalCount}{" "}
                {t("completedTasks" as any)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold">{progressPercent}%</p>
                <p className="text-sm text-white/80">{t("completed" as any)}</p>
              </div>
            </div>
          </div>
          <Progress value={progressPercent} className="mt-4 h-3 bg-white/20" />
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("totalTasks" as any)}
                </p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("pendingTasks" as any)}
                </p>
                <p className="text-2xl font-bold text-amber-500">
                  {pendingCount}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("completedToday" as any)}
                </p>
                <p className="text-2xl font-bold text-green-500">
                  {completedCount}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("overdueTasks" as any)}
                </p>
                <p className="text-2xl font-bold text-red-500">0</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card className="rounded-3xl">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>{t("todayTasksTitle" as any)}</CardTitle>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[140px] rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("allCategories" as any)}
                  </SelectItem>
                  <SelectItem value="feeding">
                    {t("categoryFeeding" as any)}
                  </SelectItem>
                  <SelectItem value="cleaning">
                    {t("categoryCleaning" as any)}
                  </SelectItem>
                  <SelectItem value="health">
                    {t("categoryHealth" as any)}
                  </SelectItem>
                  <SelectItem value="training">
                    {t("categoryTraining" as any)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div
                key={`${task.id}-${task.instanceDate}`} // Unique key for instances
                whileHover={{ scale: 1.01 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                  task.status === "completed"
                    ? "bg-muted/50"
                    : "hover:border-primary/50",
                )}
              >
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={() =>
                    handleToggleComplete(
                      task.id,
                      task.status,
                      task.instanceDate,
                    )
                  }
                  className="h-6 w-6 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">
                      {getCategoryIcon(task.category)}
                    </span>
                    <h3
                      className={cn(
                        "font-medium",
                        task.status === "completed" &&
                          "line-through text-muted-foreground",
                      )}
                    >
                      {language === "ar"
                        ? task.title
                        : task.titleEn || task.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-xl text-xs",
                        getPriorityColor(task.priority),
                      )}
                    >
                      {getPriorityText(task.priority)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.time || "---"}
                    </span>
                    <span>
                      {task.loft ? task.loft.name : t("allLoftsAssign" as any)}
                    </span>
                    {task.frequency !== "NONE" && (
                      <span className="flex items-center gap-1">
                        <Repeat className="h-3 w-3" />
                        {/* Simple mapping for now */}
                        {task.frequency}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.status !== "completed" && (
                    <Button
                      size="sm"
                      className="rounded-xl"
                      onClick={() =>
                        handleToggleComplete(
                          task.id,
                          task.status,
                          task.instanceDate,
                        )
                      }
                    >
                      {t("markAsComplete" as any)}
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(task)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t("editTask" as any)}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTaskForCompletion({
                            id: task.id,
                            instanceDate: task.instanceDate,
                          });
                          setIsCompleteDialogOpen(true);
                        }}
                      >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        {t("completeWithNotes" as any)}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        {t("deleteTask" as any)}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Task Schedule Page
  const renderTaskSchedule = () => {
    // Generate dates for the week starting from currentWeekStart (Saturday)
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      return date;
    });

    return (
      <div className="space-y-6">
        {/* Header */}
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
          <Button className="rounded-2xl">
            <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
            {t("addNewTask" as any)}
          </Button>
        </div>

        {/* Week Navigation */}
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
                {/* Format date range: "Sat, Jan 1 - Fri, Jan 7" */}
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

            {/* Week Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => {
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const dayTasks = tasks.filter(
                  (t) =>
                    new Date(t.instanceDate).toDateString() ===
                    date.toDateString(),
                );

                // Get full weekday name in current language
                const dayName = date.toLocaleDateString(language, {
                  weekday: "long",
                });

                return (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-2xl border text-center min-h-[120px] transition-colors",
                      isToday
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/30",
                    )}
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {dayName}
                    </p>
                    <p
                      className={cn(
                        "text-lg font-bold mb-2",
                        isToday && "text-primary",
                      )}
                    >
                      {date.getDate()}
                    </p>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={`${task.id}-${task.instanceDate}`}
                          className="text-xs p-1.5 rounded-lg bg-secondary/50 truncate flex items-center justify-center gap-1"
                          title={
                            language === "ar"
                              ? task.title
                              : task.titleEn || task.title
                          }
                        >
                          <span>{getCategoryIcon(task.category)}</span>
                          <span className="hidden sm:inline truncate max-w-[60px]">
                            {language === "ar"
                              ? task.title
                              : task.titleEn || task.title}
                          </span>
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <p className="text-xs text-muted-foreground pt-1">
                          +{dayTasks.length - 3}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recurring Tasks */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>{t("recurringTasks" as any)}</CardTitle>
            <CardDescription>{t("recurringTasksDesc" as any)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Deduplicate tasks by ID for the Recurring Tasks list */}
              {Array.from(
                new Map(
                  tasks
                    .filter((t) => t.frequency !== "NONE")
                    .map((t) => [t.id, t]),
                ).values(),
              ).map((task) => (
                <Card key={task.id} className="rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {getCategoryIcon(task.category)}
                        </span>
                        <div>
                          <h3 className="font-medium">
                            {language === "ar"
                              ? task.title
                              : task.titleEn || task.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {task.loft
                              ? task.loft.name
                              : t("allLoftsAssign" as any)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-xl">
                        <Repeat className="h-3 w-3 mr-1" />
                        {task.frequency === "DAILY"
                          ? t("repeatDaily" as any)
                          : task.frequency === "WEEKLY"
                            ? t("repeatWeekly" as any)
                            : t("repeatMonthly" as any)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.time}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-xl text-xs",
                          getPriorityColor(task.priority),
                        )}
                      >
                        {getPriorityText(task.priority)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Completed Tasks Page
  const renderCompletedTasks = () => (
    <div className="space-y-6">
      {/* Header */}
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
              {t("completedTasksTitle" as any)}
            </h1>
            <p className="text-muted-foreground">
              {t("dailyTasksManagement" as any)}
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-72">
          <Search
            className={cn(
              "absolute top-3 h-4 w-4 text-muted-foreground",
              dir === "rtl" ? "right-3" : "left-3",
            )}
          />
          <Input
            placeholder={t("search" as any)}
            className={cn("rounded-2xl", dir === "rtl" ? "pr-9" : "pl-9")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("completedToday" as any)}
                </p>
                <p className="text-3xl font-bold text-green-500">
                  {
                    tasks.filter(
                      (t) =>
                        t.status === "completed" &&
                        new Date(t.instanceDate).toDateString() ===
                          new Date().toDateString(),
                    ).length
                  }
                </p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("completed" as any)} {t("thisWeek" as any)}
                </p>
                <p className="text-3xl font-bold text-blue-500">
                  {tasks.filter((t) => t.status === "completed").length}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("avgDailyCompletion" as any)}
                </p>
                <p className="text-3xl font-bold text-purple-500">5.2</p>
              </div>
              <ClipboardList className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completed Tasks List */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>{t("completedTasksTitle" as any)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.status === "completed")
              .map((task) => (
                <motion.div
                  key={`${task.id}-${task.instanceDate}`}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border bg-muted/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">
                        {getCategoryIcon(task.category)}
                      </span>
                      <h3 className="font-medium">
                        {language === "ar"
                          ? task.title
                          : task.titleEn || task.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.instanceDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.time || "--:--"}
                      </span>
                      <span>
                        {task.loft
                          ? task.loft.name
                          : t("allLoftsAssign" as any)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-xl bg-green-500/10 text-green-500 border-green-500/30"
                  >
                    {t("completed" as any)}
                  </Badge>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <OnboardingGuard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {currentPage === "today" && renderTodayTasks()}
        {currentPage === "schedule" && renderTaskSchedule()}
        {currentPage === "completed" && renderCompletedTasks()}

        <Dialog
          open={isCompleteDialogOpen}
          onOpenChange={setIsCompleteDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle>{t("completeWithNotes" as any)}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="notes">
                  {language === "ar" ? "ملاحظات" : "Notes"}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={
                    language === "ar" ? "أضف ملاحظات..." : "Add notes..."
                  }
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCompleteDialogOpen(false)}
                className="rounded-2xl"
              >
                {t("cancel" as any)}
              </Button>
              <Button
                onClick={async () => {
                  if (selectedTaskForCompletion) {
                    await completeTask(
                      selectedTaskForCompletion.id,
                      new Date(selectedTaskForCompletion.instanceDate),
                      completionNotes,
                    );
                    setIsCompleteDialogOpen(false);
                    setCompletionNotes("");
                  }
                }}
                className="rounded-2xl"
              >
                {t("complete" as any) ||
                  (language === "ar" ? "إكمال" : "Complete")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </OnboardingGuard>
  );
}
