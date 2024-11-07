import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ProfileList } from '@/features/profile';
import { useProfilesStore } from '@/features/profile/store';
import { ProfilesPageHeader } from './ProfilesPageHeader/ProfilesPageHeader';
import cls from './ProfilesPage.module.scss';
import { useFilterProfiles, useRowSelection } from '@/shared/hooks';
import { fetchData } from '@/shared/config/fetch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AuthorizationForm } from '@/app/components/AuthorizationForm';
import { ReactComponent as FolderSettings } from '@/shared/assets/icons/folder-settings.svg';
import { ReactComponent as GamblingIcon } from '@/shared/assets/icons/gambling-icon.svg';
import { ReactComponent as CryptoIcon } from '@/shared/assets/icons/crypto-icon.svg';
import { ReactComponent as BattingIcon } from '@/shared/assets/icons/batting-icon.svg';
import { ReactComponent as ProductsIcon } from '@/shared/assets/icons/products-icon.svg';
import { ReactComponent as NutraIcon } from '@/shared/assets/icons/nutra-icon.svg';
import { ReactComponent as NewFolderIcon } from '@/shared/assets/icons/newfolder-icon.svg';
import { ReactComponent as Edit2Icon } from '@/shared/assets/icons/edit-2-icon.svg';
import { ReactComponent as IconTrash } from '@/shared/assets/icons/trash.svg';
import { ReactComponent as CheckIcon } from '@/shared/assets/icons/checkIcon.svg';
import { useProxiesStore } from '@/features/proxy/store';
import { Profile } from '@/features/profile/types';
import { useDispatch, useSelector } from 'react-redux';
import { setRunBrowsers, setRunBrowsersLoader } from '@/store/reducers/RunBrowsersReducer';
import store from '@/store';
import {
  setAccumulatedProxiesForCheckSingle,
  setProxySingleForCheck,
} from '@/store/reducers/ProxiesForCheckReducer';
import { setToken } from '@/store/reducers/AuthReducer';
import { EventQueue } from '@/app/EventQueue';
import { Loader } from '@/shared/components/Loader';
import { setIsProfileCreationDrawer } from '@/store/reducers/Drawers';
import { useWorkspacesStore } from '@/features/workspace/store';
import { LOCAL_STORAGE_LOCALE_KEY } from '@/shared/const/localStorage';
import { usePaymentStore } from '@/features/payment/store';
import { useTranslation } from 'react-i18next';
import { FolderIcon } from '@/shared/components/Folder/FolderIcon';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { ReactComponent as CheckboxSortSelectedIcon } from '@/shared/assets/icons/checkbox-sort-selected.svg';
import { ReactComponent as CheckboxSortIcon } from '@/shared/assets/icons/checkbox-sort.svg';
import clsx from 'clsx';
import { ReactComponent as ArrowDownWhite } from '@/shared/assets/icons/arrow-down-white.svg';
import { FoldersModeContext, FoldersModeContextType } from '@/shared/context/FoldersModeContext';
import { FoldersMode } from '@/shared/const/context';
import { AppRoutes } from '@/shared/const/router';
import { useNavigate } from 'react-router-dom';
import { AccountInfo } from '@/features/accountInfo';
import { extractExtensionId, getChromeVersion, getNaclArch } from '@/shared/utils/extensions';
import { useExtensionsStore } from '@/features/account/components/ExtensionList/store';

