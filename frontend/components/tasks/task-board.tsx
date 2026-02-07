"use client";

import { useEffect, useState } from "react";
import { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task";
import { TaskItem } from "./task-item";
import { CreateTaskDialog } from "./create-task-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";


// Assuming we have an API client or fetch wrapper. If not, I'll use fetch relative to /api (which proxies to backend) or direct to backend URL.
// The docker-compose shows frontend NEXT_PUBLIC_API_URL=http://localhost:4000.
// I'll check if there's a specific API utility in the next step, but for now I'll write a simple fetcher inside or use axios if I find it.
// I'll assume axios is used as it was in package.json.
import axios from "axios";

// Helper to get token? Access token is usually in localStorage or cookie.
// I'll assume standard bearer token pattern.

interface TaskBoardProps {
    onBack?: () => void;
}

export default function TaskBoard({ onBack }: TaskBoardProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { t, dir } = useLanguage();

    // Need to get API URL from env or constant.
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("access_token");
        return {
            Authorization: `Bearer ${token}`,
        };
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks`, {
                headers: getAuthHeaders(),
            });
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load tasks");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async (data: CreateTaskDto) => {
        try {
            const response = await axios.post(`${API_URL}/tasks`, data, {
                headers: getAuthHeaders(),
            });
            setTasks((prev) => [response.data, ...prev]);
            toast.success("Task created");
        } catch (error) {
            console.error(error);
            throw error; // Let dialog handle error
        }
    };

    const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
        // Optimistic update
        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, isCompleted } : t))
        );

        try {
            await axios.patch(
                `${API_URL}/tasks/${taskId}`,
                { isCompleted },
                { headers: getAuthHeaders() }
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task");
            // Revert
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !isCompleted } : t))
            );
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        // Optimistic update
        const previousTasks = [...tasks];
        setTasks((prev) => prev.filter((t) => t.id !== taskId));

        try {
            await axios.delete(`${API_URL}/tasks/${taskId}`, {
                headers: getAuthHeaders(),
            });
            toast.success("Task deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete task");
            setTasks(previousTasks);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-2xl"
                            onClick={onBack}
                        >
                            {/* ArrowLeft icon from lucide-react needs import or we can pass it as child if we strictly follow the other file, but let's just use the SVG or try to import it if I can't check imports easily.
                                Wait, I generated the file, I can add imports.
                                I need to update imports at the top too.
                            */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={cn("h-5 w-5", dir === "rtl" && "rotate-180")}
                            >
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                        </Button>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t("todayTasksTitle") || "Today's Tasks"}</h1>
                        <p className="text-muted-foreground mt-1">
                            {t("dailyTasksManagement") || "Manage your daily pigeon keeping activities."}
                        </p>
                    </div>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="rounded-2xl">
                    <Plus className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t("addNewTask") || "Add New Task"}
                </Button>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/50">
                        <h3 className="text-lg font-medium">No tasks yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Get started by creating a new task.
                        </p>
                        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Create Task
                        </Button>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={handleToggleTask}
                            onDelete={handleDeleteTask}
                        />
                    ))
                )}
            </div>

            <CreateTaskDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleCreateTask}
            />
        </div>
    );
}
