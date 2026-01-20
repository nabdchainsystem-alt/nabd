import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Folder, ArrowRight } from 'phosphor-react';
import { VaultItem } from '../types';

interface MoveToFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMove: (folderId: string | null) => void;
    itemToMove: VaultItem | null;
    allItems: VaultItem[];
}

export const MoveToFolderModal: React.FC<MoveToFolderModalProps> = ({ isOpen, onClose, onMove, itemToMove, allItems }) => {
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const availableFolders = useMemo(() => {
        if (!itemToMove) return [];
        // Helper to get all descendant IDs of a folder
        const getDescendantIds = (folderId: string, items: VaultItem[]): string[] => {
            const children = items.filter(i => i.folderId === folderId);
            let ids = children.map(c => c.id);
            children.forEach(c => {
                if (c.type === 'folder') {
                    ids = [...ids, ...getDescendantIds(c.id, items)];
                }
            });
            return ids;
        };

        let excludedIds: string[] = [];
        if (itemToMove.type === 'folder') {
            excludedIds = [itemToMove.id, ...getDescendantIds(itemToMove.id, allItems)];
        }

        return allItems.filter(item => {
            if (item.type !== 'folder') return false;
            // Exclude self and descendants if it's a folder
            if (excludedIds.includes(item.id)) return false;
            // Filter by search
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });
    }, [allItems, itemToMove, searchQuery]);

    if (!isOpen || !itemToMove) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onMove(selectedFolderId);
    };

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-monday-dark-surface rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Folder size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Move Item</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <p className="text-sm text-gray-500 mb-2">
                        Moving <span className="font-semibold text-gray-900 dark:text-gray-100">{itemToMove.title}</span> to...
                    </p>
                    <input
                        type="text"
                        placeholder="Search folders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-monday-blue/50 text-gray-900 dark:text-gray-100 text-sm"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    <button
                        onClick={() => setSelectedFolderId(null)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${selectedFolderId === null ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                    >
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500">
                            <Folder size={20} />
                        </div>
                        <span className="font-medium">Vault (Root)</span>
                    </button>

                    <div className="mt-2 space-y-1">
                        {availableFolders.map(folder => (
                            <button
                                key={folder.id}
                                onClick={() => setSelectedFolderId(folder.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${selectedFolderId === folder.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                            >
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500" style={{ color: folder.color }}>
                                    <Folder size={20} weight={selectedFolderId === folder.id ? "fill" : "regular"} />
                                </div>
                                <span className="font-medium truncate">{folder.title}</span>
                            </button>
                        ))}
                        {availableFolders.length === 0 && searchQuery && (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                No folders found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0 flex justify-end gap-3 bg-white dark:bg-monday-dark-surface">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 text-sm font-medium text-white bg-monday-blue hover:bg-blue-600 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                    >
                        <span>Move Here</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
