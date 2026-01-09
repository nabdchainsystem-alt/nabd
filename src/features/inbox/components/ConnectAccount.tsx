import React from 'react';
import { Mail } from 'lucide-react';

export const ConnectAccount: React.FC = () => {
    const handleConnect = (provider: 'google' | 'outlook') => {
        // Redirect to backend auth
        window.location.href = `http://localhost:3001/api/auth/${provider}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50 dark:bg-monday-dark-bg text-center">
            <div className="bg-white dark:bg-monday-dark-surface p-8 rounded-xl shadow-sm border border-gray-200 dark:border-monday-dark-border max-w-md w-full">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                    <Mail size={32} />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Connect your Inbox</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Sync your work email to manage everything in one place.
                    We support Gmail and Outlook.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => handleConnect('google')}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 font-medium"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Connect with Google
                    </button>

                    <button
                        onClick={() => handleConnect('outlook')}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 font-medium"
                    >
                        <img src="https://www.svgrepo.com/show/452267/microsoft.svg" alt="Microsoft" className="w-5 h-5" />
                        Connect with Outlook
                    </button>
                </div>

                <p className="mt-6 text-xs text-gray-400">
                    By connecting, you agree to grant read/write access to your emails.
                </p>
            </div>
        </div>
    );
};
