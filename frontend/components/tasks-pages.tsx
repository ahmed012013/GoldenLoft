"use client";

import { useState } from "react";
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

interface TasksPagesProps {
  currentPage: "today" | "schedule" | "completed";
  onBack: () => void;
}

// Sample tasks data
const sampleTasks = [
  {
    id: 1,
    name: "تنظيف اللوفت الرئيسي",
    nameEn: "Clean main loft",
    description: "تنظيف شامل للوفت الرئيسي وتغيير الفرشة",
    descriptionEn: "Complete cleaning of main loft and change bedding",
    time: "08:00",
    category: "cleaning",
    priority: "high",
    status: "completed",
    loft: "اللوفت الرئيسي",
    loftEn: "Main Loft",
    repeat: "daily",
    dueDate: "2024-01-23",
  },
  {
    id: 2,
    name: "تقديم الطعام الصباحي",
    nameEn: "Morning feeding",
    description: "تقديم الخلطة الصباحية لجميع الحمام",
    descriptionEn: "Provide morning mix to all pigeons",
    time: "09:00",
    category: "feeding",
    priority: "high",
    status: "completed",
    loft: "جميع اللوفتات",
    loftEn: "All Lofts",
    repeat: "daily",
    dueDate: "2024-01-23",
  },
  {
    id: 3,
    name: "فحص الحمام المريض",
    nameEn: "Check sick pigeons",
    description: "فحص الحمام في الحجر الصحي",
    descriptionEn: "Check pigeons in quarantine",
    time: "10:00",
    category: "health",
    priority: "high",
    status: "pending",
    loft: "لوفت الحجر",
    loftEn: "Quarantine Loft",
    repeat: "daily",
    dueDate: "2024-01-23",
  },
  {
    id: 4,
    name: "تغيير المياه",
    nameEn: "Change water",
    description: "تغيير مياه الشرب في جميع اللوفتات",
    descriptionEn: "Change drinking water in all lofts",
    time: "11:00",
    category: "water",
    priority: "medium",
    status: "pending",
    loft: "جميع اللوفتات",
    loftEn: "All Lofts",
    repeat: "daily",
    dueDate: "2024-01-23",
  },
  {
    id: 5,
    name: "تدريب مسائي",
    nameEn: "Evening training",
    description: "تدريب الحمام على الطيران",
    descriptionEn: "Flight training for pigeons",
    time: "16:00",
    category: "training",
    priority: "medium",
    status: "pending",
    loft: "لوفت السباق",
    loftEn: "Racing Loft",
    repeat: "daily",
    dueDate: "2024-01-23",
  },
  {
    id: 6,
    name: "إعطاء الأدوية",
    nameEn: "Give medications",
    description: "إعطاء الفيتامينات والمكملات",
    descriptionEn: "Give vitamins and supplements",
    time: "17:00",
    category: "medication",
    priority: "high",
    status: "pending",
    loft: "جميع اللوفتات",
    loftEn: "All Lofts",
    repeat: "weekly",
    dueDate: "2024-01-23",
  },
];

const completedTasks = [
  {
    id: 101,
    name: "تنظيف اللوفت",
    nameEn: "Clean loft",
    completedDate: "2024-01-22",
    completedTime: "08:30",
    category: "cleaning",
    loft: "اللوفت الرئيسي",
    loftEn: "Main Loft",
  },
  {
    id: 102,
    name: "التغذية الصباحية",
    nameEn: "Morning feeding",
    completedDate: "2024-01-22",
    completedTime: "09:15",
    category: "feeding",
    loft: "جميع اللوفتات",
    loftEn: "All Lofts",
  },
  {
    id: 103,
    name: "فحص صحي",
    nameEn: "Health check",
    completedDate: "2024-01-22",
    completedTime: "10:00",
    category: "health",
    loft: "لوفت التفريخ",
    loftEn: "Breeding Loft",
  },
  {
    id: 104,
    name: "تغيير المياه",
    nameEn: "Change water",
    completedDate: "2024-01-21",
    completedTime: "11:00",
    category: "water",
    loft: "جميع اللوفتات",
    loftEn: "All Lofts",
  },
  {
    id: 105,
    name: "صيانة المعدات",
    nameEn: "Equipment maintenance",
    completedDate: "2024-01-21",
    completedTime: "14:00",
    category: "maintenance",
    loft: "اللوفت الرئيسي",
    loftEn: "Main Loft",
  },
];

