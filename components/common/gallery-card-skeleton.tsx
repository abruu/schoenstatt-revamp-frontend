"use client"

import { useEffect, useState } from "react"

interface GalleryCardSkeletonProps {
  count?: number;
  className?: string;
  aspectRatio?: "square" | "video";
}

export function GalleryCardSkeleton({ 
  count = 1, 
  className = "",
  aspectRatio = "square"
}: GalleryCardSkeletonProps) {
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
  const aspectClass = aspectRatio === "square" ? "aspect-square" : "aspect-video";

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`relative ${className}`}
          role="status"
          aria-label="Loading gallery item"
        >
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className={`${aspectClass} bg-white/10 ${animationClass}`}>
              <div className="absolute top-3 left-3">
                <div className="h-5 w-16 bg-white/20 rounded"></div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className={`h-4 bg-white/10 rounded w-3/4 ${animationClass}`}></div>
              <div className={`h-3 bg-white/10 rounded w-full ${animationClass}`}></div>
              <div className={`h-3 bg-white/10 rounded w-1/2 ${animationClass}`}></div>
              <div className="flex justify-between mt-4">
                <div className={`h-3 bg-white/10 rounded w-1/4 ${animationClass}`}></div>
                <div className={`h-3 bg-white/10 rounded w-1/4 ${animationClass}`}></div>
              </div>
            </div>
          </div>
          <span className="sr-only">Loading gallery image...</span>
        </div>
      ))}
    </>
  );
}
