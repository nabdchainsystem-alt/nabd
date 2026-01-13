import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, Trash2 } from 'lucide-react';
import { useClickOutside } from '../../../../../hooks/useClickOutside';

interface TextCellContextMenuProps {
    onClose: () => void;
    onColorSelect: (color: string) => void;
    onColumnColorSelect?: (color: string) => void;
    currentColor?: string;
    currentColumnColor?: string;
    position: { x: number; y: number };
}

const COLORS = [
    { label: 'Default', value: '', class: 'text-stone-800 dark:text-stone-200' },
    { label: 'Red', value: '#ef4444', class: 'text-red-500' },
    { label: 'Orange', value: '#f97316', class: 'text-orange-500' },
    { label: 'Amber', value: '#f59e0b', class: 'text-amber-500' },
    { label: 'Green', value: '#22c55e', class: 'text-green-500' },
    { label: 'Blue', value: '#3b82f6', class: 'text-blue-500' },
    { label: 'Purple', value: '#a855f7', class: 'text-purple-500' },
    { label: 'Pink', value: '#ec4899', class: 'text-pink-500' },
];

export const TextCellContextMenu: React.FC<TextCellContextMenuProps> = ({ onClose, onColorSelect, onColumnColorSelect, currentColor, currentColumnColor, position }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useClickOutside(menuRef, onClose);

    const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({
        top: position.y,
        left: position.x,
        opacity: 0
    });

    React.useLayoutEffect(() => {
        if (menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - position.y;
            const menuHeight = menuRect.height || 300; // approximate if not rendered yet, but useLayoutEffect should have it

            let top = position.y;
            let left = position.x;

            // Check vertical overflow
            if (spaceBelow < menuHeight) {
                // Not enough space below, flip up
                top = Math.max(10, position.y - menuHeight);
            }

            // Check horizontal overflow (unlikely for 200px width but good practice)
            if (left + menuRect.width > window.innerWidth) {
                left = window.innerWidth - menuRect.width - 10;
            }

            setMenuStyle({
                top,
                left,
                opacity: 1 // Fade in after positioning
            });
        }
    }, [position.x, position.y]);

    return createPortal(
        <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[9999] w-48 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col py-1"
            style={menuStyle}
        >
            <div className="px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800 mb-1">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-stone-400">Cell Color</span>
            </div>

            {COLORS.map((color) => (
                <button
                    key={color.label}
                    onClick={() => {
                        onColorSelect(color.value);
                        onClose();
                    }}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-between group"
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full border border-stone-200 dark:border-stone-700 ${color.value ? '' : 'bg-stone-800 dark:bg-stone-200'}`} style={{ backgroundColor: color.value }} />
                        <span className={`text-stone-700 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-stone-100`}>
                            {color.label}
                        </span>
                    </div>
                    {(currentColor === color.value || (!currentColor && !color.value)) && (
                        <Check size={14} className="text-blue-500" />
                    )}
                </button>
            ))}

            {onColumnColorSelect && (
                <>
                    <div className="px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border-y border-stone-100 dark:border-stone-800 my-1">
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-stone-400">Column Color</span>
                    </div>
                    {COLORS.map((color) => (
                        <button
                            key={`col-${color.label}`}
                            onClick={() => {
                                onColumnColorSelect(color.value);
                                onClose();
                            }}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full border border-stone-200 dark:border-stone-700 ${color.value ? '' : 'bg-stone-800 dark:bg-stone-200'}`} style={{ backgroundColor: color.value }} />
                                <span className={`text-stone-700 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-stone-100`}>
                                    {color.label}
                                </span>
                            </div>
                            {(currentColumnColor === color.value || (!currentColumnColor && !color.value)) && (
                                <Check size={14} className="text-blue-500" />
                            )}
                        </button>
                    ))}
                </>
            )}
        </div>,
        document.body
    );
};
