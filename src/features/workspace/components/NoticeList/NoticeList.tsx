import { useTranslation } from 'react-i18next';
import { Table } from '@/shared/components/Table/Table';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { PageCounter } from '@/shared/components/PageCounter/PageCounter';
import { ReactComponent as ArrowIcon } from '@/shared/assets/icons/arrow.svg';
import { NoticeListItem } from './NoticeListItem';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import cls from './NoticeList.module.scss';
import tableCls from '@/shared/components/Table/Table.module.scss';
import { useFilterUsers } from '@/shared/hooks';
import { ReactComponent as ArrowUpIcon } from '@/shared/assets/icons/arrow-up.svg';
import { ReactComponent as ArrowDownIcon } from '@/shared/assets/icons/arrow-down.svg';
import { ReactComponent as GreedRedCircle } from '@/shared/assets/icons/green-red-circle.svg';
import { ReactComponent as GreedCircle } from '@/shared/assets/icons/green_circle.svg';
import { ReactComponent as RedCircle } from '@/shared/assets/icons/red_circle.svg';
import clsx from 'clsx';
import { User } from '@/features/profile/types';
import { useWorkspacesStore } from '@/features/workspace/store';
import { fetchData } from '@/shared/config/fetch';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { LOCAL_STORAGE_LOCALE_KEY } from '@/shared/const/localStorage';
import { setToken } from '@/store/reducers/AuthReducer';
import { useDispatch } from 'react-redux';
import { useFilterProfilesTrash } from '@/shared/hooks/useFilterProfilesTrash';
import { useFilterNotice } from '@/shared/hooks/useFilterNotice';
import { collectionGroup } from 'firebase/firestore';
import { Loader } from '@/shared/components/Loader';

interface NoticeListProp {
  activePages: number[];
  setActivePages: React.Dispatch<React.SetStateAction<number[]>>;
  selectedRows: Set<string>;
  selectRow: (id: string, isSelected: boolean) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  isLoadItems: boolean;
  fetchPerPage: (page?: number) => void;
}

