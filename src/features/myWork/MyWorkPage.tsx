import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Board, Task } from '../../types';
import {
    Calendar, CheckCircle2, ChevronDown, ChevronRight,
    Clock, AlertCircle, Circle, ArrowUpRight,
    Layout, Briefcase, Plus, TrendingUp,
    Filter, MoreHorizontal, CalendarDays, Flag, Bell,
    ChevronLeft, Video, User, Timer, Coffee,
    PlusCircle, Code, Tag, Hash, Calendar as CalendarIcon,
    ArrowRight, GripVertical, Bug, Mail, Undo2, Info,
    X, Search, Check
} from 'lucide-react';
import { normalizePriority } from '../priorities/priorityUtils';

interface MyWorkPageProps {
    boards: Board[];
    onNavigateToBoard: (view: 'board', boardId: string) => void;
    onUpdateTasks: (boardId: string, task: Task) => void;
    onAddBoard: (board: Board) => void;
}

// --- Icons mapping to replace Material Symbols ---
// chevron_left -> ChevronLeft
// chevron_right -> ChevronRight
// drag_indicator -> GripVertical (using GripVertical as drag handle)
// videocam -> Video
// check -> CheckCircle2
// timer -> Timer
// coffee -> Coffee
// add_circle -> PlusCircle
// code -> Code
// tune -> Filter (using Filter as tune/adjust)
// tag -> Hash or Tag
// priority_high -> AlertCircle
// calendar_today -> CalendarIcon
// arrow_forward -> ArrowRight
// bug_report -> Bug
// undo -> Undo2
// info -> Info
// add -> Plus

interface BoardSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    boards: Board[];
    taskName: string;
    onSelectBoard: (boardId: string) => void;
    onCreateBoard: (name: string) => void;
}

