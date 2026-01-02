import React, { useMemo, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    ChevronDown,
    Calendar as CalendarIcon
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragEndEvent,
    useDraggable,
    useDroppable
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ITask, Status } from '../../types/boardTypes';
import { useRoomBoardData } from '../../hooks/useRoomBoardData';
import { CalendarEventModal } from './components/CalendarEventModal';
import { motion } from 'framer-motion';

type CalendarViewMode = 'daily' | '5days' | 'weekly' | 'monthly' | 'yearly';

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const pad = (n: number) => String(n).padStart(2, '0');
const formatKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const startOfWeek = (date: Date) => {
    const day = (date.getDay() + 6) % 7; // Monday start
    return addDays(date, -day);
};

// --- DND Components ---

const DraggableTask: React.FC<{ task: ITask; onClick: (e: React.MouseEvent) => void }> = ({ task, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { task }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
        touchAction: 'none' as const
    };

    // New "Dot + Text" style
    let dotColor = 'bg-gray-400';
    if (task.status === Status.Done) dotColor = 'bg-green-500';
    else if (task.status === Status.Working) dotColor = 'bg-amber-500';
    else if (task.status === Status.Stuck) dotColor = 'bg-red-500';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className="group flex items-center gap-2 px-2 py-1 bg-white dark:bg-[#252830] border border-gray-100 dark:border-gray-800 rounded shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-grab active:cursor-grabbing select-none mb-1 overflow-hidden"
        >
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 truncate leading-tight">
                {task.name}
            </span>
        </div>
    );
};

interface DroppableDayProps {
    date: Date;
    dateKey: string;
    tasks: { task: ITask, groupId: string }[];
    isToday: boolean;
    isCurrentMonth: boolean;
    onClick: () => void;
    onTaskClick: (task: ITask, groupId: string) => void;
    isMonthView: boolean;
}

