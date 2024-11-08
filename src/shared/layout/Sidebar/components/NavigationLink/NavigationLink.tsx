import { memo } from 'react';
import clsx from 'clsx';
import * as RdxTooltip from '@radix-ui/react-tooltip';
import { NavbarItem } from '../../types/types';
import { NavLink } from 'react-router-dom';
import { Tooltip } from '@/shared/components/Tooltip/Tooltip';
import { AppRoutes } from '@/shared/const/router';
import cls from './NavigationLink.module.scss';
import { setIsEditProfileDrawer, setIsProfileCreationDrawer } from '@/store/reducers/Drawers';
import { useDispatch } from 'react-redux';

const allowedRoutes: any = [
  AppRoutes.MAIN,
  AppRoutes.AUTOREG,
  AppRoutes.PROXIES,
  AppRoutes.PAYMENT,
  AppRoutes.TRASH,
  AppRoutes.TEAM,
  AppRoutes.NOTICE,
  AppRoutes.Extension,
  AppRoutes.LoadingUpdate,
]; //FIXME remove any

interface NavigationLinkProps {
  item: NavbarItem;
  isMini: boolean;
}

export const NavigationLink = memo(({ item, isMini }: NavigationLinkProps) => {
  const dispatch = useDispatch();

  const closeProfileDrawers = () => {
    dispatch(setIsProfileCreationDrawer(false));
    dispatch(setIsEditProfileDrawer(false));
  };

  return (
    <RdxTooltip.Provider>
      <RdxTooltip.Root disableHoverableContent delayDuration={50} open={isMini ? undefined : false}>
        <div></div>
        <RdxTooltip.Trigger asChild>
          <div style={{ width: '100%' }}>
            <NavLink
              to={item.to}
              onClick={closeProfileDrawers}
              className={({ isActive }) =>
                clsx({
                  [cls.link]: true,
                  [cls.linkActive]: isActive,
                  [cls.linkDisabled]: !allowedRoutes.includes(item.to),
                })
              }>
              <div className={cls.icon}>{item.icon}</div>
              <span className={cls.linkText}>{item.text}</span>
            </NavLink>
          </div>
        </RdxTooltip.Trigger>

        <RdxTooltip.Portal>
          <RdxTooltip.Content side="right">
            <Tooltip content={item.text} />
          </RdxTooltip.Content>
        </RdxTooltip.Portal>
      </RdxTooltip.Root>
    </RdxTooltip.Provider>
  );
});
