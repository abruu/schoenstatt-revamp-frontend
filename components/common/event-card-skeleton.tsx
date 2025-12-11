"use client"

import { useEffect, useState } from "react"

interface EventCardSkeletonProps {
  count?: number;
  className?: string;
}

export function EventCardSkeleton({ count = 1, className = "" }: EventCardSkeletonProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const animationClass = prefersReducedMotion ? '' : 'animate-pulse';

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col ${className}`}
          role="status"
          aria-label="Loading event"
        >
          {/* Image skeleton */}
          <div className={`aspect-video relative overflow-hidden bg-white/10 ${animationClass}`}>
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <div className="h-6 w-20 bg-white/20 rounded"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="p-6 flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className={`h-5 w-24 bg-white/10 rounded ${animationClass}`}></div>
              <div className={`h-4 w-20 bg-white/10 rounded ${animationClass}`}></div>
            </div>

            <div className={`h-6 w-3/4 bg-white/10 rounded ${animationClass}`}></div>
            <div className={`h-4 w-full bg-white/10 rounded ${animationClass}`}></div>
            <div className={`h-4 w-5/6 bg-white/10 rounded ${animationClass}`}></div>

            <div className={`h-4 w-32 bg-white/10 rounded ${animationClass}`}></div>

            {/* Actions skeleton */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
              <div className={`flex-1 h-10 bg-white/10 rounded ${animationClass}`}></div>
              <div className={`h-10 w-10 bg-white/10 rounded ${animationClass}`}></div>
            </div>
          </div>
          <span className="sr-only">Loading event card...</span>
        </div>
      ))}
    </>
  );
}
