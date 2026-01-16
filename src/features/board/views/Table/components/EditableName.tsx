import React, { useState, useRef, useEffect } from 'react';

interface EditableNameProps {
    name: string;
    onRename?: (name: string) => void;
    className?: string;
    placeholder?: string;
}

export const EditableName: React.FC<EditableNameProps> = ({
    name,
    onRename,
    className,
    placeholder = 'Main Table'
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setValue(name);
    }, [name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (value.trim() && value.trim() !== name) {
            onRename?.(value.trim());
        } else {
            setValue(name);
        }
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') {
                        setValue(name);
                        setIsEditing(false);
                    }
                }}
                className={`font-semibold tracking-tight bg-transparent border-b border-blue-500 outline-none p-0 min-w-[100px] ${className || 'text-[14px] text-stone-800 dark:text-stone-200'}`}
            />
        );
    }

    return (
        <span
            onDoubleClick={() => onRename && setIsEditing(true)}
            className={`font-semibold tracking-tight ${onRename ? 'cursor-text hover:text-stone-600 dark:hover:text-stone-300' : ''} ${className || 'text-[14px] text-stone-800 dark:text-stone-200'}`}
        >
            {name || placeholder}
        </span>
    );
};
