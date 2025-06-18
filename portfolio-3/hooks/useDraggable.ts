import { useRef, useState, useCallback, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';

interface UseDraggableOptions {
  initialPosition: { x: number; y: number };
  onDragStop?: (position: { x: number; y: number }) => void;
  disabled?: boolean;
}

export const useDraggable = ({ initialPosition, onDragStop, disabled = false }: UseDraggableOptions) => {
  const [position, setPosition] = useState(initialPosition);
  const ref = useRef<HTMLDivElement>(null); // Ref for the draggable element itself

  // Update position if initialPosition prop changes (e.g., due to maximization restoring to a new initialPosition)
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  const bind = useDrag(({ down, movement: [mx, my], event, first, memo }) => {
    if (disabled) return;

    // Prevent drag from child buttons within the title bar
    const target = event.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    
    let newPos;
    if (first) {
        // memoize the initial position at the start of the drag
        memo = position;
    }

    newPos = {
        x: memo.x + mx,
        y: memo.y + my,
    };

    if (down) {
      setPosition(newPos);
    } else {
      // Drag ended
      // Update initialPosition for next drag cycle based on where this drag ended.
      // This is handled by onDragStop callback which updates App's state for the window.
      if (onDragStop) {
        onDragStop(newPos);
      }
    }
    return memo; // Pass memo to the next event
  }, {
    // from: () => [position.x, position.y], // This helps keep position relative to the start of the drag
    preventScroll: true,
  });
  
  // bind() returns the event handlers. Spreading ...bind() calls the function and spreads its result.
  return { position, ref, ...bind() }; 
};