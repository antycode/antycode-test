import { ReactNode } from 'react';
import clsx from 'clsx';
import cls from './MainLayout.module.scss';
import { Sidebar } from '../Sidebar';
import { useLocation } from 'react-router-dom';
import { AppRoutes } from '@/shared/const/router';

type MainLayoutProps = {
    className?: string;
    children: ReactNode;
};

export const MainLayout = (props: MainLayoutProps) => {
    const { className, children } = props;
  
   let location = useLocation();

  const isProfilePage = AppRoutes.MAIN === location.pathname
  

    return (
        <div className={clsx(cls.mainLayout, className)}>
            <div className={cls.sidebar}>
                <Sidebar />
            </div>
            <div className={clsx(cls.content,{
              [cls.mainProfileLayout]:isProfilePage
            })}>{children}</div>
        </div>
    );
};
