import Flag from 'react-world-flags';
import React, { Dispatch, memo, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { Table } from '@/shared/components/Table/Table';
import cls from './ProfileList.module.scss';
import { Profile } from '../../types';
import { Checkbox } from '@/shared/components/Checkbox/Checkbox';
import { useTranslation } from 'react-i18next';
import { formatDateShorter } from '@/shared/utils';
import { Button } from '@/shared/components/Button';
import { ReactComponent as IconPlay } from '@/shared/assets/icons/play.svg';
import { ReactComponent as IconPause } from '@/shared/assets/icons/pause.svg';
import { useProfilesStore } from '../../store';
import { initialProfile } from '../../initialProfile';
import { useChromiumParams } from '../../hooks/useChromiumParams';
import { useProxyParams } from '../../hooks/useProxyParams';
import { ReactComponent as ArrowsIcon } from '@/shared/assets/icons/arrows.svg';
import { useProxiesStore } from '@/features/proxy/store';
import { fetchData } from '@/shared/config/fetch';
import { useDispatch, useSelector } from 'react-redux';
import LoaderDotsWhite from '@/shared/assets/loaders/loadersDotsWhite/LoaderDotsWhite';
import { ReactComponent as IconReload } from '@/shared/assets/icons/reload.svg';
import LoaderCircleMedium from '@/shared/assets/loaders/loaderCirldeMedium/LoaderCircleMedium';
import clsx from 'clsx';
import { ReactComponent as WindowsIcon } from '@/shared/assets/icons/windows.svg';
import { ReactComponent as MacosIcon } from '@/shared/assets/icons/macos.svg';
import { ReactComponent as LinuxIcon } from '@/shared/assets/icons/linux.svg';
import { EventQueue } from '@/app/EventQueue';
import { setRunBrowsers } from '@/store/reducers/RunBrowsersReducer';
import { Timer } from '@/shared/components/Timer';
import { useTimerStore } from '@/features/profile/hooks/useTimerStore';
import { ReactComponent as IconThreeDots } from '@/shared/assets/icons/three-dots.svg';
import { ReactComponent as IconTrash } from '@/shared/assets/icons/trash.svg';
import { ReactComponent as IconEdit } from '@/shared/assets/icons/edit.svg';
import { ReactComponent as IconChange } from '@/shared/assets/icons/change-proxy.svg';
import { ReactComponent as IconImport } from '@/shared/assets/icons/import-1.svg';
import { ReactComponent as IconExport } from '@/shared/assets/icons/export.svg';
import { ReactComponent as IconTags } from '@/shared/assets/icons/tags.svg';
import { ReactComponent as IconSend } from '@/shared/assets/icons/send.svg';
import { ReactComponent as IconFolderAdd } from '@/shared/assets/icons/folder-add.svg';
import { ReactComponent as IconFolderRemove } from '@/shared/assets/icons/folder-remove.svg';
import { ReactComponent as FacebookIcon } from '@/shared/assets/icons/facebook.svg';
import { ReactComponent as InstagramIcon } from '@/shared/assets/icons/instagram.svg';
import { ReactComponent as TwitterIcon } from '@/shared/assets/icons/twitter.svg';
import { ReactComponent as YoutubeIcon } from '@/shared/assets/icons/youtube.svg';
import { ReactComponent as TiktokIcon } from '@/shared/assets/icons/tiktok.svg';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { AppRoutes } from '@/shared/const/router';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { useNavigate } from 'react-router-dom';
import { useWorkspacesStore } from '@/features/workspace/store';
import { useExtensionsStore } from '@/features/account/components/ExtensionList/store';
import { extractExtensionId, getChromeVersion, getNaclArch } from '@/shared/utils/extensions';
import { toast } from 'react-toastify';
import { useOnClickOutside } from '@/shared/hooks/useOnClickOutside';
import DropdownMenu from '@/shared/components/DropdownMenu/DropdownMenu';
import { setIsEditProfileDrawer } from '@/store/reducers/Drawers';

import JSZip from 'jszip';
import { platform } from 'os';

interface ProfileListItemProps {
  item: Profile;
  isSelected: boolean;
  selectRow: (id: string, isSelected: boolean) => void;
  pidProcess?: any;
  setPidProcess?: React.Dispatch<React.SetStateAction<any>>;
  profilesData: any[];
  setProfilesData: React.Dispatch<React.SetStateAction<any[]>>;
  checkProxies: (proxyItem: { [key: string]: any }) => void;
  rotateProxyLink: (proxyItem: { [key: string]: any }) => void;
  isHandlingWindows: boolean;
  setIsHandlingWindows: Dispatch<SetStateAction<boolean>>;
  contentWidth: number | null;
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
}

interface ICheckedProxy {
  [key: string]: boolean;
}

export const ProfileListItem = memo((props: ProfileListItemProps) => {
  const {
    item,
    isSelected,
    selectRow,
    pidProcess,
    setProfilesData,
    checkProxies,
    rotateProxyLink,
    isHandlingWindows,
    setIsHandlingWindows,
    contentWidth,
    selectedRows,
    setSelectedRows,
  } = props;
  const { created_at, external_id, note, title, profile_proxy_external_id, folders, profile_type } =
    item || initialProfile;

  const { customerData, myTeams } = useWorkspacesStore();
  const { extensions } = useExtensionsStore();

  const navigate = useNavigate();

  // { value: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  //       { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
  //       { value: 'twitter', label: 'Twitter', icon: <TwitterIcon /> },
  //       { value: 'youtube', label: 'YouTube', icon: <YoutubeIcon /> },
  //       { value: 'tiktok', label: 'Tik Tok', icon: <TiktokIcon /> }

  const getProfileType = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <InstagramIcon width={18} height={18}/>;
      case 'twitter':
        return <TwitterIcon width={18} height={18}/>;
      case 'youtube':
        return <YoutubeIcon width={18} height={18}/>;
      case 'tiktok':
        return <TiktokIcon width={18} height={18}/>;
      case 'facebook':
        return <FacebookIcon width={18} height={18} />;
      default:
        return platform;
    }
  };

  const checkedProxies = useSelector((state: any) => state.proxiesDataReducer.proxies);
  const checkedProxySingle = useSelector((state: any) => state.proxiesDataReducer.proxiesSingle);
  const runBrowsers = useSelector((state: any) => state.runBrowsersReducer.runBrowsers);
  const runBrowsersLoader = useSelector((state: any) => state.runBrowsersReducer.runBrowsersLoader);
  const proxiesForCheck = useSelector((state: any) => state.proxiesForCheckReducer.proxiesForCheck);
  const proxySingleForCheck = useSelector(
    (state: any) => state.proxiesForCheckReducer.proxySingleForCheck,
  );
  const proxiesChangeIpResult = useSelector(
    (state: any) => state.proxiesForCheckReducer.proxiesChangeIpResult,
  );
  const accumulatedProxiesForCheck = useSelector(
    (state: any) => state.proxiesForCheckReducer.accumulatedProxiesForCheck,
  );
  const accumulatedProxiesForCheckSingle = useSelector(
    (state: any) => state.proxiesForCheckReducer.accumulatedProxiesForCheckSingle,
  );

  const { t } = useTranslation();
  const {
    configData,
    setIsOpenChangeTags,
    setProfileTags,
    setSelectedTagsProfile,
    setProfilesAllData,
    setIsOpenChangeProxyPopup,
    setProxyHost,
    setIsOpenDeleteProfilesPopup,
    setProfileToEdit,
    setIsOpenImportCookies,
    setIsOpenSendUserPopup,
    setIsOpenTransferFolderPopup,
    setIsOpenRemoveFolder,
  } = useProfilesStore();
  const chromiumParams = useChromiumParams(item as Profile);
  const proxyParams = useProxyParams(item as Profile);
  const { allProxies } = useProxiesStore();

  const [isOpenErrorTariff, setIsOpenErrorTariff] = useState<boolean>(false);

  const [changeIpStatus, setChangeIpStatus] = useState<boolean | null>(null);
  const [showTagsPopup, setShowTagsPopup] = useState<boolean>(false);
  const [showNotePopup, setShowNotePopup] = useState<boolean>(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
  const [showNoteEditPopup, setShowNoteEditPopup] = useState<boolean>(false);
  const [showStatusEditPopup, setShowStatusEditPopup] = useState<boolean>(false);
  const [noteContentLoad, setNoteContentLoad] = useState<boolean>(false);
  const [exportCookieFlag, setExportCookieFlag] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>('');
  const [statusContent, setStatusContent] = useState<string>('');
  const outsideClickNote = useRef<HTMLDivElement | null>(null);
  const outsideClickStatus = useRef<HTMLDivElement | null>(null);
  const outsideClickDropdown = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const statusRef = useRef(null);
  const noteRef = useRef(null);
  const [error, setError] = useState<string>('');

  const generateRandomSuffix = () => {
    const timestamp = Date.now();
    return timestamp.toString();
  };

  const generateAndDownloadTxtFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(anchor);
  };

  const exportCookies = async () => {
    setError('');

    if (selectedRows.size === 0) {
      console.log('No profile is selected');
      return;
    }

    try {
      const zip = new JSZip();
      const teamId = localStorage.getItem('teamId');
      if (selectedRows.size > 1) {
        let selectedProfiles: any[] = [];
        for (const externalID of selectedRows) {
          const profileRecord = (await fetchData({
            url: `/profile/${externalID}`,
            method: 'GET',
            team: teamId,
          }).then((res) => {
            const { data, errors } = res;
            if (errors) {
              if (errors.length) {
                setError(
                  `${t('Sorry, something went wrong')}. ${t(
                    'Please, try again or contact administrator',
                  )}`,
                );
                throw new Error(errors[0].message);
              }
            }
            return data;
          })) as Profile;
          selectedProfiles.push(profileRecord);
        }
        for (const selectedProfile of selectedProfiles) {
          let items: any[] = [];
          let cookieTitle: string;
          items = selectedProfiles.filter((profile) => profile.title === selectedProfile.title);

          if (items.length > 1) {
            const suffix = generateRandomSuffix();
            cookieTitle = `${selectedProfile.title}-${suffix}`;
          } else {
            cookieTitle = selectedProfile.title;
          }

          if (selectedProfile) {
            try {
              const parsedCookies = JSON.parse(selectedProfile.cookies);
              zip.file(`anty-code_${cookieTitle}_cookies.txt`, selectedProfile.cookies);
            } catch {
              zip.file(`anty-code_${cookieTitle}_cookies.txt`, '[]');
            }
          } else {
            console.warn(
              `Cookie is empty for the profile with externalID: ${selectedProfile.external_id}`,
            );
          }
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
          const url = URL.createObjectURL(content);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'anty-code_profiles_cookies.zip';
          document.body.appendChild(anchor);
          anchor.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(anchor);
        });
        setSelectedRows(new Set());
      } else {
        const [oneSelectedExternalID] = selectedRows;
        const profileRecord = (await fetchData({
          url: `/profile/${oneSelectedExternalID}`,
          method: 'GET',
          team: teamId,
        }).then((res) => {
          const { data, errors } = res;
          if (errors) {
            if (errors.length) {
              setError(
                `${t('Sorry, something went wrong')}. ${t(
                  'Please, try again or contact administrator',
                )}`,
              );
              throw new Error(errors[0].message);
            }
          }
          return data;
        })) as Profile;
        if (profileRecord) {
          try {
            const parsedCookies = JSON.parse(profileRecord.cookies);
            generateAndDownloadTxtFile(
              profileRecord.cookies,
              `anty-code_${profileRecord.title}_cookies.txt`,
            );
            setSelectedRows(new Set());
          } catch {
            generateAndDownloadTxtFile('[]', `anty-code_${profileRecord.title}_cookies.txt`);
            setSelectedRows(new Set());
          }
        }
      }
    } catch (err) {
      console.error(err);
      setSelectedRows(new Set());
    }
  };

  const changeTag = () => {
    selectRow(external_id, true);
    const tags = getTags();

    if (!Array.isArray(tags)) {
      setProfileTags([]);
      setSelectedTagsProfile([]);
    } else {
      setProfileTags(tags);
      setSelectedTagsProfile(tags);
    }
    setIsOpenChangeTags(true);
  };

  const openTagMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    changeTag();
    setShowDropdownMenu(false);
  };

  const openProxyMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    changeProxy();
    setShowDropdownMenu(false);
  };

  const openDeleteMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectRow(external_id, true);
    setIsOpenDeleteProfilesPopup(true);
    setShowDropdownMenu(false);
  };
  const openTransferFolderMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectRow(external_id, true);
    setIsOpenTransferFolderPopup(true);
    setShowDropdownMenu(false);
  };
  const openRemoveFolderMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectRow(external_id, true);
    setIsOpenRemoveFolder(true);
    setShowDropdownMenu(false);
  };

  const openSendUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectRow(external_id, true);
    setIsOpenSendUserPopup(true);
    setShowDropdownMenu(false);
  };

  const openExportCookieMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectRow(external_id, true);
    setExportCookieFlag(true);
    setShowDropdownMenu(false);
  };

  useEffect(() => {
    if (exportCookieFlag === true) {
      exportCookies();
      setShowDropdownMenu(false);
    }
    setExportCookieFlag(false);
  }, [exportCookieFlag]);

  const openImportCookieMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectRow(external_id, true);
    setProfileToEdit(item);
    setIsOpenImportCookies(true);
    setShowDropdownMenu(false);
  };

  const openEditMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileToEdit(item);
    dispatch(setIsEditProfileDrawer(true));
    setShowDropdownMenu(false);
  };

  const items = [
    {
      icon: <IconFolderAdd width={15} height={15} />,
      label: folders.length ? t('Move to another folder') : t('Add to folder'),
      onClick: openTransferFolderMenu,
    },
    folders.length && {
      icon: <IconFolderRemove width={15} height={15} />,
      label: t('Remove from folder'),
      onClick: openRemoveFolderMenu,
    },
    { icon: <IconEdit width={15} height={15} />, label: t('Edit'), onClick: openEditMenu },
    { icon: <IconChange width={15} height={15} />, label: t('Edit proxy'), onClick: openProxyMenu },
    {
      icon: <IconImport width={15} height={15} />,
      label: t('Import cookies'),
      onClick: openImportCookieMenu,
    },
    {
      icon: <IconExport width={15} height={15} />,
      label: t('Export cookies'),
      onClick: openExportCookieMenu,
    },
    { icon: <IconTags width={15} height={15} />, label: t('Tags'), onClick: openTagMenu },
    {
      icon: <IconSend width={15} height={15} />,
      label: t('Send to user'),
      onClick: openSendUserMenu,
    },
    { icon: <IconTrash width={15} height={15} />, label: t('Delete'), onClick: openDeleteMenu },
  ].filter(Boolean);

  useOnClickOutside(outsideClickNote, noteRef, () => {
    if (showNoteEditPopup) {
      setShowNoteEditPopup(false);
    }
  });
  useOnClickOutside(outsideClickStatus, statusRef, () => {
    if (showStatusEditPopup) {
      setShowStatusEditPopup(false);
    }
  });

  const profilesTimer = JSON.parse(localStorage.getItem('timers') as string);
  const profileTimer = profilesTimer?.find((profile: any) => profile.id === external_id) || false;

  const handleMouseEnter = (item: string) => {
    if (item === 'tags') {
      setShowTagsPopup(true);
    } else if (item === 'note') {
      setShowNotePopup(true);
    }
  };

  const handleMouseLeave = (item: string) => {
    if (item === 'tags') {
      setShowTagsPopup(false);
    } else if (item === 'note') {
      setShowNotePopup(false);
    }
  };

  let proxyDataFromLocalStorage: { [key: string]: any } | undefined;
  if (
    checkedProxies.find(
      (proxy: { [key: string]: any }) => proxy.external_id === item.profile_proxy_external_id,
    )
  ) {
    proxyDataFromLocalStorage = checkedProxies.find(
      (proxy: { [key: string]: any }) => proxy.external_id === item.profile_proxy_external_id,
    );
  } else if (
    checkedProxySingle.find(
      (proxy: { [key: string]: any }) => proxy.external_id === item.profile_proxy_external_id,
    )
  ) {
    proxyDataFromLocalStorage = checkedProxySingle.find(
      (proxy: { [key: string]: any }) => proxy.external_id === item.profile_proxy_external_id,
    );
  }

  const proxyItem = allProxies.filter(
    (proxy: any) => proxy.external_id === profile_proxy_external_id,
  )[0];

  useEffect(() => {
    const paramsItem = { external_id, chromiumParams, proxyParams };
    setProfilesData((prevState) => [
      ...prevState.filter((prev) => prev.external_id !== paramsItem.external_id),
      { ...paramsItem },
    ]);
  }, [chromiumParams, proxyParams, external_id]);

  const getStatus = (): any => {
    const profileItem = item as Profile;
    if (configData && configData.statuses && profileItem.profile_status_external_id) {
      const statusData = configData?.statuses?.find(
        (status: any) => status.external_id === profileItem.profile_status_external_id,
      );
      if (statusData) {
        return statusData;
      }
    }
    return t('No status');
  };

  const getTags = (): any => {
    const profileItem = item as Profile;
    if (profileItem.tags.length > 0) {
      return profileItem.tags;
    }
    return false;
  };

  const getName = (): any => {
    if (title) {
      const profileItem = item as Profile;
      const os = configData?.platforms?.find(
        (item: any) => item.external_id === profileItem.platform_external_id,
      );
      return { title: profileItem.title, os: os?.title };
    }
    return t('Untitled');
  };

  useEffect(() => {
    const proxiesAreChecking = [
      ...proxiesForCheck,
      ...proxySingleForCheck,
      ...accumulatedProxiesForCheck,
      ...accumulatedProxiesForCheckSingle,
    ];
    if (proxiesAreChecking.find((proxy) => proxy.external_id === item.profile_proxy_external_id)) {
      setChangeIpStatus(null);
      const allProxiesForChangeIp = [...proxiesChangeIpResult];
      const foundProxy = allProxiesForChangeIp.find(
        (proxy) => proxy.external_id === item.profile_proxy_external_id,
      );
      if (foundProxy?.rotateIpResult === true) {
        setChangeIpStatus(true);
        setTimeout(() => {
          setChangeIpStatus(null);
        }, 7000);
      } else if (foundProxy?.rotateIpResult === false) {
        setChangeIpStatus(false);
        setTimeout(() => {
          setChangeIpStatus(null);
        }, 7000);
      }
    }
  }, [proxiesChangeIpResult]);

  const dispatch = useDispatch();

  const eventQueue = EventQueue();

  const handlers = useMemo(
    async () => await import('@/features/profile/components/ProfileList/profileHandlers'),
    [],
  );

  const pidItem = pidProcess?.find((item: any) => item?.id === external_id);
  const handleOpenWindow = async () => {
    if (!isHandlingWindows) {
      setIsHandlingWindows(true);
      let profileRecord: { [key: string]: any } | undefined;
      const teamId = localStorage.getItem('teamId');
      try {
        if (external_id) {
          profileRecord = (await fetchData({
            url: `/profile/${external_id}`,
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
        }

        const userExtensions = extensions.map((extension: any) => {
          if(extension.is_public) {
            return {id: extractExtensionId(extension.url), external_id: extension.external_id, url: extension.url, is_public: extension.is_public, title: extension.title}
          } else{
            return {id: extension.external_id, external_id: extension.external_id, url: extension.url, is_public: extension.is_public, title: extension.title} 
          }
        }) 
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
        if (!runBrowsers[external_id] && external_id && profileRecord) {
          (await handlers).openNewWindow(
            chromiumParams,
            proxyParams,
            external_id,
            profileRecord,
            userExtensions,
            {
              version,
              naclArch,
            },
          );
          eventQueue.addToQueue(() => {
            dispatch(setRunBrowsers({ ...runBrowsers, [external_id]: true }));
          });
          setTimeout(() => {
            setIsHandlingWindows(false);
          }, 100);
        } else if (pidItem?.pid) {
          (await handlers).closeWindowProcess(pidItem?.pid);
          setTimeout(() => {
            setIsHandlingWindows(false);
          }, 100);
        }
      } catch (error) {
        console.error('Error in handleOpenWindow: ', error);
        setIsHandlingWindows(false);
      }
    }
  };

  const changeProxy = () => {
    selectRow(external_id, true);
    const validation =
      proxyItem && proxyItem.host && proxyItem.port && proxyItem.login && proxyItem.password;
    if (validation) {
      const proxy = `${proxyItem.host}:${proxyItem.port}:${proxyItem.login}:${proxyItem.password}`;
      setProxyHost(proxy);
    }
    setIsOpenChangeProxyPopup(true);
  };

  const showChangeNote = () => {
    setShowNoteEditPopup((prev) => !prev);
    if (note) {
      setNoteContent(note);
    }
  };
  const showStatusPopup = () => {
    setShowStatusEditPopup((prev) => !prev);
  };

  const handleTextAreaClick = (e: any) => {
    e.stopPropagation();
  };
  const handleChangeNote = async (e: any) => {
    e.stopPropagation();
    await fetchEdit();
  };

  const handleStatusClick = async (status: any) => {
    setStatusContent(status.external_id);
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

  const fetchProfile = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: `/profile`, method: 'GET', team: teamId })
      .then((data: any) => {
        if (data.is_success) {
          if (data.data) {
            setProfilesAllData(data?.data);
          }
        }
      })
      .catch((err: Error) => {
        toast.error(err.message);
      });
  };

  const fetchEdit = async () => {
    const teamId = localStorage.getItem('teamId');
    const editData: any = {};
    editData.note = noteContent !== undefined ? noteContent : '';
    if (statusContent) {
      editData.profile_status_external_id = statusContent;
    }
    setNoteContentLoad(true);
    try {
      const data = await fetchData({
        url: `/profile/${external_id}`,
        method: 'PATCH',
        data: editData,
        team: teamId,
      });
      if (data.is_success) {
        await fetchProfile();
        setShowNoteEditPopup(false);
        setShowStatusEditPopup(false);
        if (selectedRows.size) {
          setSelectedRows(new Set());
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setNoteContentLoad(false);
    }
  };

  useEffect(() => {
    if (statusContent) {
      fetchEdit();
    }
  }, [statusContent]);

  useEffect(() => {
    if (note) {
      setNoteContent(note);
    }
  }, [note]);

  return (
    <>
      <Table.Row isSelected={isSelected}>
        <Table.Col className={cls.colCheck}>
          <Checkbox
            checked={isSelected}
            onChange={(e) => selectRow(external_id, e.currentTarget.checked)}
          />
        </Table.Col>
        <Table.Col
          onClick={() => {
            if (checkTariff()) {
              handleOpenWindow().then();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}
          className={cls.colName}>
          <div className={cls.nameContainer}>
            <div className={cls.wrapperIcons}>
              <div className={cls.platformName}>
                {getName().os === 'Windows' && <WindowsIcon />}
                {getName().os === 'Linux' && <LinuxIcon />}
                {getName().os === 'Macos' && <MacosIcon />}
              </div>
              {profile_type && <div className={cls.typeName}>{getProfileType(profile_type)}</div>}
            </div>
            <div
              className={cls.nameWrapper}
              onMouseEnter={() => {
                setShowDropdownMenu(true);
              }}
              onMouseLeave={() => {
                setShowDropdownMenu(false);
              }}>
              <span ref={iconRef} onClick={(e) => e.stopPropagation()} className={cls.menuIcon}>
                <IconThreeDots width={15} height={15} />
              </span>
              <DropdownMenu
                items={items}
                referenceElement={iconRef.current}
                isFlipEnabled
                ref={outsideClickDropdown}
                showDropdown={showDropdownMenu}
              />
            </div>
            <p className={cls.nameContainerText}>{getName().title}</p>
          </div>
        </Table.Col>

        <Table.Col onClick={changeProxy} className={cls.colProxy}>
          {!proxyItem ? (
            <Table.EmptyCol />
          ) : (
            <div className={cls.proxyDiv}>
              <div className={cls.proxyWrap}>
                {proxyDataFromLocalStorage && proxyDataFromLocalStorage.country && (
                  <Flag
                    className={cls.proxyFlag}
                    height="11"
                    code={proxyDataFromLocalStorage.country.toUpperCase()}
                  />
                )}
                <div className={cls.proxyTitle}>
                  {[
                    ...proxiesForCheck,
                    ...proxySingleForCheck,
                    ...accumulatedProxiesForCheck,
                    ...accumulatedProxiesForCheckSingle,
                  ].find(
                    (proxy) =>
                      proxy.external_id === item.profile_proxy_external_id && !proxy.needRotateLink,
                  ) ? (
                    <LoaderDotsWhite />
                  ) : (
                    <div className={cls.proxyTitleWrapper}>
                      {proxyItem && proxyItem?.title.length
                        ? proxyItem?.title
                        : `${proxyItem.host}:${proxyItem.port}`}
                      {[...checkedProxies, ...checkedProxySingle].find(
                        (proxy) => proxy.external_id === item.profile_proxy_external_id,
                      ) ? (
                        <span className={cls.proxyGreenStatus} />
                      ) : (
                        <span className={cls.proxyRedStatus} />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {proxyItem && (
                <div className={cls.proxyWrapSecond}>
                  <div className={cls.iconContainer}>
                    <div
                      className={cls.proxyArrowsWrapper}
                      onClick={(e) => {
                        if (checkTariff()) {
                          checkProxies(proxyItem);
                          e.stopPropagation();
                        } else {
                          setIsOpenErrorTariff(true);
                        }
                      }}>
                      <ArrowsIcon className={cls.proxyArrows} width={18} height={13} />
                    </div>
                    <div className={cls.tooltipCheckProxyContainer}>
                      <div className={cls.tooltipCheckProxy}>{t('Check Proxy')}</div>
                    </div>
                  </div>

                  {proxyDataFromLocalStorage && proxyDataFromLocalStorage.userIP && (
                    <div className={cls.proxyTitle}>{proxyDataFromLocalStorage.userIP}</div>
                  )}
                  {proxyItem.link_rotate && proxyDataFromLocalStorage && (
                    <div className={cls.changeIpContainer}>
                      <div
                        className={cls.iconReloadWrapper}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (checkTariff()) {
                            rotateProxyLink(proxyItem);
                          } else {
                            setIsOpenErrorTariff(true);
                          }
                        }}>
                        {[
                          ...proxiesForCheck,
                          ...proxySingleForCheck,
                          ...accumulatedProxiesForCheck,
                          ...accumulatedProxiesForCheckSingle,
                        ].find(
                          (proxy) =>
                            proxy.external_id === item.profile_proxy_external_id &&
                            !proxy.needCheckSpeed &&
                            proxy.needRotateLink,
                        ) ? (
                          <LoaderCircleMedium selectedRow={isSelected} />
                        ) : (
                          (changeIpStatus === true && (
                            <IconReload
                              width={13}
                              height={13}
                              className={clsx([cls.colRefresh, cls.colRefreshGreen])}
                            />
                          )) ||
                          (changeIpStatus === false && (
                            <IconReload
                              width={13}
                              height={13}
                              className={clsx([cls.colRefresh, cls.colRefreshRed])}
                            />
                          )) ||
                          (changeIpStatus === null && (
                            <IconReload width={13} height={13} className={cls.colRefresh} />
                          ))
                        )}
                      </div>
                      {[
                        ...proxiesForCheck,
                        ...proxySingleForCheck,
                        ...accumulatedProxiesForCheck,
                        ...accumulatedProxiesForCheckSingle,
                      ].find(
                        (proxy) =>
                          proxy.external_id === item.profile_proxy_external_id &&
                          !proxy.needCheckSpeed &&
                          proxy.needRotateLink,
                      )
                        ? false
                        : (changeIpStatus === true && (
                            <div
                              className={clsx([
                                cls.tooltipChangeIpContainer,
                                cls.changeIpGreenContainer,
                              ])}>
                              <div
                                className={clsx([cls.tooltipChangeIp, cls.tooltipChangeIpGreen])}>
                                {t('Success')}
                              </div>
                            </div>
                          )) ||
                          (changeIpStatus === false && (
                            <div
                              className={clsx([
                                cls.tooltipChangeIpContainer,
                                cls.changeIpRedContainer,
                              ])}>
                              <div className={clsx([cls.tooltipChangeIp, cls.tooltipChangeIpRed])}>
                                {t('Error, try again!')}
                              </div>
                            </div>
                          )) ||
                          (changeIpStatus === null && (
                            <div className={cls.tooltipChangeIpContainer}>
                              <div className={cls.tooltipChangeIp}>{t('Change IP')}</div>
                            </div>
                          ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Table.Col>

        <Table.Col
          dropdownRef={statusRef}
          onClick={showStatusPopup}
          className={clsx(cls.colStatusChildes, {
            [cls.colStatusChildesActive]: showStatusEditPopup,
          })}>
          <div className={cls.statusContainer}>
            <p className={cls.statusContainerText}>{getStatus().title}</p>
            <span className={cls.statusColor} style={{ background: `${getStatus().color}` }} />
          </div>
          <div
            ref={outsideClickStatus}
            className={clsx(cls.statusPopup, {
              [cls.statusPopupActive]: showStatusEditPopup,
            })}>
            {configData?.statuses?.length ? (
              configData.statuses.map((status: { [key: string]: any }, index: number) => (
                <div
                  onClick={() => handleStatusClick(status)}
                  className={cls.selectItem}
                  key={index}>
                  <div className={cls.statusNameWrapper}>
                    <span className={cls.statusColor} style={{ background: `${status.color}` }} />
                    <p className={cls.statusText}>
                      {status.title.length > 14 ? `${status.title.slice(0, 14)}...` : status.title}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={cls.itemsNotFound}>{t('Statuses not found')}</div>
            )}
          </div>
        </Table.Col>

        <Table.Col onClick={changeTag} className={cls.colTags}>
          {getTags() ? (
            <div
              onClick={changeTag}
              className={cls.tagsWrapper}
              onMouseEnter={() => handleMouseEnter('tags')}
              onMouseLeave={() => handleMouseLeave('tags')}>
              {getTags()
                .slice(0, 2)
                .map((tag: string, index: number) => (
                  <div
                    className={clsx(
                      getTags().length > 2 && cls.tagWrapperMore2,
                      getTags().length === 2 && cls.tagWrapperMore1,
                      getTags().length === 1 && cls.tagWrapper,
                    )}
                    key={index}>
                    <p className={cls.tagItem}>{tag}</p>
                  </div>
                ))}
              {getTags().length > 2 && <span className={cls.dots3}>...</span>}
            </div>
          ) : (
            <Table.EmptyCol />
          )}
          {showTagsPopup && getTags().length > 2 && (
            <div
              className={cls.tagsPopup}
              onMouseEnter={() => handleMouseEnter('tags')}
              onMouseLeave={() => handleMouseLeave('tags')}>
              {getTags().map((tag: string, index: number) => (
                <div className={cls.popupTagItem} key={index}>
                  <p>{tag}</p>
                </div>
              ))}
            </div>
          )}
        </Table.Col>
        <Table.Col
          dropdownRef={noteRef}
          onClick={showChangeNote}
          className={clsx(cls.colNote, {
            [cls.colNoteActive]: showNoteEditPopup,
          })}>
          {note ? (
            <>
              <div
                onMouseEnter={() => handleMouseEnter('note')}
                onMouseLeave={() => handleMouseLeave('note')}>
                {note.length > 18 ? `${note.slice(0, 18)}...` : note}
              </div>
              {showNotePopup && note.length > 18 && (
                <div
                  className={cls.notePopup}
                  onMouseEnter={() => handleMouseEnter('note')}
                  onMouseLeave={() => handleMouseLeave('note')}>
                  {note}
                </div>
              )}
            </>
          ) : (
            <div>
              <Table.EmptyCol />
            </div>
          )}
          <div
            ref={outsideClickNote}
            className={clsx(cls.noteEditPopup, {
              [cls.noteEditPopupActive]: showNoteEditPopup,
            })}>
            <div className={cls.noteEditWrapper}>
              <textarea
                className={cls.textarea}
                value={noteContent}
                onClick={handleTextAreaClick}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={t('Notes')}
              />
              <Button loading={noteContentLoad} onClick={handleChangeNote} className={cls.btnSave}>
                {t('Save')}
              </Button>
            </div>
          </div>
        </Table.Col>
        <Table.Col className={cls.colDate}>{formatDateShorter(new Date(created_at))}</Table.Col>

        {contentWidth && contentWidth >= 1000 && (
          <Table.Col className={cls.colTimer}>
            {pidProcess.find((process: any) => process.id === external_id) ? (
              <Timer pidProcess={pidProcess} external_id={external_id} />
            ) : profileTimer ? (
              profileTimer.time
            ) : (
              <Table.EmptyCol />
            )}
          </Table.Col>
        )}

        <Table.Col
          className={contentWidth && contentWidth < 1400 ? cls.colActionSecond : cls.colAction}
          itemId={external_id}>
          <Button
            className={clsx(
              contentWidth && contentWidth >= 1400 && cls.buttonRun,
              contentWidth && contentWidth < 1400 && cls.paddingLeft,
            )}
            color={runBrowsers[external_id] ? 'danger' : 'primary'}
            variant="outline"
            leftIcon={
              runBrowsers[external_id] ? (
                <IconPause width={16} height={12} />
              ) : (
                <IconPlay width={16} height={12} />
              )
            }
            onClick={() => {
              if (checkTariff()) {
                handleOpenWindow().then();
              } else {
                setIsOpenErrorTariff(true);
              }
            }}
            notNeedSpan={!!(contentWidth && contentWidth < 1400)}
            // leftIcon={
            //     !runBrowsersLoader[external_id]
            //         ? runBrowsers[external_id] ? <IconPause width={16} height={12}/> :
            //             <IconPlay width={16} height={12}/>
            //         : false
            // }
          >
            {/*{*/}
            {/*    runBrowsersLoader[external_id]*/}
            {/*        ? runBrowsers[external_id] ? <LoaderDotsRed/> : <LoaderDotsGreen/>*/}
            {/*        : runBrowsers[external_id] ? <>{t('Stop')}</> : <>{t('Run')}</>*/}
            {/*}*/}
            {contentWidth && contentWidth >= 1400 ? (
              runBrowsers[external_id] ? (
                <>{t('Stop')}</>
              ) : (
                <>{t('Run')}</>
              )
            ) : null}
          </Button>
        </Table.Col>
      </Table.Row>
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
    </>
  );
});
