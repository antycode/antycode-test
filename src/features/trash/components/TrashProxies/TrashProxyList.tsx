import { useTranslation } from 'react-i18next';
import { Table } from '@/shared/components/Table/Table';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { PageCounter } from '@/shared/components/PageCounter/PageCounter';
import { ReactComponent as ArrowIcon } from '@/shared/assets/icons/arrow.svg';
import { TrashProxyListItem } from './TrashProxyListItem';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import cls from './TrashProxyList.module.scss';
import tableCls from '@/shared/components/Table/Table.module.scss';
import { useFilterRecords } from '@/shared/hooks';
import { ReactComponent as ArrowUpIcon } from '@/shared/assets/icons/arrow-up.svg';
import { ReactComponent as ArrowDownIcon } from '@/shared/assets/icons/arrow-down.svg';
import { ReactComponent as GreedRedCircle } from '@/shared/assets/icons/green-red-circle.svg';
import { ReactComponent as GreedCircle } from '@/shared/assets/icons/green_circle.svg';
import { ReactComponent as RedCircle } from '@/shared/assets/icons/red_circle.svg';
import clsx from 'clsx';
import { useProxiesStore } from '@/features/proxy/store';
import { ReactComponent as ChangeProxyIcon } from '@/shared/assets/icons/change-proxy.svg';
import { ReactComponent as ArrowDownLightIcon } from '@/shared/assets/icons/arrow-down-light.svg';
import React, { useEffect, useRef, useState } from 'react';
import { fetchData } from '@/shared/config/fetch';

const itemsPerPageOptions = [{ value: 50 }, { value: 100 }];

