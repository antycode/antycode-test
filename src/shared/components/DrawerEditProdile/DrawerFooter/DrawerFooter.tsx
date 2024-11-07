import { ReactNode } from 'react';
import cls from './DrawerFooter.module.scss';
import clsx from 'clsx';

interface DrawerFooterProps {
    children: ReactNode;
    className?: string;
}

export const DrawerFooter = (props: DrawerFooterProps) => {
    const { children, className } = props;

    return <div className={clsx(cls.drawerFooter, className)}>{children}</div>;
};
