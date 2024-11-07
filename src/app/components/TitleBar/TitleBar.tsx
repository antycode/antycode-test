import { useContext, useMemo } from 'react';
import clsx from 'clsx';
import {
  SidebarModeContext,
  SidebarModeContextType,
} from '@/shared/context/SidebarModeContext';
import { SidebarMode } from '@/shared/const/context';
import { ReactComponent as MenuIcon } from '@/shared/assets/icons/menu.svg';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { ReactComponent as SquareIcon } from '@/shared/assets/icons/square.svg';
import { ReactComponent as MinimizeIcon } from '@/shared/assets/icons/minimize.svg';
import cls from './TitleBar.module.scss';

export const TitleBar = () => {
  const { setSidebarMode } = useContext(SidebarModeContext) as SidebarModeContextType;

  const handlers = useMemo(async () => await import('./titleBarHandlers'), []);

  const handleMenuClick = () => {
    setSidebarMode((prev) =>
      prev === SidebarMode.FULL ? SidebarMode.MINI : SidebarMode.FULL
    );
  };

  return (
    <div className={cls.titleBar}>
      <button className={clsx(cls.btn, cls.btnMenu)} onClick={handleMenuClick}>
        <MenuIcon className={cls.icon} width={22} height={22} />
      </button>
      <div className={cls.draggable}></div>
      <div className={cls.actions}>
        <button
          className={clsx(cls.btn, cls.btnMinimize)}
          onClick={async () => (await handlers).minimizeApp()}
        >
          <MinimizeIcon className={cls.icon} width={14} height={14} />
        </button>
        <button
          className={clsx(cls.btn, cls.btnExpand)}
          onClick={async () => (await handlers).maximizeApp()}
        >
          <SquareIcon className={cls.icon} width={16} height={16} />
        </button>
        <button
          className={clsx(cls.btn, cls.btnClose)}
          onClick={async () => (await handlers).closeApp()}
        >
          <CloseIcon className={cls.icon} width={12} height={12} />
        </button>
      </div>
    </div>
  );
};
