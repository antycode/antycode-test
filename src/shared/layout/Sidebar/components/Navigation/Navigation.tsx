import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { AppRoutes } from '@/shared/const/router';
import cls from './Navigation.module.scss';
import { NavigationLink } from '../NavigationLink/NavigationLink';
import { LinkTypes, NavbarGroup } from '../../types/types';

import { ReactComponent as UserIcon } from '@/shared/assets/icons/user.svg';
import { ReactComponent as ImportIcon } from '@/shared/assets/icons/import.svg';
import { ReactComponent as DotsPenIcon } from '@/shared/assets/icons/dots-pen.svg';
import { ReactComponent as ProxyIcon } from '@/shared/assets/icons/proxy.svg';
import { ReactComponent as PuzzleIcon } from '@/shared/assets/icons/puzzle.svg';
import { ReactComponent as UsersIcon } from '@/shared/assets/icons/users.svg';
import { ReactComponent as ApiIcon } from '@/shared/assets/icons/api.svg';
import { ReactComponent as GearIcon } from '@/shared/assets/icons/gear.svg';
import { ReactComponent as LockIcon } from '@/shared/assets/icons/lock.svg';
import { ReactComponent as CardIcon } from '@/shared/assets/icons/card.svg';
import { ReactComponent as ShoppingCartIcon } from '@/shared/assets/icons/shopping-cart.svg';
import { ReactComponent as SupportIcon } from '@/shared/assets/icons/support.svg';
import { ReactComponent as NoticeIcon } from '@/shared/assets/icons/notice-icon.svg';

interface NavigationProps {
  isMini: boolean;
}

interface NavbarItem {
  text: string;
  to: string;
  icon: React.ReactNode;
}

export const Navigation = (props: NavigationProps) => {
  const { isMini } = props;

  const { t, i18n } = useTranslation();

  const replaceIconForNullPath = (items: NavbarItem[]): NavbarItem[] =>
    items.map((item) => ({
      ...item,
      icon: item.to === '/null' ? <LockIcon /> : item.icon,
    }));

    const navigation = useMemo(
      () =>
        [
          {
            type: LinkTypes.primary,
            items: replaceIconForNullPath([
              { text: t('Profiles'), to: AppRoutes.MAIN, icon: <UserIcon /> },
              {
                text: t('Software'),
                to: AppRoutes.AUTOREG,
                icon: <DotsPenIcon />,
              },
              {
                text: t('Proxy'),
                to: AppRoutes.PROXIES,
                icon: <ProxyIcon />,
              },
              {
                text: t('Extension'),
                to: AppRoutes.Extension,
                icon: <PuzzleIcon />,
              },
              {
                text: t('Team'),
                to: AppRoutes.TEAM,
                icon: <UsersIcon />,
              },
            ]),
          },
          {
            label: t('Payment'),
            labelClassName: cls.groupLabelAcc,
            type: LinkTypes.secondary,
            items: replaceIconForNullPath([
              {
                text: t('Payment'),
                to: AppRoutes.PAYMENT,
                icon: <CardIcon />,
              },
            ]),
          },
          {
            label: t('Mail'),
            labelClassName: cls.groupLabelAcc,
            type: LinkTypes.secondary,
            items: replaceIconForNullPath([
              {
                text: t('Notifications'),
                to: AppRoutes.NOTICE,
                icon: <NoticeIcon />,
              },
            ]),
          },
          {
            label: t('API'),
            labelClassName: cls.groupLabelApi,
            type: LinkTypes.secondary,
            items: replaceIconForNullPath([
              { text: t('API'), to: '/null', icon: <ApiIcon /> },
            ]),
          },
          {
            label: t('Basket'),
            labelClassName: cls.groupLabelBacket,
            type: LinkTypes.secondary,
            items: replaceIconForNullPath([
              {
                text: t('Cart'),
                to: AppRoutes.TRASH,
                icon: <ShoppingCartIcon />,
              },
            ]),
          },
          {
            label: t('Help'),
            labelClassName: cls.groupLabelAcc,
            type: LinkTypes.secondary,
            items: replaceIconForNullPath([
              {
                text: t('Support'),
                to: AppRoutes.LoadingUpdate,
                icon: <SupportIcon />,
              },
            ]),
          },
        ] as NavbarGroup[],
      [i18n.language, isMini],
    );

  return (
    <nav className={cls.nav}>
      {navigation.map((group, idx) => (
        <div
          key={idx}
          className={clsx(
            cls.group,
            group.type === LinkTypes.primary ? cls.groupTypePrimary : cls.groupTypeSecondary,
          )}>
          {group.label && (
            <div className={clsx(cls.groupLabel, group.labelClassName)}>{group.label}</div>
          )}

          <div className={cls.items}>
            {group.items.map((item) => (
              <div key={item.text} className={cls.item}>
                <NavigationLink item={item} isMini={isMini} />
              </div>
            ))}
          </div>

          {idx < navigation.length - 1 && <div className={cls.divider}></div>}
        </div>
      ))}
    </nav>
  );
};
