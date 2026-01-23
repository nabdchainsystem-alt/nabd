import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../contexts/AIContext';
import { Sparkle, Lightning, Brain, CircleNotch, Robot, Database, Info } from 'phosphor-react';
import { useAppContext } from '../contexts/AppContext';

interface AICreditsDisplayProps {
    showMode?: boolean;
    compact?: boolean;
}

/**
 * Displays user's AI credit balance and mode toggle in a single dropdown.
 * Placed in the TopBar for persistent visibility.
 *
 * NABD Brain Modes:
 * - Auto (Smart Routing): AI analyzes complexity and chooses the right model
 * - Deep Mode: Always uses Thinker (Gemini 3 Pro) for complex analysis
 */
export function AICreditsDisplay({ showMode = true, compact = false }: AICreditsDisplayProps) {
    const {
        credits,
        creditsLoading,
        deepModeEnabled,
        toggleDeepMode,
        isProcessing,
        currentTier,
        currentBoardContext,
        currentRoomContext,
    } = useAI();
    const { theme } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isDark = theme === 'dark';
    const hasContext = currentBoardContext || currentRoomContext;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get current tier indicator
    const getTierIndicator = () => {
        if (!isProcessing || !currentTier) return null;

        switch (currentTier) {
            case 'cleaner':
                return <Sparkle size={10} weight="fill" className="text-green-500" />;
            case 'worker':
                return <Lightning size={10} weight="fill" className="text-blue-500" />;
            case 'thinker':
                return <Brain size={10} weight="fill" className="text-purple-500" />;
        }
    };

    if (compact) {
        return (
            <div className="flex items-center gap-1.5 text-sm">
                {isProcessing ? (
                    <div className="relative">
                        <CircleNotch size={14} className="animate-spin text-blue-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {getTierIndicator()}
                        </div>
                    </div>
                ) : (
                    <Brain size={14} className={deepModeEnabled ? 'text-purple-500' : 'text-blue-500'} weight="fill" />
                )}
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {creditsLoading ? '...' : credits}
                </span>
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative flex items-center gap-1
                    text-gray-500 dark:text-monday-dark-text-secondary
                    hover:text-[#323338] dark:hover:text-monday-dark-text
                    transition-colors p-1.5 rounded
                    hover:bg-gray-100 dark:hover:bg-monday-dark-hover
                    h-8 flex items-center justify-center
                    ${isOpen ? 'bg-gray-100 dark:bg-monday-dark-hover text-[#323338] dark:text-monday-dark-text' : ''}
                `}
                title={`NABD Brain - ${credits} credits • ${deepModeEnabled ? 'Deep Mode' : 'Auto Mode'}${hasContext ? ' • Context Active' : ''}`}
            >
                {isProcessing ? (
                    <div className="relative">
                        <CircleNotch size={18} className="animate-spin text-blue-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {getTierIndicator()}
                        </div>
                    </div>
                ) : (
                    <Brain
                        size={18}
                        weight={deepModeEnabled ? 'fill' : 'duotone'}
                        className={deepModeEnabled ? 'text-purple-500' : ''}
                    />
                )}

                {/* Credits badge */}
                <span className={`
                    text-[10px] font-bold px-1 rounded
                    ${credits < 10
                        ? 'text-red-500 bg-red-500/10'
                        : credits < 30
                            ? 'text-amber-500 bg-amber-500/10'
                            : isDark ? 'text-gray-400' : 'text-gray-500'
                    }
                `}>
                    {creditsLoading ? '...' : credits}
                </span>

                {/* Context indicator */}
                {hasContext && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`
                    absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden
                    ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}
                `}>
                    {/* Header */}
                    <div className={`px-3 py-2 border-b ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain size={14} weight="fill" className="text-purple-500" />
                                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    NABD Brain
                                </span>
                            </div>
                            <span className={`
                                text-xs font-bold px-1.5 py-0.5 rounded-full
                                ${credits < 10
                                    ? 'text-red-500 bg-red-500/10'
                                    : credits < 30
                                        ? 'text-amber-500 bg-amber-500/10'
                                        : 'text-blue-500 bg-blue-500/10'
                                }
                            `}>
                                {creditsLoading ? '...' : `${credits} cr`}
                            </span>
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div className="p-2 space-y-1">
                        <div className={`text-[9px] font-bold uppercase tracking-wider px-2 mb-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Routing Mode
                        </div>

                        {/* Auto Mode (Smart Routing) */}
                        <button
                            onClick={() => { if (deepModeEnabled) toggleDeepMode(); setIsOpen(false); }}
                            className={`
                                w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all
                                ${!deepModeEnabled
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                                    : isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-50 text-gray-500'
                                }
                            `}
                        >
                            <Robot size={16} weight={!deepModeEnabled ? 'fill' : 'regular'} />
                            <div className="flex-1 text-left">
                                <div className="text-xs font-bold">Auto Mode</div>
                                <div className={`text-[9px] ${!deepModeEnabled ? 'text-white/80' : 'opacity-60'}`}>
                                    Smart routing • 1-5 cr
                                </div>
                            </div>
                            {!deepModeEnabled && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </button>

                        {/* Deep Mode */}
                        <button
                            onClick={() => { if (!deepModeEnabled) toggleDeepMode(); setIsOpen(false); }}
                            className={`
                                w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all
                                ${deepModeEnabled
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                    : isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-50 text-gray-500'
                                }
                            `}
                        >
                            <Brain size={16} weight={deepModeEnabled ? 'fill' : 'regular'} />
                            <div className="flex-1 text-left">
                                <div className="text-xs font-bold">Deep Mode</div>
                                <div className={`text-[9px] ${deepModeEnabled ? 'text-white/80' : 'opacity-60'}`}>
                                    Thinker only • 5 cr
                                </div>
                            </div>
                            {deepModeEnabled && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </button>
                    </div>

                    {/* Context Status */}
                    <div className={`px-3 py-2 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-2">
                            <Database size={12} className={hasContext ? 'text-green-500' : isDark ? 'text-gray-600' : 'text-gray-400'} />
                            <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {hasContext
                                    ? `Reading: ${currentBoardContext?.name || currentRoomContext?.name}`
                                    : 'No context loaded'
                                }
                            </span>
                        </div>
                    </div>

                    {/* Keyboard Shortcut Hint */}
                    <div className={`px-3 py-1.5 border-t ${isDark ? 'border-gray-800 bg-gray-800/30' : 'border-gray-100 bg-gray-50/50'}`}>
                        <div className="flex items-center justify-center gap-1">
                            <Info size={10} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                            <span className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Press <kbd className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-[8px] font-mono">⌘J</kbd> to open chat
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AICreditsDisplay;
