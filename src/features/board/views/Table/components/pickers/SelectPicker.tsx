import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePopupPosition } from '../../hooks/usePopupPosition';

interface SelectOption {
    id: string;
    label: string;
    color: string;
}

interface SelectPickerProps {
    onSelect: (value: string) => void;
    onClose: () => void;
    current: string;
    options: SelectOption[];
    triggerRect?: DOMRect;
    onAdd?: (label: string) => void;
}

export const SelectPicker: React.FC<SelectPickerProps> = ({
    onSelect,
    onClose,
    current,
    options,
    triggerRect,
    onAdd
}) => {
    const [search, setSearch] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);
    const positionStyle = usePopupPosition({ triggerRect, menuHeight: 320 });

    // Filter options based on search
    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const content = (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[99]" onClick={onClose} />
            <div
                ref={menuRef}
                onClick={(e) => e.stopPropagation()}
                className="fixed w-[220px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-xl z-[100] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100 p-2 gap-2"
                style={positionStyle}
            >
                {/* Search Input */}
                <input
                    type="text"
                    autoFocus
                    placeholder="Search or add options..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border-2 border-primary/50 focus:border-primary rounded-md outline-none transition-all placeholder:text-stone-400"
                />

                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {/* Clear / None Option */}
                    <button
                        onClick={() => { onSelect(''); onClose(); }}
                        className="w-full h-8 border border-dashed border-stone-300 dark:border-stone-600 rounded flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                        <span className="text-stone-400">-</span>
                    </button>

                    {/* Filtered Options */}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => { onSelect(opt.label); onClose(); }}
                                className={`w-full py-1.5 px-3 rounded text-xs font-medium text-white transition-transform active:scale-95 ${opt.color || 'bg-stone-500'}`}
                            >
                                {opt.label}
                            </button>
                        ))
                    ) : (
                        <div className="py-2 text-center text-xs text-stone-400">
                            No options found
                        </div>
                    )}

                    {/* Add new option */}
                    {search.trim() && !options.some(o => o.label.toLowerCase() === search.trim().toLowerCase()) && onAdd && (
                        <button
                            onClick={() => { onAdd(search.trim()); onClose(); }}
                            className="w-full py-1.5 px-3 rounded text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1 border border-dashed border-stone-300 dark:border-stone-700 mt-1"
                        >
                            <span>Create "{search.trim()}"</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );

    return createPortal(content, document.body);
};

export type { SelectOption };
