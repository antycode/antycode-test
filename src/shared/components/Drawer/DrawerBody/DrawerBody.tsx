import { ReactNode } from 'react';
import cls from './DrawerBody.module.scss';
import clsx from 'clsx';

interface DrawerBodyProps {
  children: ReactNode;
  className?: string;
}

export const DrawerBody = (props: DrawerBodyProps) => {
  const { children, className } = props;

  return <div className={clsx(cls.drawerBody, className)}>{children}</div>;
};
