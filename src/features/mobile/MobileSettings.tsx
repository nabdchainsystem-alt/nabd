import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { SignOut, Trash, ArrowSquareOut, Info, PencilSimple, Check, X, Cloud } from 'phosphor-react';
import { useAppContext } from '../../contexts/AppContext';

export const MobileSettings: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { userDisplayName, updateUserDisplayName } = useAppContext();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userDisplayName);

  // Update local state when context changes
  useEffect(() => {
    setEditedName(userDisplayName);
  }, [userDisplayName]);

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateUserDisplayName(editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userDisplayName);
    setIsEditingName(false);
  };

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
            {userDisplayName?.[0]?.toUpperCase() || user?.firstName?.[0] || 'U'}
          </div>
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-lg font-semibold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <Check size={20} weight="bold" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {userDisplayName || 'User'}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <PencilSimple size={16} />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500">
              {user?.emailAddresses?.[0]?.emailAddress || ''}
            </p>
          </div>
        </div>
        {/* Cloud sync indicator */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <Cloud size={14} />
          <span>Profile synced across all devices</span>
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
              href="https://app.nabdchain.com"
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
        <p className="mt-1">Tasks and notes stored locally, profile synced to cloud</p>
      </div>
    </div>
  );
};

export default MobileSettings;
