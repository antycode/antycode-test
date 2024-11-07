import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Button } from '@/shared/components/Button';
import cls from './NoticePageHeader.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import clsBtn from '@/shared/components/Button/Button.module.scss';
import { ReactComponent as IconPlusCircle } from '@/shared/assets/icons/plus-circle.svg';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { ReactComponent as IconTrash } from '@/shared/assets/icons/trash.svg';
import { ReactComponent as IconEdit } from '@/shared/assets/icons/edit.svg';
import { ReactComponent as UsersIcon } from '@/shared/assets/icons/users-icon.svg';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import { ReactComponent as NoticeIcon } from '@/shared/assets/icons/notice-icon.svg';
import { ReactComponent as ArrowDownWhite } from '@/shared/assets/icons/arrow-down-white.svg';
import { ModalWindow2 } from '@/shared/components/ModalWindow2/ModalWindow2';
import { fetchData } from '@/shared/config/fetch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { use } from 'i18next';
import { ReactComponent as TrashIcon1 } from '@/shared/assets/icons/trash-icon-1.svg';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { useWorkspacesStore } from '@/features/workspace/store';
import { setToken } from '@/store/reducers/AuthReducer';
import { LOCAL_STORAGE_LOCALE_KEY } from '@/shared/const/localStorage';
import { ReactComponent as Arrow2Left } from '@/shared/assets/icons/arrow-2-left.svg';
import { SidebarMode } from '@/shared/const/context';
import { SidebarModeContext, SidebarModeContextType } from '@/shared/context/SidebarModeContext';
import { useDebounce } from '@/shared/hooks';

enum ButtonTypes {
  deleteIcon = 'btnDeleteIcon',
  addUser = 'btnAddUser',
}

interface NoticePageHeaderProps {
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  setIsLoaderActive: Dispatch<SetStateAction<boolean>>;
  activeNoticeFilter: string;
  handleSearch: (searchValue: string) => void;
  fetchPerPage: (page?: number) => void;
}

