import { useTranslation } from 'react-i18next';
import { Table } from '@/shared/components/Table/Table';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { ReactComponent as ArrowIcon } from '@/shared/assets/icons/arrow.svg';
import { ProxyListItem } from './ProxyListItem';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import cls from './ProxyList.module.scss';
import clsTab from '../../../../shared/components/Table/Table.module.scss';
import tableCls from '@/shared/components/Table/Table.module.scss';
import { useFilterRecords } from '@/shared/hooks';
import { ReactComponent as ArrowUpIcon } from '@/shared/assets/icons/arrow-up.svg';
import { ReactComponent as ArrowDownIcon } from '@/shared/assets/icons/arrow-down.svg';
import { ReactComponent as GreedRedCircle } from '@/shared/assets/icons/green-red-circle.svg';
import clsx from 'clsx';
import { useProxiesStore } from '@/features/proxy/store';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchData } from '@/shared/config/fetch';
import { Loader } from '@/shared/components/Loader';

const itemsPerPageOptions = [{ value: 50 }, { value: 100 }];

interface ProxyListProp {
  activePages: number[];
  setActivePages: React.Dispatch<React.SetStateAction<number[]>>;
  selectedRows: Set<string>;
  selectRow: (id: string, isSelected: boolean) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  rotateProxyLink: (proxyItem: { [key: string]: any }) => void;
  useSortSpeed: boolean;
  setUseSortSpeed: Dispatch<SetStateAction<boolean>>;
  useSortStatus: boolean;
  setUseSortStatus: Dispatch<SetStateAction<boolean>>;
  setEditProxyActive: Dispatch<SetStateAction<boolean>>;
  isProxyFormActive: boolean
}