export function TasksPages({ currentPage, onBack }: TasksPagesProps) {
  const { language, t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

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

  const pendingCount = sampleTasks.filter((t) => t.status === "pending").length;
  const completedCount = sampleTasks.filter(
    (t) => t.status === "completed",
  ).length;
  const totalCount = sampleTasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

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
              <DialogTitle>{t("addNewTask" as any)}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t("taskName" as any)}</Label>
                <Input
                  placeholder={t("taskNamePlaceholder" as any)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("taskDescription" as any)}</Label>
                <Textarea
                  placeholder={t("taskDescriptionPlaceholder" as any)}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("taskTime" as any)}</Label>
                  <Input type="time" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{t("taskCategory" as any)}</Label>
                  <Select>
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
                  <Select>
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
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={t("selectLoft" as any)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("allLoftsAssign" as any)}
                      </SelectItem>
                      <SelectItem value="main">
                        {language === "ar" ? "اللوفت الرئيسي" : "Main Loft"}
                      </SelectItem>
                      <SelectItem value="breeding">
                        {language === "ar" ? "لوفت التفريخ" : "Breeding Loft"}
                      </SelectItem>
                      <SelectItem value="racing">
                        {language === "ar" ? "لوفت السباق" : "Racing Loft"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("repeatTask" as any)}</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={t("repeatNone" as any)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("repeatNone" as any)}
                    </SelectItem>
                    <SelectItem value="daily">
                      {t("repeatDaily" as any)}
                    </SelectItem>
                    <SelectItem value="weekly">
                      {t("repeatWeekly" as any)}
                    </SelectItem>
                    <SelectItem value="monthly">
                      {t("repeatMonthly" as any)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 rounded-2xl">
                  {t("saveTask" as any)}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl bg-transparent"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  {t("cancel" as any)}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Card */}
      <Card className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {language === "ar" ? "تقدم اليوم" : "Today's Progress"}
              </h2>
              <p className="text-white/80">
                {completedCount} {language === "ar" ? "من" : "of"} {totalCount}{" "}
                {language === "ar" ? "مهمة مكتملة" : "tasks completed"}
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
                    {language === "ar" ? "جميع الفئات" : "All Categories"}
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
            {sampleTasks.map((task) => (
              <motion.div
                key={task.id}
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
                      {language === "ar" ? task.name : task.nameEn}
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
                      {task.time}
                    </span>
                    <span>{language === "ar" ? task.loft : task.loftEn}</span>
                    {task.repeat !== "none" && (
                      <span className="flex items-center gap-1">
                        <Repeat className="h-3 w-3" />
                        {task.repeat === "daily"
                          ? t("repeatDaily" as any)
                          : task.repeat === "weekly"
                            ? t("repeatWeekly" as any)
                            : t("repeatMonthly" as any)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.status !== "completed" && (
                    <Button size="sm" className="rounded-xl">
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
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        {t("editTask" as any)}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
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
    const days = [
      t("sun" as any),
      t("mon" as any),
      t("tue" as any),
      t("wed" as any),
      t("thu" as any),
      t("fri" as any),
      t("sat" as any),
    ];
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
                {t("weeklySchedule" as any)}
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
                const dayTasks = sampleTasks.filter(
                  (t) =>
                    t.repeat === "daily" ||
                    (index === 0 && t.repeat === "weekly"),
                );

                return (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-2xl border text-center min-h-[120px]",
                      isToday
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/30",
                    )}
                  >
                    <p className="text-xs text-muted-foreground">
                      {days[index]}
                    </p>
                    <p
                      className={cn(
                        "text-lg font-bold",
                        isToday && "text-primary",
                      )}
                    >
                      {date.getDate()}
                    </p>
                    <div className="mt-2 space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="text-xs p-1 rounded-lg bg-muted truncate"
                          title={language === "ar" ? task.name : task.nameEn}
                        >
                          {getCategoryIcon(task.category)}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <p className="text-xs text-muted-foreground">
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
            <CardTitle>
              {language === "ar" ? "المهام المتكررة" : "Recurring Tasks"}
            </CardTitle>
            <CardDescription>
              {language === "ar"
                ? "المهام التي تتكرر بشكل منتظم"
                : "Tasks that repeat regularly"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleTasks
                .filter((t) => t.repeat !== "none")
                .map((task) => (
                  <Card key={task.id} className="rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {getCategoryIcon(task.category)}
                          </span>
                          <div>
                            <h3 className="font-medium">
                              {language === "ar" ? task.name : task.nameEn}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {language === "ar" ? task.loft : task.loftEn}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="rounded-xl">
                          <Repeat className="h-3 w-3 mr-1" />
                          {task.repeat === "daily"
                            ? t("repeatDaily" as any)
                            : task.repeat === "weekly"
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
            placeholder={
              language === "ar"
                ? "بحث في المهام المنجزة..."
                : "Search completed tasks..."
            }
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
                  {language === "ar" ? "منجزة اليوم" : "Completed Today"}
                </p>
                <p className="text-3xl font-bold text-green-500">
                  {
                    completedTasks.filter(
                      (t) => t.completedDate === "2024-01-22",
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
                  {language === "ar"
                    ? "منجزة هذا الأسبوع"
                    : "Completed This Week"}
                </p>
                <p className="text-3xl font-bold text-blue-500">
                  {completedTasks.length}
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
                  {language === "ar"
                    ? "متوسط الإنجاز اليومي"
                    : "Avg. Daily Completion"}
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
            {completedTasks.map((task) => (
              <motion.div
                key={task.id}
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
                      {language === "ar" ? task.name : task.nameEn}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {task.completedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.completedTime}
                    </span>
                    <span>{language === "ar" ? task.loft : task.loftEn}</span>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {currentPage === "today" && renderTodayTasks()}
      {currentPage === "schedule" && renderTaskSchedule()}
      {currentPage === "completed" && renderCompletedTasks()}
    </motion.div>
  );
}
