import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, TextT as Type } from 'phosphor-react';

interface UrlPickerProps {
    current: { url: string; text?: string } | null;
    onSelect: (value: { url: string; text: string } | null) => void;
    onClose: () => void;
    triggerRect?: DOMRect;
}

export const UrlPicker: React.FC<UrlPickerProps> = ({ current, onSelect, onClose, triggerRect }) => {
    const [url, setUrl] = useState(current?.url || '');
    const [text, setText] = useState(current?.text || '');
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Calculate position
    const positionStyle = triggerRect
        ? {
            top: `${triggerRect.bottom + 8}px`,
            left: `${triggerRect.left}px`,
        }
        : {};

    const handleSave = () => {
        if (!url) {
            onSelect(null);
        } else {
            onSelect({ url, text: text || url });
        }
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const content = (
        <>
            <div className="fixed inset-0 z-[9998]" onClick={onClose} />
            <div
                ref={menuRef}
                className="fixed z-[9999] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl w-72 p-4 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-3"
                style={positionStyle}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-medium uppercase tracking-wider mb-1">
                    <Link size={12} />
                    Edit Link
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-stone-500 mb-1">URL Address</label>
                        <div className="relative">
                            <input
                                type="text"
                                autoFocus
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="https://example.com"
                                className="w-full pl-8 pr-3 py-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                            />
                            <Link size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-stone-500 mb-1">Display Text (Optional)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Short name"
                                className="w-full pl-8 pr-3 py-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded text-sm text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                            />
                            <Type size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-1">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-sm"
                    >
                        Save Link
                    </button>
                </div>
            </div>
        </>
    );

    return createPortal(content, document.body);
};
