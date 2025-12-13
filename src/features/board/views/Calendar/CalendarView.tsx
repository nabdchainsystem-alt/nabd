import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Filter, Search, User, SlidersHorizontal, Settings, Plus as PlusIcon } from 'lucide-react';
import { ITask, Status } from '../../types/boardTypes';
import { useRoomBoardData } from '../../hooks/useRoomBoardData';

// --- Date Helpers (No date-fns) ---
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarViewProps {
    roomId?: string;
    storageKey?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ roomId, storageKey }) => {
    // 1. Get Board Data
    // We try to use the hook if storageKey is provided, otherwise fallbacks might be needed
    // But BoardView passes board.id usually. Let's assume we use the same hook as TaskBoard/Kanban.
    const effectiveKey = storageKey || (roomId ? `board-${roomId}` : 'demo-board');
    const { board } = useRoomBoardData(effectiveKey);

    // 2. Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 3. Navigation Handlers
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    // 4. Generate Days Grid
    // Logic to align Mon-Sun. 
    // JS getDay(): 0=Sun, 1=Mon. We want 0=Mon, ... 6=Sun.
    const startDayIndex = (getFirstDayOfMonth(year, month) + 6) % 7;
    const daysInMonth = getDaysInMonth(year, month);

    // We need 6 weeks to cover all possibilities (42 cells) or just dynamic rows
    // Let's create a flat array for the grid
    const calendarCells = useMemo(() => {
        const cells = [];
        // Empty slots before first day
        for (let i = 0; i < startDayIndex; i++) {
            cells.push({ day: null, fullDate: null });
        }
        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push({
                day: d,
                fullDate: new Date(year, month, d)
            });
        }
        // Remaining slots for 35 or 42 grid? Flex wrap handles it, or explicit loop.
        // Let's just fill to multiple of 7 for clean border
        while (cells.length % 7 !== 0) {
            cells.push({ day: null, fullDate: null });
        }
        return cells;
    }, [year, month, startDayIndex, daysInMonth]);


    // 5. Map Tasks to Dates
    // Tasks are in board.groups[].tasks
    // We need a map: DateString (YYYY-MM-DD) -> Task[]
    const tasksByDate = useMemo(() => {
        const map: Record<string, ITask[]> = {};

        board.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (!task.dueDate) return;
                // Parse ISO date string to YYYY-MM-DD local logic if possible or just slice
                // task.dueDate is ISO string. 
                const dateObj = new Date(task.dueDate);
                const key = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`; // unique key per day

                // Compare with cell logic: same matching logic
                if (!map[key]) map[key] = [];
                map[key].push(task);
            });
        });
        return map;
    }, [board]);

    // Helper to get tasks for a specific cell date
    const getTasksForDate = (date: Date | null) => {
        if (!date) return [];
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        return tasksByDate[key] || [];
    };

    // 6. UI Render
    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#1a1d24]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors">
                        <PlusIcon size={16} /> New Item
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <PlusIcon size={16} /> Add widget
                    </button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search"
                            className="pl-8 pr-3 py-1.5 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded-md text-sm outline-none transition-colors w-24 focus:w-48 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={goToToday} className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Today
                    </button>
                    <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
                        <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 border-r border-gray-300 dark:border-gray-700 transition-colors">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <span className="text-sm font-semibold w-32 text-center text-gray-800 dark:text-gray-200">
                        {MONTH_NAMES[month]} {year}
                    </span>

                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ml-2">
                        Month <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#25282e]">
                {WEEKDAYS.map(day => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid Body */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr overflow-y-auto">
                {calendarCells.map((cell, idx) => {
                    const cellTasks = getTasksForDate(cell.fullDate);
                    const isToday = cell.fullDate &&
                        cell.fullDate.getDate() === new Date().getDate() &&
                        cell.fullDate.getMonth() === new Date().getMonth() &&
                        cell.fullDate.getFullYear() === new Date().getFullYear();

                    return (
                        <div
                            key={idx}
                            className={`min-h-[120px] bg-white dark:bg-[#1a1d24] border-b border-r border-gray-200 dark:border-gray-800 p-2 relative group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${idx % 7 === 0 ? 'border-l' : ''}`}
                        >
                            {cell.day && (
                                <>
                                    <span className={`text-xs font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center ${isToday ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
                                        {cell.day}
                                    </span>

                                    <div className="mt-1 space-y-1">
                                        {cellTasks.map(task => {
                                            let bg = "bg-gray-400";
                                            if (task.status === Status.Done) bg = "bg-green-500";
                                            else if (task.status === Status.Working) bg = "bg-orange-400";
                                            else if (task.status === Status.New) bg = "bg-gray-400";
                                            else if (task.status === Status.Stuck) bg = "bg-red-500";

                                            // Match image style: minimal bar with text
                                            return (
                                                <div key={task.id} className={`${bg} text-white text-[10px] px-2 py-0.5 rounded-sm truncate shadow-sm cursor-pointer hover:opacity-90`}>
                                                    {task.name}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <button className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlusIcon size={14} className="text-gray-500" />
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Legend matching image */}
            <div className="h-10 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center gap-6 bg-white dark:bg-[#1a1d24] text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Done
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div> No Value
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div> Working on it
                </div>
            </div>
        </div>
    );
};

// Simple ChevronDown component locally if needed or import
function ChevronDown({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}

export default CalendarView;