interface TrashProxyListProp {
  activePages: [number, ...number[]];
  setActivePages: React.Dispatch<React.SetStateAction<[number, ...number[]]>>;
  selectedRows: Set<string>;
  selectRow: (id: string, isSelected: boolean) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const TrashProxyList = (props: TrashProxyListProp) => {
  const { activePages, setActivePages, selectedRows, selectRow, setSelectedRows } = props;
  const { t } = useTranslation();
  const { isLoading, perPageCount, setCurrentPage, setPerPageCount, allProxies, currentPage, setTotalPagesCount, totalPagesCount } =
    useProxiesStore();

  const {
    setSearchFilter,
    searchFilter,
    currentPageRecords,
    setSortFilter,
    setCurrentPageRecords,
    sortFilter,
    filteredRecords,
  } = useFilterRecords({
    allRecords: allProxies,
    currentPage,
    perPageCount,
  });
  const totalCount = filteredRecords.length;
  const [sortField, sortOrder] = sortFilter.split('=');

  const [listStatusActive, setListStatusActive] = useState<boolean>(false);
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as HTMLElement)) {
        // Click occurred outside the protocol block
        setListStatusActive(false);
      }
    };

    // Add a click event listener when the component mounts
    document.addEventListener('click', handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };


  const filterRecordsBySearchText = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setSearchFilter(`${field}=${event.target.value.toLowerCase()}`);
  };

  const handleChangeSort = (sortOrder: 'asc' | 'desc', sortField: string) => {
    setCurrentPage(1);
    setSortFilter(`${sortField}=${sortOrder}`);
  };
  const displaySearchInput = (label: string, fieldName: string, searchIconClass?: string) => {
    let searchText = '';
    if (searchFilter.includes('=')) {
      const fieldAndText = searchFilter.split('=');
      if (fieldAndText[0] == fieldName) {
        searchText = fieldAndText[1];
      }
    }
    return (
      <div className={tableCls.searchWrapper}>
        <input
          placeholder={label}
          className={tableCls.searchInput}
          value={searchText}
          onChange={(e) => filterRecordsBySearchText(e, fieldName)}
        />
        <SearchIcon width={13} height={13} className={clsx(tableCls.searchIcon, searchIconClass)} />
      </div>
    );
  };

  const displaySortingOption = (fieldName: string) => {
    if (sortField === fieldName) {
      return (
        <div className={tableCls.sortIconBox}>
          {sortOrder == 'asc' && (
            <ArrowDownIcon
              className={tableCls.sortIcon}
              onClick={() => handleChangeSort('desc', fieldName)}
            />
          )}
          {sortOrder == 'desc' && (
            <ArrowUpIcon
              className={tableCls.sortIcon}
              onClick={() => handleChangeSort('asc', fieldName)}
            />
          )}
        </div>
      );
    }
    return (
      <div className={tableCls.sortIconBox}>
        <ArrowUpIcon
          className={tableCls.sortIcon}
          onClick={() => handleChangeSort('asc', fieldName)}
        />
        <ArrowDownIcon
          className={clsx(tableCls.sortIcon, tableCls.sortIconDown)}
          onClick={() => handleChangeSort('desc', fieldName)}
        />
      </div>
    );
  };

  const fetchDataProxies = async (
    page: number = 1,
  ) => {

    const teamId = localStorage.getItem('teamId');

    let url = `/profile/proxy?count=${perPageCount}&page=${page}&is_basket=1`;

    try {
      const data = await fetchData({
        url,
        method: 'GET',
        team: teamId,
      });
  
      if (data.is_success) {
        setTotalPagesCount(data.settings?.total_pages || 1);
        setCurrentPageRecords(data.data);
        console.log('data.data', data.data)
        setCurrentPage(page);
      } else {
        console.error('Fetch failed:', data.errors);
      }
    } catch (err) {
      console.log('Fetch error:', err);
    } 
    // finally {
    //   setLoading(false);
    //   setIsProfileFetching(false);
    // }
  };

  useEffect(() => {
    fetchDataProxies(currentPage)
  }, [perPageCount,]);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Col className={cls.colCheck}>
            <Table.IndeterminateCheckbox
              pageItems={currentPageRecords}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </Table.Col>
          <Table.Col className={cls.colStatusChecked}>
            <div className={cls.changeStatus} data-list-active={listStatusActive} ref={statusRef}>
              <button
                className={cls.changeStatusBtn}
                onClick={() => setListStatusActive(!listStatusActive)}
                disabled={selectedRows.size == 0}>
                <GreedRedCircle />
                <ArrowDownLightIcon />
              </button>
              <ul className={cls.changeStatusList}>
                <li className={cls.changeStatusItem} onClick={() => setListStatusActive(false)}>
                  <GreedCircle />
                </li>
                <li className={cls.changeStatusItem} onClick={() => setListStatusActive(false)}>
                  <RedCircle />
                </li>
              </ul>
            </div>
          </Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colName)}>
            {displaySearchInput(t('Proxy name'), 'title')}
          </Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colHost)}>
            {displaySearchInput(t('Host'), 'host')}
          </Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colPort)}>
            {t('Port')}
            {displaySortingOption('port')}
          </Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colLogin)}>
            {t('Login')}
            {displaySortingOption('login')}
          </Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colPassword)}>
            {t('Password')}
            {displaySortingOption('password')}
          </Table.Col>
          <Table.Col className={cls.colChangeLink}>{t('Link to change IP')}</Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colProtocol)}>
            {displaySearchInput(t('Protocol'), 'type', cls.colProtocolSearchIcon)}
          </Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colGeo)}>
            {t('Geo')}
            {displaySortingOption('country_code')}
          </Table.Col>
          <Table.Col className={cls.colDate}>
            <div className={cls.searchWrapper}>
              {t('Deletion date')}
              <ArrowDownIcon className={cls.filterSortIcon} />

              {/*NEED TO DO DELETING DATE AND SORT BY DATE*/}

              {/*{!useSort && <ArrowDownIcon className={cls.filterSortIcon} onClick={handleChangeSort} />}*/}
              {/*{useSort && <ArrowUpIcon className={cls.filterSortIcon} onClick={handleChangeSort} />}*/}
            </div>
          </Table.Col>
          <Table.Col className={cls.colAction}>{t('Cleaning')}</Table.Col>
        </Table.Header>

        <Table.Main isLoading={isLoading}>
          <div className={cls.tableMainWrapper}>
            {currentPageRecords.map((item) => (
              <TrashProxyListItem
                key={item.external_id}
                item={item}
                isSelected={selectedRows.has(item.external_id)}
                selectRow={selectRow}
              />
            ))}

            {!isLoading && !currentPageRecords.length && (
              <Table.NoItemsText>{t('No proxies')}</Table.NoItemsText>
            )}
          </div>
        </Table.Main>

        {isLoading && <Table.Loader />}
      </Table>
    </>
  );
};
