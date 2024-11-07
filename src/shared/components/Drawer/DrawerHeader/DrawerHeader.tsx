import { ReactNode } from 'react';
import cls from './DrawerHeader.module.scss';
import clsx from 'clsx';

interface DrawerHeaderProps {
  children: ReactNode;
  className?: string;
}

export const DrawerHeader = (props: DrawerHeaderProps) => {
  const { children, className } = props;

  return <div className={clsx(cls.drawerHeader, className)}>{children}</div>;
};