const DroppableDay: React.FC<DroppableDayProps> = ({ date, dateKey, tasks, isToday, isCurrentMonth, onClick, onTaskClick, isMonthView }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: dateKey,
        data: { dateKey, date }
    });

    return (
        <div
            ref={setNodeRef}
            onClick={onClick}
            className={`
                relative flex flex-col transition-all cursor-pointer h-full min-h-[120px]
                border-b border-r border-[#E5E7EB] dark:border-gray-800
                ${!isCurrentMonth ? 'bg-gray-50/30 dark:bg-gray-900/10' : 'bg-white dark:bg-[#1a1d24]'}
                ${isOver ? 'ring-inset ring-2 ring-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'}
                group
            `}
        >
            <div className="flex items-start justify-between p-2">
                <span className={`
                    text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : isCurrentMonth ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600'}
                `}>
                    {date.getDate()}
                </span>

                {/* Optional: Add button visible on hover */}
                {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={14} className="text-gray-400" />
                </div> */}
            </div>

            <div className="flex-1 px-1.5 pb-2 overflow-y-auto space-y-0.5 no-scrollbar">
                {tasks.map(({ task, groupId }) => (
                    <DraggableTask
                        key={task.id}
                        task={task}
                        onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task, groupId);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Main Component ---

interface CalendarViewProps {
    roomId?: string;
    storageKey?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ roomId, storageKey }) => {
    const effectiveKey = storageKey || (roomId ? `board-${roomId}` : 'demo-board');
    const { board, addTask, updateTask } = useRoomBoardData(effectiveKey);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<CalendarViewMode>('monthly');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState(new Date());
    const [editingTask, setEditingTask] = useState<{ task: ITask, groupId: string } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    const isScheduleView = calendarView === '5days' || calendarView === 'weekly';

    const prev = () => {
        if (calendarView === 'daily') setCurrentDate(addDays(currentDate, -1));
        else if (calendarView === '5days' || calendarView === 'weekly') setCurrentDate(addDays(currentDate, -7));
        else if (calendarView === 'yearly') setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1));
        else setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const next = () => {
        if (calendarView === 'daily') setCurrentDate(addDays(currentDate, 1));
        else if (calendarView === '5days' || calendarView === 'weekly') setCurrentDate(addDays(currentDate, 7));
        else if (calendarView === 'yearly') setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
        else setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => setCurrentDate(new Date());

    const tasksByDate = useMemo(() => {
        const map: Record<string, { task: ITask, groupId: string }[]> = {};
        if (board && board.groups) {
            board.groups.forEach(group => {
                group.tasks.forEach(task => {
                    if (!task.dueDate) return;
                    const dateObj = new Date(task.dueDate);
                    const key = formatKey(dateObj);
                    if (!map[key]) map[key] = [];
                    map[key].push({ task, groupId: group.id });
                });
            });
        }
        return map;
    }, [board]);

    const monthGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startOffset = (firstDay.getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const cells: { date: Date, isCurrentMonth: boolean }[] = [];

        // Previous month filler
        for (let i = startOffset - 1; i >= 0; i--) {
            cells.push({ date: new Date(year, month, -i), isCurrentMonth: false });
        }
        // Current month
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
        }
        // Next month filler
        const remaining = 42 - cells.length; // 6 rows * 7 cols
        for (let i = 1; i <= remaining; i++) {
            cells.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return cells;
    }, [currentDate]);

    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate);
        return Array.from({ length: calendarView === '5days' ? 5 : 7 }, (_, i) => addDays(start, i));
    }, [currentDate, calendarView]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id as string;
        const newDateKey = over.id as string;
        const [y, m, d] = newDateKey.split('-').map(Number);
        const newDate = new Date(y, m - 1, d); // Construct date safely

        // Find the task's group
        let groupId = '';
        let task: ITask | undefined;

        for (const g of board.groups) {
            const t = g.tasks.find(t => t.id === taskId);
            if (t) {
                groupId = g.id;
                task = t;
                break;
            }
        }

        if (groupId && task) {
            updateTask(groupId, taskId, { dueDate: newDate.toISOString() });
        }
    };

    const onDateClick = (date: Date) => {
        setModalDate(date);
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const onTaskClick = (task: ITask, groupId: string) => {
        setEditingTask({ task, groupId });
        setModalDate(new Date(task.dueDate));
        setIsModalOpen(true);
    };

    const handleSaveTask = (updates: Partial<ITask>) => {
        if (editingTask) {
            updateTask(editingTask.groupId, editingTask.task.id, updates);
        } else {
            // New task - add to first group or a default "Inbox" group if distinct
            const targetGroupId = board.groups[0]?.id;
            if (targetGroupId) {
                addTask(targetGroupId, updates.name || 'New Event', {
                    ...updates,
                    dueDate: updates.dueDate // Ensure date is passed
                });
            }
        }
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#1a1d24]">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {/* --- Header Section --- */}
                <div className="flex flex-col border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    {/* Top Row: Title, Nav, Actions */}
                    <div className="flex items-center justify-between px-6 py-3.5">
                        <div className="flex items-center gap-6">
                            {/* Today Button */}
                            <button
                                onClick={goToToday}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Today
                            </button>

                            {/* Month Dropdown Stub (Visual) */}
                            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-1.5 rounded-md transition-colors">
                                <span>Month</span>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>

                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                            {/* Navigation & Title */}
                            <div className="flex items-center gap-2">
                                <button onClick={prev} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors"><ChevronLeft size={18} /></button>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </h1>
                                <button onClick={next} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors"><ChevronRight size={18} /></button>
                            </div>
                        </div>

                        {/* Right: Search, Customization, Add Task */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                                <button className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm font-medium">
                                    <Search size={16} />
                                    <span>Search</span>
                                </button>
                                {/* Hide & Customize Stubs */}
                                {/* In a real app these would toggle UI or Modals */}
                                <button className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm font-medium">
                                    {/* Using a placeholder icon for Hide */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    <span>Hide</span>
                                </button>
                                <button className="flex items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm font-medium">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                    <span>Customize</span>
                                </button>
                                <button className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    setModalDate(new Date());
                                    setEditingTask(null);
                                    setIsModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                <Plus size={16} /> Add Task
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row: Filters (Filter / Closed / Assignee) */}
                    <div className="flex items-center gap-2 px-6 pb-3 overflow-x-auto no-scrollbar">
                        <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            Filter
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Closed
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            Assignee
                        </button>
                        {/* More Filter dots */}
                        <div className="ml-auto flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>
                </div>

                {/* --- Grid Section --- */}
                {/* Weekday Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1d24]">
                    {(!isScheduleView ? WEEKDAY_LABELS : weekDays.map(d => d.toLocaleDateString('default', { weekday: 'short' }))).map((day, i) => (
                        <div key={i} className="px-2 py-2 text-[11px] font-semibold text-gray-500 dark:text-gray-500 uppercase">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid Container */}
                <div className="flex-1 overflow-hidden relative bg-white dark:bg-[#151820]">
                    <motion.div
                        key={calendarView + currentDate.toISOString()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`
                            h-full bg-white dark:bg-[#1a1d24]
                            grid
                            ${isScheduleView
                                ? `grid-cols-${calendarView === '5days' ? '5' : '7'}`
                                : 'grid-cols-7 grid-rows-6'
                            }
                            sm:border-l sm:border-t border-[#E5E7EB] dark:border-gray-800
                        `}
                    >
                        {isScheduleView ? (
                            weekDays.map((day) => {
                                const key = formatKey(day);
                                const dayTasks = tasksByDate[key] || [];
                                const isToday = key === formatKey(new Date());

                                return (
                                    <DroppableDay
                                        key={key}
                                        date={day}
                                        dateKey={key}
                                        tasks={dayTasks}
                                        isToday={isToday}
                                        isCurrentMonth={true}
                                        onClick={() => onDateClick(day)}
                                        onTaskClick={onTaskClick}
                                        isMonthView={false}
                                    />
                                );
                            })
                        ) : (
                            monthGrid.map((cell, idx) => {
                                const key = formatKey(cell.date);
                                const cellTasks = tasksByDate[key] || [];
                                const isToday = key === formatKey(new Date());

                                return (
                                    <DroppableDay
                                        key={idx}
                                        date={cell.date}
                                        dateKey={key}
                                        tasks={cellTasks}
                                        isToday={isToday}
                                        isCurrentMonth={cell.isCurrentMonth}
                                        onClick={() => onDateClick(cell.date)}
                                        onTaskClick={onTaskClick}
                                        isMonthView={true}
                                    />
                                );
                            })
                        )}
                    </motion.div>
                </div>

                <DragOverlay>
                    {/* Optional: Custom Drag Preview */}
                </DragOverlay>
            </DndContext>

            <CalendarEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                initialDate={modalDate}
                existingTask={editingTask?.task}
            />
        </div>
    );
};

export default CalendarView;
