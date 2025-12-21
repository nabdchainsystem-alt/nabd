import React from 'react';

export const GeminiIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M12 2C12.5 6 16 9.5 20 10C16 10.5 12.5 14 12 18C11.5 14 8 10.5 4 10C8 9.5 11.5 6 12 2Z"
                fill="currentColor"
            />
            <path
                d="M18 16C18.25 18 20 19.75 22 20C20 20.25 18.25 22 18 24C17.75 22 16 20.25 14 20C16 19.75 17.75 18 18 16Z"
                fill="currentColor"
                opacity="0.7"
            />
            <path
                d="M6 18C6.25 19.5 7.5 20.75 9 21C7.5 21.25 6.25 22.5 6 24C5.75 22.5 4.5 21.25 3 21C4.5 20.75 5.75 19.5 6 18Z"
                fill="currentColor"
                opacity="0.5"
            />
        </svg>
    );
};
