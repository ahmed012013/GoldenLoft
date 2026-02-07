"use client";

import { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TaskItemProps {
    task: Task;
    onToggle: (taskId: string, isCompleted: boolean) => void;
    onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    return (
        <div
            className={cn(
                "group flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-sm",
                task.isCompleted ? "bg-muted/50 border-transparent" : "bg-card border-border"
            )}
        >
            <Checkbox
                checked={task.isCompleted}
                onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
                className="mt-1"
            />
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                    <p
                        className={cn(
                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                            task.isCompleted && "line-through text-muted-foreground"
                        )}
                    >
                        {task.title}
                    </p>
                    {task.dueDate && (
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 gap-1 font-normal">
                            <CalendarDays className="h-3 w-3" />
                            {format(new Date(task.dueDate), "MMM d")}
                        </Badge>
                    )}
                </div>
                {task.description && (
                    <p
                        className={cn(
                            "text-sm text-muted-foreground line-clamp-2",
                            task.isCompleted && "line-through opacity-70"
                        )}
                    >
                        {task.description}
                    </p>
                )}
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                onClick={() => onDelete(task.id)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
