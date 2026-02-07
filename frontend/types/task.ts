export interface Task {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    dueDate?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    dueDate?: string;
    isCompleted?: boolean;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> { }
