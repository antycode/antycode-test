import React, { createContext } from 'react';
import { FoldersMode } from '../const/context';

export type FoldersModeContextType = {
    foldersMode: FoldersMode;
    setFoldersMode: React.Dispatch<React.SetStateAction<FoldersMode>>;
};

export const FoldersModeContext = createContext<FoldersModeContextType | null>(null);
