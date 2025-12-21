import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const AuroraBackground: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth floating movement for the blobs
    const springConfig = { damping: 25, stiffness: 50 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Parallax effects
    const moveX = useTransform(x, [0, window.innerWidth], [-20, 20]);
    const moveY = useTransform(y, [0, window.innerHeight], [-20, 20]);
    const moveXInv = useTransform(x, [0, window.innerWidth], [20, -20]);
    const moveYInv = useTransform(y, [0, window.innerHeight], [20, -20]);

    const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Deep Base */}
            <div className="absolute inset-0 bg-gray-50 dark:bg-gray-950 transition-colors duration-700" />

            {/* Aurora Mesh */}
            <motion.div
                className="absolute inset-0 opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen filter blur-3xl"
                style={{ x: moveX, y: moveY }}
            >
                {/* Blob 1: Primary Blue/Purple */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 animate-pulse" style={{ animationDuration: '8s' }} />

                {/* Blob 2: Secondary Cyan/Teal */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-cyan-400/20 to-teal-500/20 animate-pulse" style={{ animationDuration: '12s' }} />

                {/* Blob 3: Accent Pink/Rose (Center drift) */}
                <motion.div
                    className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-rose-400/20 to-orange-300/20"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </motion.div>

            {/* Noise Overlay for Texture */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/5 dark:to-black/30" />
        </div>
    );
};
