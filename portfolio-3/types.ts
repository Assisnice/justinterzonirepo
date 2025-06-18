import React from 'react';

export type AppId = 'home' | 'about' | 'skills' | 'experience' | 'contact' | 'terminal';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface ContentComponentProps {
  openWindow?: (appId: AppId) => void;
}

export interface WindowConfig {
  id: AppId;
  title: string;
  content: React.FC<ContentComponentProps>; // Content component for the window
  initialPosition: WindowPosition;
  initialSize: WindowSize;
  isTerminal?: boolean;
}

export interface WindowInstance {
  id: string; // Unique instance ID, e.g., "window-about-1"
  appId: AppId; // Original app ID
  title: string;
  content: React.FC<ContentComponentProps>;
  position: WindowPosition;
  size: WindowSize;
  prevPosition?: WindowPosition; // For restoring from maximized
  prevSize?: WindowSize;       // For restoring from maximized
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isTerminal?: boolean;
}

// Keep Skill types if SkillsSection content uses them
export enum SkillCategory {
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  DATABASES = "Databases",
  TOOLS = "Tools & Technologies"
}

export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: React.ReactNode;
}

// NavItem might be repurposed for Start Menu or similar
export interface NavItem {
  name: string;
  appId: AppId; // Changed href to appId
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface TerminalCommand {
  command: string;
  description: string;
  action: (args: string[], openWindow?: (appId: AppId) => void) => string | void | Promise<string | void>;
}