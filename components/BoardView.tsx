import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronDown,
    MessageCircle,
    UserCircle,
    MoreHorizontal,
    Table,
    Kanban,
    List,
    FileText,
    MessageSquare,
    CheckSquare,
    Plus as PlusIcon,
    GanttChart,
    PieChart,
    Calendar,
    Image as ImageIcon,
    FileEdit,
    Search,
    Filter,
    Layout,
    ArrowLeftToLine,
    Pin,
    Pencil,
    Copy,
    Share2,
    Unlock,
    Trash2,
    ArrowUpDown
} from 'lucide-react';
import { Board, BoardViewType } from '../types';
import ListBoard from '../src/features/board/views/ListBoard/ListBoard';
import Lists from '../src/features/board/views/List/Lists';
import RoomTable from '../src/features/board/views/Table/RoomTable';
import DiscussionPage from '../src/features/discussion/DiscussionPage';
import KanbanBoard from '../src/features/board/views/Kanban/KanbanBoard';
import { DocView } from '../src/features/board/views/Doc/DocView';


import CalendarView from '../src/features/board/views/Calendar/CalendarView';
import { PortalPopup } from '../src/components/ui/PortalPopup';

interface BoardViewProps {
    board: Board;
    onUpdateBoard?: (boardId: string, updates: Partial<Board>) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ board, onUpdateBoard }) => {
    const storageKey = `board-active-view-${board.id}`;

    const [activeView, setActiveView] = useState<BoardViewType>(() => {
        const saved = localStorage.getItem(storageKey);
        // Validate if saved view is still available
        if (saved && board.availableViews && board.availableViews.includes(saved as BoardViewType)) {
            return saved as BoardViewType;
        }
        return board.defaultView || 'kanban';
    });
    const [showAddViewMenu, setShowAddViewMenu] = useState(false);
    const [showInfoMenu, setShowInfoMenu] = useState(false);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; viewId: BoardViewType } | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const addViewRef = useRef<HTMLButtonElement>(null);

    // Track previous board ID to distinguish between board switch and update
    const prevBoardIdRef = useRef(board.id);

    // Persist active view
    useEffect(() => {
        if (activeView) {
            localStorage.setItem(storageKey, activeView);
        }
    }, [activeView, storageKey]);

    // Sync active view when board changes
    React.useEffect(() => {
        // If board ID changed, it means we switched boards -> reset to saved or default
        if (board.id !== prevBoardIdRef.current) {
            const newStorageKey = `board-active-view-${board.id}`;
            const saved = localStorage.getItem(newStorageKey);

            if (saved && board.availableViews && board.availableViews.includes(saved as BoardViewType)) {
                setActiveView(saved as BoardViewType);
            } else if (board.defaultView && board.availableViews?.includes(board.defaultView)) {
                setActiveView(board.defaultView);
            } else if (board.availableViews && board.availableViews.length > 0) {
                setActiveView(board.availableViews[0]);
            } else {
                setActiveView('kanban');
            }
            prevBoardIdRef.current = board.id;
        }
        // If board ID is same, check if current active view is still valid
        // This allows us to manually switch views without it being reset by prop updates
        else if (board.availableViews && !board.availableViews.includes(activeView)) {
            // Active view was deleted or removed, switch to default
            if (board.defaultView && board.availableViews.includes(board.defaultView)) {
                setActiveView(board.defaultView);
            } else if (board.availableViews.length > 0) {
                setActiveView(board.availableViews[0]);
            } else {
                setActiveView('kanban');
            }
        }
    }, [board.id, board.defaultView, board.availableViews, activeView]);

    // Local state for editing to avoid jumpy UI
    const [editName, setEditName] = useState(board.name);
    const [editDescription, setEditDescription] = useState(board.description || '');

    // Sync local state when board prop changes (e.g. switching boards)
    React.useEffect(() => {
        setEditName(board.name);
        setEditDescription(board.description || '');
    }, [board.id, board.name, board.description]);

    // Close context menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenu(null);
            }
        };

        if (contextMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [contextMenu]);

    const handleSave = () => {
        if (onUpdateBoard) {
            onUpdateBoard(board.id, {
                name: editName,
                description: editDescription
            });
        }
    };

    const isViewAvailable = (view: BoardViewType) => {
        if (!board.availableViews || board.availableViews.length === 0) return true;
        return board.availableViews.includes(view);
    };

    const handleContextMenu = (e: React.MouseEvent, viewId: BoardViewType) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            viewId
        });
    };

    const handleDeleteView = () => {
        if (!contextMenu || !onUpdateBoard) return;

        const viewToDelete = contextMenu.viewId;
        const currentViews = board.availableViews || [];
        const newViews = currentViews.filter(v => v !== viewToDelete);

        onUpdateBoard(board.id, {
            availableViews: newViews
        });

        // If we deleted the active view, switch to the first available one
        if (activeView === viewToDelete && newViews.length > 0) {
            setActiveView(newViews[0]);
        }

        setContextMenu(null);
    };

    const VIEW_OPTIONS = [
        { label: 'Table', icon: Table, id: 'table' },
        { label: 'Gantt', icon: GanttChart, id: 'gantt' },
        { label: 'Chart', icon: PieChart, id: 'chart' },
        { label: 'Calendar', icon: Calendar, id: 'calendar' },
        { label: 'Kanban', icon: Kanban, id: 'kanban' },
        { label: 'Doc', icon: FileText, id: 'doc' },
        { label: 'File gallery', icon: ImageIcon, id: 'file_gallery' },
        { label: 'Form', icon: FileEdit, id: 'form' },


        { label: 'List', icon: List, id: 'list' },
        { label: 'List Board', icon: CheckSquare, id: 'listboard' },
        { label: 'Discussion', icon: MessageSquare, id: 'discussion' }
    ];

    const renderView = () => {
        switch (activeView) {
            case 'kanban':
                return <KanbanBoard key={board.id} boardId={board.id} />;
            case 'table':
                return <RoomTable key={board.id} roomId={board.id} viewId="table-main" />;
            case 'discussion':
                return <DiscussionPage key={board.id} />;
            case 'doc':
                return <DocView key={board.id} roomId={board.id} />;


            case 'list':
                return <Lists key={board.id} roomId={board.id} viewId="list-main" />;
            case 'listboard':
                return <ListBoard key={board.id} storageKey={`board-${board.id}`} />;
            case 'calendar':
                return <CalendarView key={board.id} roomId={board.id} />;
            default:
                return <KanbanBoard key={board.id} boardId={board.id} />;
        }
    };

    // Ensure default views are available if availableViews is empty
    const availableViews = board.availableViews && board.availableViews.length > 0
        ? board.availableViews
        : ['table', 'kanban'] as BoardViewType[];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
            {/* Top Header Section */}
            <div className="pl-[24px] pr-[20px] pt-4 pb-0 flex-shrink-0 bg-white dark:bg-[#1a1d24]">
                {/* Title and Top Actions */}
                <div className="flex items-center justify-between mb-1 gap-4">
                    {/* Left: Title */}
                    <div className="relative">
                        <div
                            className="flex items-center gap-1 group cursor-pointer min-w-0"
                            onClick={() => setShowInfoMenu(!showInfoMenu)}
                        >
                            <h1 className="text-[24px] font-[450] text-gray-800 dark:text-white truncate">{board.name}</h1>
                            <ChevronDown size={20} className="text-gray-400 group-hover:text-gray-600" />
                        </div>

                        {/* Board Info / Rename Popover */}
                        {showInfoMenu && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-100">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500">Board Settings</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onBlur={handleSave}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                placeholder="Board Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                            <textarea
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                onBlur={handleSave}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[80px]"
                                                placeholder="Add a description..."
                                            />
                                        </div>
                                    </div>
                                    {/* Backdrop to close when clicking outside */}
                                    <div
                                        className="fixed inset-0 z-[-1]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowInfoMenu(false);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 md:gap-3">
                        <button className="hover:bg-gray-100 p-2 rounded text-gray-500"><MessageCircle size={18} /></button>
                        <button className="hover:bg-gray-100 p-2 rounded text-gray-500"><UserCircle size={26} /></button>
                        <button className="hover:bg-gray-100 p-2 rounded text-gray-500"><MoreHorizontal size={18} /></button>
                    </div>
                </div>

                {/* Board Description */}
                {board.description && (
                    <div className="pt-1 pb-4 text-sm text-gray-500 dark:text-gray-400 max-w-4xl">
                        {board.description}
                    </div>
                )}

                {/* Tabs Row */}
                <div className="flex items-center gap-0 pr-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-start gap-6 overflow-x-auto no-scrollbar max-w-full">
                        {/* Dynamic Tab Rendering via availableViews */}
                        {availableViews.map((viewId) => {
                            const option = VIEW_OPTIONS.find(v => v.id === viewId);
                            // If option not found (e.g. legacy view ID), skip
                            if (!option) return null;
                            const Icon = option.icon;

                            return (
                                <button
                                    key={viewId}
                                    onClick={() => setActiveView(viewId as BoardViewType)}
                                    onContextMenu={(e) => handleContextMenu(e, viewId as BoardViewType)}
                                    className={`flex items-center gap-2 py-1.5 border-b-2 text-[13px] font-medium transition-colors whitespace-nowrap ${activeView === viewId
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{option.label}</span>
                                    {activeView === viewId && (
                                        <div className="ml-1 p-0.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 transition-colors" onClick={(e) => { e.stopPropagation(); /* Context menu logic */ handleContextMenu(e, viewId as BoardViewType); }}>
                                            <MoreHorizontal size={14} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Add View Button - Always at the end, outside scroll container */}
                    <div className="relative flex items-center flex-shrink-0">
                        <button
                            ref={addViewRef}
                            onClick={() => setShowAddViewMenu(!showAddViewMenu)}
                            className="p-1.5 ml-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <PlusIcon size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {showAddViewMenu && (
                            <PortalPopup
                                triggerRef={addViewRef}
                                onClose={() => setShowAddViewMenu(false)}
                                side="bottom"
                                align="start"
                            >
                                <div className="bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-1 w-48">
                                    {VIEW_OPTIONS.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setShowAddViewMenu(false);
                                                const viewId = option.id as BoardViewType;

                                                // Add to available views if not present (only if onUpdateBoard is available)
                                                if (onUpdateBoard && board.availableViews && !board.availableViews.includes(viewId)) {
                                                    onUpdateBoard(board.id, {
                                                        availableViews: [...board.availableViews, viewId]
                                                    });
                                                } else if (onUpdateBoard && !board.availableViews) {
                                                    // If availableViews is null/undefined, initialize it
                                                    onUpdateBoard(board.id, {
                                                        availableViews: [viewId]
                                                    });
                                                }

                                                setActiveView(viewId);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                                        >
                                            <option.icon size={16} className="text-gray-500" />
                                            <span>{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </PortalPopup>
                        )}
                    </div>
                </div>

            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden bg-transparent flex flex-col relative bg-white dark:bg-[#1a1d24] px-6">
                {renderView()}
            </div>

            {/* Context Menu Portal/Overlay */}
            {
                contextMenu && (
                    <div
                        className="fixed inset-0 z-[9999]"
                        style={{ pointerEvents: 'none' }}
                    >
                        {/* Transparent overlay for click-outside handled by global listener, but this ensures z-index stacking is correct */}
                        <div
                            ref={contextMenuRef}
                            className="absolute bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-2 w-60 pointer-events-auto"
                            style={{ top: contextMenu.y, left: contextMenu.x }}
                        >
                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-not-allowed text-gray-400">
                                <Pin size={16} />
                                <span className="text-sm">Pin view</span>
                            </div>
                            <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>

                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-not-allowed text-gray-400">
                                <Pencil size={16} />
                                <span className="text-sm">Rename view</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-not-allowed text-gray-400">
                                <Copy size={16} />
                                <span className="text-sm">Duplicate view</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-not-allowed text-gray-400">
                                <Share2 size={16} />
                                <span className="text-sm">Share view</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-not-allowed text-gray-400">
                                <Unlock size={16} />
                                <span className="text-sm">Unlock view</span>
                            </div>

                            <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>

                            <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-not-allowed text-gray-400">
                                <div className="flex items-center gap-3">
                                    <ArrowUpDown size={16} />
                                    <span className="text-sm">Reorder (for you only)</span>
                                </div>
                            </div>

                            <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>

                            <div
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400"
                                onClick={handleDeleteView}
                            >
                                <Trash2 size={16} />
                                <span className="text-sm">Delete view</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};