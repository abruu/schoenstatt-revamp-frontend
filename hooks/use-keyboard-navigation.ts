import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
  onSelect?: () => void;
  enabled?: boolean;
  containerRef?: React.RefObject<HTMLElement>;
}

/**
 * Hook for keyboard navigation support in lists and grids
 * Provides arrow key navigation and Enter/Space for selection
 */
export function useKeyboardNavigation({
  onNavigateNext,
  onNavigatePrevious,
  onSelect,
  enabled = true,
  containerRef,
}: UseKeyboardNavigationOptions) {
  const focusedIndexRef = useRef<number>(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const { key } = event;

      switch (key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          if (onNavigateNext) {
            onNavigateNext();
            focusedIndexRef.current += 1;
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          if (onNavigatePrevious) {
            onNavigatePrevious();
            focusedIndexRef.current = Math.max(0, focusedIndexRef.current - 1);
          }
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          if (onSelect) {
            onSelect();
          }
          break;

        case 'Home':
          event.preventDefault();
          focusedIndexRef.current = 0;
          break;

        case 'End':
          event.preventDefault();
          // Will be handled by the component
          break;

        default:
          break;
      }
    },
    [enabled, onNavigateNext, onNavigatePrevious, onSelect]
  );

  useEffect(() => {
    const element = containerRef?.current || document;

    if (enabled) {
      element.addEventListener('keydown', handleKeyDown as any);
    }

    return () => {
      element.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [enabled, handleKeyDown, containerRef]);

  return {
    focusedIndex: focusedIndexRef.current,
    setFocusedIndex: (index: number) => {
      focusedIndexRef.current = index;
    },
  };
}
