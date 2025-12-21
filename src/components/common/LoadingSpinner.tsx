
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-[#F7F9FB] dark:bg-monday-dark-bg">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
};
