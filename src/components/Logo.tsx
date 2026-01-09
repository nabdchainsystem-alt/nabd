import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-auto", showText = true, textClassName = "" }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Abstract "Pulse/Chain" Logo Mark */}
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" /> {/* blue-600 */}
                        <stop offset="100%" stopColor="#06B6D4" /> {/* cyan-500 */}
                    </linearGradient>
                </defs>

                {/* Central Pulse Line */}
                <path
                    d="M15 50 H35 L45 20 L55 80 L65 50 H85"
                    stroke="url(#logoGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Outer Chain Links (Stylized) */}
                <circle cx="50" cy="50" r="42" stroke="#1F2937" strokeWidth="4" strokeOpacity="0.1" />
                <path d="M20 50 A 30 30 0 0 1 80 50" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10" opacity="0.5" />
            </svg>

            {showText && (
                <div className={`flex flex-col justify-center ${textClassName}`}>
                    <span className="font-bold leading-none tracking-tight text-gray-900 dark:text-white" style={{ fontSize: '1.2em' }}>
                        NABD
                    </span>
                    <span className="text-blue-600 font-semibold tracking-wide" style={{ fontSize: '0.9em' }}>
                        CHAIN
                    </span>
                </div>
            )}
        </div>
    );
};
