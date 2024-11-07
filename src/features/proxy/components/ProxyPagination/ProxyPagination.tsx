import { Table } from '@/shared/components/Table/Table';
import cls from './ProxyPagination.module.scss';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { useProxiesStore } from '../../store';
import { useFilterRecords } from '@/shared/hooks';
import { useTranslation } from 'react-i18next';
import { useWorkspacesStore } from '@/features/workspace/store';

const itemsPerPageOptions = [{ value: 50 }, { value: 100 }];

interface IProxyPagination {
  setActivePages: React.Dispatch<React.SetStateAction<number[]>>;
  activePages: number[];
}

const ProxyPagination = ({ setActivePages, activePages }: IProxyPagination) => {
  const {
    perPageCount,
    currentPage,
    totalPagesCount,
    setPerPageCount,
    setCurrentPage,
    allProxies,
  } = useProxiesStore();
  
  const { customerData, teamCustomers, myTeams } = useWorkspacesStore();

  const { t } = useTranslation();

  const { setSearchFilter } = useFilterRecords({
    allRecords: allProxies,
    currentPage,
    perPageCount,
  });

  const handlePerPageSelect = (perPageCount: number) => {
    setPerPageCount(perPageCount);
    setCurrentPage(1);
    setActivePages([1]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActivePages([page]);
    setSearchFilter('');
  };

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
    <div className={cls.footer}>
      <Table.ItemsPerPageSelect
        value={itemsPerPageOptions.find((o) => o.value === perPageCount)}
        options={itemsPerPageOptions}
        onChange={(value) => handlePerPageSelect(value)}
      />
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
      <div className={cls.pagination}>
        <Pagination
          totalPages={totalPagesCount}
          currentPage={currentPage}
          activePages={activePages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProxyPagination;