export const ProfilesPage = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const {
    profilesAll,
    profilesParams,
    setProfilesConfigData,
    setProfilesAllData,
    setProfilesParams,
    currentPage,
    configData,
    loaderProfilesPage,
    folders,
    setFolders,
    totalPages,
    selectedFolder,
    setSelectedFolder,
    perPageCount,
    setCurrentPage,
    setPerPageCount,
    setShouldFilterProfiles,
  } = useProfilesStore();
  const { setAllProxiesData } = useProxiesStore();
  const { myTeams, setCustomerData, setMyTeams, customerData } = useWorkspacesStore();
  const { extensions } = useExtensionsStore();

  // const loaderIsActive = useSelector((state: any) => state.loaderReducer.loaderIsActive);

  const [activePages, setActivePages] = useState<number[]>([currentPage]);
  const [loaderIsActive, setLoaderIsActive] = useState<boolean>(true);
  const [loaderIsActiveFolders, setLoaderIsActiveFolders] = useState<boolean>(false);

  const itemsPerPageOptions = [{ value: 50 }, { value: 100 }];

  const dropdownColorRef = useRef<any>(null);
  const dropdownIconRef = useRef<any>(null);
  const folderRef = useRef<any>(null);
  const editFoldersSortTimer = useRef<any>(null);

  const eventQueue = EventQueue();
  const navigate = useNavigate();

  const { foldersMode, setFoldersMode } = useContext(FoldersModeContext) as FoldersModeContextType;
  const isNoneFolders = foldersMode === FoldersMode.NONE;

  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  const runBrowsers = useSelector((state: any) => state.runBrowsersReducer.runBrowsers);
  const runBrowsersLoader = useSelector((state: any) => state.runBrowsersReducer.runBrowsersLoader);
  const pidProcess = useSelector((state: any) => state.runBrowsersReducer.pidProcess);
  const proxiesForCheck = useSelector((state: any) => state.proxiesForCheckReducer.proxiesForCheck);
  const accumulatedProxiesForCheck = useSelector(
    (state: any) => state.proxiesForCheckReducer.accumulatedProxiesForCheck,
  );
  const accumulatedProxiesForCheckSingle = useSelector(
    (state: any) => state.proxiesForCheckReducer.accumulatedProxiesForCheckSingle,
  );
  const proxySingleForCheck = useSelector(
    (state: any) => state.proxiesForCheckReducer.proxySingleForCheck,
  );

  const [isHandlingWindows, setIsHandlingWindows] = useState<boolean>(false);

  const [isOpenErrorTariff, setIsOpenErrorTariff] = useState<boolean>(false);

  const { selectedRows, selectRow, setSelectedRows } = useRowSelection();
  const [profilesData, setProfilesData] = useState<any[]>([]);
  const [openWindowItem, setOpenWindowItem] = useState<any>(null);
  const [openAddFolder, setOpenAddFolder] = useState<boolean>(false);
  const [openEditFolders, setOpenEditFolders] = useState<boolean>(false);
  const [openEditFolder, setOpenEditFolder] = useState<boolean>(false);
  const [editFolder, setEditFolder] = useState<any>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [searchNote, setSearchNote] = useState<string>('');

  const [folderName, setFolderName] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<any>('#4CA0A0');
  const [errorAddFolder, setErrorAddFolder] = useState<any>(false);

  const [deleteFolders, setDeleteFolders] = useState<any[]>([]);
  const [foldersSortData, setFoldersSortData] = useState<any[]>([]);

  const [isOpenDropdownIcon, setIsOpenDropdownIcon] = useState<boolean>(false);
  const [isOpenDropdownColor, setIsOpenDropdownColor] = useState<boolean>(false);

  const [isFolderInfoFetching, setIsFolderInfoFetching] = useState(false);
  const [isProfileFetching, setIsProfileFetching] = useState(false);

  const [contentWidth, setContentWidth] = useState<number | null>(null);

  const icons = [
    { id: 1, title: 'Gambling', icon: <GamblingIcon /> },
    { id: 2, title: 'Google', icon: <BattingIcon /> },
    { id: 3, title: 'Crypto', icon: <CryptoIcon /> },
    { id: 4, title: 'Facebook', icon: <ProductsIcon /> },
    { id: 5, title: 'Nutra', icon: <NutraIcon /> },
  ];

  const colors = ['#4CA0A0', '#4E4CA0', '#A0604C', '#A04C88', '#51B2F8'];

  useEffect(() => {
    setProfilesParams([...profilesData]);
  }, [profilesData]);

  const handlers = useMemo(
    async () => await import('../../../features/profile/components/ProfileList/profileHandlers'),
    [],
  );

  const getProfileData = async (itemId: string) => {
    const teamId = localStorage.getItem('teamId');
    return (await fetchData({
      url: `/profile/${itemId}`,
      method: 'GET',
      team: teamId,
    }).then((res) => {
      const { data, errors } = res;
      if (errors) {
        if (errors.length) {
          throw new Error(errors[0].message);
        }
      }
      return data;
    })) as Profile;
  };

  const openEditFolderPopup = (folder: any) => {
    setFolderName(folder.title);
    setSelectedColor(folder.color);
    setSelectedIcon(icons.find((icon: any) => icon.id === folder.icon));
    setEditFolder(folder);
    setOpenEditFolder(true);
  };

  const openAddFolderPopup = () => {
    setOpenAddFolder(true);
  };

  const closeAddFolderPopup = () => {
    setOpenAddFolder(false);
    setIsOpenDropdownIcon(false);
    setIsOpenDropdownColor(false);
    setSelectedIcon(null);
    setSelectedColor('#4CA0A0');
    setFolderName('');
    setOpenEditFolder(false);
    setOpenEditFolders(false);
    setEditFolder(null);
    setDeleteFolders([]);
    setErrorAddFolder(false);
  };

  const openEditFoldersPopup = () => {
    openAddFolderPopup();
    setOpenEditFolders(true);
  };

  const closeEditFoldersPopup = () => {
    closeAddFolderPopup();
  };

  const toggleDropdownIcon = () => {
    setIsOpenDropdownColor(false);
    setIsOpenDropdownIcon((prevState) => !prevState);
  };

  const toggleDropdownColor = () => {
    setIsOpenDropdownIcon(false);
    setIsOpenDropdownColor((prevState) => !prevState);
  };

  const selectIcon = (icon: any) => {
    setErrorAddFolder(false);
    setSelectedIcon(icon);
    setIsOpenDropdownIcon(false);
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setIsOpenDropdownColor(false);
  };

  const selectDeleteFolders = (folder: any) => {
    setDeleteFolders([...deleteFolders, folder.external_id]);
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(folders);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    items.forEach((item, index) => {
      item.sort = items.length - index;
    });

    setFolders(items);
    setFoldersSortData(items);

    if (editFoldersSortTimer.current) {
      clearTimeout(editFoldersSortTimer.current);
    }

    editFoldersSortTimer.current = setTimeout(() => {
      editFoldersSort(items).catch((err) => {
        console.log('Error in handleOnDragEnd(): ', err);
      });
    }, 3000);
  };

  const editFoldersSort = async (foldersSortedBySort: any[]) => {
    setLoaderIsActiveFolders(true);
    const teamId = localStorage.getItem('teamId');
    try {
      console.log('foldersSortedBySort', foldersSortedBySort);
      const promises = foldersSortedBySort.map((folder) => {
        const submitData = {
          sort: folder.sort,
        };
        console.log('submitData', submitData);
        return fetchData({
          url: `/folder/${folder.external_id}`,
          method: 'PATCH',
          data: submitData,
          team: teamId,
        });
      });
      await Promise.all(promises);
      fetchFolders();
      setLoaderIsActiveFolders(false);
      setFoldersSortData([]);
    } catch (err) {
      console.log('Ошибка при обновлении сортировки папок: ', err);
      setLoaderIsActiveFolders(false);
    }
  };

  const addFolder = () => {
    if (folderName && selectedIcon) {
      closeAddFolderPopup();
      setLoaderIsActiveFolders(true);
      const teamId = localStorage.getItem('teamId');
      const submitData = {
        title: folderName,
        icon: selectedIcon.id,
        color: selectedColor,
      };
      console.log('submitData', submitData);
      fetchData({ url: '/folder', method: 'POST', data: submitData, team: teamId })
        .then((data: any) => {
          console.log('folders post', data);
          if (data.is_success) {
            setFolders([data.data, ...folders]);
            // fetchFolders();
          }
          setLoaderIsActiveFolders(false);
        })
        .catch((err) => {
          console.log('POST /folder error: ', err);
          setLoaderIsActiveFolders(false);
        });
    } else {
      setErrorAddFolder(true);
    }
  };

  const editFolderFunc = () => {
    if (folderName && selectedIcon) {
      closeAddFolderPopup();
      setLoaderIsActiveFolders(true);
      const teamId = localStorage.getItem('teamId');
      const submitData = {
        title: folderName,
        icon: selectedIcon.id,
        color: selectedColor,
      };
      console.log('submitData', submitData);
      fetchData({
        url: `/folder/${editFolder.external_id}`,
        method: 'PATCH',
        data: submitData,
        team: teamId,
      })
        .then((data: any) => {
          console.log('folders patch', data);
          if (data.is_success) {
            setFolders(data?.data);
            fetchFolders();
          }
          setLoaderIsActiveFolders(false);
        })
        .catch((err) => {
          console.log('PATCH /folder error: ', err);
          setLoaderIsActiveFolders(false);
        });
    } else {
      setErrorAddFolder(true);
    }
  };

  const selectFolder = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  // const fetchFolderInfo = async (folderId: string) => {
  //   const teamId = localStorage.getItem('teamId');
  //   try {
  //     const response = await fetchData({
  //       url: `/folder?=${folderId}`,
  //       method: 'GET',
  //       team: teamId,
  //     });
  //     if (response.is_success) {
  //       return response.data;
  //     } else {
  //       console.error('Fetch failed:', response.errors);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //     return null;
  //   }
  // };

  const deleteFoldersFunc = async () => {
    closeAddFolderPopup();
    setLoaderIsActiveFolders(true);
    const teamId = localStorage.getItem('teamId');
    try {
      const foldersArr = [...deleteFolders];
      const promises = foldersArr.map((external_id) =>
        fetchData({
          url: `/folder/${external_id}`,
          method: 'DELETE',
          team: teamId,
        }),
      );
      await Promise.all(promises);
      const foldersConst = folders.filter(
        (folder: any) => !foldersArr.includes(folder.external_id),
      );
      setFolders(foldersConst);
      setLoaderIsActiveFolders(false);
    } catch (err) {
      console.log(err);
      setLoaderIsActiveFolders(false);
    }
  };

  const handleOpenWindows = async () => {
    if (!isHandlingWindows) {
      setIsHandlingWindows(true);
      const rows = [...selectedRows];
      for (let i = 0; i < rows.length; i++) {
        const itemId = rows[i];
        const profileRecord = await getProfileData(itemId);
        const objParams = profilesData.find((item: any) => item?.external_id === itemId);
        const proxyParams = objParams?.proxyParams;
        const chromiumParams = objParams?.chromiumParams;
        const userExtensions = extensions.map((extension: any) => {
          if (extension.is_public) {
            return {
              id: extractExtensionId(extension.url),
              external_id: extension.external_id,
              url: extension.url,
              is_public: extension.is_public,
              title: extension.title,
            };
          } else {
            return {
              id: extension.external_id,
              external_id: extension.external_id,
              url: extension.url,
              is_public: extension.is_public,
              title: extension.title,
            };
          }
        });
        const currentVersion = getChromeVersion();
        const version =
          currentVersion?.major +
          '.' +
          currentVersion?.minor +
          '.' +
          currentVersion?.build +
          '.' +
          currentVersion?.patch;
        const naclArch = getNaclArch();
        if (chromiumParams && itemId && profileRecord && !runBrowsers[itemId]) {
          try {
            (await handlers).openNewWindow(
              chromiumParams,
              proxyParams,
              itemId,
              profileRecord,
              userExtensions,
              {
                version,
                naclArch,
              },
            );
            await setOpenWindowItem(itemId);
          } catch (err) {
            console.log('Error with chromium starts func - (handleOpenWindows): ', err);
          }
        }
      }
      setSelectedRows(new Set());
      setIsHandlingWindows(false);
    }
  };

  useEffect(() => {
    if (openWindowItem) {
      eventQueue.addToQueue(() => {
        dispatch(setRunBrowsers({ ...runBrowsers, [openWindowItem]: true }));
      });
    }
  }, [openWindowItem]);

  const handleCloseWindows = async () => {
    if (!isHandlingWindows) {
      setIsHandlingWindows(true);
      const rows = [...selectedRows];
      let pidItemsToClose = [];
      for (let i = 0; i < rows.length; i++) {
        const itemId = rows[i];
        const pidItem = pidProcess.find((item: any) => item?.id === itemId);
        if (pidItem) {
          pidItemsToClose.push(pidItem);
          (await handlers).closeWindowProcess(pidItem?.pid);
          await new Promise((resolve) => {
            const unsubscribe = store.subscribe(() => {
              if (!store.getState().runBrowsersReducer.runBrowsers[itemId]) {
                unsubscribe();
                resolve(true);
              }
            });
          });
        }
      }
      setSelectedRows(new Set());
      setIsHandlingWindows(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const deleteProfiles = async () => {
    const teamId = localStorage.getItem('teamId');
    try {
      const profileArr = [...selectedRows];
      const promises = profileArr.map((external_id) => {
        const timestamp = Date.now();
        const currentTime = formatTimestamp(timestamp);
        const submitData = {
          date_basket: currentTime,
        };
        return fetchData({
          url: `/profile/${external_id}`,
          method: 'PATCH',
          data: submitData,
          team: teamId,
        });
      });

      await Promise.all(promises);
      const profilesNotBasket = profilesAll.filter(
        (profile: any) => !profileArr.includes(profile.external_id),
      );
      setProfilesAllData(profilesNotBasket);
      setSelectedRows(new Set());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRecords = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: '/profile/proxy', method: 'GET', team: teamId })
      .then((data: any) => {
        if (data.is_success) {
          setAllProxiesData(data?.data || []);
        }
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  const fetchProfileConfig = () => {
    const lang = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY) as string;
    const teamId = localStorage.getItem('teamId');
    const urlApi = lang === 'ru' ? '/profile/config' : `/${lang}/profile/config`;
    fetchData({ url: urlApi, method: 'GET', team: teamId })
      .then((data: any) => {
        setProfilesConfigData(data.data);
        if (Object.keys(configData).length === 0) {
          setLoaderIsActive(false);
        }
      })
      .catch((err: Error) => {
        console.log(err);
      });
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
        console.log('/customer/login error: ', err);
      });
  };

  const fetchFolders = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: '/folder', method: 'GET', team: teamId })
      .then((data: any) => {
        console.log('Folders get', data);
        if (data.is_success) {
          setFolders(data?.data || []);
        }
      })
      .catch((err: Error) => {
        console.log(err);
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

  const fetchProfile = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: `/profile`, method: 'GET', team: teamId })
      .then((data: any) => {
        console.log('customer data', data);
        if (data.is_success) {
          if (data.data) {
            setProfilesAllData(data?.data);
          }
        }
      })
      .catch((err: Error) => {
        console.log('/customer/login error: ', err);
      });
  };

  const { currentPageRecords, setSearchFilterProxy, searchFilterProxy, setCurrentPageRecords } =
    useFilterProfiles({
      allRecords: profilesAll,
      currentPage,
      perPageCount,
    });

  const handleRefetch = async () => {
    await fetchMyTeams();
    fetchFolders();
    fetchRecords();
    fetchProfileConfig();
    fetchCustomerData();
    // fetchProfile();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActivePages([page]);
    setSearchName('');
    setSearchNote('');
    setSearchFilterProxy('');
  };

  const handlePerPageSelect = (perPageCount: number) => {
    setPerPageCount(perPageCount);
    setCurrentPage(1);
    setActivePages([1]);
  };

  const rotateProxyLink = async (proxyItem: { [key: string]: any }) => {
    let proxyForRotate = [
      { ...proxyItem, needCheckSpeed: false, needRotateLink: true, checkFromProfilesPage: true },
    ];
    const checkingProxiesAtTheMoment = [
      ...proxiesForCheck,
      ...proxySingleForCheck,
      ...accumulatedProxiesForCheck,
      ...accumulatedProxiesForCheckSingle,
    ];
    if (
      proxySingleForCheck.length > 0 &&
      !checkingProxiesAtTheMoment.find((proxy) => proxy.external_id === proxyItem.external_id)
    ) {
      dispatch(
        setAccumulatedProxiesForCheckSingle([
          ...accumulatedProxiesForCheckSingle,
          ...proxyForRotate,
        ]),
      );
    } else if (
      !checkingProxiesAtTheMoment.find((proxy) => proxy.external_id === proxyItem.external_id)
    ) {
      dispatch(setProxySingleForCheck(proxyForRotate));
    }
  };

  const checkProxies = async (proxyItem: { [key: string]: any }) => {
    const proxyForCheck = [{ ...proxyItem, needCheckSpeed: false, checkFromProfilesPage: true }];
    const checkingProxiesAtTheMoment = [
      ...proxiesForCheck,
      ...proxySingleForCheck,
      ...accumulatedProxiesForCheck,
      ...accumulatedProxiesForCheckSingle,
    ];
    if (
      proxySingleForCheck.length > 0 &&
      !checkingProxiesAtTheMoment.find((proxy) => proxy.external_id === proxyItem.external_id)
    ) {
      dispatch(
        setAccumulatedProxiesForCheckSingle([
          ...accumulatedProxiesForCheckSingle,
          ...proxyForCheck,
        ]),
      );
    } else if (
      !checkingProxiesAtTheMoment.find((proxy) => proxy.external_id === proxyItem.external_id)
    ) {
      dispatch(setProxySingleForCheck(proxyForCheck));
    }
  };

  const checkTariff = () => {
    const teamIdFromLocal = localStorage.getItem('teamId');
    const selectedTeam = myTeams?.find((team: any) => team.external_id === teamIdFromLocal);
    if (selectedTeam && customerData?.customer?.nickname === selectedTeam.nickname) {
      const dateTariffFinish = new Date(customerData?.tariff?.date_tariff_finish);
      if (customerData?.tariff?.date_tariff_finish && new Date() <= dateTariffFinish) {
        return true;
      }
      return false;
    } else if (
      selectedTeam &&
      selectedTeam.is_confirmed &&
      selectedTeam.limits?.total_profile > 0
    ) {
      return true;
    }
    return false;
  };

  const handleClickOutsideColor = (event: any) => {
    if (dropdownColorRef.current && !dropdownColorRef.current.contains(event.target)) {
      setIsOpenDropdownColor(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideColor);
    return () => {
      document.removeEventListener('click', handleClickOutsideColor);
    };
  }, []);

  const handleClickOutsideIcon = (event: any) => {
    if (dropdownIconRef.current && !dropdownIconRef.current.contains(event.target)) {
      setIsOpenDropdownIcon(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideIcon);
    return () => {
      document.removeEventListener('click', handleClickOutsideIcon);
    };
  }, []);

  useEffect(() => {
    if (myTeams.length > 0) {
      handleRefetch();
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(setIsProfileCreationDrawer(false));
    };
  }, []);

  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return;
    }

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setContentWidth(entry.contentRect.width);
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    resizeObserver.observe(contentElement);

    return () => {
      resizeObserver.unobserve(contentElement);
    };
  }, [contentWidth]);

  return (
    <div className="page">
      <div className={cls.profilesPage}>
        <div className={cls.folders} data-folders-mode={isNoneFolders}>
          <div className={cls.foldersHeader}>
            <p className={cls.headerTitle}>{t('Folders')}</p>
            <div className={cls.foldersHeaderRight}>
              <div
                className={cls.headerFolderItem}
                onClick={() => {
                  if (checkTariff()) {
                    openEditFoldersPopup();
                  } else {
                    setIsOpenErrorTariff(true);
                  }
                }}>
                <FolderSettings />
              </div>
              <div
                className={cls.headerFolderItem}
                onClick={() => {
                  if (checkTariff()) {
                    openAddFolderPopup();
                  } else {
                    setIsOpenErrorTariff(true);
                  }
                }}>
                <NewFolderIcon />
              </div>
            </div>
          </div>
          <div className={cls.allProfiles}>
            <div
              className={clsx(
                cls.allProfilesFolder,
                selectedFolder === 'all' ? cls.activeSelectedFolder : undefined,
              )}
              onClick={() => selectFolder('all')}>
              <FolderIcon color={'#d2d2d2'} />
              <p className={cls.folderTitle}>{t('All profiles')}</p>
            </div>
          </div>
          <div className={cls.folderItemsWrapper}>
            <div className={cls.folderItems}>
              {folders.length > 0 &&
                folders.map((folder, index) => (
                  <div
                    className={clsx(
                      cls.folderItem,
                      selectedFolder === folder.external_id ? cls.activeSelectedFolder : undefined,
                    )}
                    onClick={() => selectFolder(folder.external_id)}>
                    <div className={cls.folderItemLeft}>
                      <FolderIcon color={folder.color} />
                      <p>{folder.title}</p>
                    </div>
                    <div>{icons.find((icon) => icon.id === folder.icon)?.icon}</div>
                  </div>
                ))}
            </div>
          </div>
          {/*{folders.length > 0 && folders.map((i: any, idx: number) => (*/}
          {/*    <div className={cls.folderItem} key={idx}>*/}
          {/*        <div className={cls.folderItemLeft}>*/}
          {/*            <FolderIcon color={i.color} />*/}
          {/*            <p>{i.title}</p>*/}
          {/*        </div>*/}
          {/*        <div>*/}
          {/*            {icons.find((icon: any) => icon.id === i.icon).icon}*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*))}*/}
        </div>
        <div className={cls.content} ref={contentRef}>
          <ProfilesPageHeader
            deleteProfiles={deleteProfiles}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            handleRefetch={handleRefetch}
            handleOpenWindows={handleOpenWindows}
            handleCloseWindows={handleCloseWindows}
            setLoaderIsActive={setLoaderIsActive}
            contentWidth={contentWidth}
          />
          <ProfileList
            currentPageRecords={currentPageRecords}
            searchFilterProxy={searchFilterProxy}
            setCurrentPageRecords={setCurrentPageRecords}
            setSearchFilterProxy={setSearchFilterProxy}
            searchName={searchName}
            searchNote={searchNote}
            setSearchName={setSearchName}
            setSearchNote={setSearchNote}
            activePages={activePages}
            setActivePages={setActivePages}
            selectedRows={selectedRows}
            selectRow={selectRow}
            setSelectedRows={setSelectedRows}
            pidProcess={pidProcess}
            setProfilesData={setProfilesData}
            profilesData={profilesData}
            checkProxies={checkProxies}
            rotateProxyLink={rotateProxyLink}
            isHandlingWindows={isHandlingWindows}
            setIsHandlingWindows={setIsHandlingWindows}
            contentWidth={contentWidth}
            setIsProfileFetching={setIsProfileFetching}
            isProfileFetching={isProfileFetching}
          />
        </div>
        <AccountInfo
          handlePerPageSelect={handlePerPageSelect}
          handlePageChange={handlePageChange}
          itemsPerPageOptions={itemsPerPageOptions}
          perPageCount={perPageCount}
          currentPage={currentPage}
          activePages={activePages}
          totalPages={totalPages}
          className={cls.infoBar}
          page={'profiles'}
        />
        {loaderIsActive &&
          (configData === undefined ||
            configData === null ||
            Object.keys(configData).length === 0) && <Loader size={75} />}
        {loaderIsActiveFolders && <Loader size={75} />}
        {loaderProfilesPage && <Loader size={75} />}
        {/*<div className={cls.footer}></div>*/}
      </div>
      <ModalWindow modalWindowOpen={openAddFolder} onClose={closeEditFoldersPopup}>
        {openEditFolder ? (
          <>
            <div className={cls.modalWindowHeader}>
              <span className={cls.freeSpace} />
              <div className={cls.modalDeleteHeaderTitle}>
                <p className={cls.modalDeleteTitle}>{t('Edit folder')}</p>
              </div>
              <CloseIcon className={cls.closeBtn} onClick={closeAddFolderPopup} />
            </div>
            <div className={cls.addFolderContainer}>
              <div className={cls.addFolderData}>
                <div className={cls.addFolderDataItem}>
                  <p>{t('Folder name')}</p>
                  <div className={cls.inputWrapper}>
                    <input
                      value={folderName}
                      onChange={(e) => {
                        setErrorAddFolder(false);
                        setFolderName(e.target.value);
                      }}
                      type="text"
                      placeholder={t('Folder name')}
                      maxLength={50}
                      className={cls.inputFolderName}
                    />
                  </div>
                </div>
                <div className={cls.addFolderDataItem}>
                  <p>{t('Color')}</p>
                  <div className={cls.dropdown} ref={dropdownColorRef}>
                    <ul className={cls.colorList}>
                      {colors.map((color: string, idx: number) => (
                        <li
                          key={idx}
                          className={clsx(cls.dropdownColorItem, {
                            [cls.activeColor]: selectedColor && selectedColor === color,
                          })}
                          onClick={() => selectColor(color)}>
                          <span className={cls.color} style={{ background: color }}>
                            {selectedColor && selectedColor === color && <CheckIcon />}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={cls.addFolderDataItem}>
                  <p>{t('Icon')}</p>
                  <div className={cls.dropdown} ref={dropdownIconRef}>
                    <div
                      className={clsx(cls.dropdownMain, isOpenDropdownIcon && cls.dropdownActive)}
                      onClick={toggleDropdownIcon}>
                      {selectedIcon ? (
                        <div className={cls.selectedIcon}>
                          {selectedIcon.icon}
                          <p>{selectedIcon.title}</p>
                        </div>
                      ) : (
                        <p>{t('Select icon')}</p>
                      )}
                      <ArrowDownWhite />
                    </div>
                    {isOpenDropdownIcon && (
                      <ul className={cls.dropdownList}>
                        {icons.map((icon) => (
                          <li
                            key={icon.id}
                            className={clsx(cls.dropdownItem, {
                              [cls.active]: selectedIcon && selectedIcon.id === icon.id,
                            })}
                            onClick={() => selectIcon(icon)}>
                            <div className={cls.iconWithTitle}>
                              {icon.icon}
                              <p>{icon.title}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <p className={cls.errorValidation}>
                  {errorAddFolder && t('Not all fields are filled in')}
                </p>
              </div>
              <div className={cls.approveDeleteContent}>
                <button className={cls.btnAccept} onClick={editFolderFunc}>
                  {t('Accept')}
                </button>
                <button className={cls.btnCancelDeleteToken} onClick={closeAddFolderPopup}>
                  {t('Cancel')}
                </button>
              </div>
            </div>
          </>
        ) : openEditFolders ? (
          <>
            <div className={cls.modalWindowHeader}>
              <span className={cls.freeSpace} />
              <div className={cls.modalDeleteHeaderTitle}>
                <p className={cls.modalDeleteTitle}>{t('Edit folders')}</p>
              </div>
              <CloseIcon className={cls.closeBtn} onClick={closeEditFoldersPopup} />
            </div>
            <div className={cls.addFolderContainer}>
              <div className={cls.addFolderData}>
                {folders.length > 0 &&
                  folders
                    .filter(
                      (f1: any) => !deleteFolders.some((f2Id: string) => f1.external_id === f2Id),
                    )
                    .map((folder: any) => (
                      <div className={cls.folderContainer}>
                        <div
                          className={cls.folderWrapper}
                          onClick={() => openEditFolderPopup(folder)}>
                          <div className={cls.folderColorTitle}>
                            <FolderIcon color={folder.color} />
                            <p>{folder.title}</p>
                          </div>
                          <Edit2Icon />
                        </div>
                        <div
                          className={cls.removeFolderWrapper}
                          onClick={() => selectDeleteFolders(folder)}>
                          <IconTrash />
                        </div>
                      </div>
                    ))}
                {folders.length > 0 &&
                  folders.filter(
                    (f1: any) => !deleteFolders.some((f2Id: string) => f1.external_id === f2Id),
                  ).length < 1 && <p className={cls.noFoldersWrapper}>{t('Remove all folders')}</p>}
                {folders.length == 0 && <p className={cls.noFoldersWrapper}>{t('No folders')}</p>}
              </div>
              <div className={cls.approveDeleteContent}>
                <button
                  className={cls.btnAccept}
                  onClick={() => {
                    if (folders.length > 0) {
                      deleteFoldersFunc().then();
                    } else {
                      closeEditFoldersPopup();
                    }
                  }}>
                  {t('Accept')}
                </button>
                <button className={cls.btnCancelDeleteToken} onClick={closeEditFoldersPopup}>
                  {t('Cancel')}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={cls.modalWindowHeader}>
              <span className={cls.freeSpace} />
              <div className={cls.modalDeleteHeaderTitle}>
                <p className={cls.modalDeleteTitle}>{t('New folder')}</p>
              </div>
              <CloseIcon className={cls.closeBtn} onClick={closeAddFolderPopup} />
            </div>
            <div className={cls.addFolderContainer}>
              <div className={cls.addFolderData}>
                <div className={cls.addFolderDataItem}>
                  <p>{t('Folder name')}</p>
                  <div className={cls.inputWrapper}>
                    <input
                      value={folderName}
                      onChange={(e) => {
                        setErrorAddFolder(false);
                        setFolderName(e.target.value);
                      }}
                      type="text"
                      placeholder={t('Folder name')}
                      maxLength={50}
                      className={cls.inputFolderName}
                    />
                  </div>
                </div>
                <div className={cls.addFolderDataItem}>
                  <p>{t('Color')}</p>
                  <div className={cls.dropdown} ref={dropdownColorRef}>
                    <ul className={cls.colorList}>
                      {colors.map((color: string, idx: number) => (
                        <li
                          key={idx}
                          className={clsx(cls.dropdownColorItem, {
                            [cls.activeColor]: selectedColor && selectedColor === color,
                          })}
                          onClick={() => selectColor(color)}>
                          <span className={cls.color} style={{ background: color }}>
                            {selectedColor && selectedColor === color && <CheckIcon />}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={cls.addFolderDataItem}>
                  <p>{t('Icon')}</p>
                  <div className={cls.dropdown} ref={dropdownIconRef}>
                    <div
                      className={clsx(cls.dropdownMain, isOpenDropdownIcon && cls.dropdownActive)}
                      onClick={toggleDropdownIcon}>
                      {selectedIcon ? (
                        <div className={cls.selectedIcon}>
                          {selectedIcon.icon}
                          <p>{selectedIcon.title}</p>
                        </div>
                      ) : (
                        <p>{t('Select icon')}</p>
                      )}
                      <ArrowDownWhite />
                    </div>
                    {isOpenDropdownIcon && (
                      <ul className={cls.dropdownList}>
                        {icons.map((icon) => (
                          <li
                            key={icon.id}
                            className={clsx(cls.dropdownItem, {
                              [cls.active]: selectedIcon && selectedIcon.id === icon.id,
                            })}
                            onClick={() => selectIcon(icon)}>
                            <div className={cls.iconWithTitle}>
                              {icon.icon}
                              <p>{icon.title}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <p className={cls.errorValidation}>
                  {errorAddFolder && t('Not all fields are filled in')}
                </p>
              </div>
              <div className={cls.approveDeleteContent}>
                <button className={cls.btnAccept} onClick={addFolder}>
                  {t('Accept')}
                </button>
                <button className={cls.btnCancelDeleteToken} onClick={closeAddFolderPopup}>
                  {t('Cancel')}
                </button>
              </div>
            </div>
          </>
        )}
      </ModalWindow>
      <ModalWindow modalWindowOpen={isOpenErrorTariff} onClose={() => setIsOpenErrorTariff(false)}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <p className={cls.modalTitle}>{t('Error')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={() => setIsOpenErrorTariff(false)} />
        </div>
        <p className={cls.tariffErrorContent}>{t('You must purchase a plan')}</p>
        <div className={cls.approveContentModalWindow}>
          <button
            className={cls.btnApproveModalWindow}
            style={{ margin: '0 20px 20px 20px' }}
            onClick={() => navigate(AppRoutes.PAYMENT)}>
            {t('Buy plan')}
          </button>
        </div>
      </ModalWindow>
    </div>
  );
};
