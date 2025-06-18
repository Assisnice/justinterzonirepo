
import React from 'react';
import Window from './Window';
import AnimatedBackground from './AnimatedBackground';
import { WindowInstance, AppId } from '../types';

interface DesktopProps {
  windows: WindowInstance[];
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onUpdateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateWindowSize: (id: string, size: {width: number; height: number}) => void;
  openWindow: (appId: AppId) => void;
  isMobileView: boolean; // Added prop
}

const Desktop: React.FC<DesktopProps> = ({
  windows,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onFocusWindow,
  onUpdateWindowPosition,
  onUpdateWindowSize,
  openWindow,
  isMobileView, // Destructure new prop
}) => {
  return (
    <div className="relative flex-grow h-full w-full overflow-hidden bg-os-desktop">
      <AnimatedBackground />
      {windows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          initialPosition={win.position}
          initialSize={win.size}
          zIndex={win.zIndex}
          isMaximized={win.isMaximized}
          isTerminal={win.isTerminal}
          onClose={() => onCloseWindow(win.id)}
          onMinimize={() => onMinimizeWindow(win.id)}
          onMaximize={() => onMaximizeWindow(win.id)}
          onFocus={() => onFocusWindow(win.id)}
          onDragStop={(pos) => onUpdateWindowPosition(win.id, pos)}
          openApp={openWindow}
          isMobileView={isMobileView} // Pass isMobileView to Window
          isMinimized={win.isMinimized} // Pass isMinimized status
        >
          <win.content />
        </Window>
      ))}
    </div>
  );
};

export default Desktop;
