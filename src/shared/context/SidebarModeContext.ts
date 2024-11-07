import React, { createContext } from 'react';
import { SidebarMode } from '../const/context';

export type SidebarModeContextType = {
  sidebarMode: SidebarMode;
  setSidebarMode: React.Dispatch<React.SetStateAction<SidebarMode>>;
};

export const SidebarModeContext = createContext<SidebarModeContextType | null>(null);
