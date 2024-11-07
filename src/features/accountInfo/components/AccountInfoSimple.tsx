import React from 'react';
import cls from './AccountInfo.module.scss';
import { useTranslation } from 'react-i18next';
import { useWorkspacesStore } from '@/features/workspace/store';
import clsx from 'clsx';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { Table } from '@/shared/components/Table/Table';

interface IAccountInfoSimple {
  page?: string;
  className?: string;
}

export const AccountInfoSimple = ({ className, page }: IAccountInfoSimple) => {
  const { t } = useTranslation();

  const { customerData, teamCustomers, myTeams } = useWorkspacesStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const numberOfProfiles =
    myTeams.find((team: any) => team.external_id === localStorage.getItem('teamId'))?.self_used
      .total_profile || 0;

  return (
    <div
      className={clsx(
        cls.accountInfo,
        page && page === 'profiles' && cls.profilesHeight,
        className,
      )}>
      <span className={cls.span} />
      <div className={cls.accountInfoContent}>
        <div>
          <p className={cls.text}>
            {t('Users')}: <span className={cls.text2}>{teamCustomers?.length}</span>
          </p>
        </div>
        <div>
          <p className={cls.text}>
            {t('Profiles')}: <span className={cls.text2}>{numberOfProfiles}</span>
          </p>
        </div>
        <div>
          <p className={cls.text}>
            {t('Expiration date')}:{' '}
            <span className={cls.text2}>
              {customerData.tariff?.date_tariff_finish
                ? formatDate(customerData.tariff?.date_tariff_finish)
                : '-'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
