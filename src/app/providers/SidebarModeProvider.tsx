import { useMemo, useState, useLayoutEffect, PropsWithChildren } from 'react';
import { LOCAL_STORAGE_SIDEBAR_MODE } from '@/shared/const/localStorage';
import { SidebarModeContext } from '@/shared/context/SidebarModeContext';
import { SidebarMode } from '@/shared/const/context';

const storedSidebarMode = localStorage.getItem(LOCAL_STORAGE_SIDEBAR_MODE) as SidebarMode;

export const SidebarModeProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const [sidebarMode, setSidebarMode] = useState(storedSidebarMode || SidebarMode.FULL);

  useLayoutEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SIDEBAR_MODE, sidebarMode);
  }, [sidebarMode]);

  const defaultProps = useMemo(
    () => ({
      sidebarMode,
      setSidebarMode,
    }),
    [sidebarMode]
  );

  return (
    <SidebarModeContext.Provider value={defaultProps}>
      {children}
    </SidebarModeContext.Provider>
  );
};
