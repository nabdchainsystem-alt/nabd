import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { SignOut, Trash, ArrowSquareOut, Info } from 'phosphor-react';

export const MobileSettings: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const clearAllData = () => {
    if (confirm('This will delete all your local tasks and notes. Are you sure?')) {
      localStorage.removeItem('mobile-tasks-v1');
      localStorage.removeItem('mobile-notes-v1');
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* User Profile */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.fullName || 'User'}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.emailAddresses?.[0]?.emailAddress || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="flex-1 p-4 space-y-4">
        {/* App Info */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase">About</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Info size={20} className="text-gray-400" />
                <span className="text-gray-800">Version</span>
              </div>
              <span className="text-gray-500">1.0.0</span>
            </div>
            <a
              href="https://nabdchain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ArrowSquareOut size={20} className="text-gray-400" />
                <span className="text-gray-800">Open Full App</span>
              </div>
              <span className="text-gray-400 text-sm">app.nabdchain.com</span>
            </a>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Data</h3>
          </div>
          <button
            onClick={clearAllData}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash size={20} />
            <span>Clear All Local Data</span>
          </button>
        </div>

        {/* Sign Out */}
        <div className="bg-white rounded-xl overflow-hidden">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <SignOut size={20} className="text-gray-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-400">
        <p>NABD Mobile - Quick access on the go</p>
        <p className="mt-1">Data stored locally on this device</p>
      </div>
    </div>
  );
};

export default MobileSettings;
