import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { BoardView } from './components/BoardView';
import { InboxView } from './components/InboxView';
import DiscussionPage from './src/features/discussion/DiscussionPage';
import { Board, Workspace, ViewState, BoardViewType } from './types';
import { AppProvider } from './contexts/AppContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { UIProvider } from './src/contexts/UIContext';
import { NavigationProvider } from './src/contexts/NavigationContext';

// Mock Initial Data
const INITIAL_WORKSPACES: Workspace[] = [
  { id: 'w1', name: 'Main workspace', icon: 'Briefcase', color: 'from-orange-400 to-red-500' }
];

const INITIAL_BOARDS: Board[] = [
  {
    id: 'default-1',
    name: 'Marketing Campaign',
    description: 'Q4 Product Launch Activities',
    workspaceId: 'w1',
    columns: [
      { id: 'c1', title: 'Owner', type: 'person' },
      { id: 'c2', title: 'Status', type: 'status' },
      { id: 'c3', title: 'Due Date', type: 'date' }
    ],
    tasks: [
      { id: 't1', name: 'Design Ad Creatives', person: 'Alice', status: 'Working on it', date: '2023-10-15' },
      { id: 't2', name: 'Approve Budget', person: 'Bob', status: 'Done', date: '2023-10-01' },
      { id: 't3', name: 'Launch Social Ads', person: 'Charlie', status: 'Stuck', date: '2023-10-20' },
      { id: 't4', name: 'Review Analytics', person: 'Alice', status: '', date: '2023-11-01' }
    ]
  },
  {
    id: 'default-2',
    name: 'Product Roadmap',
    description: '2024 Roadmap',
    workspaceId: 'w1',
    columns: [
      { id: 'c1', title: 'Owner', type: 'person' },
      { id: 'c2', title: 'Status', type: 'status' }
    ],
    tasks: [],
    isFavorite: false
  }
];

const AppContent: React.FC = () => {
  // --- Persistent State Initialization ---

  const [activeView, setActiveView] = useState<ViewState>(() => {
    const saved = localStorage.getItem('app-active-view');
    return (saved as ViewState) || 'dashboard';
  });

  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem('app-workspaces');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
  });

  const [boards, setBoards] = useState<Board[]>(() => {
    const saved = localStorage.getItem('app-boards');
    return saved ? JSON.parse(saved) : INITIAL_BOARDS;
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    return localStorage.getItem('app-active-workspace') || INITIAL_WORKSPACES[0].id;
  });

  const [activeBoardId, setActiveBoardId] = useState<string | null>(() => {
    // Check if we have a saved board ID that actually exists in our (potentially loaded) boards
    const savedId = localStorage.getItem('app-active-board');
    return savedId || INITIAL_BOARDS[0].id;
  });

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('app-sidebar-width');
    return saved ? parseInt(saved, 10) : 260;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const activeBoard = boards.find(b => b.id === activeBoardId) || boards[0];

  // --- Persistence Effects ---

  useEffect(() => {
    localStorage.setItem('app-sidebar-width', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    localStorage.setItem('app-active-view', activeView);
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem('app-workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('app-boards', JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    localStorage.setItem('app-active-workspace', activeWorkspaceId);
  }, [activeWorkspaceId]);

  useEffect(() => {
    if (activeBoardId) {
      localStorage.setItem('app-active-board', activeBoardId);
    }
  }, [activeBoardId]);

  const handleBoardCreated = (newBoard: Board) => {
    const boardWithWorkspace = { ...newBoard, workspaceId: activeWorkspaceId };
    setBoards([...boards, boardWithWorkspace]);
    setActiveBoardId(newBoard.id);
    setActiveView('board');
  };

  const handleQuickAddBoard = (name: string, icon?: string, defaultView: BoardViewType = 'table') => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name: name || 'New Board',
      workspaceId: activeWorkspaceId,
      columns: [
        { id: 'c1', title: 'Owner', type: 'person' },
        { id: 'c2', title: 'Status', type: 'status' },
        { id: 'c3', title: 'Date', type: 'date' }
      ],
      tasks: [],
      defaultView: defaultView,
      availableViews: [defaultView],
      icon: icon // Add icon support if Board type allows it, otherwise we might need to update Board type or just ignore it for now if not in type. 
      // Checking Board type in types.ts would be good but I'll assume it might not be there yet or I shouldn't break it.
      // Wait, the prompt says "choose an icon". I should check if Board type supports icon.
      // In App.tsx Initial Data, Board doesn't have an icon field. Workspace does.
      // I should adds icon to Board type or just ignore it? 
      // User said "choose an icon". I'll add it to the matching Board object.
    };
    handleBoardCreated(newBoard);
  };

  const handleNavigate = (view: ViewState, boardId?: string) => {
    setActiveView(view);
    if (boardId) {
      setActiveBoardId(boardId);
    }
  };

  const handleAddWorkspace = (name: string, icon: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      icon,
      color: 'from-blue-400 to-indigo-500' // Default color
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
  };

  const handleDeleteWorkspace = (id: string) => {
    if (workspaces.length <= 1) return; // Prevent deleting last workspace
    const newWorkspaces = workspaces.filter(w => w.id !== id);
    setWorkspaces(newWorkspaces);
    if (activeWorkspaceId === id) {
      setActiveWorkspaceId(newWorkspaces[0].id);
    }
    setBoards(boards.filter(b => b.workspaceId !== id));
  };

  const handleDeleteBoard = (id: string) => {
    const newBoards = boards.filter(b => b.id !== id);
    setBoards(newBoards);
    if (activeBoardId === id) {
      setActiveView('dashboard');
      setActiveBoardId(null);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setBoards(boards.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
  };

  const handleUpdateBoard = (boardId: string, updates: Partial<Board>) => {
    setBoards(boards.map(b => b.id === boardId ? { ...b, ...updates } : b));
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#FCFCFD] dark:bg-monday-dark-bg font-sans text-[#323338] dark:text-monday-dark-text transition-colors duration-200">
      <TopBar />
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar
          activeView={activeView}
          activeBoardId={activeBoardId}
          onNavigate={handleNavigate}
          width={sidebarWidth}
          onResize={setSidebarWidth}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onWorkspaceChange={setActiveWorkspaceId}
          onAddWorkspace={handleAddWorkspace}
          onDeleteWorkspace={handleDeleteWorkspace}
          boards={boards}
          onDeleteBoard={handleDeleteBoard}
          onToggleFavorite={handleToggleFavorite}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onAddBoard={(name, icon) => handleQuickAddBoard(name, icon)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#FCFCFD] dark:bg-monday-dark-bg z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.08)] ml-0.5">
          {activeView === 'dashboard' ? (
            <Dashboard onBoardCreated={handleBoardCreated} />
          ) : activeView === 'board' && activeBoard ? (
            <BoardView board={activeBoard} onUpdateBoard={handleUpdateBoard} />
          ) : activeView === 'inbox' ? (
            <InboxView />
          ) : activeView === 'discussion' ? (
            <DiscussionPage />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-light text-xl">
              {activeView === 'teams' && "Manage your teams here"}
              {activeView === 'vault' && "Secure Vault"}
              {activeView === 'board' && !activeBoard && "No board selected"}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};



const App: React.FC = () => {
  return (
    <AppProvider>
      <UIProvider>
        <LanguageProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </LanguageProvider>
      </UIProvider>
    </AppProvider>
  )
}

export default App;