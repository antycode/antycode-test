// AppRouter.tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import { AutoregPage } from '@/pages/AutoregPage';
import { ProfilesPage } from '@/pages/ProfilesPage';
import { ProxiesPage } from '@/pages/ProxiesPage';
import { PaymentPage } from "@/pages/PaymentPage";
import { TrashPage } from "@/pages/TrashPage";
import { TeamPage } from "@/pages/TeamPage";
import { NoticePage } from "@/pages/NoticePage";
import { ExtensionPage } from '@/pages/ExtensionPage';
import LoadingPage from '@/pages/LoadingPage';
import { AppRoutes } from '@/shared/const/router';
import { MainLayout } from '@/shared/layout/MainLayout';
import useApplicationUpdate from '@/shared/hooks/useApplicationUpdate';

export const AppRouter = () => {
  // Вызов хука для получения состояния обновления

  return (
    <MainLayout>
      <Routes>
        <Route path={AppRoutes.MAIN} element={<ProfilesPage />} />
        <Route path={AppRoutes.AUTOREG} element={<AutoregPage />} />
        <Route path={AppRoutes.PROXIES} element={<ProxiesPage />} />
        <Route path={AppRoutes.PAYMENT} element={<PaymentPage />} />
        <Route path={AppRoutes.TRASH} element={<TrashPage />} />
        <Route path={AppRoutes.TEAM} element={<TeamPage />} />
        <Route path={AppRoutes.NOTICE} element={<NoticePage />} />
        <Route path={AppRoutes.Extension} element={<ExtensionPage />} />
        <Route path="*" element={<Navigate to={AppRoutes.MAIN} />} />
      </Routes>
    </MainLayout>
  );
};
