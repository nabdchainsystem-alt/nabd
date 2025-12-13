export interface Reminder {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    time?: string;
    listId?: string;
    tags: string[];
    completed: boolean;
    subtasks: any[];
}

export const remindersService = {
    subscribe: (callback: (reminders: Reminder[]) => void) => {
        return () => { };
    },
    getReminders: async (contextId?: string): Promise<Reminder[]> => {
        return [];
    },
    addReminder: (reminder: Omit<Reminder, 'id'>) => {
        console.log('Reminder added', reminder);
    },
    deleteReminder: (id: string) => {
        console.log('Reminder deleted', id);
    },
    updateReminder: (id: string, updates: Partial<Reminder>) => {
        console.log('Reminder updated', id, updates);
    },
    sendTask: () => console.log('Task sent to reminders')
};
