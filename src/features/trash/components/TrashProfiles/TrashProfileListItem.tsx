import { ipcRenderer } from 'electron';
import Flag from 'react-world-flags';
import React, { Dispatch, memo, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Table } from '@/shared/components/Table/Table';
import cls from './TrashProfileList.module.scss';
import { Profile } from '@/features/profile/types';
import { Checkbox } from '@/shared/components/Checkbox/Checkbox';
import { useTranslation } from 'react-i18next';
import { formatDate, formatDateShorter } from '@/shared/utils';
import { Button } from '@/shared/components/Button';
import { ReactComponent as IconPlay } from '@/shared/assets/icons/play.svg';
import { ReactComponent as IconPause } from '@/shared/assets/icons/pause.svg';
import { ReactComponent as IconRemove } from '@/shared/assets/icons/remove.svg';
import { useProfilesStore } from '@/features/profile/store';
import { initialProfile } from '@/features/profile/initialProfile';
import { useChromiumParams } from '@/features/profile/hooks/useChromiumParams';
import { useProxyParams } from '@/features/profile/hooks/useProxyParams';
import { ReactComponent as ArrowsIcon } from '@/shared/assets/icons/arrows.svg';
import { ReactComponent as Cross2Icon } from '@/shared/assets/icons/cross2.svg';
import { useProxiesStore } from '@/features/proxy/store';
import { RefetchButton } from '@/shared/components/RefetchButton/RefetchButton';
import { useCheckProxy } from '@/features/profile/hooks/useCheckProxy';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '@/shared/config/fetch';
import { EventQueue } from '@/app/EventQueue';
import { setRunBrowsers } from '@/store/reducers/RunBrowsersReducer';
import { ReactComponent as WindowsIcon } from '@/shared/assets/icons/windows.svg';
import { ReactComponent as LinuxIcon } from '@/shared/assets/icons/linux.svg';
import { ReactComponent as MacosIcon } from '@/shared/assets/icons/macos.svg';
import { ReactComponent as FacebookIcon } from '@/shared/assets/icons/facebook.svg';
import { ReactComponent as InstagramIcon } from '@/shared/assets/icons/instagram.svg';
import { ReactComponent as TwitterIcon } from '@/shared/assets/icons/twitter.svg';
import { ReactComponent as YoutubeIcon } from '@/shared/assets/icons/youtube.svg';
import { ReactComponent as TiktokIcon } from '@/shared/assets/icons/tiktok.svg';
import LoaderDotsWhite from '@/shared/assets/loaders/loadersDotsWhite/LoaderDotsWhite';
import LoaderCircleMedium from '@/shared/assets/loaders/loaderCirldeMedium/LoaderCircleMedium';
import { ReactComponent as IconReload } from '@/shared/assets/icons/reload.svg';
import clsx from 'clsx';
import { Timer } from '@/shared/components/Timer';
import { useProfilesTrashStore } from '@/features/trash/store';
import { ReactComponent as TrashIcon1 } from '@/shared/assets/icons/trash-icon-1.svg';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';

interface TrashProfileListItemProps {
  item: Profile;
  isSelected: boolean;
  selectRow: (id: string, isSelected: boolean) => void;
  pidProcess?: any;
  setPidProcess?: React.Dispatch<React.SetStateAction<any>>;
}

interface ICheckedProxy {
  [key: string]: boolean;
}

