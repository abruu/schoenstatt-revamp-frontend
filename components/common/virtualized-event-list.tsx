"use client"

import { useRef, useEffect } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { EventCardSkeleton } from "./event-card-skeleton"

interface VirtualizedEventListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  estimateSize?: number;
  overscan?: number;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function VirtualizedEventList<T>({
  items,
  renderItem,
  isLoading,
  hasMore,
  onLoadMore,
  estimateSize = 450,
  overscan = 3,
  loadingComponent,
  emptyComponent,
  className = "grid md:grid-cols-2 lg:grid-cols-3 gap-8",
  itemClassName = "",
}: VirtualizedEventListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(onLoadMore);

  // Update ref to avoid stale closures
  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    // Enable smooth scrolling
    scrollMargin: 0,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // Trigger load more when scrolling near the end
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= items.length - 1 - overscan &&
      hasMore &&
      !isLoading
    ) {
      loadMoreRef.current();
    }
  }, [virtualItems, items.length, hasMore, isLoading, overscan]);

  // Initial loading state
  if (isLoading && items.length === 0) {
    return (
      <div className={className}>
        {loadingComponent || <EventCardSkeleton count={6} />}
      </div>
    );
  }

  // Empty state
  if (!isLoading && items.length === 0) {
    return <>{emptyComponent}</>;
  }

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
        <div
          className={className}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const item = items[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className={itemClassName}
                style={{
                  gridColumn: 'span 1',
                }}
              >
                {renderItem(item, virtualRow.index)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading more indicator */}
      {isLoading && items.length > 0 && (
        <div className="flex justify-center py-8" role="status" aria-live="polite">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
            <span>Loading more events...</span>
          </div>
        </div>
      )}
    </div>
  );
}
