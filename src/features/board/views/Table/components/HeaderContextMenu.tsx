import React, { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import { useClickOutside } from '../../../../../hooks/useClickOutside';

interface HeaderContextMenuProps {
    onClose: () => void;
    onHeaderColorSelect: (color: string) => void;
    onColumnColorSelect: (color: string) => void;
    currentHeaderColor?: string;
    currentColumnColor?: string;
    position: { x: number; y: number };
}

const COLORS = [
    { label: 'Default', value: '', class: 'border-stone-200' },
    { label: 'White', value: '#ffffff', class: 'bg-white border-stone-200' },
    { label: 'Subtle Grey', value: '#f5f5f4', class: 'bg-stone-100' },
    { label: 'Warm Sand', value: '#fdfbf7', class: 'bg-[#fdfbf7] border-stone-100' },
    { label: 'Muted Blue', value: '#f0f4f8', class: 'bg-slate-50' },
    { label: 'Soft Sage', value: '#f2f7f5', class: 'bg-emerald-50/50' },
    { label: 'Slate', value: '#e2e8f0', class: 'bg-slate-200' },
];

export const HeaderContextMenu: React.FC<HeaderContextMenuProps> = ({ onClose, onHeaderColorSelect, onColumnColorSelect, currentHeaderColor, currentColumnColor, position }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useClickOutside(menuRef, onClose);

    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({
        top: position.y,
        left: position.x,
        opacity: 0
    });

    useLayoutEffect(() => {
        if (menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - position.y;
            const menuHeight = menuRect.height || 300;

            let top = position.y;
            let left = position.x;

            if (spaceBelow < menuHeight) {
                top = Math.max(10, position.y - menuHeight);
            }

            if (left + menuRect.width > window.innerWidth) {
                left = window.innerWidth - menuRect.width - 10;
            }

            setMenuStyle({
                top,
                left,
                opacity: 1
            });
        }
    }, [position.x, position.y]);

    return createPortal(
        <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[9999] w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col py-1"
            style={menuStyle}
        >
            <div className="px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800 mb-1">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-stone-400">Header Background</span>
            </div>

            <div className="grid grid-cols-4 gap-1 p-2">
                {COLORS.map((color) => (
                    <button
                        key={`head-${color.label}`}
                        onClick={() => {
                            onHeaderColorSelect(color.value);
                            onClose();
                        }}
                        title={color.label}
                        className={`
                            h-8 rounded-md flex items-center justify-center transition-all border
                            ${color.value ? '' : 'bg-white dark:bg-stone-800'}
                            ${(currentHeaderColor === color.value || (!currentHeaderColor && !color.value))
                                ? 'border-blue-500 ring-1 ring-blue-500'
                                : 'border-transparent hover:border-stone-300 dark:hover:border-stone-700'}
                        `}
                        style={{ backgroundColor: color.value || undefined }}
                    >
                        {!color.value && <div className="w-full h-[1px] bg-red-400 rotate-45" />}
                    </button>
                ))}
            </div>

            <div className="px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border-y border-stone-100 dark:border-stone-800 my-1">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-stone-400">Column Background</span>
            </div>

            <div className="grid grid-cols-4 gap-1 p-2">
                {COLORS.map((color) => (
                    <button
                        key={`col-${color.label}`}
                        onClick={() => {
                            onColumnColorSelect(color.value);
                            onClose();
                        }}
                        title={color.label}
                        className={`
                            h-8 rounded-md flex items-center justify-center transition-all border
                            ${color.value ? '' : 'bg-white dark:bg-stone-800'}
                            ${(currentColumnColor === color.value || (!currentColumnColor && !color.value))
                                ? 'border-blue-500 ring-1 ring-blue-500'
                                : 'border-transparent hover:border-stone-300 dark:hover:border-stone-700'}
                        `}
                        style={{ backgroundColor: color.value || undefined }}
                    >
                        {!color.value && <div className="w-full h-[1px] bg-red-400 rotate-45" />}
                    </button>
                ))}
            </div>
        </div>,
        document.body
    );
};