const BoardSelectionModal: React.FC<BoardSelectionModalProps> = ({ isOpen, onClose, boards, taskName, onSelectBoard, onCreateBoard }) => {
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-switch to create mode if no boards exist
    useEffect(() => {
        if (boards.length === 0) {
            setIsCreating(true);
        }
    }, [boards.length]);

    useEffect(() => {
        if (isOpen && !isCreating) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen, isCreating]);

    if (!isOpen) return null;

    const filteredBoards = boards.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#2c333a] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-[#252a30]">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{isCreating ? 'Create New Board' : 'Select Board'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-sm text-slate-500 mb-4">
                        Where should we save <strong className="text-slate-800 dark:text-slate-200">"{taskName}"</strong>?
                    </p>

                    {isCreating ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Board Name</label>
                                <input
                                    autoFocus
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                    placeholder="e.g. Q4 Marketing"
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#1a1e23] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newBoardName.trim()) {
                                            onCreateBoard(newBoardName);
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsCreating(false)} className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                                <button
                                    onClick={() => newBoardName.trim() && onCreateBoard(newBoardName)}
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors font-medium">
                                    Create Board
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="relative mb-3">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    ref={inputRef}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search boards..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-[#1a1e23] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>

                            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors group text-left"
                                >
                                    <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                        <Plus size={16} />
                                    </div>
                                    <span className="text-sm font-semibold">Create new board</span>
                                </button>

                                {filteredBoards.map(board => (
                                    <button
                                        key={board.id}
                                        onClick={() => onSelectBoard(board.id)}
                                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group text-left"
                                    >
                                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-colors">
                                            <Hash size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{board.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{board.tasks?.length || 0} tasks</p>
                                        </div>
                                        {board.workspaceId && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">WS</span>}
                                    </button>
                                ))}

                                {filteredBoards.length === 0 && (
                                    <div className="text-center py-4 text-slate-400 text-xs">
                                        No boards found
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Menus ---

const PriorityMenu = ({ onSelect, onClose }: { onSelect: (p: string) => void, onClose: () => void }) => (
    <div className="absolute bottom-full left-0 mb-2 w-32 bg-white dark:bg-[#2c333a] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
        {['High', 'Medium', 'Low'].map(p => (
            <button
                key={p}
                onClick={() => { onSelect(p); onClose(); }}
                className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
            >
                <span className={`w-2 h-2 rounded-full ${p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                <span className="text-slate-700 dark:text-slate-200">{p}</span>
            </button>
        ))}
    </div>
);

const DateMenu = ({ onSelect, onClose }: { onSelect: (d: string) => void, onClose: () => void }) => (
    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#2c333a] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
        {['Today', 'Tomorrow', 'Next Week'].map(d => (
            <button
                key={d}
                onClick={() => { onSelect(d); onClose(); }}
                className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200"
            >
                <CalendarIcon size={12} className="text-slate-400" />
                {d}
            </button>
        ))}
    </div>
);

// --- Kanban View Component ---

const KanbanView = () => {
    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#16181d] overflow-hidden animate-in fade-in duration-300">
            {/* Header Section */}
            <header className="flex flex-col gap-6 px-6 py-8 md:px-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#121417] dark:text-white">My Work</h1>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95">
                        <Plus size={20} />
                        <span>New Task</span>
                    </button>
                </div>
                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <Search size={20} />
                        </div>
                        <input className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-[#f0f2f4] dark:bg-[#2a2e35] text-[#121417] dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-600/50 text-sm font-medium transition-colors" placeholder="Search tasks, projects..." type="text" />
                    </div>
                    {/* Chips */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <button className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f0f2f4] dark:bg-[#2a2e35] hover:bg-gray-200 dark:hover:bg-[#353a42] transition-colors">
                            <span className="text-sm font-semibold text-[#121417] dark:text-gray-200">Status</span>
                            <ChevronDown size={18} className="text-gray-500 group-hover:text-[#121417] dark:text-gray-400 dark:group-hover:text-white" />
                        </button>
                        <button className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f0f2f4] dark:bg-[#2a2e35] hover:bg-gray-200 dark:hover:bg-[#353a42] transition-colors">
                            <span className="text-sm font-semibold text-[#121417] dark:text-gray-200">Date</span>
                            <ChevronDown size={18} className="text-gray-500 group-hover:text-[#121417] dark:text-gray-400 dark:group-hover:text-white" />
                        </button>
                        <button className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f0f2f4] dark:bg-[#2a2e35] hover:bg-gray-200 dark:hover:bg-[#353a42] transition-colors">
                            <span className="text-sm font-semibold text-[#121417] dark:text-gray-200">Priority</span>
                            <ChevronDown size={18} className="text-gray-500 group-hover:text-[#121417] dark:text-gray-400 dark:group-hover:text-white" />
                        </button>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>
                        <button className="flex items-center justify-center p-2 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-[#2a2e35] text-gray-500 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>
            </header>
            {/* Main Content Area */}
            <main className="flex-1 px-6 md:px-10 pb-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                {/* Overdue Section */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertCircle size={24} />
                        <h2 className="text-lg font-bold tracking-tight">Overdue Items</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Overdue Card 1 */}
                        <div className="flex flex-col gap-3 p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold uppercase tracking-wider text-red-600/80 dark:text-red-400">Marketing</span>
                                <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-bold px-2 py-1 rounded">2 Days Overdue</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-[#121417] dark:text-white mb-1">Q3 Budget Final Review</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ensure all departmental spend is accounted for.</p>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1e212b] bg-slate-200 flex items-center justify-center text-[10px] font-bold">MK</div>
                                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1e212b] bg-slate-300 flex items-center justify-center text-[10px] font-bold">JD</div>
                                </div>
                                <Flag size={20} className="text-red-400" />
                            </div>
                        </div>
                        {/* Overdue Card 2 */}
                        <div className="flex flex-col gap-3 p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold uppercase tracking-wider text-red-600/80 dark:text-red-400">Legal</span>
                                <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-bold px-2 py-1 rounded">1 Day Overdue</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-[#121417] dark:text-white mb-1">Contract Addendum</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Review the vendor agreement updates.</p>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#1e212b] bg-blue-200 flex items-center justify-center text-[10px] font-bold">SW</div>
                                </div>
                                <Flag size={20} className="text-red-400" />
                            </div>
                        </div>
                    </div>
                </section>
                {/* Kanban Board */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
                    {/* Column: To Do */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">To Do</h3>
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">5</span>
                            </div>
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                        {/* Tasks List */}
                        <div className="flex flex-col gap-3">
                            {/* Card */}
                            <div className="group bg-white dark:bg-[#1e212b] p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-md dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all cursor-pointer border border-transparent hover:border-blue-600/20">
                                <div className="mb-2 flex justify-between">
                                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Product Launch</span>
                                    <MoreHorizontal size={18} className="text-gray-300 group-hover:text-gray-500" />
                                </div>
                                <h4 className="font-bold text-[#121417] dark:text-white mb-3">Draft Initial User Stories</h4>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                                        <Calendar size={14} /> Oct 24
                                    </span>
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1e212b] bg-slate-100 flex items-center justify-center text-[8px] font-bold">JD</div>
                                    </div>
                                </div>
                            </div>
                            {/* Card */}
                            <div className="group bg-white dark:bg-[#1e212b] p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-blue-600/20">
                                <div className="mb-2 flex justify-between">
                                    <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Research</span>
                                    <MoreHorizontal size={18} className="text-gray-300 group-hover:text-gray-500" />
                                </div>
                                <h4 className="font-bold text-[#121417] dark:text-white mb-3">Competitor Analysis Report</h4>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                                        <Calendar size={14} /> Oct 26
                                    </span>
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 border-2 border-white dark:border-[#1e212b] flex items-center justify-center text-[10px] font-bold">JD</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Column: In Progress */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">In Progress</h3>
                                <span className="bg-blue-600/10 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                            </div>
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                        {/* Tasks List */}
                        <div className="flex flex-col gap-3">
                            {/* Card */}
                            <div className="group bg-white dark:bg-[#1e212b] p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-600">
                                <div className="mb-2 flex justify-between">
                                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Product Launch</span>
                                    <MoreHorizontal size={18} className="text-gray-300 group-hover:text-gray-500" />
                                </div>
                                <h4 className="font-bold text-[#121417] dark:text-white mb-3">Develop API Endpoints</h4>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mb-3 overflow-hidden">
                                    <div className="bg-blue-600 h-full rounded-full w-2/3"></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-orange-600 bg-orange-50 dark:bg-orange-900/20 text-xs font-semibold px-2 py-1 rounded">
                                        <Clock size={14} /> Today
                                    </span>
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1e212b] bg-slate-100 flex items-center justify-center text-[8px] font-bold">AS</div>
                                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1e212b] bg-slate-200 flex items-center justify-center text-[8px] font-bold">TM</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Column: Completed */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">Completed</h3>
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">12</span>
                            </div>
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                        {/* Tasks List */}
                        <div className="flex flex-col gap-3 opacity-70 hover:opacity-100 transition-opacity">
                            {/* Card */}
                            <div className="group bg-white dark:bg-[#1e212b] p-4 rounded-xl shadow-none border border-gray-200 dark:border-gray-800 hover:border-gray-300 transition-all cursor-pointer">
                                <div className="mb-2 flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider line-through">Onboarding</span>
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full p-0.5">
                                        <Check size={14} />
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-500 dark:text-gray-400 mb-3 line-through">Welcome Email Sequence</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-xs">Completed Oct 20</span>
                                    <div className="flex -space-x-2 grayscale">
                                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1e212b] bg-slate-200 flex items-center justify-center text-[8px] font-bold">ME</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};


export const MyWorkPage: React.FC<MyWorkPageProps> = ({ boards, onNavigateToBoard, onUpdateTasks, onAddBoard }) => {
    // --- State ---
    const [currentTab, setCurrentTab] = useState<'timeline' | 'kanban'>('timeline');
    const [filter, setFilter] = useState<'all' | 'design' | 'dev' | 'personal'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Task Creation State
    const [newTaskName, setNewTaskName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Task properties state
    const [newTaskPriority, setNewTaskPriority] = useState<string | null>(null);
    const [newTaskDate, setNewTaskDate] = useState<string | null>(null);

    // Menu States
    const [activeMenu, setActiveMenu] = useState<'none' | 'priority' | 'date'>('none');
    const [isProjectActive, setIsProjectActive] = useState(false);

    // --- Derived Data ---
    const { inboxTasks, activeProjects, todayTasks } = useMemo(() => {
        const inbox: { task: Task, boardName: string, boardId: string }[] = [];
        const today: { task: Task, boardName: string, boardId: string }[] = [];
        const projects: Record<string, { id: string, name: string, tasks: Task[] }> = {};

        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split('T')[0];

        boards.forEach(board => {
            if (!board.tasks || !Array.isArray(board.tasks)) return;

            // Group by Project (Board)
            if (!projects[board.id]) {
                projects[board.id] = { id: board.id, name: board.name, tasks: [] };
            }

            board.tasks.forEach(task => {
                const richTask = { task, boardName: board.name, boardId: board.id };

                // Add to Projects
                projects[board.id].tasks.push(task);

                // Add to Today if matches
                if (task.date === currentDateString) {
                    today.push(richTask);
                } else {
                    // For now, treat everything else as "Inbox" candidates for the purpose of the UI demo
                    inbox.push(richTask);
                }
            });
        });


        return {
            inboxTasks: inbox.filter(item => {
                const matchesSearch = item.task.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.boardName.toLowerCase().includes(searchQuery.toLowerCase());
                // Mock filter logic - since we don't have 'type' on tasks, we'll just show all for now or do rudimentary text matching if 'design' or 'dev' was in the name
                const matchesFilter = filter === 'all' ? true :
                    filter === 'design' ? item.boardName.toLowerCase().includes('design') || item.task.name.toLowerCase().includes('design') :
                        filter === 'dev' ? item.boardName.toLowerCase().includes('dev') || item.task.name.toLowerCase().includes('fix') :
                            true;
                return matchesSearch && matchesFilter;
            }),
            activeProjects: Object.values(projects).filter(p => p.tasks.length > 0 && p.name.toLowerCase().includes(searchQuery.toLowerCase())),
            todayTasks: today
        };
    }, [boards, searchQuery, filter]);


    // --- Handlers ---
    const handleTaskInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTaskName.trim()) {
            setIsModalOpen(true);
        }
    };

    const handleSelectBoard = (boardId: string) => {
        const newTask: Task = {
            id: `t-${Date.now()}`,
            name: newTaskName,
            priority: newTaskPriority as any,
            date: newTaskDate ? (newTaskDate === 'Today' ? new Date().toISOString().split('T')[0] : newTaskDate) : undefined,
            status: 'To Do',
            person: 'ME'
        };

        onUpdateTasks(boardId, newTask);

        // Reset state
        setNewTaskName('');
        setNewTaskPriority(null);
        setNewTaskDate(null);
        setIsModalOpen(false);
        setIsProjectActive(false);
    };

    const handleCreateBoard = (name: string) => {
        const newBoardId = Date.now().toString();
        const newTask: Task = {
            id: `t-${Date.now()}-1`,
            name: newTaskName,
            priority: newTaskPriority as any,
            date: newTaskDate ? (newTaskDate === 'Today' ? new Date().toISOString().split('T')[0] : newTaskDate) : undefined,
            status: 'To Do',
            person: 'ME'
        };

        const newBoard: Board = {
            id: newBoardId,
            name: name,
            tasks: [newTask],
            columns: [
                { id: 'name', title: 'Name', type: 'text' },
                { id: 'status', title: 'Status', type: 'status' },
                { id: 'dueDate', title: 'Due date', type: 'date' },
                { id: 'priority', title: 'Priority', type: 'priority' }
            ],
            workspaceId: boards[0]?.workspaceId, // Attach to first available workspace for now
            defaultView: 'overview',
            availableViews: ['overview', 'table']
        };

        onAddBoard(newBoard);

        // Reset state
        setNewTaskName('');
        setNewTaskPriority(null);
        setNewTaskDate(null);
        setIsModalOpen(false);
        setIsProjectActive(false);
    };

    const toggleMenu = (menu: 'priority' | 'date') => {
        setActiveMenu(prev => prev === menu ? 'none' : menu);
    };


    // --- Render Helpers ---

    const getPriorityColor = (priority?: string | null) => {
        const p = normalizePriority(priority);
        if (p === 'High') return 'text-red-500 bg-red-50 dark:bg-red-900/20';
        if (p === 'Medium') return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    };

    return (
        <div className="flex flex-col md:flex-row h-full w-full bg-[#f9fafa] dark:bg-[#21262c] text-[#121716] dark:text-[#e2e8f0] font-sans overflow-hidden antialiased transition-colors duration-300 relative" style={{ zoom: '80%' }}>

            <BoardSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                boards={boards}
                taskName={newTaskName}
                onSelectBoard={handleSelectBoard}
                onCreateBoard={handleCreateBoard}
            />

            {/* MAIN CONTENT (AGENDA) */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative border-r border-slate-200 dark:border-slate-700/50">

                {/* Header */}
                <header className="px-8 py-6 flex justify-between items-end bg-[#f9fafa]/90 dark:bg-[#21262c]/90 backdrop-blur-sm z-10 sticky top-0">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Wednesday, Oct 24</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Daily Agenda • {todayTasks.length} tasks scheduled</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all">Today</button>
                        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </header>

                {currentTab === 'timeline' ? (
                    <div className="flex-1 overflow-y-auto px-6 pb-20 relative custom-scrollbar animate-in fade-in duration-300">

                        {/* Current Time Indicator (Visual Mock) */}
                        <div className="absolute w-[calc(100%-3rem)] left-6 top-[380px] flex items-center z-20 pointer-events-none group">
                            <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 -ml-2">10:42</div>
                            <div className="h-[2px] w-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                        </div>

                        {/* 08:00 AM Slot (Empty) */}
                        <div className="flex group min-h-[100px]">
                            <div className="w-20 pr-4 text-right pt-2 text-xs font-semibold text-slate-400 font-mono">08:00 AM</div>
                            <div className="flex-1 border-t border-slate-100 dark:border-slate-800 relative pt-2 pb-4">
                                <div className="h-full w-full rounded-xl border-2 border-dashed border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="text-slate-300 text-sm font-medium">Drop task here</span>
                                </div>
                            </div>
                        </div>

                        {/* 09:00 AM Slot (Meeting Mock) */}
                        <div className="flex group min-h-[120px]">
                            <div className="w-20 pr-4 text-right pt-2 text-xs font-semibold text-slate-400 font-mono">09:00 AM</div>
                            <div className="flex-1 border-t border-slate-100 dark:border-slate-800 relative pt-1 pb-2">
                                <div className="h-full w-full bg-white dark:bg-[#2c333a] rounded-xl shadow-sm dark:shadow-none border-l-[6px] border-purple-500 p-4 flex gap-4 transition-transform hover:-translate-y-0.5 duration-200 cursor-pointer relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent opacity-50 pointer-events-none"></div>
                                    <div className="flex-1 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-200 mb-2 inline-block">MEETING</span>
                                            <GripVertical className="text-slate-300 text-[18px]" size={18} />
                                        </div>
                                        <h3 className="text-slate-800 dark:text-slate-100 font-bold text-lg leading-tight">Daily Standup Team Sync</h3>
                                        <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400 text-sm">
                                            <Video size={16} />
                                            <span>Zoom • 30m</span>
                                            <div className="flex -space-x-2 ml-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white dark:border-slate-700 flex items-center justify-center text-xs text-white">JD</div>
                                                <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-white dark:border-slate-700 flex items-center justify-center text-xs text-white">AS</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 10:00 AM Slot (Real Data Injection) */}
                        <div className="flex group min-h-[200px]">
                            <div className="w-20 pr-4 text-right pt-2 text-xs font-semibold text-slate-400 font-mono flex flex-col gap-[88px]">
                                <span>10:00 AM</span>
                                <span className="opacity-30">11:00 AM</span>
                            </div>
                            <div className="flex-1 border-t border-slate-100 dark:border-slate-800 relative pt-1 pb-2">
                                <div className="h-full w-full bg-white dark:bg-[#2c333a] rounded-xl shadow-sm dark:shadow-none border-l-[6px] border-orange-500 p-5 flex gap-4 transition-transform hover:-translate-y-0.5 duration-200 cursor-pointer relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/20 dark:to-transparent opacity-60 pointer-events-none"></div>
                                    <div className="flex-1 relative z-10 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200 mb-2 inline-block uppercase tracking-wider">High Priority</span>
                                            <GripVertical className="text-slate-300 text-[18px]" size={18} />
                                        </div>
                                        <h3 className="text-slate-900 dark:text-white font-extrabold text-xl leading-tight mt-1">Deep Work: UI Kit Design System</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-lg">Focus on component variations for the new mobile app. Finalize the button states and typography scale.</p>
                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-sm font-medium">
                                                    <Timer size={18} className="fill-current" /> 2h 00m
                                                </span>
                                                <span className="text-slate-300">|</span>
                                                <span className="text-slate-400 text-sm">Project: Atlas</span>
                                            </div>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-400 transition-colors">
                                                <CheckCircle2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 12:00 PM Break */}
                        <div className="flex group min-h-[100px]">
                            <div className="w-20 pr-4 text-right pt-2 text-xs font-semibold text-slate-400 font-mono">12:00 PM</div>
                            <div className="flex-1 border-t border-slate-100 dark:border-slate-800 relative pt-1 pb-2">
                                <div className="h-full w-full rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-slate-400">
                                    <Coffee size={18} />
                                    <span className="font-medium text-sm">Lunch Break</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <KanbanView />
                )}

                {/* Tab Switcher */}
                <div className="absolute bottom-6 left-6 z-[60] flex items-center gap-1 transition-all">
                    <button
                        onClick={() => setCurrentTab('timeline')}
                        className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 ${currentTab === 'timeline' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-105' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                    >
                        Timeline
                    </button>
                    <button
                        onClick={() => setCurrentTab('kanban')}
                        className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 ${currentTab === 'kanban' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-105' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                    >
                        Kanban
                    </button>
                </div>

            </main>

            {/* SIDEBAR (TASK BUCKET) */}
            <aside className="w-full lg:w-[420px] xl:w-[480px] bg-white dark:bg-[#1a1e23] flex flex-col h-full shadow-2xl lg:shadow-none z-20 border-l border-slate-200 dark:border-slate-700/50" style={{ zoom: '1.05' }}>

                {/* Search & Filter Header */}
                <div className="px-6 pt-6 pb-4 bg-white dark:bg-[#1a1e23]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Task Bucket</h2>
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">{inboxTasks.length + activeProjects.length} items</span>
                        </div>
                        <button className="text-blue-600 hover:bg-blue-600/10 p-2 rounded-full transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>

                    {/* Input */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 focus-within:bg-white dark:focus-within:bg-[#252a30] focus-within:shadow-md focus-within:border-blue-500/50 transition-all duration-200 relative group/input">
                        <div className="flex items-center gap-2 px-1">
                            <input
                                className="w-full bg-transparent border-none p-1.5 text-sm font-medium focus:outline-none placeholder-slate-400 text-slate-800 dark:text-slate-100"
                                placeholder="Add a new task..."
                                type="text"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                                onKeyDown={handleTaskInputKeyDown}
                            />
                        </div>
                        <div className="flex items-center justify-between px-1 mt-1">
                            <div className="flex gap-1.5 relative">
                                <button
                                    onClick={() => setIsProjectActive(!isProjectActive)}
                                    className={`flex items-center gap-1 p-1 pr-2 rounded transition-colors group/btn ${isProjectActive ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-500'}`}
                                    title="Project (#)"
                                >
                                    <Tag size={16} />
                                    <span className="text-[10px] font-bold transition-colors hidden sm:inline">Project</span>
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => toggleMenu('priority')}
                                        className={`flex items-center gap-1 p-1 pr-2 rounded transition-colors group/btn ${newTaskPriority ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-red-500'}`}
                                        title="Priority (!)"
                                    >
                                        <AlertCircle size={16} />
                                        <span className="text-[10px] font-bold transition-colors hidden sm:inline">{newTaskPriority || 'Priority'}</span>
                                    </button>
                                    {activeMenu === 'priority' && <PriorityMenu onSelect={setNewTaskPriority} onClose={() => setActiveMenu('none')} />}
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => toggleMenu('date')}
                                        className={`flex items-center gap-1 p-1 pr-2 rounded transition-colors group/btn ${newTaskDate ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-sky-500'}`}
                                        title="Date (@)"
                                    >
                                        <CalendarIcon size={16} />
                                        <span className="text-[10px] font-bold transition-colors hidden sm:inline">{newTaskDate || 'Date'}</span>
                                    </button>
                                    {activeMenu === 'date' && <DateMenu onSelect={setNewTaskDate} onClose={() => setActiveMenu('none')} />}
                                </div>
                            </div>
                            <button
                                onClick={() => newTaskName.trim() && setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 shadow-sm transition-colors flex items-center justify-center h-6 w-6"
                            >
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar pb-1">
                        <button onClick={() => setFilter('all')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors ${filter === 'all' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-600 hover:text-blue-600'}`}>All Tasks</button>
                        <button onClick={() => setFilter('design')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === 'design' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-600 hover:text-blue-600'}`}>Design</button>
                        <button onClick={() => setFilter('dev')} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === 'dev' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-600 hover:text-blue-600'}`}>Development</button>
                    </div>
                </div>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-800 w-full"></div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-slate-50/50 dark:bg-[#1a1e23]">

                    {/* INBOX SECTION */}
                    <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inbox</p>
                            <span className="text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded">{inboxTasks.length}</span>
                        </div>
                        <div className="space-y-3">
                            {/* Render Inbox Tasks */}
                            {inboxTasks.slice(0, 5).map(({ task, boardName, boardId }, idx) => (
                                <div key={task.id} className="group bg-white dark:bg-[#2c333a] p-4 rounded-xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700/50 hover:border-blue-600/30 cursor-grab active:cursor-grabbing transition-all flex gap-3 items-start select-none relative">
                                    <div className="mt-1 cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-blue-600 transition-colors">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="flex-1" onClick={() => onNavigateToBoard('board', boardId)}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                                                {normalizePriority(task.priority) || 'No Priority'}
                                            </span>
                                            {/* Mock duration for now */}
                                            <span className="text-xs text-slate-400">1h</span>
                                        </div>
                                        <h4 className="text-slate-800 dark:text-slate-200 font-bold text-sm leading-snug">{task.name}</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                <Hash size={10} /> {boardName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Static Examples from Design (hidden if we have inbox tasks to avoid clutter, or shown if list is short) */}
                            {inboxTasks.length === 0 && (
                                <>
                                    <div className="group bg-white dark:bg-[#2c333a] p-4 rounded-xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700/50 hover:border-blue-600/30 cursor-grab active:cursor-grabbing transition-all flex gap-3 items-start select-none relative">
                                        <div className="mt-1 cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-blue-600 transition-colors">
                                            <GripVertical size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">Design</span>
                                                <span className="text-xs text-slate-400">2h</span>
                                            </div>
                                            <h4 className="text-slate-800 dark:text-slate-200 font-bold text-sm leading-snug">Create High-Fidelity Mockups for Dashboard</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-orange-400 h-full w-2/3 rounded-full"></div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 whitespace-nowrap">66%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group bg-white dark:bg-[#2c333a] p-4 rounded-xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700/50 hover:border-blue-600/30 cursor-grab active:cursor-grabbing transition-all flex gap-3 items-start select-none relative">
                                        <div className="mt-1 cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-blue-600 transition-colors">
                                            <GripVertical size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-900/20 px-2 py-0.5 rounded">Dev</span>
                                                <span className="text-xs text-slate-400">1h 30m</span>
                                            </div>
                                            <h4 className="text-slate-800 dark:text-slate-200 font-bold text-sm leading-snug">Fix navigation bug on mobile safari</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Bug size={14} className="text-slate-400" />
                                                <span className="text-xs text-slate-500 dark:text-slate-400">Priority: High</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>

                    {/* ACTIVE PROJECTS ACCORDION */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                        <details className="group" open>
                            <summary className="flex items-center justify-between cursor-pointer list-none mb-4 px-1 select-none">
                                <div className="flex items-center gap-2">
                                    <ChevronRight size={14} className="text-slate-400 group-open:rotate-90 transition-transform" />
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Projects</h3>
                                </div>
                                <button className="text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[10px] font-bold uppercase hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded transition-colors">
                                    <Plus size={14} /> New
                                </button>
                            </summary>
                            <div className="space-y-2 pl-2 border-l-2 border-slate-200 dark:border-slate-700 ml-1.5 pb-4">

                                {activeProjects.length > 0 ? (
                                    activeProjects.map((project) => (
                                        <details key={project.id} className="group/project open:bg-slate-100/50 dark:open:bg-slate-800/30 rounded-lg transition-colors">
                                            <summary className="flex items-center justify-between p-2 rounded hover:bg-white dark:hover:bg-slate-800 cursor-pointer list-none transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-500/20"></span>
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{project.name}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-600">{project.tasks.length} tasks</span>
                                            </summary>
                                            <div className="pl-7 pr-2 py-2 space-y-2">
                                                {project.tasks.map(task => (
                                                    <div key={task.id} className="bg-white dark:bg-[#2c333a] p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-2 cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-colors">
                                                        <GripVertical size={16} className="text-slate-300 mt-0.5" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{task.name}</p>
                                                                <span className="text-[10px] text-slate-400">45m</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    ))
                                ) : (
                                    <div className="text-xs text-slate-400 italic pl-4">No active projects</div>
                                )}

                            </div>
                        </details>
                    </div>

                </div>
            </aside>

            {/* FAB (Floating Action Button) */}
            <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-4 group">
                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible translate-y-4 flex flex-col items-end gap-3 transition-all duration-300">
                    <button className="flex items-center gap-3 pl-4 pr-2 py-2 bg-white dark:bg-[#2c333a] rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">New Goal</span>
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm">
                            <Flag size={18} />
                        </div>
                    </button>
                    <button className="flex items-center gap-3 pl-4 pr-2 py-2 bg-white dark:bg-[#2c333a] rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">New Project</span>
                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-sm">
                            <Briefcase size={18} />
                        </div>
                    </button>
                    <button className="flex items-center gap-3 pl-4 pr-2 py-2 bg-white dark:bg-[#2c333a] rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">New Task</span>
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm">
                            <CheckCircle2 size={18} />
                        </div>
                    </button>
                </div>
                <button className="h-16 w-16 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group-hover:rotate-45">
                    <Plus size={32} />
                </button>
            </div>

        </div>
    );
};
