export interface Task {
    id: string;
    title: string;
    isUrgent: boolean;
    isImportant: boolean;
    isCompleted: boolean;
    createdAt: number;
}