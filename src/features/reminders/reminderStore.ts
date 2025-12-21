import { useCallback, useEffect, useMemo, useState } from 'react';

export type ReminderStatus = 'scheduled' | 'triggered' | 'dismissed';
export type ReminderKind = 'absolute' | 'relative';

export interface ReminderRecord {
  id: string;
  itemId: string;
  boardId?: string;
  itemTitle?: string;
  remindAt: string; // ISO string
  status: ReminderStatus;
  kind: ReminderKind;
  relativeLabel?: string;
  createdAt: string;
}

const STORAGE_KEY = 'reminders-v1';

const readAll = (): ReminderRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const writeAll = (records: ReminderRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const computeStatus = (reminder: ReminderRecord): ReminderStatus => {
  if (reminder.status === 'dismissed') return 'dismissed';
  const target = new Date(reminder.remindAt).getTime();
  if (Number.isNaN(target)) return reminder.status || 'scheduled';
  return Date.now() >= target ? 'triggered' : 'scheduled';
};

const refreshStatuses = (records: ReminderRecord[]) => {
  let changed = false;
  const updated = records.map((r) => {
    const nextStatus = computeStatus(r);
    if (nextStatus !== r.status && r.status !== 'dismissed') {
      changed = true;
      return { ...r, status: nextStatus };
    }
    return r;
  });
  if (changed) writeAll(updated);
  return updated;
};

export const reminderStore = {
  list(boardId?: string) {
    const all = refreshStatuses(readAll());
    if (!boardId) return all;
    return all.filter((r) => r.boardId === boardId);
  },

  listForItem(itemId: string, boardId?: string) {
    return this.list(boardId).filter((r) => r.itemId === itemId);
  },

  addReminder(reminder: Omit<ReminderRecord, 'id' | 'status' | 'createdAt'> & { status?: ReminderStatus }) {
    const all = refreshStatuses(readAll());
    const record: ReminderRecord = {
      ...reminder,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: reminder.status || 'scheduled'
    };
    all.push(record);
    writeAll(all);
    return record;
  },

  updateReminder(id: string, updates: Partial<ReminderRecord>) {
    const all = refreshStatuses(readAll());
    const updated = all.map((r) => (r.id === id ? { ...r, ...updates } : r));
    writeAll(updated);
  },

  deleteReminder(id: string) {
    const all = refreshStatuses(readAll()).filter((r) => r.id !== id);
    writeAll(all);
  }
};

export const useReminders = (boardId?: string) => {
  const [reminders, setReminders] = useState<ReminderRecord[]>(() => reminderStore.list(boardId));

  const refresh = useCallback(() => {
    setReminders(reminderStore.list(boardId));
  }, [boardId]);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(() => refresh(), 60 * 1000);
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  const addReminder = useCallback(
    (reminder: Omit<ReminderRecord, 'id' | 'status' | 'createdAt'> & { status?: ReminderStatus }) => {
      reminderStore.addReminder({ ...reminder, boardId });
      refresh();
    },
    [boardId, refresh]
  );

  const updateReminder = useCallback(
    (id: string, updates: Partial<ReminderRecord>) => {
      reminderStore.updateReminder(id, updates);
      refresh();
    },
    [refresh]
  );

  const deleteReminder = useCallback(
    (id: string) => {
      reminderStore.deleteReminder(id);
      refresh();
    },
    [refresh]
  );

  const groupedByItem = useMemo(() => {
    return reminders.reduce<Record<string, ReminderRecord[]>>((acc, reminder) => {
      const list = acc[reminder.itemId] || [];
      list.push(reminder);
      acc[reminder.itemId] = list;
      return acc;
    }, {});
  }, [reminders]);

  return { reminders, groupedByItem, addReminder, updateReminder, deleteReminder, refresh };
};
