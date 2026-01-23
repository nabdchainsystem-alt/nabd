import React, { useState } from 'react';
import {
    X,
    Folder,
    Image,
    Globe,
    FileText,
    Note,
    Key,
    Star,
    Heart,
    Briefcase,
    Shield,
    Stack,
    Presentation,
    Cloud
} from 'phosphor-react';
import { useAppContext } from '../../../contexts/AppContext';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: { name: string; icon: string; color: string }) => void;
}

const AVAILABLE_ICONS = [
    { name: 'Folder', icon: Folder },
    { name: 'Star', icon: Star },
    { name: 'Heart', icon: Heart },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Shield', icon: Shield },
    { name: 'Stack', icon: Stack },
    { name: 'Presentation', icon: Presentation },
    { name: 'Cloud', icon: Cloud },
    { name: 'Key', icon: Key },
    { name: 'Globe', icon: Globe },
    { name: 'Image', icon: Image },
    { name: 'FileText', icon: FileText },
    { name: 'Note', icon: Note },
];

const AVAILABLE_COLORS = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onCreate }) => {
    const { t, language } = useAppContext();
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Folder');
    const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate({ name, icon: selectedIcon, color: selectedColor });
        setName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white dark:bg-monday-dark-surface w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-monday-dark-border overflow-hidden animate-fade-in-up">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('create_new_group')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t('group_name_label')}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('group_name_placeholder')}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-monday-blue text-sm"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t('workspace_icon')}
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {AVAILABLE_ICONS.map(({ name: iconName, icon: Icon }) => (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => setSelectedIcon(iconName)}
                                    className={`p-3 rounded-lg flex items-center justify-center transition-all ${selectedIcon === iconName
                                        ? 'bg-monday-blue text-white shadow-md'
                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t('color')}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === color ? 'border-gray-400 scale-110 shadow-sm' : 'border-transparent'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="flex-1 py-2 bg-monday-blue hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all shadow-md active:scale-95"
                        >
                            {t('create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
