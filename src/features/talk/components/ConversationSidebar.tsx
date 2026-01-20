import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useAuth } from '../../../auth-adapter';
import { boardService } from '../../../services/boardService';
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
    Check
} from 'phosphor-react';
import { getStorageItem, setStorageItem } from '../../../utils/storage';

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
    createdAt: string;
}

interface ConversationData {
    tasks: ConversationTask[];
    reminders: ConversationReminder[];
    files: ConversationFile[];
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

    // Storage key for conversation data
    const getStorageKey = (convId: string) => `talk-conversation-${convId}`;

    // Load conversation data
    const loadConversationData = useCallback(() => {
        if (!conversationId) {
            setTasks([]);
            setReminders([]);
            setFiles([]);
            return;
        }

        const data = getStorageItem<ConversationData>(getStorageKey(conversationId), {
            tasks: [],
            reminders: [],
            files: []
        });

        setTasks(data.tasks);
        setReminders(data.reminders);
        setFiles(data.files);
    }, [conversationId]);

    // Save conversation data
    const saveConversationData = useCallback((
        newTasks: ConversationTask[],
        newReminders: ConversationReminder[],
        newFiles: ConversationFile[]
    ) => {
        if (!conversationId) return;

        setStorageItem(getStorageKey(conversationId), {
            tasks: newTasks,
            reminders: newReminders,
            files: newFiles
        });
    }, [conversationId]);

    // Load data when conversation changes
    useEffect(() => {
        loadConversationData();
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
    const handleAddTask = () => {
        if (!newTaskName.trim() || !conversationId) return;

        const newTask: ConversationTask = {
            id: `task-${Date.now()}`,
            name: newTaskName.trim(),
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        saveConversationData(updatedTasks, reminders, files);
        setNewTaskName('');
        setShowAddTask(false);
    };

    // Add new reminder
    const handleAddReminder = () => {
        if (!newReminderText.trim() || !conversationId) return;

        const newReminder: ConversationReminder = {
            id: `reminder-${Date.now()}`,
            text: newReminderText.trim(),
            dueDate: newReminderDate || new Date().toISOString(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        const updatedReminders = [...reminders, newReminder];
        setReminders(updatedReminders);
        saveConversationData(tasks, updatedReminders, files);
        setNewReminderText('');
        setNewReminderDate('');
        setShowAddReminder(false);
    };

    // Toggle task status
    const toggleTaskStatus = (taskId: string) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                return { ...task, status: newStatus as ConversationTask['status'] };
            }
            return task;
        });
        setTasks(updatedTasks);
        saveConversationData(updatedTasks, reminders, files);
    };

    // Toggle reminder completed
    const toggleReminderCompleted = (reminderId: string) => {
        const updatedReminders = reminders.map(reminder => {
            if (reminder.id === reminderId) {
                return { ...reminder, completed: !reminder.completed };
            }
            return reminder;
        });
        setReminders(updatedReminders);
        saveConversationData(tasks, updatedReminders, files);
    };

    // Delete task
    const deleteTask = (taskId: string) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        saveConversationData(updatedTasks, reminders, files);
    };

