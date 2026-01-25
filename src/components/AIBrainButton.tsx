import React, { useState, useEffect, useRef } from 'react';
import { Sparkle, Power } from 'phosphor-react';
import { useAI } from '../contexts/AIContext';
import { useAppContext } from '../contexts/AppContext';
import AIChat from './AIChat';

/**
 * NABD Brain - Smooth Wave AI Button
 * - Click to open AI chat (when enabled)
 * - Right-click or long-press to toggle AI on/off
 * - Features smooth flowing wave animations with black/silver gradient
 */
export function AIBrainButton() {
    const { isProcessing, aiEnabled, toggleAI } = useAI();
    const { t, dir } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [showToggleHint, setShowToggleHint] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const isRTL = dir === 'rtl';

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
                e.preventDefault();
                if (aiEnabled) {
                    setIsOpen(prev => !prev);
                } else {
                    // Show hint that AI is disabled
                    setShowToggleHint(true);
                    setTimeout(() => setShowToggleHint(false), 2000);
                }
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, aiEnabled]);

    const handleClick = () => {
        if (aiEnabled) {
            setIsOpen(!isOpen);
        } else {
            setShowToggleHint(true);
            setTimeout(() => setShowToggleHint(false), 2000);
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleAI();
    };

    const handleMouseDown = () => {
        setIsPressed(true);
        // Long press to toggle
        longPressTimer.current = setTimeout(() => {
            toggleAI();
            setIsPressed(false);
        }, 800);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleMouseLeave = () => {
        setIsPressed(false);
        setIsHovered(false);
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    return (
        <>
            {/* Toggle hint tooltip */}
            {showToggleHint && (
                <div className={`fixed bottom-20 z-50 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg ${isRTL ? 'left-6' : 'right-6'}`}>
                    {t('ai_disabled_hint')}
                </div>
            )}

            {/* Smooth Wave Button */}
            <button
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => setIsHovered(true)}
                title={aiEnabled ? `${t('open_ai_chat')} (⌘J) • ${t('right_click_disable')}` : `${t('ai_disabled')} • ${t('right_click_enable')}`}
                className={`
                    fixed bottom-6 z-50
                    w-[52px] h-[52px] rounded-full
                    flex items-center justify-center
                    transition-all duration-300
                    ${isRTL ? 'left-6' : 'right-6'}
                    ${isPressed ? 'scale-90' : isHovered ? 'scale-110' : 'scale-100'}
                    ${aiEnabled ? 'ai-wave-button' : 'ai-wave-button-disabled'}
                `}
                style={{
                    border: '1px solid rgba(100, 100, 100, 0.3)',
                }}
            >
                {/* Outer blue ring */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        zIndex: 10,
                        background: aiEnabled
                            ? 'conic-gradient(from 0deg, #1e40af, #3b82f6, #60a5fa, #93c5fd, #dbeafe, #93c5fd, #60a5fa, #3b82f6, #1e40af)'
                            : 'conic-gradient(from 0deg, #2a2a2a, #3a3a3a, #4a4a4a, #3a3a3a, #2a2a2a)',
                        padding: '2px',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                    }}
                />

                {/* Inner content area - base layer */}
                <div
                    className="absolute rounded-full"
                    style={{
                        inset: '3px',
                        zIndex: 1,
                        background: aiEnabled
                            ? `
                                radial-gradient(circle at 30% 25%, #3b82f6 0%, transparent 35%),
                                radial-gradient(circle at 70% 75%, #2563eb 0%, transparent 40%),
                                radial-gradient(circle at 50% 50%, #1e40af 0%, #1e3a8a 100%)
                            `
                            : 'radial-gradient(circle at 50% 50%, #252525 0%, #1a1a1a 100%)',
                    }}
                />

                {/* Gradient layer 1 - diagonal sweep */}
                {aiEnabled && (
                    <div
                        className="absolute rounded-full"
                        style={{
                            inset: '3px',
                            zIndex: 2,
                            background: `
                                linear-gradient(135deg, transparent 0%, rgba(96,165,250,0.5) 20%, rgba(147,197,253,0.4) 40%, rgba(96,165,250,0.5) 60%, transparent 80%),
                                linear-gradient(315deg, transparent 0%, rgba(59,130,246,0.3) 30%, rgba(96,165,250,0.25) 50%, transparent 70%)
                            `,
                        }}
                    />
                )}

                {/* Gradient layer 2 - curved highlight top-left */}
                {aiEnabled && (
                    <div
                        className="absolute rounded-full"
                        style={{
                            inset: '3px',
                            zIndex: 3,
                            background: 'radial-gradient(ellipse 140% 100% at 15% 15%, rgba(255,255,255,0.35) 0%, rgba(219,234,254,0.2) 25%, transparent 50%)',
                        }}
                    />
                )}

                {/* Gradient layer 3 - bottom-right white reflection */}
                {aiEnabled && (
                    <div
                        className="absolute rounded-full"
                        style={{
                            inset: '3px',
                            zIndex: 3,
                            background: 'radial-gradient(ellipse 120% 80% at 85% 85%, rgba(219,234,254,0.25) 0%, rgba(147,197,253,0.12) 30%, transparent 55%)',
                        }}
                    />
                )}

                {/* Gradient layer 4 - center white glow */}
                {aiEnabled && (
                    <div
                        className="absolute rounded-full"
                        style={{
                            inset: '3px',
                            zIndex: 3,
                            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, rgba(191,219,254,0.15) 30%, transparent 60%)',
                        }}
                    />
                )}

                {/* Gradient layer 5 - horizontal white band */}
                {aiEnabled && (
                    <div
                        className="absolute rounded-full"
                        style={{
                            inset: '3px',
                            zIndex: 3,
                            background: 'linear-gradient(180deg, transparent 35%, rgba(191,219,254,0.15) 45%, rgba(255,255,255,0.2) 50%, rgba(191,219,254,0.15) 55%, transparent 65%)',
                        }}
                    />
                )}

                {/* Wave layers - flowing animation */}
                {aiEnabled && (
                    <>
                        <div className="ai-wave-layer ai-wave-1" style={{ zIndex: 4 }} />
                        <div className="ai-wave-layer ai-wave-2" style={{ zIndex: 4 }} />
                        <div className="ai-wave-layer ai-wave-3" style={{ zIndex: 4 }} />
                    </>
                )}

                {/* Gradient layer 6 - top arc highlight */}
                <div
                    className="absolute rounded-full"
                    style={{
                        inset: '3px',
                        zIndex: 5,
                        background: aiEnabled
                            ? 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(219,234,254,0.12) 20%, transparent 45%)'
                            : 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 30%)',
                    }}
                />

                {/* Gradient layer 7 - side white streaks */}
                {aiEnabled && (
                    <div
                        className="absolute rounded-full"
                        style={{
                            inset: '3px',
                            zIndex: 5,
                            background: `
                                linear-gradient(90deg, transparent 0%, rgba(219,234,254,0.15) 15%, transparent 35%, transparent 65%, rgba(219,234,254,0.15) 85%, transparent 100%),
                                linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)
                            `,
                        }}
                    />
                )}

                {/* Gradient layer 8 - bottom subtle reflection */}
                {aiEnabled && (
                    <div
                        className="absolute rounded-full"
                        style={{
                            inset: '3px',
                            zIndex: 5,
                            background: 'linear-gradient(0deg, rgba(147,197,253,0.12) 0%, transparent 30%)',
                        }}
                    />
                )}

                {/* Top highlight reflection - glass effect */}
                <div
                    className="absolute rounded-full"
                    style={{
                        top: '5px',
                        left: '8px',
                        width: '45%',
                        height: '30%',
                        zIndex: 6,
                        background: aiEnabled
                            ? 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(219,234,254,0.25) 40%, transparent 100%)'
                            : 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
                        borderRadius: '50%',
                        filter: 'blur(1px)',
                    }}
                />

                {/* AI Icon or Power Off icon */}
                {aiEnabled ? (
                    <Sparkle
                        size={22}
                        weight="fill"
                        className={`relative z-20 ${isProcessing ? 'animate-spin' : ''}`}
                        style={{
                            color: '#ffffff',
                            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 3px rgba(219,234,254,0.5)) drop-shadow(0 1px 2px rgba(30,64,175,0.4))',
                        }}
                    />
                ) : (
                    <Power
                        size={22}
                        weight="bold"
                        className="relative z-20"
                        style={{
                            color: '#666',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                        }}
                    />
                )}
            </button>

            {/* Chat Modal - only render when AI is enabled */}
            {aiEnabled && <AIChat isOpen={isOpen} onClose={() => setIsOpen(false)} />}
        </>
    );
}

export default AIBrainButton;
