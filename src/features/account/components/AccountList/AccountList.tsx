import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from '@/shared/components/Table/Table';
import i18n from '@/shared/config/i18n/i18n';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { PageCounter } from '@/shared/components/PageCounter/PageCounter';
import { ReactComponent as ArrowIcon } from '@/shared/assets/icons/arrow.svg';
import { useAccounts } from '../../api/getAccounts';
import { Account, InProgressAccount } from '../../types';
import { AccountListItem } from './AccountListItem';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import { ReactComponent as ArrowUpIcon } from '@/shared/assets/icons/arrow-up.svg';
import { ReactComponent as ArrowDownIcon } from '@/shared/assets/icons/arrow-down.svg';
import cls from './AccountList.module.scss';
import { useFilterAccounts } from '../../hooks/useFilterAccounts';

const itemsPerPageOptions = [{ value: 30 }, { value: 60 }];

interface AccountListProp {
  activePages: [number, ...number[]];
  setActivePages: React.Dispatch<React.SetStateAction<[number, ...number[]]>>;
  selectedRows: Set<string>;
  selectRow: (id: string, isSelected: boolean) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const AccountList = (props: AccountListProp) => {
  const { activePages, setActivePages, selectedRows, selectRow, setSelectedRows } = props;

  const { t } = useTranslation();

  const {
    accounts,
    totalCount,
    // isLoading,
    perPageCount,
    setPerPageCount,
    resetAccounts,
  } = useAccounts(activePages);

  const {
    setUseSearchName,
    setUseSearchField,
    setFilterAccounts,
    setUseSort,
    filterAccounts,
    useSort,
  } = useFilterAccounts();

  const handleLoadMore = () => {
    const nextPage = activePages[activePages.length - 1] + 1;
    setActivePages((prev) => [...prev, nextPage]);
  };

  const handlePerPageSelect = (perPageCount: number) => {
    resetAccounts({ exclude: ['perPageCount'] });
    setPerPageCount(perPageCount);
    setActivePages([1]);
  };

  const handleInputNameSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseSearchName(event.target.value);
  };

  const handleChangeNameSearch = () => {
    setUseSearchField('find_name');
  };

  const handleChangeSort = () => {
    setUseSort((prev) => !prev);
    if (filterAccounts?.length > 0) {
      setFilterAccounts(filterAccounts.reverse());
    } else {
      setFilterAccounts(accounts.reverse());
    }
  };

  const totalPages = Math.ceil(totalCount / perPageCount);
  const isLoadMoreBtn = activePages[activePages.length - 1] < totalPages;
  const currentAccounts = useMemo(() => {
    if (filterAccounts && filterAccounts.length > 0) {
      return filterAccounts;
    }
    return accounts;
  }, [filterAccounts, accounts]);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Col className={cls.colCheck}>
            <Table.IndeterminateCheckbox
              pageItems={currentAccounts}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </Table.Col>
          <Table.Col className={cls.colGeo}>
            <div className={cls.geoWrapper}>
              <span></span>
              <p>{t('Geo')}</p>{' '}
              {true ? (
                <ArrowUpIcon className={cls.filterSortIcon} />
              ) : (
                <ArrowDownIcon className={cls.filterSortIcon} />
              )}
            </div>
          </Table.Col>
          <Table.Col className={cls.colName}>
            <div className={cls.searchWrapper}>
              <input
                placeholder={t('Account name')}
                className={cls.inputAccount}
                onChange={handleInputNameSearch}
              />
              <SearchIcon className={cls.filterIcon} onClick={handleChangeNameSearch} />
            </div>
          </Table.Col>
          <Table.Col className={cls.colRegister}>{t('Registration')}</Table.Col>
          <Table.Col className={cls.colFp}>
            <p>{t('FP')}</p>
          </Table.Col>
          <Table.Col className={cls.colPolicy}>
            <p>{t('Policy')}</p>
          </Table.Col>
          <Table.Col className={cls.colToken}>{t('Token')}</Table.Col>
          <Table.Col className={cls.colZrd}>{t('ZRD')}</Table.Col>
          <Table.Col className={cls.colBm}>{t('BM')}</Table.Col>
          <Table.Col className={cls.colFarm}>{t('Farm')}</Table.Col>
          <Table.Col className={cls.colDate}>{t('Date')}</Table.Col>
          <Table.Col className={cls.colDownload}>{t('Download')}</Table.Col>
          <Table.Col className={cls.colShare}>{t('Hand over')}</Table.Col>
        </Table.Header>

        <Table.Main>
          <div className={cls.tableMainWrapper}>
            {/* {currentAccounts.map((item, idx) => (
              <AccountListItem
                key={idx}
                item={item}
                isSelected={selectedRows.has(item.id)}
                selectRow={selectRow}
              />
            ))} */}
            <AccountListItem
              // key={idx}
              // item={item}
              // isSelected={selectedRows.has(item.id)}
              selectRow={selectRow}
            />

            {/* {!currentAccounts.length && <Table.NoItemsText>{t('No accounts')}</Table.NoItemsText>} */}
          </div>
        </Table.Main>

        {/* {isLoading && <Table.Loader />} */}
      </Table>

      {/* <div className={cls.footer}>
        <Table.ItemsPerPageSelect
          value={itemsPerPageOptions.find((o) => o.value === perPageCount)}
          options={itemsPerPageOptions}
          onChange={(value) => handlePerPageSelect(value)}
        />

        <div className={cls.pagination}>
          <PageCounter perPageCount={30} currentPage={1} totalCount={currentAccounts.length} />
          <Pagination
           withoutRange
            activePages={activePages}
            onChange={(page) => setActivePages([page])
          total={totalPages}
            disabled={isLoading}
           isLoading={isLoading}
          />
        </div>
      </div> */}
    </>
  );
};

function getDateTitle(accounts?: (Account | InProgressAccount)[]) {
  if (!accounts || accounts.length === 0) return '—';

  const dateFrom = accounts[0].created_at.toDate();
  const dateTo = accounts[accounts.length - 1].created_at.toDate();

  return (
    <>
      {dateTo.toLocaleDateString(i18n.language)}
      <span className={cls.colDateDivider}>&nbsp;—&nbsp;</span>
      {dateFrom.toLocaleDateString(i18n.language)}
    </>
  );
}
