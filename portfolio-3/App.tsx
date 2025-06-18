import React, { useState, useCallback, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import { WindowConfig, WindowInstance, AppId } from './types';

// Import section content components
import HeroContent from './components/sections/HeroContent';
import AboutContent from './components/sections/AboutContent';
import SkillsContent from './components/sections/SkillsContent';
import ExperienceContent from './components/sections/ExperienceContent';
import ContactContent from './components/sections/ContactContent';
import TerminalApp from './components/TerminalApp';

const initialApps: Record<AppId, WindowConfig> = {
  home: { id: 'home', title: 'Welcome', content: HeroContent, initialSize: { width: 600, height: 400 }, initialPosition: { x: 50, y: 50 } },
  about: { id: 'about', title: 'About Me', content: AboutContent, initialSize: { width: 700, height: 550 }, initialPosition: { x: 100, y: 100 } },
  skills: { id: 'skills', title: 'My Tech Arsenal', content: SkillsContent, initialSize: { width: 800, height: 600 }, initialPosition: { x: 150, y: 150 } },
  experience: { id: 'experience', title: 'My Journey & Capabilities', content: ExperienceContent, initialSize: { width: 750, height: 650 }, initialPosition: { x: 200, y: 200 } },
  contact: { id: 'contact', title: 'Let\'s Connect', content: ContactContent, initialSize: { width: 550, height: 680 }, initialPosition: { x: 250, y: 250 } },
  terminal: { id: 'terminal', title: 'Terminal', content: TerminalApp, initialSize: { width: 600, height: 400 }, initialPosition: { x: 300, y: 100 }, isTerminal: true },
};

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [maxWindowId, setMaxWindowId] = useState(0); // For unique window instance IDs

  const openWindow = useCallback((appId: AppId) => {
    const appConfig = initialApps[appId];
    if (!appConfig) return;

    // If window is already open and not minimized, bring to front
    const existingWindow = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existingWindow) {
      setWindows(prevWindows =>
        prevWindows.map(w =>
          w.id === existingWindow.id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
        )
      );
      setNextZIndex(prev => prev + 1);
      return;
    }
    
    // If window is minimized, restore it
    const minimizedWindow = windows.find(w => w.appId === appId && w.isMinimized);
    if (minimizedWindow) {
        setWindows(prevWindows =>
            prevWindows.map(w =>
                w.id === minimizedWindow.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
            )
        );
        setNextZIndex(prev => prev + 1);
        return;
    }

    const newWindowId = maxWindowId + 1;
    setMaxWindowId(newWindowId);

    const newWindow: WindowInstance = {
      id: `window-${appConfig.id}-${newWindowId}`,
      appId: appConfig.id,
      title: appConfig.title,
      content: appConfig.content,
      position: { ...appConfig.initialPosition },
      size: { ...appConfig.initialSize },
      zIndex: nextZIndex,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isTerminal: !!appConfig.isTerminal,
    };
    setWindows(prevWindows => [...prevWindows, newWindow]);
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex, windows, maxWindowId]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prevWindows => prevWindows.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  }, []);
  
  const toggleMaximizeWindow = useCallback((id: string) => {
    setWindows(prevWindows =>
      prevWindows.map(w => {
        if (w.id === id) {
          const isCurrentlyMaximized = w.isMaximized;
          return {
            ...w,
            isMaximized: !isCurrentlyMaximized,
            zIndex: nextZIndex, // Bring to front when maximizing/restoring
            // Store original position and size if maximizing, restore if unmaximizing
            prevPosition: !isCurrentlyMaximized ? w.position : w.prevPosition,
            prevSize: !isCurrentlyMaximized ? w.size : w.prevSize,
            position: !isCurrentlyMaximized ? { x: 0, y: 0 } : (w.prevPosition || w.position),
             // Taskbar height is 48px (h-12 in tailwind)
            size: !isCurrentlyMaximized ? { width: window.innerWidth, height: window.innerHeight - 48 } : (w.prevSize || w.size),
          };
        }
        return w;
      })
    );
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const focusWindow = useCallback((id: string) => {
    setWindows(prevWindows =>
      prevWindows.map(w =>
        w.id === id ? { ...w, zIndex: nextZIndex } : w
      )
    );
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, position } : w))
    );
  }, []);
  
  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, size } : w))
    );
  }, []);

  useEffect(() => {
    // Open Welcome window by default
    openWindow('home');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <div className="h-full flex flex-col antialiased overflow-hidden">
      <Desktop
        windows={windows.filter(w => !w.isMinimized)}
        onCloseWindow={closeWindow}
        onMinimizeWindow={minimizeWindow}
        onMaximizeWindow={toggleMaximizeWindow}
        onFocusWindow={focusWindow}
        onUpdateWindowPosition={updateWindowPosition}
        onUpdateWindowSize={updateWindowSize} 
        openWindow={openWindow} // Pass openWindow to Desktop
      />
      <Taskbar
        apps={initialApps}
        openWindows={windows}
        onOpenWindow={openWindow}
        onFocusWindow={focusWindow}
        onMinimizeWindow={minimizeWindow}
      />
    </div>
  );
};

export default App;