export const ProxyList = (props: ProxyListProp) => {
  const {
    activePages,
    setActivePages,
    selectedRows,
    selectRow,
    setSelectedRows,
    rotateProxyLink,
    useSortSpeed,
    setUseSortSpeed,
    useSortStatus,
    setUseSortStatus,
    isProxyFormActive,
    setEditProxyActive
  } = props;
  const { t } = useTranslation();
  const {
    isLoading,
    perPageCount,
    setCurrentPage,
    setPerPageCount,
    allProxies,
    currentPage,
    setAllProxiesData,
    setTotalPagesCount,
    totalPagesCount,
  } = useProxiesStore();

  const {
    setSearchFilter,
    searchFilter,
    currentPageRecords,
    setCurrentPageRecords,
    setSortFilter,
    sortFilter,
    filteredRecords,
    setFilteredRecords,
    loadMoreProfiles,
    setLoadMoreProfiles,
  } = useFilterRecords({
    allRecords: allProxies,
    currentPage,
    perPageCount,
  });

  const checkedProxies = useSelector((state: any) => state.proxiesDataReducer.proxies);
  const checkedProxiesSingle = useSelector((state: any) => state.proxiesDataReducer.proxiesSingle);

  const [sortField, sortOrder] = sortFilter.split('=');
  const [isLoadingProxy, setIsLoadingProxy] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handlePerPageSelect = (perPageCount: number) => {
    setPerPageCount(perPageCount);
    setCurrentPage(1);
    setActivePages([1]);
};

  const handleChangeSortBySpeed = () => {
    setUseSortStatus(false);
    setActivePages([currentPage]);
    setUseSortSpeed((prev) => !prev);
    const allCheckedProxies = [...checkedProxies, ...checkedProxiesSingle];
    const proxies = allProxies.map((filteredRecord) => {
      const checkedProxy = allCheckedProxies.find(
        (checkedProxy) => filteredRecord.external_id === checkedProxy.external_id,
      );
      if (checkedProxy) {
        return { ...filteredRecord, speed: checkedProxy.speed ? +checkedProxy.speed : 0 };
      }
      return { ...filteredRecord, speed: 0 };
    });
    const sortedProxies = proxies.slice().sort((a, b) => {
      if (useSortSpeed) {
        return a.speed - b.speed;
      } else {
        return b.speed - a.speed;
      }
    });
    setAllProxiesData([...sortedProxies]);
  };

  const handleChangeSortByStatus = () => {
    setUseSortSpeed(false);
    setActivePages([currentPage]);
    setUseSortStatus((prev) => !prev);
    const allCheckedProxies = [...checkedProxies, ...checkedProxiesSingle];
    let sortedProxies: any[] = [];
    if (!useSortStatus) {
      sortedProxies = allProxies.filter((proxy) =>
        allCheckedProxies.some((checkedProxy) => proxy.external_id === checkedProxy.external_id),
      );
      allProxies.forEach((proxy) => {
        if (!sortedProxies?.some((sortedProxy) => sortedProxy.external_id === proxy.external_id)) {
          sortedProxies.push(proxy);
        }
      });
    } else {
      sortedProxies = allProxies.filter(
        (proxy) =>
          !allCheckedProxies.some((checkedProxy) => proxy.external_id === checkedProxy.external_id),
      );
      allProxies.forEach((proxy) => {
        if (!sortedProxies?.some((sortedProxy) => sortedProxy.external_id === proxy.external_id)) {
          sortedProxies.push(proxy);
        }
      });
    }
    setAllProxiesData([...sortedProxies]);
  };

  const filterRecordsBySearchText = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!event.target.value) {
      setCurrentPage(currentPage);
      setActivePages([currentPage]);
    }
    setSearchFilter(`${field}=${event.target.value.toLowerCase()}`);
  };

  const handleChangeSort = (sortOrder: 'asc' | 'desc', sortField: string) => {
    setActivePages([currentPage]);
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

  const isLoadMoreBtn =
    currentPageRecords.length < allProxies.length &&
    currentPage < Math.ceil(allProxies.length / perPageCount);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActivePages([page]);
    setSearchFilter('');
  };

  const fetchPerPage = (page: number = 1) => {
    const teamId = localStorage.getItem('teamId');
    if (!isFirstLoad) {
      setIsLoadingProxy(true);
    }

    fetchData({
      url: `/profile/proxy?count=${perPageCount}&page=${page}&is_basket=0`,
      method: 'GET',
      team: teamId,
    })
      .then((data: any) => {
        if (data.is_success) {
          setTotalPagesCount(data.settings?.total_pages || 1);
          setCurrentPageRecords(data.data);
          setCurrentPage(page);
          setIsLoadingProxy(false)
          setIsFirstLoad(false)
          setActivePages([page])
        } else {
          console.error('Fetch failed:', data.errors);
        }
      })
      .catch((err) => {
        console.log('Proxy fetch error:', err);
      });
  };

  useEffect(() => {
    if (!loadMoreProfiles) {
      fetchPerPage(currentPage);
    }
  }, [currentPage, perPageCount, allProxies]);

  return (
    <>
        <Table className={clsx({
          [clsTab.tabScroll]:isProxyFormActive
        })}>
          <Table.Header>
            <Table.Col className={cls.colCheck}>
              <Table.IndeterminateCheckbox
                pageItems={currentPageRecords}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
              />
            </Table.Col>
            <Table.Col className={cls.colStatusChecked}>
              <div className={cls.changeStatus}>
                <button className={cls.changeStatusBtn} onClick={handleChangeSortByStatus}>
                  <GreedRedCircle />
                  {!useSortStatus && <ArrowDownIcon className={cls.filterSortIcon} />}
                  {useSortStatus && <ArrowUpIcon className={cls.filterSortIcon} />}
                </button>
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
              {/*{displaySortingOption('port')}*/}
            </Table.Col>
            <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colLogin)}>
              {t('Login')}
              {/*{displaySortingOption('login')}*/}
            </Table.Col>
            <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colPassword)}>
              {t('Password')}
              {/*{displaySortingOption('password')}*/}
            </Table.Col>
            <Table.Col className={cls.colChangeLink}>{t('Link to change IP')}</Table.Col>
            <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colProtocol)}>
              {(t('Protocol'))}
            </Table.Col>
            <Table.Col className={cls.colRefresh}>
              <p style={{ marginLeft: '13px' }}>{t('IP')}</p>
            </Table.Col>
            <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colSpeed)}>
              <div
                className={clsx(cls.searchWrapper, cls.sortBySpeed)}
                // onClick={handleChangeSortBySpeed}
              >
                {t('Speed')}
                {/*{!useSortSpeed && <ArrowDownIcon className={cls.filterSortIcon} />}*/}
                {/*{useSortSpeed && <ArrowUpIcon className={cls.filterSortIcon} />}*/}
              </div>
            </Table.Col>
            <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colGeo)}>
              {t('Geo')}
              {/*{displaySortingOption('country_code')}*/}
            </Table.Col>
          </Table.Header>
  
          {isLoadingProxy ? (
            <Loader className='' size={75}/>
          ) : (
            <Table.Main isLoading={isLoading}>
              <div className={cls.tableMainWrapper}>
                {currentPageRecords.map((item) => (
                  <ProxyListItem
                    key={item.external_id}
                    item={item}
                    isSelected={selectedRows.has(item.external_id)}
                    selectRow={selectRow}
                    setEditProxyActive={setEditProxyActive}
                    rotateProxyLink={rotateProxyLink}
                  />
                ))}
  
                {!isLoading && !currentPageRecords.length && (
                  <Table.NoItemsText>{t('No proxies')}</Table.NoItemsText>
                )}
              </div>
            </Table.Main>
          )}
  
          {isLoading && <Table.Loader />}
        </Table>

      
    </>
  );
};
