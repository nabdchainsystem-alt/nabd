export enum Status {
    ToDo = 'To Do',
    WorkingOnIt = 'Working on it',
    Stuck = 'Stuck',
    Done = 'Done',
    InProgress = 'In Progress',
    Pending = 'Pending',
    AlmostFinish = 'Almost Done'
}

export enum Priority {
    Urgent = 'Urgent',
    High = 'High',
    Medium = 'Medium',
    Normal = 'Normal',
    Low = 'Low'
}

export const STATUS_COLORS: Record<Status, string> = {
    [Status.ToDo]: '#c4c4c4',
    [Status.WorkingOnIt]: '#fdab3d',
    [Status.Stuck]: '#e2445c',
    [Status.Done]: '#00c875',
    [Status.InProgress]: '#3B82F6',
    [Status.Pending]: '#579bfc',
    [Status.AlmostFinish]: '#a25ddc'
};

export const PRIORITY_COLORS: Record<Priority, string> = {
    [Priority.Urgent]: '#333333',
    [Priority.High]: '#401694',
    [Priority.Medium]: '#5559df',
    [Priority.Normal]: '#579bfc',
    [Priority.Low]: '#d8d8d8'
};

export const PEOPLE = [
    { id: '1', name: 'Max', color: '#ff0000' },
    { id: '2', name: 'Alice', color: '#00ff00' }
];

export interface ITask {
    id: string;
    name: string;
    status: Status;
    priority: Priority;
    personId: string | null;
    dueDate: string;
    textValues: Record<string, string>;
    selected: boolean;
    subtasks?: ITask[];
    people?: any; // To support rich person object sync
    [key: string]: any; // Allow for dynamic column data (e.g. file attachments)
}

export interface IColumn {
    id: string;
    title: string;
    type: string;
    width?: number;
}

export interface IGroup {
    id: string;
    title: string;
    color: string;
    tasks: ITask[];
    columns: IColumn[];
    isPinned: boolean;
}

export interface IBoard {
    id: string;
    name: string;
    groups: IGroup[];
    availableViews?: string[];
    pinnedViews?: string[];
    description?: string;
    defaultView?: string;
}
