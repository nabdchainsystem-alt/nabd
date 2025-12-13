import { ITask as Task, Status, Priority } from '../types/boardTypes';

export const taskService = {
    getTasks: async (filter?: any, contextId?: string): Promise<Task[]> => {
        return [];
    },
    createTask: async (task: Partial<Task>): Promise<Task> => {
        return {} as Task;
    },
    updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
        return {} as Task;
    },
    deleteTask: async (id: string): Promise<void> => {
    }
};
