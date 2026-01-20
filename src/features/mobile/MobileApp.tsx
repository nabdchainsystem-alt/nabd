import React, { useState } from 'react';
import { SignedIn, SignedOut, SignIn, useUser } from '../../auth-adapter';
import { NotePencil, CheckSquare, Gear, SignOut } from 'phosphor-react';
import { MobileNotes } from './MobileNotes';
import { MobileTasks } from './MobileTasks';
import { MobileSettings } from './MobileSettings';
import { useClerk } from '@clerk/clerk-react';

type MobileView = 'notes' | 'tasks' | 'settings';

const MobileContent: React.FC = () => {
  const [activeView, setActiveView] = useState<MobileView>('tasks');
  const { user } = useUser();
  const { signOut } = useClerk();

  const navItems: { id: MobileView; icon: React.ReactNode; label: string }[] = [
    { id: 'tasks', icon: <CheckSquare size={24} weight="fill" />, label: 'Tasks' },
    { id: 'notes', icon: <NotePencil size={24} weight="fill" />, label: 'Notes' },
    { id: 'settings', icon: <Gear size={24} weight="fill" />, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-gray-800">NABD Mobile</span>
        </div>
        <button
          onClick={() => signOut()}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Sign out"
        >
          <SignOut size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeView === 'notes' && <MobileNotes />}
        {activeView === 'tasks' && <MobileTasks />}
        {activeView === 'settings' && <MobileSettings />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 flex-shrink-0 safe-area-bottom">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                activeView === item.id
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

const MobileSignIn: React.FC = () => {
  // Use current origin to ensure redirect stays on mobile subdomain
  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : '/';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">NABD Mobile</h1>
          <p className="text-gray-500 mt-2">Quick access to your tasks & notes</p>
        </div>

        <SignIn
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
          appearance={{
            variables: {
              colorPrimary: '#2563eb',
            },
            elements: {
              footer: "hidden",
              socialButtons: "hidden",
              dividerRow: "hidden",
              card: "shadow-lg rounded-2xl",
            }
          }}
        />
      </div>
    </div>
  );
};

export const MobileApp: React.FC = () => {
  return (
    <>
      <SignedOut>
        <MobileSignIn />
      </SignedOut>
      <SignedIn>
        <MobileContent />
      </SignedIn>
    </>
  );
};

export default MobileApp;