export const TrashProfileListItem = memo((props: TrashProfileListItemProps) => {
  const { item, isSelected, selectRow, pidProcess, setPidProcess } = props;
  const {
    profile_status_external_id,
    created_at,
    external_id,
    note,
    title,
    profile_proxy_external_id,
    tags,
    profile_type
  } = item || initialProfile;

  const { setAllProxiesData } = useProxiesStore();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
  // const profilesTimer = useSelector((state: any) => state.timerReducer.profilesTimer);

  const { t } = useTranslation();
  const { configData } = useProfilesStore();
  const { setProfilesAllData, profilesAll } = useProfilesTrashStore();
  const chromiumParams = useChromiumParams(item as Profile);
  const proxyParams = useProxyParams(item as Profile);
  const { allProxies } = useProxiesStore();

  const [changeIpStatus, setChangeIpStatus] = useState<boolean | null>(null);
  const [showTagsPopup, setShowTagsPopup] = useState<boolean>(false);
  const [showNotePopup, setShowNotePopup] = useState<boolean>(false);
  const [isOpenDeleteProfilesPopup, setIsOpenDeleteProfilesPopup] = useState<boolean>(false);

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

  // const checkedProxy = useMemo(() => {
  //     // FIXME will need to remove the commented code or back that
  //
  //     // if (checkedAllProxy[external_id]) {
  //     //     return <ArrowsIcon className={cls.proxyArrows} width={17} height={15}/>;
  //     // } else {
  //     //     return <div className={cls.proxyArrows}></div>;
  //     // }
  //
  //     return <ArrowsIcon className={cls.proxyArrows} width={17} height={15}/>;
  // }, [checkedAllProxy]);

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

  const openDeleteProfilesPopup = () => {
    setIsOpenDeleteProfilesPopup(true);
  };

  const closeDeleteProfilePopup = () => {
    setIsOpenDeleteProfilesPopup(false);
  };

  const deleteSelectedProfiles = async () => {
    await removeProfile();
    await setIsOpenDeleteProfilesPopup(false);
  };

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

  const removeProfile = async () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: `/profile/${external_id}`, method: 'DELETE', team: teamId })
      .then((data: any) => {
        if (data?.is_success) {
          const profilesInBasket = profilesAll.filter(
            (profile: any) => profile.external_id !== external_id && profile.date_basket,
          );
          setProfilesAllData(profilesInBasket || []);
        }
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  // const handleCheckProxyExternal = () => {
  //     const allCheckedProxy = {...checkedAllProxy};
  //     useCheckProxy(proxyItem);
  //     ipcRenderer.on('proxyStatus', (i, success) => {
  //         if (success) {
  //             allCheckedProxy[external_id] = true;
  //             setCheckedAllProxy(allCheckedProxy);
  //         } else if (!success) {
  //             allCheckedProxy[external_id] = false;
  //             setCheckedAllProxy(allCheckedProxy);
  //         }
  //         ;
  //     });
  // };

  const fetchRecords = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: '/profile/proxy', method: 'GET', team: teamId })
      .then((data: any) => {
        setAllProxiesData(data?.data || []);
      })
      .catch((err: Error) => {
        console.log(err);
      });
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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Table.Row isSelected={isSelected}>
        <Table.Col className={cls.colCheck}>
          <Checkbox
            checked={isSelected}
            onChange={(e) => selectRow(external_id, e.currentTarget.checked)}
          />
        </Table.Col>

        <Table.Col className={cls.colName}>
          <div className={cls.nameContainer}>
            {getName().os === 'Windows' && <WindowsIcon />}
            {getName().os === 'Linux' && <LinuxIcon />}
            {getName().os === 'Macos' && <MacosIcon />}
            <div className={cls.profileType}>{getProfileType(profile_type)}</div>
            <p className={cls.nameContainerText}>{getName().title}</p>
          </div>
        </Table.Col>

        {!proxyItem ? (
          <Table.Col className={cls.colProxyLine}>
            <Table.EmptyCol />
          </Table.Col>
        ) : (
          <Table.Col className={cls.colProxy}>
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
            </div>
          </Table.Col>
        )}

        <Table.Col className={cls.colStatusChildes}>
          <div className={cls.statusContainer}>
            <span className={cls.statusColor} style={{ background: `${getStatus().color}` }} />
            <p className={cls.statusContainerText}>{getStatus().title}</p>
          </div>
        </Table.Col>

        <Table.Col className={cls.colTags}>
          {getTags() ? (
            <div
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

        {!note ? (
          <Table.Col className={cls.colNote}>
            <Table.EmptyCol />
          </Table.Col>
        ) : (
          <Table.Col className={cls.colNote}>
            <div
              onMouseEnter={() => handleMouseEnter('note')}
              onMouseLeave={() => handleMouseLeave('note')}>
              {note && note.length > 18 ? `${note.slice(0, 18)}...` : note}
            </div>
            {showNotePopup && note.length > 18 && (
              <div
                className={cls.notePopup}
                onMouseEnter={() => handleMouseEnter('note')}
                onMouseLeave={() => handleMouseLeave('note')}>
                {note}
              </div>
            )}
          </Table.Col>
        )}

        <Table.Col className={cls.colDate}>{formatDateShorter(new Date(created_at))}</Table.Col>
        <Table.Col className={cls.colDate}>
          {formatDateShorter(new Date(item.date_basket ?? ''))}
        </Table.Col>

        <Table.Col className={cls.colAction} itemId={external_id}>
          <Button
            color={'danger'}
            variant="outline"
            leftIcon={<IconRemove width={16} height={12} />}
            onClick={() => openDeleteProfilesPopup()}>
            <>{t('Delete')}</>
          </Button>
        </Table.Col>
      </Table.Row>
      <ModalWindow modalWindowOpen={isOpenDeleteProfilesPopup} onClose={closeDeleteProfilePopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <TrashIcon1 />
            <p className={cls.modalTitle}>{t('Delete profile')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={() => closeDeleteProfilePopup()} />
        </div>
        <div className={cls.modalContent}>
          <div className={cls.warningTextContent}>
            <p className={cls.warningText1}>
              {t('Are you sure you want to delete the selected profiles?')}
            </p>
            <p className={cls.warningText2}>{t('The files will be deleted permanently')}</p>
          </div>
          <div className={cls.approveContent}>
            <button className={cls.btnCancel} onClick={() => closeDeleteProfilePopup()}>
              {t('Cancel')}
            </button>
            <button className={cls.btnDelete} onClick={() => deleteSelectedProfiles()}>
              {t('Delete')}
            </button>
          </div>
        </div>
      </ModalWindow>
    </>
  );
});