export const NoticePageHeader = (props: NoticePageHeaderProps) => {
  const {
    selectedRows,
    setSelectedRows,
    setIsLoaderActive,
    activeNoticeFilter,
    handleSearch,
    fetchPerPage,
  } = props;

  const { t } = useTranslation();

  const platform = useSelector((state: any) => state.platformReducer.platform);

  const dispatch = useDispatch();

  const {
    positions,
    notifications,
    setNotifications,
    setTeamCustomers,
    setCustomerData,
    setMyTeams,
    myTeams,
    setFilteredNotice,
    filteredNotice,
    currentPageNotice,
  } = useWorkspacesStore();

  const { sidebarMode, setSidebarMode } = useContext(SidebarModeContext) as SidebarModeContextType;
  const isMiniSidebar = sidebarMode === SidebarMode.MINI;

  const dropdownRoleRef = useRef<HTMLDivElement | null>(null);
  const dropdownProfilesRef = useRef<HTMLDivElement | null>(null);
  const dropdownProxiesRef = useRef<HTMLDivElement | null>(null);

  const [isOpenMakeRead, setIsOpenMakeRead] = useState<boolean>(false);
  const [isOpenDropdownTitle, setIsOpenDropdownTitle] = useState<string>('');
  const [isOpenDeleteNoticePopup, setIsOpenDeleteNoticePopup] = useState<boolean>(false);
  const [selectedNotice, setSelectedNotice] = useState<any[]>([]);

  const [searchNoticeVal, setSearchNoticeVal] = useState<string>('');
  const debouncedSearchValue = useDebounce(searchNoticeVal, 500);

  const openMakeRead = () => {
    if (selectedRows.size > 0) {
      setIsOpenMakeRead(true);
    }
  };

  const closeMakeRead = () => {
    setSelectedRows(new Set());
    setIsOpenMakeRead(false);
  };

  const openDeleteNoticePopup = () => {
    if (selectedRows.size > 0) {
      setSelectedNotice(Array.from(selectedRows));
      setIsOpenDeleteNoticePopup(true);
    }
  };

  const closeDeleteNoticePopup = () => {
    setIsOpenDeleteNoticePopup(false);
  };

  const deleteNotice = async () => {
    const teamId = localStorage.getItem('teamId');
    await closeDeleteNoticePopup();
    await setIsLoaderActive(true);
    for (const i of selectedNotice) {
      try {
        const data = await fetchData({ url: `/notification/${i}`, method: 'DELETE', team: teamId });
        console.log('Delete notice', data);
        if (data.is_success) {
          console.log(`Delete notice via id ${i} is success`);
          setFilteredNotice(filteredNotice.filter((notice: any) => notice.external_id !== i));
        }
      } catch (err) {
        console.log('/Delete notice error: ', err);
      }
    }

    await handleRefetch();
    await setIsLoaderActive(false);
  };

  const makeRead = async () => {
    const teamId = localStorage.getItem('teamId');
    for (const i of selectedNotice) {
      try {
        const dataSubmit = {
          is_read: true,
        };
        const data = await fetchData({
          url: `/notification/${i}`,
          method: 'PATCH',
          data: dataSubmit,
          team: teamId,
        });
        console.log('PATCH notice', data);
        if (data.is_success) {
          console.log(`PATCH notice via id ${i} is success`);
        }
      } catch (err) {
        console.log('/PATCH notice error: ', err);
      }
    }

    await handleRefetch();
    await closeMakeRead();
  };

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

  const fetchNotification = () => {
    const lang = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);
    const teamId = localStorage.getItem('teamId');
    const urlApi = lang === 'ru' ? '/notification' : `/${lang}/notification`;
    fetchData({ url: urlApi, method: 'GET', team: teamId })
      .then((data: any) => {
        console.log('notification', data);
        if (data.is_success) {
          setNotifications(data?.data);
        }
      })
      .catch((err) => {
        console.log('notification', err);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchNoticeVal(searchValue);
  };

  const handleRefetch = () => {
    fetchMyTeams().then(() => {
      fetchCustomerData();
      fetchTeamCustomers();
      fetchNotification();
    });
  };

  const handleMenuClick = () => {
    setSidebarMode((prev) => (prev === SidebarMode.FULL ? SidebarMode.MINI : SidebarMode.FULL));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRoleRef.current &&
        !dropdownRoleRef.current.contains(event.target as Node) &&
        dropdownProfilesRef.current &&
        !dropdownProfilesRef.current.contains(event.target as Node) &&
        dropdownProxiesRef.current &&
        !dropdownProxiesRef.current.contains(event.target as Node)
      ) {
        setIsOpenDropdownTitle('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchValue !== '') {
      handleSearch(debouncedSearchValue);
    } else {
      fetchPerPage(currentPageNotice);
    }
  }, [debouncedSearchValue, currentPageNotice]);

  return (
    <div className={cls.autoregHeader}>
      <div className={cls.actions}>
        {/*<div>*/}
        {/*  <button className={cls.btnSidebar} onClick={handleMenuClick}>*/}
        {/*    <Arrow2Left*/}
        {/*      style={isMiniSidebar ? { marginLeft: '1px' } : { marginLeft: '-1px' }}*/}
        {/*      className={isMiniSidebar ? cls.arrowDeg : undefined}*/}
        {/*    />*/}
        {/*  </button>*/}
        {/*</div>*/}
        {/*<Button*/}
        {/*    className={clsx(cls[ButtonTypes.addUser], clsBtn.btnCreate)}*/}
        {/*    color="primary"*/}
        {/*    onClick={openMakeRead}*/}
        {/*>*/}
        {/*    <p className={clsx(clsBtn.btnCreateText, platform === 'Windows' ? clsBtn.btnCreateTextWin : '')}>{t('Mark as read')}</p>*/}
        {/*</Button>*/}
        <Button
          className={clsx(cls[ButtonTypes.addUser], clsBtn.btnCreate)}
          color="primary"
          onClick={openDeleteNoticePopup}
          leftIcon={<IconTrash width={18} height={18} style={{ marginRight: '2px' }} />}>
          <p
            className={clsx(
              clsBtn.btnCreateText,
              platform === 'Windows' ? clsBtn.btnCreateTextWin : '',
            )}>
            {t('Delete')}
          </p>
        </Button>
        {/*<Button*/}
        {/*    className={clsx(cls[ButtonTypes.addUser], clsBtn.btnCreate)}*/}
        {/*    color="primary"*/}
        {/*    // onClick={handleAddUser}*/}
        {/*>*/}
        {/*    <p className={clsx(clsBtn.btnCreateText, platform === 'Windows' ? clsBtn.btnCreateTextWin : '')}>{t('Unread')}</p>*/}
        {/*    <ArrowDownWhite style={{marginRight: "11px"}} />*/}
        {/*</Button>*/}
        <div className={cls.findUserWrapper}>
          <input
            value={searchNoticeVal}
            onChange={handleInputChange}
            placeholder={t('search by notifications')}
            type="text"
            className={cls.findUserInput}
          />
          <SearchIcon />
        </div>
      </div>
      <ModalWindow modalWindowOpen={isOpenDeleteNoticePopup} onClose={closeDeleteNoticePopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalDeleteHeaderTitle}>
            <TrashIcon1 />
            <p className={cls.modalDeleteTitle}>{t('Delete notifications')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={closeDeleteNoticePopup} />
        </div>
        <div className={cls.modalDeleteContent}>
          <div className={cls.warningTextContent}>
            <p className={cls.warningText1}>
              {t('Are you sure you want to delete the selected notifications?')}
            </p>
          </div>
          <div className={cls.approveDeleteContent}>
            <button className={cls.btnCancelDeleteToken} onClick={closeDeleteNoticePopup}>
              {t('Cancel')}
            </button>
            <button className={cls.btnDelete} onClick={() => deleteNotice()}>
              {t('Delete')}
            </button>
          </div>
        </div>
      </ModalWindow>
      <ModalWindow modalWindowOpen={isOpenMakeRead} onClose={closeMakeRead}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalDeleteHeaderTitle}>
            <TrashIcon1 />
            <p className={cls.modalDeleteTitle}>{t('Make as read')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={closeMakeRead} />
        </div>
        <div className={cls.modalMakeReadContent}>
          <div className={cls.warningTextMakeReadContent}>
            <p className={cls.warningText1}>{t('Make as read?')}</p>
          </div>
          <div className={cls.approveDeleteContent}>
            <button className={cls.btnApprove} onClick={() => makeRead()}>
              {t('Yes')}
            </button>
          </div>
        </div>
      </ModalWindow>
    </div>
  );
};
