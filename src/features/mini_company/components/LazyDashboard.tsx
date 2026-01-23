import React, { useState, useRef, useEffect, Suspense } from 'react';

interface LazyDashboardProps {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  props?: Record<string, any>;
  height?: string;
}

/**
 * Lazy loads dashboard components when they become visible in the viewport.
 * Uses IntersectionObserver for efficient visibility detection.
 */
export const LazyDashboard: React.FC<LazyDashboardProps> = ({
  component: Component,
  props = {},
  height = '400px'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      {
        rootMargin: '100px', // Start loading slightly before visible
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded]);

  return (
    <div ref={ref} style={{ minHeight: isVisible ? 'auto' : height }}>
      {isVisible ? (
        <Suspense fallback={
          <div className="flex items-center justify-center p-8" style={{ minHeight: height }}>
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Component {...props} />
        </Suspense>
      ) : (
        <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg m-4" style={{ minHeight: height }}>
          <div className="text-gray-400 text-sm">Loading dashboard...</div>
        </div>
      )}
    </div>
  );
};
