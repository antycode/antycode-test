import { createContext } from 'react';

export type DrawerContextProps = {
  onClose?(): void;
};

export const DrawerContext = createContext<DrawerContextProps>({});
