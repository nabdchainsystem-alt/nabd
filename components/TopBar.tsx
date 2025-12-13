import React from 'react';
import { Bell, Search, HelpCircle, Grid3X3, Download, Link, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const TopBar: React.FC = () => {
  const { theme, toggleTheme, language, toggleLanguage, t } = useAppContext();

  return (
    <div className="h-12 bg-white dark:bg-monday-dark-surface flex items-center justify-between px-4 flex-shrink-0 z-20 shadow-sm transition-colors duration-200">

      {/* Start: Logo Section */}
      <div className="flex items-center min-w-[200px]">
        <div className="flex items-center cursor-pointer group">
          <div className="w-8 h-8 bg-[#2b2c33] dark:bg-monday-blue rounded-md flex items-center justify-center me-2 shadow-sm transition-all group-hover:scale-105 group-hover:bg-monday-blue dark:group-hover:bg-monday-blue-hover">
            <Link size={16} className="text-white transform -rotate-45" />
          </div>
          <div className="flex items-baseline gap-1.5 justify-center">
            <span className="text-lg font-bold tracking-tight text-[#323338] dark:text-monday-dark-text leading-none hidden md:block">
              NABD
            </span>
            <span className="font-normal text-gray-500 dark:text-monday-dark-text-secondary text-xs leading-none hidden md:block">
              Chain System
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute ms-3 top-2 text-gray-400 dark:text-monday-dark-text-secondary group-focus-within:text-monday-blue transition-colors" size={16} />
          <input
            type="text"
            placeholder={t('search')}
            className="w-full px-10 py-1.5 rounded-md border border-gray-200 dark:border-monday-dark-border bg-[#f5f6f8] dark:bg-monday-dark-bg text-gray-800 dark:text-monday-dark-text placeholder-gray-500 dark:placeholder-monday-dark-text-secondary hover:bg-gray-100 dark:hover:bg-monday-dark-hover focus:bg-white dark:focus:bg-monday-dark-surface focus:border-monday-blue dark:focus:border-monday-blue focus:ring-1 focus:ring-monday-blue outline-none text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      {/* End: Icons Section */}
      <div className="flex items-center space-x-1 space-x-reverse min-w-[200px] justify-end">

        {/* Language Toggle - Simple Text Icon */}
        <button
          onClick={toggleLanguage}
          title={t('language')}
          className="text-gray-500 dark:text-monday-dark-text-secondary hover:text-[#323338] dark:hover:text-monday-dark-text transition-colors p-1.5 rounded hover:bg-gray-100 dark:hover:bg-monday-dark-hover w-8 h-8 flex items-center justify-center font-bold text-xs"
        >
          {language === 'en' ? 'EN' : 'AR'}
        </button>

        {/* Theme Toggle - Simple Icon */}
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? t('dark_mode') : t('light_mode')}
          className="text-gray-500 dark:text-monday-dark-text-secondary hover:text-[#323338] dark:hover:text-monday-dark-text transition-colors p-1.5 rounded hover:bg-gray-100 dark:hover:bg-monday-dark-hover w-8 h-8 flex items-center justify-center"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="w-px h-5 bg-gray-300 dark:bg-monday-dark-border mx-2 hidden md:block"></div>

        <button className="text-gray-500 dark:text-monday-dark-text-secondary hover:text-[#323338] dark:hover:text-monday-dark-text relative transition-colors p-1.5 rounded hover:bg-gray-100 dark:hover:bg-monday-dark-hover">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-monday-dark-surface"></span>
        </button>
        <button className="text-gray-500 dark:text-monday-dark-text-secondary hover:text-[#323338] dark:hover:text-monday-dark-text transition-colors p-1.5 rounded hover:bg-gray-100 dark:hover:bg-monday-dark-hover hidden sm:block"><Download size={18} /></button>
        <button className="text-gray-500 dark:text-monday-dark-text-secondary hover:text-[#323338] dark:hover:text-monday-dark-text transition-colors p-1.5 rounded hover:bg-gray-100 dark:hover:bg-monday-dark-hover hidden sm:block"><HelpCircle size={18} /></button>
        <button className="text-gray-500 dark:text-monday-dark-text-secondary hover:text-[#323338] dark:hover:text-monday-dark-text transition-colors p-1.5 rounded hover:bg-gray-100 dark:hover:bg-monday-dark-hover"><Grid3X3 size={18} /></button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:scale-105 hover:shadow-md transition-all ms-2 border-2 border-white dark:border-monday-dark-border">
          N
        </div>
      </div>
    </div>
  );
};