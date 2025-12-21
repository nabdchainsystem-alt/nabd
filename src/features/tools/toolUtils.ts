import { Board } from '../../types';

export interface SimplifiedTask {
    id: string;
    name: string;
    owner?: string;
    status?: string;
    dueDate?: string;
    priority?: string;
}

const cleanString = (value: any): string => {
    return typeof value === 'string' ? value.trim() : '';
};

const pickOwner = (task: any): string => {
    if (Array.isArray(task?.assignees) && task.assignees.length > 0) {
        return task.assignees.join(', ');
    }
    if (cleanString(task?.assignees)) return cleanString(task.assignees);
    if (cleanString(task?.owner)) return cleanString(task.owner);
    if (cleanString(task?.Owner)) return cleanString(task.Owner);
    if (cleanString(task?.person)) return cleanString(task.person);
    if (cleanString(task?.Person)) return cleanString(task.Person);
    return 'Unassigned';
};

export const loadBoardTasks = (boardId: string, fallbackTasks: any[] = []): SimplifiedTask[] => {
    let source = fallbackTasks;

    try {
        const stored = localStorage.getItem(`board-tasks-${boardId}`);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                source = parsed;
            }
        }
    } catch {
        // Best-effort read; fall back silently
    }

    return (source || []).map((task, index) => {
        const name = cleanString(task?.name) || cleanString(task?.title) || cleanString(task?.Name) || `Task ${index + 1}`;
        return {
            id: task?.id || `task-${index}`,
            name,
            owner: pickOwner(task),
            status: cleanString(task?.status) || cleanString(task?.Status),
            dueDate: cleanString(task?.dueDate) || cleanString(task?.date) || cleanString(task?.Date) || cleanString(task?.due_date),
            priority: cleanString(task?.priority) || cleanString(task?.Priority),
        };
    });
};

export const parseDate = (value?: string) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
};

export const isDoneStatus = (status?: string) => {
    if (!status) return false;
    const normalized = status.toLowerCase();
    return normalized.includes('done') || normalized.includes('complete');
};

export const pickBoardTasks = (board?: Board) => {
    if (!board || !Array.isArray(board.tasks)) return [];
    return board.tasks;
};
