import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext<any>(null);

export const NavigationProvider = ({ children }: any) => {
    const [isImmersive, setIsImmersive] = useState(false);
    const [activePage, setActivePage] = useState('board');
    return (
        <NavigationContext.Provider value={{ isImmersive, activePage, setActivePage }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) return { isImmersive: false, activePage: 'board', setActivePage: () => { } };
    return context;
};
