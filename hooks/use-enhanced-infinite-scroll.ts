import { useEffect, useCallback, useRef, useState } from 'react';

interface UseEnhancedInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
  threshold?: number; // Distance from bottom to trigger load (in pixels)
  prefetchThreshold?: number; // Distance to start prefetching
  retryAttempts?: number;
  retryDelay?: number;
  enabled?: boolean;
}

interface InfiniteScrollState {
  retryCount: number;
  lastError: Error | null;
  isPrefetching: boolean;
}

export function useEnhancedInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 300,
  prefetchThreshold = 600,
  retryAttempts = 3,
  retryDelay = 1000,
  enabled = true,
}: UseEnhancedInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isLoadingRef = useRef(false);
  const lastLoadTimeRef = useRef<number>(0);
  
  const [state, setState] = useState<InfiniteScrollState>({
    retryCount: 0,
    lastError: null,
    isPrefetching: false,
  });

  // Debounce to prevent rapid successive calls
  const MIN_LOAD_INTERVAL = 500; // ms

  const loadMoreWithRetry = useCallback(async () => {
    // Prevent duplicate calls
    if (isLoadingRef.current || !hasMore || !enabled) {
      return;
    }

    // Debounce check
    const now = Date.now();
    if (now - lastLoadTimeRef.current < MIN_LOAD_INTERVAL) {
      return;
    }

    isLoadingRef.current = true;
    lastLoadTimeRef.current = now;

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    let currentRetry = 0;

    while (currentRetry <= retryAttempts) {
      try {
        await onLoadMore();
        
        // Success - reset retry count and error
        setState({
          retryCount: 0,
          lastError: null,
          isPrefetching: false,
        });
        
        isLoadingRef.current = false;
        return;
      } catch (error) {
        // Check if aborted
        if (error instanceof Error && error.name === 'AbortError') {
          isLoadingRef.current = false;
          return;
        }

        currentRetry++;
        
        if (currentRetry <= retryAttempts) {
          // Exponential backoff
          const delay = retryDelay * Math.pow(2, currentRetry - 1);
          
          setState({
            retryCount: currentRetry,
            lastError: error as Error,
            isPrefetching: false,
          });

          console.log(`Retrying load (${currentRetry}/${retryAttempts}) after ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // All retries exhausted
          setState({
            retryCount: currentRetry,
            lastError: error as Error,
            isPrefetching: false,
          });
          
          console.error('Failed to load more items after retries:', error);
          isLoadingRef.current = false;
          return;
        }
      }
    }

    isLoadingRef.current = false;
  }, [hasMore, onLoadMore, retryAttempts, retryDelay, enabled]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      
      if (target.isIntersecting && hasMore && !isLoading && enabled) {
        loadMoreWithRetry();
      }
    },
    [hasMore, isLoading, loadMoreWithRetry, enabled]
  );

  useEffect(() => {
    const element = loadingRef.current;
    if (!element || !enabled) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: `${threshold}px`,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
        observerRef.current.disconnect();
      }
      
      // Abort any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [handleObserver, threshold, enabled]);

  // Update loading ref when isLoading prop changes
  useEffect(() => {
    if (!isLoading) {
      isLoadingRef.current = false;
    }
  }, [isLoading]);

  const retry = useCallback(() => {
    setState({
      retryCount: 0,
      lastError: null,
      isPrefetching: false,
    });
    loadMoreWithRetry();
  }, [loadMoreWithRetry]);

  return {
    loadingRef,
    retry,
    retryCount: state.retryCount,
    lastError: state.lastError,
    isPrefetching: state.isPrefetching,
  };
}
