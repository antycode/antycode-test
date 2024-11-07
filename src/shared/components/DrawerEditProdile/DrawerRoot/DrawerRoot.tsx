import {ReactNode, useContext, useEffect, useRef} from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { Portal } from '../../Portal/Portal';
import cls from './DrawerRoot.module.scss';
import { DrawerContext } from '../Drawer.context';
import {
  SidebarModeContext,
  SidebarModeContextType,
} from '@/shared/context/SidebarModeContext';
import { SidebarMode } from '@/shared/const/context';

interface DrawerRootProps {
  opened: boolean;
  onClose(): void;
  className?: string;
  children: ReactNode;
  closeOnEscape?: boolean;
}

export const DrawerRoot = (props: DrawerRootProps) => {
  const { children, opened, onClose, className, closeOnEscape = true } = props;

  const { sidebarMode } = useContext(SidebarModeContext) as SidebarModeContextType;

  const isMiniSidebar = sidebarMode === SidebarMode.MINI;

  const nodeRef = useRef(null);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  return (
    <DrawerContext.Provider value={{ onClose }}>
      <Portal>
        <CSSTransition
          nodeRef={nodeRef}
          unmountOnExit
          in={opened}
          timeout={{ enter: 0, exit: 500 }}
        >
          <div
            ref={nodeRef}
            className={clsx(cls.drawer, className, opened && cls.visible)}
          >
            <div className={cls.overlay} onClick={() => onClose()}></div>

            <div className={cls.drawerInner} data-mini-sidebar={isMiniSidebar}>
              <div className={cls.content}>{children}</div>
            </div>
          </div>
        </CSSTransition>
      </Portal>
    </DrawerContext.Provider>
  );
};
