import React, { useEffect, useState } from 'react';
import cls from '@/pages/NoticePage/components/NoticePage.module.scss';
import teamBackground2 from '@/shared/assets/icons/team-background-2.jpg';
import { ReactComponent as UserIcon } from '@/shared/assets/icons/user-icon.svg';
import clsx from 'clsx';
import { ReactComponent as EditIcon } from '@/shared/assets/icons/edit-icon.svg';
import { useRowSelection } from '@/shared/hooks';
import { useTranslation } from 'react-i18next';
import { NoticePageHeader } from '@/pages/NoticePage/components/NoticePageHeader/NoticePageHeader';
import { fetchData } from '@/shared/config/fetch';
import { useWorkspacesStore } from '@/features/workspace/store';
import { NoticeList } from '@/features/workspace/components/NoticeList/NoticeList';
import { LOCAL_STORAGE_LOCALE_KEY } from '@/shared/const/localStorage';
import { Loader } from '@/shared/components/Loader';

interface INotice {
  activePages: number[];
  setActivePages: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Notice = ({activePages, setActivePages}:INotice) => {
  const { t } = useTranslation();

  const {
    setNotifications,
    visibleNotice,
    setVisibleNotice,
    setFilteredNotice,
    filteredNotice,
    setTotalPagesCount,
    perPageCountNotice,
    setCurrentPageNotice,
    notifications
  } = useWorkspacesStore();

  const [activeNoticeFilter, setActiveNoticeFilter] = useState<string>('all');

  const [isLoaderActive, setIsLoaderActive] = useState<boolean>(false);
  const [isLoadItems, setIsLoadItems] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [page, setPage] = useState<number>(1);

  const { selectedRows, selectRow, setSelectedRows } = useRowSelection();

  const handleSearch = (searchValue: string) => {
    const teamId = localStorage.getItem('teamId');
    setIsLoadItems(true);

    fetchData({ url: `/notification?message=${searchValue}`, method: 'GET', team: teamId })
      .then((data: any) => {
        if (data.is_success) {
          setVisibleNotice(data.data);
          setTotalPagesCount(data.settings?.total_pages || 1);
          setIsLoadItems(false);
        }
      })
      .catch((err: Error) => {
        console.log('/notification get error: ', err);
      });
  };

  const fetchPerPage = (page: number = 1) => {
    const teamId = localStorage.getItem('teamId');

    if (!isFirstLoad) {
      setIsLoadItems(true);
    }

    fetchData({
      url: `/notification?count=${perPageCountNotice}&page=${page}`,
      method: 'GET',
      team: teamId,
    })
      .then((data: any) => {
        if (data.is_success) {
          setNotifications(data.data);
          setVisibleNotice(data.data);
          setTotalPagesCount(data.settings?.total_pages || 1);
          setCurrentPageNotice(page);
          setIsLoadItems(false);
          setIsFirstLoad(false);
        } else {
          console.error('Fetch failed:', data.errors);
        }
      })
      .catch((err) => {
        console.log('Notification fetch error:', err);
      });
  };

  const fetchNotification = () => {
    const lang = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);
    const teamId = localStorage.getItem('teamId');
    const urlApi = lang === 'ru' ? '/notification' : `/${lang}/notification`;
    fetchData({url: urlApi, method: 'GET', team: teamId}).then((data: any) => {
        if (data.is_success) {
            setNotifications(data?.data);
            if (!filteredNotice.length) {
                setFilteredNotice(data?.data);
            }
        }
    }).catch((err) => {
        console.log('notification', err);
    });
};

  // const fetchFilter = (value: string) => {
  //   const teamId = localStorage.getItem('teamId');
  //   setIsLoadItems(true);
  //   setActiveNoticeFilter(value);

  //   const url = value === 'all' ? `/notification` : `/notification?topic=${value}`;

  //   fetchData({ url, method: 'GET', team: teamId })
  //     .then((data: any) => {
  //       if (data.is_success) {
  //         setVisibleNotice(data.data);
  //         setTotalPagesNotice(data.settings?.total_pages || 1);
  //       }
  //     })
  //     .catch((err: Error) => {
  //       console.log('/notification get error: ', err);
  //     })
  //     .finally(() => {
  //       setIsLoadItems(false);
  //     });
  // };

  const filterNoticeByType = (typeNotice: string) => {
    setActiveNoticeFilter(typeNotice);
    if (typeNotice === 'all') {
      setFilteredNotice(notifications);
    } else if (typeNotice === 'info') {
      const notices = notifications.filter((i: any) => i.type.includes(typeNotice));
      setFilteredNotice(notices);
    } else if (typeNotice === 'tariff') {
      const notices = notifications.filter((i: any) => i.type.includes(typeNotice));
      setFilteredNotice(notices);
    } else if (typeNotice === 'team') {
      const notices = notifications.filter((i: any) => i.type.includes(typeNotice));
      setFilteredNotice(notices);
    }
  };

  useEffect(() => {
    fetchNotification();
}, []);

  return (
    <>
      <div className={cls.header}>
        <div className={cls.headerContent}>
          <p
            className={clsx(
              cls.changeNoticePage,
              activeNoticeFilter === 'all' && cls.changeTeamPageActive,
            )}
            onClick={() => filterNoticeByType('all')}>
            {t('All notifications')}
          </p>
          <p
            className={clsx(
              cls.changeNoticePage,
              activeNoticeFilter === 'info' && cls.changeTeamPageActive,
            )}
            onClick={() => filterNoticeByType('info')}>
            {t('News')}
          </p>
          <p
            className={clsx(
              cls.changeNoticePage,
              activeNoticeFilter === 'tariff' && cls.changeTeamPageActive,
            )}
            onClick={() => filterNoticeByType('tariff')}>
            {t('Payments')}
          </p>
          <p
            className={clsx(
              cls.changeNoticePage,
              activeNoticeFilter === 'team' && cls.changeTeamPageActive,
            )}
            onClick={() => filterNoticeByType('team')}>
            {t('Team')}
          </p>
        </div>
      </div>
      <NoticePageHeader
        handleSearch={handleSearch}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        setIsLoaderActive={setIsLoaderActive}
        activeNoticeFilter={activeNoticeFilter}
        fetchPerPage={fetchPerPage}
      />
      {isLoaderActive ? (
        <Loader size={75} />
      ) : (
        <NoticeList
          fetchPerPage={fetchPerPage}
          activePages={activePages}
          setActivePages={setActivePages}
          selectedRows={selectedRows}
          selectRow={selectRow}
          setSelectedRows={setSelectedRows}
          page={page}
          setPage={setPage}
          isLoadItems={isLoadItems}
        />
      )}
    </>
  );
};
