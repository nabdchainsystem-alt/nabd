import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useAuth } from '../../../auth-adapter';
import { boardService } from '../../../services/boardService';
import { talkService } from '../../../services/talkService';
import {
    Plus,
    CheckSquare,
    Bell,
    Folder,
    CircleNotch,
    File,
    Trash,
    ArrowSquareOut,
    X,
    Clock,
    Check,
    Upload
} from 'phosphor-react';

interface ConversationTask {
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: string;
    sentToBoard?: {
        boardId: string;
        boardName: string;
    };
}

interface ConversationReminder {
    id: string;
    text: string;
    dueDate: string;
    completed: boolean;
    createdAt: string;
}

interface ConversationFile {
    id: string;
    name: string;
    type: string;
    url?: string;
    taskId?: string;
    createdAt: string;
}

interface Board {
    id: string;
    name: string;
}

interface ConversationSidebarProps {
    conversationId: string | null;
    onNavigate?: (view: string, boardId?: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
    conversationId,
    onNavigate
}) => {
    const { t, activeWorkspaceId } = useAppContext();
    const { getToken } = useAuth();

    // State for conversation data
    const [tasks, setTasks] = useState<ConversationTask[]>([]);
    const [reminders, setReminders] = useState<ConversationReminder[]>([]);
    const [files, setFiles] = useState<ConversationFile[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // UI State
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddReminder, setShowAddReminder] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newReminderText, setNewReminderText] = useState('');
    const [newReminderDate, setNewReminderDate] = useState('');

    // Send to board modal
    const [showSendToBoardModal, setShowSendToBoardModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ConversationTask | null>(null);
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoardId, setSelectedBoardId] = useState<string>('');
    const [isSending, setIsSending] = useState(false);
    const [loadingBoards, setLoadingBoards] = useState(false);

    // File Upload / Assign
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [assigningTaskId, setAssigningTaskId] = useState<string | null>(null);

    // Load conversation data from backend
    const loadConversationData = useCallback(async () => {
        if (!conversationId) {
            setTasks([]);
            setReminders([]);
            setFiles([]);
            return;
        }

        try {
            const token = await getToken();
            if (!token) return;

            const data = await talkService.getConversationData(token, conversationId);
            setTasks(data.tasks);
            setReminders(data.reminders);
            setFiles(data.files);
        } catch (error) {
            console.error('Failed to load conversation data:', error);
        }
    }, [conversationId, getToken]);

    // Initial load and polling
    useEffect(() => {
        const init = async () => {
            setIsLoadingData(true);
            await loadConversationData();
            setIsLoadingData(false);
        };
        init();

        const interval = setInterval(loadConversationData, 3000);
        return () => clearInterval(interval);
    }, [loadConversationData]);

    // Load boards for send to board modal
    const loadBoards = useCallback(async () => {
        setLoadingBoards(true);
        try {
            const token = await getToken();
            if (!token) return;

            const boardsList = await boardService.getAllBoards(token, activeWorkspaceId || undefined);
            setBoards(boardsList);
        } catch (error) {
            console.error('Failed to load boards:', error);
        } finally {
            setLoadingBoards(false);
        }
    }, [getToken, activeWorkspaceId]);

    // Add new task
    const handleAddTask = async () => {
        if (!newTaskName.trim() || !conversationId) return;

        try {
            const token = await getToken();
            if (!token) return;

            const task = await talkService.createTask(token, conversationId, newTaskName.trim());
            setTasks(prev => [...prev, task]);
            setNewTaskName('');
            setShowAddTask(false);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    // Add new reminder
    const handleAddReminder = async () => {
        if (!newReminderText.trim() || !conversationId) return;

        try {
            const token = await getToken();
            if (!token) return;

            const reminder = await talkService.createReminder(
                token,
                conversationId,
                newReminderText.trim(),
                newReminderDate || new Date().toISOString()
            );
            setReminders(prev => [...prev, reminder]);
            setNewReminderText('');
            setNewReminderDate('');
            setShowAddReminder(false);
        } catch (error) {
            console.error('Failed to create reminder:', error);
        }
    };

    // Toggle task status
    const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
        try {
            const token = await getToken();
            if (!token) return;

            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
            const updated = await talkService.updateTask(token, taskId, { status: newStatus });
            setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    // Toggle reminder completed
    const toggleReminderCompleted = async (reminderId: string, currentCompleted: boolean) => {
        try {
            const token = await getToken();
            if (!token) return;

            const updated = await talkService.updateReminder(token, reminderId, { completed: !currentCompleted });
            setReminders(prev => prev.map(r => r.id === reminderId ? updated : r));
        } catch (error) {
            console.error('Failed to toggle reminder:', error);
        }
    };

    // Delete task
    const deleteTask = async (taskId: string) => {
        try {
            const token = await getToken();
            if (!token) return;

            await talkService.deleteTask(token, taskId);
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    // Delete reminder
    const deleteReminder = async (reminderId: string) => {
        try {
            const token = await getToken();
            if (!token) return;

            await talkService.deleteReminder(token, reminderId);
            setReminders(prev => prev.filter(r => r.id !== reminderId));
        } catch (error) {
            console.error('Failed to delete reminder:', error);
        }
    };

    // Open send to board modal
    const openSendToBoardModal = (task: ConversationTask) => {
        setSelectedTask(task);
        setShowSendToBoardModal(true);
        loadBoards();
    };

    // Send task to board
    const handleSendToBoard = async () => {
        if (!selectedTask || !selectedBoardId) return;

        setIsSending(true);
        try {
            const token = await getToken();
            if (!token) return;

            const board = boards.find(b => b.id === selectedBoardId);
            if (!board) return;

            const boardData = await boardService.getBoard(token, selectedBoardId);
            const existingTasks = boardData.tasks ?
                (typeof boardData.tasks === 'string' ? JSON.parse(boardData.tasks) : boardData.tasks) : [];

            const newBoardTask = {
                id: `task-${Date.now()}`,
                name: selectedTask.name,
                status: 'To Do',
                createdAt: new Date().toISOString()
            };

            await boardService.updateBoard(token, selectedBoardId, {
                tasks: JSON.stringify([...existingTasks, newBoardTask])
            });

            // Update on backend
            const updated = await talkService.updateTask(token, selectedTask.id, {
                boardId: selectedBoardId,
                boardName: board.name
            });
            setTasks(prev => prev.map(t => t.id === selectedTask.id ? updated : t));

            setShowSendToBoardModal(false);
            setSelectedTask(null);
            setSelectedBoardId('');
        } catch (error) {
            console.error('Failed to send task to board:', error);
        } finally {
            setIsSending(false);
        }
    };

    // File Upload
    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>, taskId?: string) => {
        const file = e.target.files?.[0];
        if (!file || !conversationId) return;

        try {
            const token = await getToken();
            if (!token) return;

            // In a real app, we'd upload to S3/Cloudinary first.
            // For now, we simulate by creating a file record.
            const newFile = await talkService.createFile(token, conversationId, {
                name: file.name,
                type: file.type,
                size: file.size,
                taskId: taskId || assigningTaskId || undefined
            });

            setFiles(prev => [...prev, newFile]);
            setAssigningTaskId(null);
        } catch (error) {
            console.error('Failed to upload file:', error);
        }
    };

    // Format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();

    if (!conversationId) {
        return (
            <aside className="w-72 border-l flex-col h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 flex shrink-0">
                <div className="flex-1 flex items-center justify-center text-center p-6 text-gray-400">
                    <div>
                        <CheckSquare size={36} className="mx-auto mb-3" />
                        <p className="text-sm">Select a conversation to see tasks & reminders</p>
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <>
            <aside className="w-72 border-l flex-col h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 flex shrink-0 transition-all">
                {/* Tasks Section */}
                <div className="flex-1 border-b flex flex-col min-h-0 border-gray-200 dark:border-gray-800">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center">
                            <CheckSquare className="mr-2" size={16} />
                            Tasks
                        </h3>
                        <button onClick={() => setShowAddTask(true)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="p-3 space-y-1 overflow-y-auto flex-1">
                        {showAddTask && (
                            <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg mb-2">
                                <input
                                    type="text"
                                    value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                    placeholder="Task name..."
                                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded focus:outline-none"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => setShowAddTask(false)} className="flex-1 py-1.5 text-xs text-gray-500">Cancel</button>
                                    <button onClick={handleAddTask} disabled={!newTaskName.trim()} className="flex-1 py-1.5 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded">Add</button>
                                </div>
                            </div>
                        )}

                        {tasks.length === 0 && !showAddTask ? (
                            <div className="text-gray-400 text-center py-6">
                                <CheckSquare size={28} className="mx-auto mb-2" />
                                <p className="text-xs">No tasks</p>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className="group p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <div className="flex items-start gap-2">
                                        <button
                                            onClick={() => toggleTaskStatus(task.id, task.status)}
                                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${task.status === 'completed' ? 'bg-gray-900 dark:bg-white' : 'border-gray-300'
                                                }`}
                                        >
                                            {task.status === 'completed' && <Check size={10} className="text-white dark:text-gray-900" weight="bold" />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm truncate ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {task.name}
                                            </p>
                                            {task.sentToBoard && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><ArrowSquareOut size={10} /> {task.boardName}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                            <button
                                                onClick={() => {
                                                    setAssigningTaskId(task.id);
                                                    fileInputRef.current?.click();
                                                }}
                                                className="p-1 text-gray-400 hover:text-gray-700"
                                                title="Assign File"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            {!task.sentToBoard && task.status !== 'completed' && (
                                                <button onClick={() => openSendToBoardModal(task)} className="p-1 text-gray-400 hover:text-gray-700"><ArrowSquareOut size={14} /></button>
                                            )}
                                            <button onClick={() => deleteTask(task.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash size={14} /></button>
                                        </div>
                                    </div>
                                    {/* Related Files */}
                                    {files.filter(f => f.taskId === task.id).map(file => (
                                        <div key={file.id} className="ml-6 mt-1 flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/80 px-2 py-1 rounded">
                                            <File size={10} />
                                            <span className="truncate">{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Reminders Section */}
                <div className="flex-1 border-b flex flex-col min-h-0 border-gray-200 dark:border-gray-800">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center">
                            <Bell className="mr-2" size={16} />
                            Reminders
                        </h3>
                        <button onClick={() => setShowAddReminder(true)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="p-3 space-y-1 overflow-y-auto flex-1">
                        {showAddReminder && (
                            <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg mb-2">
                                <input
                                    type="text"
                                    value={newReminderText}
                                    onChange={(e) => setNewReminderText(e.target.value)}
                                    placeholder="Reminder..."
                                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded focus:outline-none mb-2"
                                />
                                <input
                                    type="datetime-local"
                                    value={newReminderDate}
                                    onChange={(e) => setNewReminderDate(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border rounded focus:outline-none"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => setShowAddReminder(false)} className="flex-1 py-1.5 text-xs text-gray-500">Cancel</button>
                                    <button onClick={handleAddReminder} disabled={!newReminderText.trim()} className="flex-1 py-1.5 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded">Add</button>
                                </div>
                            </div>
                        )}
                        {reminders.length === 0 && !showAddReminder ? (
                            <div className="text-gray-400 text-center py-6">
                                <Bell size={28} className="mx-auto mb-2" />
                                <p className="text-xs">No reminders</p>
                            </div>
                        ) : (
                            reminders.map(reminder => (
                                <div key={reminder.id} className="group p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <div className="flex items-start gap-2">
                                        <button
                                            onClick={() => toggleReminderCompleted(reminder.id, reminder.completed)}
                                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${reminder.completed ? 'bg-gray-900 dark:bg-white' : 'border-gray-300'
                                                }`}
                                        >
                                            {reminder.completed && <Check size={10} className="text-white dark:text-gray-900" weight="bold" />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm truncate ${reminder.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {reminder.text}
                                            </p>
                                            <p className={`text-xs flex items-center gap-1 mt-0.5 ${isOverdue(reminder.dueDate) && !reminder.completed ? 'text-red-500' : 'text-gray-400'}`}>
                                                <Clock size={10} /> {formatDate(reminder.dueDate)}
                                            </p>
                                        </div>
                                        <button onClick={() => deleteReminder(reminder.id)} className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"><Trash size={14} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Files Section */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center">
                            <Folder className="mr-2" size={16} />
                            Files
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                            >
                                <Upload size={12} weight="bold" />
                                Import
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileImport}
                            />
                        </div>
                    </div>
                    <div className="p-3 space-y-1 overflow-y-auto flex-1">
                        {files.filter(f => !f.taskId).length === 0 ? (
                            <div className="text-gray-400 text-center py-6">
                                <File size={28} className="mx-auto mb-2" />
                                <p className="text-xs">No files</p>
                            </div>
                        ) : (
                            files.filter(f => !f.taskId).map(file => (
                                <div key={file.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                                    <File size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </aside>

            {/* Send to Board Modal */}
            {showSendToBoardModal && selectedTask && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    {/* Clear Backdrop as requested (removed bg-black/40 and backdrop-blur) */}
                    <div className="fixed inset-0" onClick={() => setShowSendToBoardModal(false)} />

                    <div className="bg-white dark:bg-monday-dark-surface p-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-sm w-full m-4 border border-gray-200 dark:border-monday-dark-border relative z-10 scale-in-center">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">Send to Board</h3>
                            <button onClick={() => setShowSendToBoardModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 dark:bg-monday-dark-bg rounded-lg border border-gray-100 dark:border-monday-dark-border">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Task</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedTask.name}</p>
                        </div>

                        <p className="text-xs font-semibold text-gray-500 mb-2">Select board:</p>

                        {loadingBoards ? (
                            <div className="flex items-center justify-center py-6"><CircleNotch size={20} className="animate-spin text-primary" /></div>
                        ) : boards.length === 0 ? (
                            <div className="text-center py-4 text-sm text-gray-500">No boards available</div>
                        ) : (
                            <div className="max-h-40 overflow-y-auto mb-4 space-y-1 custom-scrollbar">
                                {boards.map(board => (
                                    <button
                                        key={board.id}
                                        onClick={() => setSelectedBoardId(board.id)}
                                        className={`w-full flex items-center p-2.5 rounded-lg transition-all text-left text-sm ${selectedBoardId === board.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full mr-2.5 ${selectedBoardId === board.id ? 'bg-primary' : 'bg-gray-300'}`} />
                                        {board.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-monday-dark-border">
                            <button
                                onClick={() => setShowSendToBoardModal(false)}
                                className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-transparent"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendToBoard}
                                disabled={!selectedBoardId || isSending}
                                className="flex-1 py-2.5 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-primary/20"
                            >
                                {isSending ? <CircleNotch size={14} className="animate-spin" /> : <><ArrowSquareOut size={16} weight="bold" /> Send</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .scale-in-center { animation: scale-in-center 0.15s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
                @keyframes scale-in-center { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
            `}</style>
        </>
    );
};

export default ConversationSidebar;
