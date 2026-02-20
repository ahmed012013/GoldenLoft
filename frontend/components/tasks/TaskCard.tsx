import { motion } from "framer-motion";
import {
  Clock,
  Repeat,
  MoreHorizontal,
  Edit,
  ClipboardList,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

interface Task {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  time?: string;
  category: string;
  priority: string;
  status: string;
  frequency: string;
  instanceDate: string;
  loft?: {
    id: string;
    name: string;
  };
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (
    taskId: string,
    currentStatus: string,
    dateStr: string,
  ) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onCompleteWithNotes: (task: Task) => void;
}

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onCompleteWithNotes,
}: TaskCardProps) {
  const { language, t } = useLanguage();

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

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-all",
        task.status === "completed" ? "bg-muted/50" : "hover:border-primary/50",
      )}
    >
      <Checkbox
        checked={task.status === "completed"}
        onCheckedChange={() =>
          onToggleComplete(task.id, task.status, task.instanceDate)
        }
        className="h-6 w-6 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{getCategoryIcon(task.category)}</span>
          <h3
            className={cn(
              "font-medium",
              task.status === "completed" &&
                "line-through text-muted-foreground",
            )}
          >
            {language === "ar" ? task.title : task.titleEn || task.title}
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
          <span>{task.loft ? task.loft.name : t("allLoftsAssign" as any)}</span>
          {task.frequency !== "NONE" && (
            <span className="flex items-center gap-1">
              <Repeat className="h-3 w-3" />
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
              onToggleComplete(task.id, task.status, task.instanceDate)
            }
          >
            {t("markAsComplete" as any)}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4 mr-2" />
              {t("editTask" as any)}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCompleteWithNotes(task)}>
              <ClipboardList className="h-4 w-4 mr-2" />
              {t("completeWithNotes" as any)}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(task.id)}
            >
              <Trash className="h-4 w-4 mr-2" />
              {t("deleteTask" as any)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
