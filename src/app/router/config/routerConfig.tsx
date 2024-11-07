import { Navigate, Outlet, createBrowserRouter, useLocation } from 'react-router-dom';
import { AutoregPage } from '@/pages/AutoregPage';
import { ProfilesPage } from '@/pages/ProfilesPage';
import { ProxiesPage } from '@/pages/ProxiesPage';
import { AppRoutes } from '@/shared/const/router';
import { MainLayout } from '@/shared/layout/MainLayout';
import {PaymentPage} from "@/pages/PaymentPage";
import {TrashPage} from "@/pages/TrashPage";
import {TeamPage} from "@/pages/TeamPage";
import {NoticePage} from "@/pages/NoticePage";
import { ExtensionPage } from '@/pages/ExtensionPage';


export const routerConfig = createBrowserRouter([
  
  {
    path: AppRoutes.MAIN,
    element: (
        <MainLayout>
          
          <Outlet />
        </MainLayout>
    ),
    children: [
      { path: AppRoutes.MAIN, element: <ProfilesPage /> },
      { path: AppRoutes.AUTOREG, element: <AutoregPage /> },
      { path: AppRoutes.PROXIES, element: <ProxiesPage /> },
      { path: AppRoutes.PAYMENT, element: <PaymentPage /> },
      { path: AppRoutes.TRASH, element: <TrashPage /> },
      { path: AppRoutes.TEAM, element: <TeamPage /> },
      { path: AppRoutes.NOTICE, element: <NoticePage /> },
      { path: AppRoutes.Extension, element: <ExtensionPage /> },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
]);
