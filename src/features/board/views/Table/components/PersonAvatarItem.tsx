import React, { useState } from 'react';

interface PersonAvatarItemProps {
    person: {
        name?: string;
        label?: string;
        title?: string;
        avatar?: string;
    } | string;
    isActive: boolean;
    onClick: () => void;
}

const AVATAR_COLORS = [
    'bg-red-100 text-red-600',
    'bg-orange-100 text-orange-600',
    'bg-amber-100 text-amber-600',
    'bg-green-100 text-green-600',
    'bg-emerald-100 text-emerald-600',
    'bg-teal-100 text-teal-600',
    'bg-cyan-100 text-cyan-600',
    'bg-blue-100 text-blue-600',
    'bg-indigo-100 text-indigo-600',
    'bg-violet-100 text-violet-600',
    'bg-purple-100 text-purple-600',
    'bg-fuchsia-100 text-fuchsia-600',
    'bg-pink-100 text-pink-600',
    'bg-rose-100 text-rose-600'
];

export const PersonAvatarItem: React.FC<PersonAvatarItemProps> = ({
    person,
    isActive,
    onClick
}) => {
    const [imageError, setImageError] = useState(false);

    // Aggressive name resolution
    const displayName = typeof person === 'string'
        ? person
        : person.name || person.label || person.title || 'Unknown';

    const initial = (typeof person === 'string'
        ? person.charAt(0)
        : (person.name ? person.name.charAt(0) : '?')
    ).toUpperCase();

    // Generate consistent color based on name hash
    const colorIndex = Math.abs(
        displayName.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    ) % AVATAR_COLORS.length;
    const avatarColorClass = AVATAR_COLORS[colorIndex];

    const avatar = typeof person === 'string' ? undefined : person.avatar;

    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors overflow-hidden relative ${
                isActive
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-white ring-1 ring-stone-200 dark:ring-stone-700 hover:ring-stone-300'
            }`}
            title={displayName}
        >
            {avatar && !imageError ? (
                <img
                    src={avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className={`w-full h-full flex items-center justify-center ${avatarColorClass}`}>
                    <span className="text-xs font-bold leading-none">
                        {initial}
                    </span>
                </div>
            )}
        </button>
    );
};
