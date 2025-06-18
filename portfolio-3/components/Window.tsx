import React from 'react';
import { useDraggable } from '../hooks/useDraggable';
import XIcon from './icons/XIcon';
import MinimizeIcon from './icons/MinimizeIcon';
import MaximizeIcon from './icons/MaximizeIcon';
import RestoreIcon from './icons/RestoreIcon';
import { AppId, ContentComponentProps } from '../types';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode; // This will be <win.content /> from Desktop.tsx
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  zIndex: number;
  isMaximized: boolean;
  isTerminal?: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDragStop: (position: { x: number; y: number }) => void;
  openApp?: (appId: AppId) => void; // New prop from Desktop
}

const WindowComponent: React.FC<WindowProps> = ({
  id,
  title,
  children,
  initialPosition,
  initialSize,
  zIndex,
  isMaximized,
  isTerminal = false,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragStop,
  openApp, // Destructure new prop
}) => {
  const { 
    position: currentPosition,
    ref: draggableRef, 
    ...dragEventHandlers 
  } = useDraggable({
    initialPosition,
    onDragStop,
    disabled: isMaximized,
  });

  const windowStyle: React.CSSProperties = isMaximized ? {
    top: 0,
    left: 0,
    width: '100%',
    height: `calc(100% - 48px)`, 
    zIndex,
    position: 'absolute',
  } : {
    top: currentPosition.y,
    left: currentPosition.x,
    width: initialSize.width,
    height: initialSize.height,
    zIndex,
    position: 'absolute',
  };

  let contentWithProps = children;
  if (openApp && React.isValidElement(children) && typeof children.type === 'function') {
    // Clone the child (e.g., <HeroContent />) and add openWindow prop to it
    contentWithProps = React.cloneElement(children as React.ReactElement<ContentComponentProps>, { openWindow: openApp });
  }

  return (
    <div
      ref={draggableRef}
      id={id}
      className={`absolute flex flex-col bg-os-window-bg backdrop-blur-md shadow-window rounded-lg overflow-hidden border border-slate-700/50 ${isMaximized ? 'rounded-none border-none' : ''} animate-windowOpen`}
      style={windowStyle}
      onMouseDownCapture={onFocus} 
      onTouchStartCapture={onFocus}
    >
      {/* Title Bar */}
      <div
        {...(!isMaximized ? dragEventHandlers : {})} 
        className={`flex items-center justify-between h-8 px-2 bg-os-title-bar text-slate-300 select-none ${isMaximized ? '' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <span className="text-xs font-semibold truncate">{title}</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={onMinimize}
            className="p-1 rounded hover:bg-slate-600 transition-colors"
            aria-label="Minimize window"
          >
            <MinimizeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onMaximize}
            className="p-1 rounded hover:bg-slate-600 transition-colors"
            aria-label={isMaximized ? "Restore window" : "Maximize window"}
          >
            {isMaximized ? <RestoreIcon className="w-4 h-4" /> : <MaximizeIcon className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-red-500 transition-colors"
            aria-label="Close window"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-grow p-4 overflow-auto os-window-content ${isTerminal ? 'bg-black text-green-400 font-mono text-sm p-2' : 'text-slate-200'}`}>
        {contentWithProps}
      </div>
    </div>
  );
};

export default WindowComponent;