    // Delete reminder
    const deleteReminder = (reminderId: string) => {
        const updatedReminders = reminders.filter(reminder => reminder.id !== reminderId);
        setReminders(updatedReminders);
        saveConversationData(tasks, updatedReminders, files);
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

            // Get the board to update
            const board = boards.find(b => b.id === selectedBoardId);
            if (!board) return;

            // Add task to the board
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

            // Update local task to mark as sent
            const updatedTasks = tasks.map(task => {
                if (task.id === selectedTask.id) {
                    return {
                        ...task,
                        sentToBoard: {
                            boardId: selectedBoardId,
                            boardName: board.name
                        }
                    };
                }
                return task;
            });
            setTasks(updatedTasks);
            saveConversationData(updatedTasks, reminders, files);

            setShowSendToBoardModal(false);
            setSelectedTask(null);
            setSelectedBoardId('');
        } catch (error) {
            console.error('Failed to send task to board:', error);
        } finally {
            setIsSending(false);
        }
    };

    // Format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    // Check if reminder is overdue
    const isOverdue = (dateStr: string) => {
        return new Date(dateStr) < new Date();
    };

    if (!conversationId) {
        return (
            <aside className="w-72 border-l flex-col h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 flex shrink-0">
                <div className="flex-1 flex items-center justify-center text-center p-6">
                    <div className="text-gray-400">
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
                        <button
                            onClick={() => setShowAddTask(true)}
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title="Add Task"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="p-3 space-y-1 overflow-y-auto conversation-sidebar-scrollbar flex-1">
                        {/* Add Task Input */}
                        {showAddTask && (
                            <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg mb-2">
                                <input
                                    type="text"
                                    value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                    placeholder="Task name..."
                                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-gray-400"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddTask();
                                        if (e.key === 'Escape') setShowAddTask(false);
                                    }}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => setShowAddTask(false)}
                                        className="flex-1 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddTask}
                                        disabled={!newTaskName.trim()}
                                        className="flex-1 py-1.5 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {tasks.length === 0 && !showAddTask ? (
                            <div className="text-gray-400 text-center py-6">
                                <CheckSquare size={28} className="mx-auto mb-2" />
                                <p className="text-xs">No tasks</p>
                                <button
                                    onClick={() => setShowAddTask(true)}
                                    className="mt-2 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                                >
                                    Add task
                                </button>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div
                                    key={task.id}
                                    className="group p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-start gap-2">
                                        <button
                                            onClick={() => toggleTaskStatus(task.id)}
                                            className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                                task.status === 'completed'
                                                    ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white'
                                                    : 'border-gray-300 hover:border-gray-500'
                                            }`}
                                        >
                                            {task.status === 'completed' && (
                                                <Check size={10} className="text-white dark:text-gray-900" weight="bold" />
                                            )}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm truncate ${
                                                task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                                {task.name}
                                            </p>
                                            {task.sentToBoard && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <ArrowSquareOut size={10} />
                                                    {task.sentToBoard.boardName}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!task.sentToBoard && task.status !== 'completed' && (
                                                <button
                                                    onClick={() => openSendToBoardModal(task)}
                                                    className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                                    title="Send to Board"
                                                >
                                                    <ArrowSquareOut size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        </div>
                                    </div>
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
                        <button
                            onClick={() => setShowAddReminder(true)}
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title="Add Reminder"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="p-3 space-y-1 overflow-y-auto conversation-sidebar-scrollbar flex-1">
                        {/* Add Reminder Input */}
                        {showAddReminder && (
                            <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg mb-2">
                                <input
                                    type="text"
                                    value={newReminderText}
                                    onChange={(e) => setNewReminderText(e.target.value)}
                                    placeholder="Reminder..."
                                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-gray-400 mb-2"
                                    autoFocus
                                />
                                <input
                                    type="datetime-local"
                                    value={newReminderDate}
                                    onChange={(e) => setNewReminderDate(e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-gray-400"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => setShowAddReminder(false)}
                                        className="flex-1 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddReminder}
                                        disabled={!newReminderText.trim()}
                                        className="flex-1 py-1.5 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {reminders.length === 0 && !showAddReminder ? (
                            <div className="text-gray-400 text-center py-6">
                                <Bell size={28} className="mx-auto mb-2" />
                                <p className="text-xs">No reminders</p>
                                <button
                                    onClick={() => setShowAddReminder(true)}
                                    className="mt-2 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                                >
                                    Add reminder
                                </button>
                            </div>
                        ) : (
                            reminders.map(reminder => (
                                <div
                                    key={reminder.id}
                                    className="group p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-start gap-2">
                                        <button
                                            onClick={() => toggleReminderCompleted(reminder.id)}
                                            className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                                reminder.completed
                                                    ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white'
                                                    : 'border-gray-300 hover:border-gray-500'
                                            }`}
                                        >
                                            {reminder.completed && (
                                                <Check size={10} className="text-white dark:text-gray-900" weight="bold" />
                                            )}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm truncate ${
                                                reminder.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'
                                            }`}>
                                                {reminder.text}
                                            </p>
                                            <p className={`text-xs flex items-center gap-1 mt-0.5 ${
                                                isOverdue(reminder.dueDate) && !reminder.completed
                                                    ? 'text-red-500'
                                                    : 'text-gray-400'
                                            }`}>
                                                <Clock size={10} />
                                                {formatDate(reminder.dueDate)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteReminder(reminder.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <Trash size={14} />
                                        </button>
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
                        <button
                            onClick={() => onNavigate?.('vault')}
                            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="p-3 space-y-1 overflow-y-auto conversation-sidebar-scrollbar flex-1 flex flex-col items-center justify-center text-center">
                        {files.length === 0 ? (
                            <div className="text-gray-400">
                                <File size={28} className="mx-auto mb-2" />
                                <p className="text-xs">No files</p>
                                <button
                                    onClick={() => onNavigate?.('vault')}
                                    className="mt-2 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                                >
                                    Open Vault
                                </button>
                            </div>
                        ) : (
                            <div className="w-full space-y-1">
                                {files.map(file => (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    >
                                        <File size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Send to Board Modal */}
            {showSendToBoardModal && selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-xl max-w-sm w-full m-4 border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Send to Board</h3>
                            <button
                                onClick={() => {
                                    setShowSendToBoardModal(false);
                                    setSelectedTask(null);
                                    setSelectedBoardId('');
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 mb-1">Task</p>
                            <p className="text-sm text-gray-900 dark:text-white">{selectedTask.name}</p>
                        </div>

                        <p className="text-xs text-gray-500 mb-2">
                            Select board:
                        </p>

                        {loadingBoards ? (
                            <div className="flex items-center justify-center py-6">
                                <CircleNotch size={20} className="animate-spin text-gray-400" />
                            </div>
                        ) : boards.length === 0 ? (
                            <div className="text-center py-6 text-gray-500">
                                <p className="text-sm">No boards available.</p>
                                <button
                                    onClick={() => onNavigate?.('home')}
                                    className="mt-2 text-sm text-gray-700 dark:text-gray-300 underline hover:no-underline"
                                >
                                    Create a board first
                                </button>
                            </div>
                        ) : (
                            <div className="max-h-40 overflow-y-auto mb-4 space-y-1">
                                {boards.map(board => (
                                    <button
                                        key={board.id}
                                        onClick={() => setSelectedBoardId(board.id)}
                                        className={`w-full flex items-center p-2.5 rounded transition-colors text-left text-sm ${
                                            selectedBoardId === board.id
                                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <div className={`w-2 h-2 rounded-sm mr-2.5 ${
                                            selectedBoardId === board.id ? 'bg-white dark:bg-gray-900' : 'bg-gray-400'
                                        }`} />
                                        {board.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => {
                                    setShowSendToBoardModal(false);
                                    setSelectedTask(null);
                                    setSelectedBoardId('');
                                }}
                                className="flex-1 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendToBoard}
                                disabled={!selectedBoardId || isSending}
                                className="flex-1 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                            >
                                {isSending ? (
                                    <>
                                        <CircleNotch size={14} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <ArrowSquareOut size={14} />
                                        Send
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .conversation-sidebar-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .conversation-sidebar-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .conversation-sidebar-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #D1D5DB;
                    border-radius: 20px;
                }
                .dark .conversation-sidebar-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4B5563;
                }
            `}</style>
        </>
    );
};

export default ConversationSidebar;
