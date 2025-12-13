
export enum Status {
  WORKING_ON_IT = 'Working on it',
  DONE = 'Done',
  STUCK = 'Stuck',
  EMPTY = ''
}

export interface TaskItem {
  id: string;
  name: string;
  person: string | null; // URL to avatar or null
  status: Status;
  date: string | null;
  selected: boolean;
}

export interface GroupData {
  id: string;
  title: string;
  color: string;
  items: TaskItem[];
}

export interface ColumnWidths {
  person: number;
  status: number;
  date: number;
}
