"use client"

import { useRef, useEffect, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { GalleryCardSkeleton } from "./gallery-card-skeleton"

interface VirtualizedGalleryGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  columns?: {
    default: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  estimateSize?: number;
  overscan?: number;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  className?: string;
  aspectRatio?: "square" | "video";
}

export function VirtualizedGalleryGrid<T>({
  items,
  renderItem,
  isLoading,
  hasMore,
  onLoadMore,
  columns = { default: 2, md: 2, lg: 3, xl: 4 },
  estimateSize = 400,
  overscan = 5,
  loadingComponent,
  emptyComponent,
  className = "",
  aspectRatio = "square",
}: VirtualizedGalleryGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(onLoadMore);

  // Update ref to avoid stale closures
  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // Determine current column count based on viewport
  const getColumnCount = () => {
    if (typeof window === 'undefined') return columns.default;
    
    const width = window.innerWidth;
    if (width >= 1280 && columns.xl) return columns.xl;
    if (width >= 1024 && columns.lg) return columns.lg;
    if (width >= 768 && columns.md) return columns.md;
    return columns.default;
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

  useEffect(() => {
    const handleResize = () => {
      const newColumnCount = getColumnCount();
      if (newColumnCount !== columnCount) {
        setColumnCount(newColumnCount);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columnCount]);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(items.length / columnCount),
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  // Trigger load more when scrolling near the end
  useEffect(() => {
    const [lastRow] = [...virtualRows].reverse();

    if (!lastRow) return;

    const lastItemIndex = (lastRow.index + 1) * columnCount - 1;

    if (
      lastItemIndex >= items.length - columnCount - overscan &&
      hasMore &&
      !isLoading
    ) {
      loadMoreRef.current();
    }
  }, [virtualRows, items.length, hasMore, isLoading, columnCount, overscan]);

  // Initial loading state
  if (isLoading && items.length === 0) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loadingComponent || <GalleryCardSkeleton count={8} aspectRatio={aspectRatio} />}
      </div>
    );
  }

  // Empty state
  if (!isLoading && items.length === 0) {
    return <>{emptyComponent}</>;
  }

  const gridClass = `grid gap-6 ${className}`.trim();
  const responsiveGridCols = `grid-cols-${columns.default} md:grid-cols-${columns.md || columns.default} lg:grid-cols-${columns.lg || columns.md || columns.default} xl:grid-cols-${columns.xl || columns.lg || columns.md || columns.default}`;

  return (
    <div
      ref={parentRef}
      className="w-full"
      style={{
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const startIndex = virtualRow.index * columnCount;
          const rowItems = items.slice(startIndex, startIndex + columnCount);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={gridClass}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              }}
            >
              {rowItems.map((item, colIndex) => {
                const itemIndex = startIndex + colIndex;
                return (
                  <div key={itemIndex}>
                    {renderItem(item, itemIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Loading more indicator */}
      {isLoading && items.length > 0 && (
        <div className="flex justify-center py-8" role="status" aria-live="polite">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
            <span>Loading more photos...</span>
          </div>
        </div>
      )}
    </div>
  );
}
