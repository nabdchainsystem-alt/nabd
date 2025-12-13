import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext<any>(null);

export const UIProvider = ({ children }: any) => {
    const [theme, setTheme] = useState('light');
    return (
        <UIContext.Provider value={{ theme, setTheme }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext) || { theme: 'light' };
