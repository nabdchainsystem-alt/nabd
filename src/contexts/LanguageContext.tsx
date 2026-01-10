import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext<any>(null);

const translations: any = {
    en: {
    },
    ar: {
    }
};

export const LanguageProvider = ({ children }: any) => {
    const [language, setLanguage] = useState('en');
    const t = (key: string) => translations[language]?.[key] || key;
    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext) || { language: 'en', t: (k: string) => k };