export const NoticeList = (props: NoticeListProp) => {
  const {
    activePages,
    setActivePages,
    selectedRows,
    selectRow,
    setSelectedRows,
    setPage,
    page,
    isLoadItems,
    fetchPerPage,
  } = props;
  const { t } = useTranslation();
  const {
    isLoading,
    perPageCountNotice,
    setCurrentPageNotice,
    setPerPageCountNotice,
    teamCustomers,
    currentPageNotice,
    allFilteredCustomers,
    setTeamCustomers,
    myTeams,
    setNotifications,
    notifications,
    setCustomerData,
    setMyTeams,
    setTotalPagesCount,
    totalPagesCount,
    setFilteredNotice,
    filteredNotice,
    visibleNotice,
    setVisibleNotice,
  } = useWorkspacesStore();

  const dispatch = useDispatch();

  const itemsPerPageOptions = [{ value: 50 }, { value: 100 }];

  useEffect(() => {
    setVisibleNotice(notifications);
  }, [notifications, currentPageNotice]);


  // const handleChangeSort = () => {
  //     setUseSort(prev => !prev);
  //     if (filterProfiles?.length > 0) {
  //         setFilterProfiles(filterProfiles.reverse());
  //     } else {
  //         setFilterProfiles(profiles.reverse());
  //     }
  // };

  const fetchCustomerData = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: `/customer`, method: 'GET', team: teamId })
      .then((data: any) => {
        console.log('customer data', data);
        if (data.is_success) {
          if (data.data) {
            setCustomerData(data?.data);
          }
        }
      })
      .catch((err: Error) => {
        console.log('/customer get error: ', err);
      });
  };

  const fetchTeamCustomers = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: '/team/customers', method: 'GET', team: teamId })
      .then((data: any) => {
        console.log('customers', data);
        if (data.is_success) {
          setTeamCustomers(data?.data);
        }
      })
      .catch((err) => {
        console.log('Tariff', err);
      });
  };

  const fetchMyTeams = async () => {
    try {
      const response = await fetchData({ url: '/team/my-teams', method: 'GET' });
      if (
        response.errorCode === 7 &&
        response.errorMessage &&
        response.errorMessage.includes('not found')
      ) {
        return dispatch(setToken(''));
      }
      if (response.is_success) {
        setMyTeams(response.data);
        const localTeamId = localStorage.getItem('teamId');
        const teamFromList = response.data.find((i: any) => i.external_id === localTeamId);
        if (teamFromList) {
          return teamFromList.external_id;
        }
        localStorage.setItem('teamId', response.data[0].external_id);
        return response.data;
      } else {
        return { is_success: false };
      }
    } catch (error) {
      console.error('Error fetching my teams:', error);
      return { is_success: false };
    }
  };

  const handleRefetch = () => {
    fetchMyTeams().then(() => {
      fetchCustomerData();
      fetchTeamCustomers();
    });
  };

  useEffect(() => {
    fetchPerPage(currentPageNotice);
  }, [perPageCountNotice]);

  useEffect(() => {
    handleRefetch();
  }, []);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Col className={clsx(cls.colCheck, cls.colHeader)}>
            <Table.IndeterminateCheckbox
              pageItems={filteredNotice}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colChapter, cls.colHeader)}>
            {t('Chapter')}
          </Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colSubject, cls.colHeader)}>
            {t('Subject')}
          </Table.Col>
          <Table.Col
            className={clsx(tableCls.colActionHeaderCell, cls.colNotification, cls.colHeader)}>
            {t('Notification')}
          </Table.Col>
          <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colAction, cls.colHeader)}>
            {t('Action')}
          </Table.Col>
          <Table.Col className={clsx(cls.colDate, cls.colHeader)}>
            {getDateTitle(filteredNotice)}
          </Table.Col>
        </Table.Header>

        {isLoadItems ? (
          <Loader className='' size={75} />
        ) : (
          <Table.Main isLoading={isLoading}>
            <div className={cls.tableMainWrapper}>
              {visibleNotice.map((item) => (
                <NoticeListItem
                  key={item.external_id}
                  item={item}
                  isSelected={selectedRows.has(item.external_id)}
                  selectRow={selectRow}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              ))}

              {!isLoading && !visibleNotice.length && (
                <Table.NoItemsText>{t('No notifications')}</Table.NoItemsText>
              )}
            </div>
          </Table.Main>
        )}
        {isLoading && <Table.Loader />}
      </Table>
    </>
  );
};

function getDateTitle(users?: User[] | null | undefined): JSX.Element | string {
  const { t } = useTranslation();

  // const dateFrom = cookies[0].created_at.toDate();
  // const dateTo = cookies[cookies.length - 1].created_at.toDate();
  const dateFrom = new Date();
  const dateTo = new Date();

  // Get day, month, and last two digits of the year for both dates
  const dayFrom = dateFrom.getDate();
  const monthFrom = dateFrom.getMonth() + 1; // Months are 0-indexed
  const yearFrom = dateFrom.getFullYear() % 100;

  const dayTo = dateTo.getDate();
  const monthTo = dateTo.getMonth() + 1; // Months are 0-indexed
  const yearTo = dateTo.getFullYear() % 100;

  // Format the month with a leading "0" if necessary
  const formattedMonthFrom = monthFrom < 10 ? `0${monthFrom}` : `${monthFrom}`;
  const formattedMonthTo = monthTo < 10 ? `0${monthTo}` : `${monthTo}`;

  // Create formatted date strings
  const formattedDateFrom = `${dayFrom}.${formattedMonthFrom}.${yearFrom}`;
  const formattedDateTo = `${dayTo}.${formattedMonthTo}.${yearTo}`;

  return (
    <>
      {/*{formattedDateTo}*/}
      {/*<span className={cls.colDateDivider}>&nbsp;—&nbsp;</span>*/}
      {/*{formattedDateFrom}*/}
      {t('Date')}
    </>
  );
}
