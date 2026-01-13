import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext<any>(null);

export const UIProvider = ({ children }: any) => {
    const [theme, setTheme] = useState('light');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
        const saved = localStorage.getItem('app-sidebar-collapsed');
        return saved ? saved === 'true' : false;
    });

    React.useEffect(() => {
        localStorage.setItem('app-sidebar-collapsed', isSidebarCollapsed ? 'true' : 'false');
    }, [isSidebarCollapsed]);

    return (
        <UIContext.Provider value={{ theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext) || { theme: 'light' };
