import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Button } from '@/shared/components/Button';
import cls from './ProfilesPageHeader.module.scss';
import clsBtn from '@/shared/components/Button/Button.module.scss';
import { ReactComponent as IconPlay } from '@/shared/assets/icons/play.svg';
import { ReactComponent as IconPlusCircle } from '@/shared/assets/icons/plus-circle.svg';
import { ReactComponent as IconPause } from '@/shared/assets/icons/pause.svg';
import { ReactComponent as IconTrash } from '@/shared/assets/icons/trash.svg';
import { ReactComponent as IconEdit } from '@/shared/assets/icons/edit.svg';
import { ReactComponent as IconFolderAdd } from '@/shared/assets/icons/folder-add.svg';
import { ReactComponent as IconChange } from '@/shared/assets/icons/change-proxy.svg';
import { ReactComponent as IconImport } from '@/shared/assets/icons/import-1.svg';
import { ReactComponent as IconExport } from '@/shared/assets/icons/export.svg';
import { ReactComponent as IconTags } from '@/shared/assets/icons/tags.svg';
import { ReactComponent as IconSend } from '@/shared/assets/icons/send.svg';
import { ReactComponent as Arrow2Left } from '@/shared/assets/icons/arrow-2-left.svg';
import { ReactComponent as FolderLeft } from '@/shared/assets/icons/folder-left.svg';
import { ReactComponent as FolderRight } from '@/shared/assets/icons/folder-right.svg';
import { ProfileCreationDrawer } from '@/features/profile/components/ProfileCreationDrawer/ProfileCreationDrawer';
import { ProfileProxyDrawer } from '@/features/profile/components/ProfileProxyDrawer/ProfileProxyDrawer';
import { EditProfileDrawer } from '@/features/profile/components/EditProfileDrawer/EditProfileDrawer';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { ReactComponent as TrashIcon1 } from '@/shared/assets/icons/trash-icon-1.svg';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { fetchData } from '@/shared/config/fetch';
import { Profile } from '@/features/profile/types';
import JSZip, { forEach } from 'jszip';
import { useProfilesStore } from '@/features/profile/store';
import { CookiesAreaPopup } from './CookiesAreaPopup/CookiesAreaPopup';
import { InputCustom } from '@/shared/components/Input/InputCustom';
import { ReactComponent as ArrowsIcon } from '@/shared/assets/icons/arrows.svg';
import { useCreateProxyExternal } from '@/features/profile/hooks/useCreateProxyExternal';
import { useCreateNewProfileData } from '@/features/profile/hooks/useCreateNewProfile';
import {
  setAccumulatedProxiesForCheckSingle,
  setProxySingleForCheck,
} from '@/store/reducers/ProxiesForCheckReducer';
import { ipcRenderer } from 'electron';
import { SegmentedControl } from '@/shared/components/SegmentedControl/SegmentedControl';
import { useProfileInitData } from '@/features/profile/hooks/useProfileInitData';
import { Select } from '@/shared/components/Select';
import { useProxiesStore } from '@/features/proxy/store';
import { useDispatch, useSelector } from 'react-redux';
import LoaderDotsWhite from '@/shared/assets/loaders/loadersDotsWhite/LoaderDotsWhite';
import { ReactComponent as Cross3Icon } from '@/shared/assets/icons/cross3.svg';
import { ReactComponent as Cross1Icon } from '@/shared/assets/icons/cross1.svg';
import { ReactComponent as ArrowFilledDownIcon } from '@/shared/assets/icons/arrow-filled-down.svg';
import { ReactComponent as SearchIcon } from '@/shared/assets/icons/search.svg';
import { ReactComponent as CheckboxSelectedIcon } from '@/shared/assets/icons/checkbox-selected.svg';
import { ReactComponent as CheckboxIcon } from '@/shared/assets/icons/checkbox.svg';
import { setIsEditProfileDrawer, setIsProfileCreationDrawer } from '@/store/reducers/Drawers';
import { useWorkspacesStore } from '@/features/workspace/store';
import { FoldersMode, SidebarMode } from '@/shared/const/context';
import { SidebarModeContext, SidebarModeContextType } from '@/shared/context/SidebarModeContext';
import { setToken } from '@/store/reducers/AuthReducer';
import { FoldersModeContext, FoldersModeContextType } from '@/shared/context/FoldersModeContext';
import { AppRoutes } from '@/shared/const/router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

enum ButtonTypes {
  autoreg = 'btnAutoreg',
  farm = 'btnFarm',
  passToUser = 'btnPassToUser',
  download = 'btnDownload',
  deleteIcon = 'btnDeleteIcon',
  runProfiles = 'btnRunProfiles',
  stopProfiles = 'btnStopProfiles',
  createProfile = 'btnCreateProfile',
  tags = 'btnTags',
  edit = 'btnEdit',
  changeProxy = 'btnChangeProxy',
  upload = 'btnUpload',
}

interface ProfilesPageHeader {
  deleteProfiles: any;
  handleRefetch: () => void;
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleOpenWindows: () => void;
  handleCloseWindows: () => void;
  setLoaderIsActive: Dispatch<SetStateAction<boolean>>;
  contentWidth: number | null;
}

export const ProfilesPageHeader = (props: ProfilesPageHeader) => {
  const {
    deleteProfiles,
    handleRefetch,
    selectedRows,
    setSelectedRows,
    handleOpenWindows,
    handleCloseWindows,
    setLoaderIsActive,
    contentWidth,
  } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    configData,
    setProfilesAllData,
    setProfilesConfigData,
    profilesAll,
    isOpenChangeTags,
    setIsOpenChangeTags,
    profileTags,
    setProfileTags,
    setSelectedTagsProfile,
    selectedTagsProfile,
    isOpenChangeProxyPopup,
    proxyHost,
    setProxyHost,
    setIsOpenChangeProxyPopup,
    setIsOpenDeleteProfilesPopup,
    isOpenDeleteProfilesPopup,
    profileToEdit,
    setProfileToEdit,
    setIsOpenImportCookies,
    isOpenImportCookies,
    setIsOpenSendUserPopup,
    isOpenSendUserPopup,
    isOpenTransferFolderPopup,
    folders,
    setIsOpenTransferFolderPopup,
    setIsOpenRemoveFolder,
    isOpenRemoveFolder,
  } = useProfilesStore();
  const { options } = useProfileInitData();
  const { setAllProxiesData } = useProxiesStore();
  const { myTeams, customerData } = useWorkspacesStore();

  const { sidebarMode, setSidebarMode } = useContext(SidebarModeContext) as SidebarModeContextType;
  const isMiniSidebar = sidebarMode === SidebarMode.MINI;

  const { foldersMode, setFoldersMode } = useContext(FoldersModeContext) as FoldersModeContextType;
  const isNoneFolders = foldersMode === FoldersMode.NONE;

  const dispatch = useDispatch();
  const proxiesForCheck = useSelector((state: any) => state.proxiesForCheckReducer.proxiesForCheck);
  const proxySingleForCheck = useSelector(
    (state: any) => state.proxiesForCheckReducer.proxySingleForCheck,
  );
  const accumulatedProxiesForCheck = useSelector(
    (state: any) => state.proxiesForCheckReducer.accumulatedProxiesForCheck,
  );
  const accumulatedProxiesForCheckSingle = useSelector(
    (state: any) => state.proxiesForCheckReducer.accumulatedProxiesForCheckSingle,
  );
  const platform = useSelector((state: any) => state.platformReducer.platform);
  const isProfileCreationDrawer = useSelector(
    (state: any) => state.drawersReducer.isProfileCreationDrawer,
  );
  const isEditProfileDrawer = useSelector((state: any) => state.drawersReducer.isEditProfileDrawer);

  const [error, setError] = useState<string>('');
  const [textFile, setTextFile] = useState<any>('');
  const [successImportCookies, setSuccessImportCookies] = useState<boolean>(false);

  const [proxyType, setProxyType] = useState<string>('http');
  const [proxyData, setProxyData] = useState<{ [key: string]: any }>({
    title: '',
    type: 'http',
    host: '',
    port: '',
    login: '',
    password: '',
  });
  const [proxyError, setProxyError] = useState<string>('');
  const [checkProxySuccess, setCheckProxySuccess] = useState<boolean>(false);
  const [addProxyOption, setAddProxyOption] = useState<number | string>(0);
  const [selectedProxy, setSelectedProxy] = useState<any>(null);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [checkProxyData, setCheckProxyData] = useState<any>(null);
  const [isCheckingProxy, setIsCheckingProxy] = useState<boolean>(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchTag, setSearchTag] = useState('');

  const [userName, setUserName] = useState<string>('');
  const [teamTitle, setTeamTitle] = useState<string>('');
  const [freeNick, setFreeNick] = useState<boolean | null>(null);
  const [freeTeamTitle, setFreeTeamTitle] = useState<boolean | null>(null);
  const [checkNickTitleError, setCheckNickTitleError] = useState<boolean>(false);

  const [isOpenErrorTariff, setIsOpenErrorTariff] = useState<boolean>(false);

  const openSendUserPopup = () => {
    setIsOpenSendUserPopup(true);
  };

  const closeSendUserPopup = () => {
    setIsOpenSendUserPopup(false);
    setUserName('');
    setTeamTitle('');
    setFreeNick(null);
    setFreeTeamTitle(null);
    setCheckNickTitleError(false);
    setSelectedRows(new Set());
  };

  const openTransferFolder = () => {
    if (selectedRows.size > 0) {
      setIsOpenTransferFolderPopup(true);
    } else {
      toast.info(t('Please select at least 1 profile'));
    }
  };

  const sendData = async () => {
    setLoaderIsActive(true);
    const checkData = await checkFreeNickAndTeamTitle();
    if (checkData === true) {
      const teamId = localStorage.getItem('teamId');
      try {
        const profileArr = [...selectedRows];
        const promises = profileArr.map((external_id) => {
          const submitData = {
            nickname: userName,
            title_team: teamTitle,
          };
          fetchData({
            url: `/profile/${external_id}`,
            method: 'PATCH',
            data: submitData,
            team: teamId,
          }).then((data: any) => {
            if (data.is_success) {
              closeSendUserPopup();
              setProfilesAllData(
                profilesAll.filter((profile: any) => profile.external_id !== external_id),
              );
            } else {
              setCheckNickTitleError(true);
              return null;
            }
          });
        });
        await Promise.all(promises);
        await setLoaderIsActive(false);
      } catch (err) {
        console.log(err);
      }
    } else if (checkData === 'error') {
      setCheckNickTitleError(true);
    }
  };

  const checkFreeNickAndTeamTitle = async () => {
    const teamId = localStorage.getItem('teamId');
    const dataSubmit = {
      nickname: userName,
      title_team: teamTitle,
    };

    try {
      const dataNickname = await fetchData({
        url: '/customer/is-free-nickname',
        method: 'POST',
        data: { nickname: dataSubmit.nickname },
      });

      const dataTeamTitle = await fetchData({
        url: '/customer/is-free-title-team',
        method: 'POST',
        data: { title_team: dataSubmit.title_team },
        team: teamId,
      });

      if (dataNickname.is_success && dataTeamTitle.is_success) {
        setFreeNick(!dataNickname.data.is_free);
        setFreeTeamTitle(!dataTeamTitle.data.is_free);

        if (!dataNickname.data.is_free && !dataTeamTitle.data.is_free) {
          return true;
        } else {
          return false;
        }
      } else {
        return 'error';
      }
    } catch (err) {
      console.log('Error in checkFreeNickAndTeamTitle:', err);
      return 'error';
    }
  };

  let allTags: string[] = [];
  profilesAll?.forEach((profile: any) => {
    profile.tags.map((tag: string) => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  const handleCreateProfile = () => {
    dispatch(setIsProfileCreationDrawer(true));
  };

  const handleEditProfile = async () => {
    const foundedProfile = profilesAll.find(
      (profile) => profile.external_id === Array.from(selectedRows)[0],
    );
    if (selectedRows.size === 1) {
      setProfileToEdit(foundedProfile);
      dispatch(setIsEditProfileDrawer(true));
    } else {
      toast.info(t('You can only edit 1 profile'));
      return;
    }
  };

  const handleImportCookies = async () => {
    const foundedProfile = profilesAll.find(
      (profile) => profile.external_id === Array.from(selectedRows)[0],
    );
    if (selectedRows.size === 1) {
      await setProfileToEdit(foundedProfile);
      await setIsOpenImportCookies(true);
    }
  };

  const handleChangeTags = () => {
    const foundedProfileId = Array.from(selectedRows);
    const filteredProfile = profilesAll.filter((profile) =>
      foundedProfileId.includes(profile.external_id),
    );
    const allTags = filteredProfile.flatMap((profile) => profile.tags);
    if (selectedRows.size > 0) {
      setProfileTags(allTags);
      setSelectedTagsProfile(allTags);
      setProfileToEdit(filteredProfile);
      setIsOpenChangeTags(true);
    } else {
      toast.info(t('Please select at least 1 profile'));
    }
  };

  const closeChangeTagsPopup = () => {
    setIsOpenChangeTags(false);
    setProfileTags([]);
    setSelectedTagsProfile([]);
    setSelectedRows(new Set());
  };

  const openDeleteProfilesPopup = () => {
    setIsOpenDeleteProfilesPopup(true);
  };

  const closeDeleteProfilePopup = () => {
    setIsOpenDeleteProfilesPopup(false);
    setSelectedRows(new Set());
  };

  const closeRemoveProfileFromFolder = () => {
    setIsOpenRemoveFolder(false);
    setSelectedRows(new Set());
  };

  const closeImportCookiesPopup = () => {
    setIsOpenImportCookies(false);
    setSuccessImportCookies(false);
    setTextFile('');
    setSelectedRows(new Set());
  };

  const closeChangeProxyPopup = async () => {
    await setProxyData({
      title: '',
      type: 'http',
      host: '',
      port: '',
      login: '',
      password: '',
    });
    await setProxyType('http');
    await setProxyHost('');
    await setProxyError('');
    await setCheckProxySuccess(false);
    setAddProxyOption(0);
    setSelectedProxy(null);
    setIsOpenChangeProxyPopup(false);
    setSelectedRows(new Set());
  };

  const closeTransferFolder = () => {
    setIsOpenTransferFolderPopup(false);
    setSelectedFolder(null);
    setSelectedRows(new Set());
  };

  const openChangeProxyPopup = () => {
    const selectedProfiles = profilesAll.filter((profile) =>
      Array.from(selectedRows).includes(profile.external_id),
    );

    if (selectedRows.size > 0 && selectedProfiles.length > 0) {
      const hasProxyProfile = selectedProfiles.some(
        (profile) => profile?.profile_proxy_external_id,
      );

      if (hasProxyProfile) {
        setAddProxyOption(2);
        const proxyValues = selectedProfiles.map((profile) => profile?.profile_proxy_external_id);
        setSelectedProxy({
          ...selectedProxy,
          values: proxyValues,
        });
      }
      setProfileToEdit(selectedProfiles);
      setIsOpenChangeProxyPopup(true);
    }
  };

  const deleteSelectedProfiles = async () => {
    await deleteProfiles();
    await setIsOpenDeleteProfilesPopup(false);
    await setSelectedRows(new Set());
  };

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

  const importCookies = () => {
    try {
      const parsedCookies = JSON.parse(textFile);
      const teamId = localStorage.getItem('teamId');
      const dataSubmit = {
        cookies: textFile,
      };
      fetchData({
        url: `/profile/${profileToEdit.external_id}`,
        method: 'PATCH',
        data: { ...dataSubmit },
        team: teamId,
      })
        .then(() => {
          setSuccessImportCookies(true);
        })
        .catch((err: Error) => {
          console.log(err);
        });
    } catch {
      console.log('Cookies are not valid!');
    }
  };

  const fetchProfileChangeProxy = async (dataSubmit: any) => {
    const teamId = localStorage.getItem('teamId');
    const selectedProfiles = Array.from(selectedRows);

    if (selectedProfiles.length > 0) {
      try {
        const requests = selectedProfiles.map((profileId) =>
          fetchData({
            url: `/profile/${profileId}`,
            method: 'PATCH',
            data: { ...dataSubmit },
            team: teamId,
          }),
        );
        const results = await Promise.all(requests);
        results.forEach((res) => {
          if (!res.is_success) {
            toast.error(res.errorMessage);
          }
        });
        await closeChangeProxyPopup();
        await fetchProfile();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.info(t('Please select at least 1 profile'));
    }
  };

  const changeProxyInProfile = () => {
    if (addProxyOption == 0) {
      const dataSubmit = {
        profile_proxy_external_id: null,
      };
      fetchProfileChangeProxy(dataSubmit);
    } else if (addProxyOption == 1) {
      setProxyError('checking');
      const proxyOptions = proxyData;
      const proxyAll = options.profileProxyExternalOpt;
      const teamId = localStorage.getItem('teamId');
      fetchData({ url: '/profile/proxy', method: 'POST', data: proxyOptions, team: teamId })
        .then((res) => {
          if (res?.is_success) {
            const proxyRecord = res?.data as { external_id: string };
            setProxyError('success');
            fetchData({ url: '/profile/proxy', method: 'GET', team: teamId })
              .then((data: any) => {
                setProfilesConfigData({ ...configData, proxies: data?.data });
                handleRefetch();
                setIsOpenChangeProxyPopup(false);
                return data;
              })
              .then((proxiesData) => {
                if (checkProxyData === null) {
                  console.log('checkProxyData', false);
                  setCheckProxyData(null);
                } else {
                  console.log('checkProxyData', true);
                  setCheckProxyData(null);
                }

                const dataSubmit = {
                  profile_proxy_external_id: proxiesData.data[0].external_id,
                };
                fetchData({
                  url: `/profile/${profileToEdit.external_id}`,
                  method: 'PATCH',
                  data: { ...dataSubmit },
                  team: teamId,
                })
                  .then((data: any) => {
                    // Close Drawer
                    if (data?.is_success) {
                      closeChangeProxyPopup().then();
                      let proxyItem = [{ ...proxiesData.data[0], checkFromProfilesPage: true }];
                      const checkingProxiesAtTheMoment = [
                        ...proxiesForCheck,
                        ...proxySingleForCheck,
                        ...accumulatedProxiesForCheck,
                        ...accumulatedProxiesForCheckSingle,
                      ];
                      if (
                        proxySingleForCheck.length > 0 &&
                        !checkingProxiesAtTheMoment.find(
                          (proxy) => proxy.external_id === proxyItem[0].external_id,
                        )
                      ) {
                        dispatch(
                          setAccumulatedProxiesForCheckSingle([
                            ...accumulatedProxiesForCheckSingle,
                            ...proxyItem,
                          ]),
                        );
                      } else if (
                        !checkingProxiesAtTheMoment.find(
                          (proxy) => proxy.external_id === proxyItem[0].external_id,
                        )
                      ) {
                        dispatch(setProxySingleForCheck(proxyItem));
                      }
                    }
                  })
                  .catch((err: Error) => {
                    console.log(err);
                  })
                  .finally(() => {
                    fetchData({ url: '/profile', method: 'GET', team: teamId })
                      .then((data: any) => {
                        const profilesNotBasket = data?.data.filter(
                          (profile: any) => profile.date_basket === null,
                        );
                        setProfilesAllData(profilesNotBasket);
                      })
                      .catch((err: Error) => {
                        console.log('Error of get cookies:', err);
                      });
                  });
              })
              .catch((err: Error) => {
                console.log('Error of post profile:', err);
              });
            return;
          }
          if (res.errorCode === 12 && res.errorMessage && res.errorMessage.includes('exists')) {
            setProxyError('used');
          }
          if (res.errorCode === 9) {
            setProxyError('incorrect');
          } else if (
            res.errorCode === 12 &&
            res.errorMessage &&
            !res.errorMessage.includes('exists')
          ) {
            setProxyError('error');
          }
        })
        .catch((err: Error) => {
          setProxyError('error');
        });
    } else if (addProxyOption == 2) {
      const dataSubmit = {
        profile_proxy_external_id: selectedProxy.value,
      };
      fetchProfileChangeProxy(dataSubmit);
    }
  };

  const checkProxyInChangeProxyPopup = async (
    proxyOptions: { [key: string]: any },
    retryCount = 0,
  ) => {
    try {
      return await new Promise(async (resolve, reject) => {
        await setIsCheckingProxy(true);
        await ipcRenderer.removeAllListeners('checkProxyInProfileFormResult');
        await ipcRenderer.send('checkProxyInProfileForm', proxyOptions);
        await ipcRenderer.once('checkProxyInProfileFormResult', async (event, result) => {
          if (result.result === 'requestError') {
            console.error('Error of checkProxy:', result.result);
            if (retryCount < 2) {
              console.log(`Retrying checkProxy, attempt ${retryCount + 1}`);
              setTimeout(async () => {
                try {
                  await ipcRenderer.removeAllListeners('checkProxyInProfileFormResult');
                  const updatedData = await checkProxyInChangeProxyPopup(
                    proxyOptions,
                    retryCount + 1,
                  );
                  await resolve(updatedData);
                } catch (err) {
                  await ipcRenderer.removeAllListeners('checkProxyInProfileFormResult');
                  await setIsCheckingProxy(false);
                  await resolve(err);
                }
              }, 1000);
            } else {
              await setProxyError('error');
              await setCheckProxySuccess(false);
              await setIsCheckingProxy(false);
              await resolve(true);
            }
          } else {
            try {
              await console.log('Result of checkProxy:', {
                result: JSON.parse(result.result),
              });
              await setProxyError('success');
              await setCheckProxySuccess(true);
              await setCheckProxyData({ ...JSON.parse(result.result) });
              await ipcRenderer.removeAllListeners('checkProxyInProfileFormResult');
              await setIsCheckingProxy(false);
              await resolve(true);
            } catch (err) {
              console.log('Error with in "try" block where JSON.parse(result.result): ', err);
              if (retryCount < 3) {
                console.log(`Retrying checkProxy, attempt ${retryCount + 1}`);
                setTimeout(async () => {
                  try {
                    await ipcRenderer.removeAllListeners('checkProxyInProfileFormResult');
                    const updatedData = await checkProxyInChangeProxyPopup(
                      proxyOptions,
                      retryCount + 1,
                    );
                    await resolve(updatedData);
                  } catch (err) {
                    await ipcRenderer.removeAllListeners('checkProxyInProfileFormResult');
                    await setIsCheckingProxy(false);
                    await resolve(err);
                  }
                }, 1000);
              } else {
                await console.error('Max retry attempts reached. Could not recover from error.');
                await setProxyError('error');
                await setCheckProxySuccess(false);
                await ipcRenderer.removeAllListeners('checkProxyInProfileFormResult');
                await setIsCheckingProxy(false);
                await resolve(true);
              }
            }
          }
        });
      });
    } catch (error) {
      console.error('Error in handleCheckProxyExternal: ', error);
      setProxyError('error');
      setCheckProxySuccess(false);
      setIsCheckingProxy(false);
    }
  };

  // Checking Proxy in adding proxy form
  const handleCheckProxyExternal = async () => {
    // Execute this part first
    const proxyOptions = proxyData;

    //Then, execute the rest of the logic
    const colonRegex = /:/g;
    if ((proxyHost.match(colonRegex) || []).length === 3) {
      checkProxyInChangeProxyPopup(proxyOptions).catch((error) => {
        console.error('Error in handleCheckProxyExternal: ', error);
        setProxyError('error');
        setCheckProxySuccess(false);
      });
    } else {
      setProxyError('error');
      setCheckProxySuccess(false);
    }
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const colonRegex = /:/g;

    if ((proxyHost.match(colonRegex) || []).length === 3) {
      // Clear the previous timeout if it exists
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current!);
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        console.log('Timeout expired, calling handleCheckProxyExternal');
        handleCheckProxyExternal().then((data) => {});
      }, 1000);
    } else if (proxyHost.length > 0) {
      setTimeout(() => {
        console.log("ProxyHost changed, setting proxyError to 'error'");
      }, 1000);
    }

    // Cleanup function to clear the timeout when the component unmounts or when proxyHost changes
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current!);
        console.log('Cleanup: Cleared timeout');
      }
    };
  }, [proxyHost, proxyType]);

  const handleDeleteAllTags = (event: any) => {
    event.stopPropagation();
    setProfileTags([]);
    setSelectedTagsProfile([]);
  };

  const handleTagRemove = (e: any, item: any) => {
    e.stopPropagation();
    setProfileTags(profileTags.filter((tag: string) => tag !== item));
    setSelectedTagsProfile(selectedTagsProfile.filter((selectedTag) => selectedTag !== item));
  };

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTagInputBlur(event);
    }
  };

  const handleTagInputBlur = (event: any) => {
    const inputTagValue = event.target.value.trim();
    if (inputTagValue !== '') {
      if (profileTags.length < 10) {
        if (!profileTags.includes(inputTagValue)) {
          setProfileTags([...profileTags, inputTagValue]);
          if (allTags.includes(inputTagValue)) {
            setSelectedTagsProfile([...selectedTagsProfile, inputTagValue]);
          }
        } else {
          console.log('The tag already exists!');
        }
      } else {
        console.log('Maximum tag limit reached!');
      }
      event.target.value = '';
    }
  };

  const handleAddTagCheckbox = (e: any, tag: string) => {
    e.stopPropagation();
    const tagValue = tag.trim();
    if (profileTags.length < 10) {
      if (!profileTags.includes(tagValue)) {
        setProfileTags([...profileTags, tagValue]);
      } else {
        console.log('The tag already exists!');
      }
    } else {
      console.log('Maximum tag limit reached!');
    }
  };

  const toggleDropdown = (e: any) => {
    e.stopPropagation();
    if (allTags.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleTagCheckboxChange = (e: any, tag: string) => {
    if (selectedTagsProfile.includes(tag)) {
      setSelectedTagsProfile(selectedTagsProfile.filter((selectedTag) => selectedTag !== tag));
      handleTagRemove(e, tag);
    } else if (profileTags.length < 10) {
      setSelectedTagsProfile([...selectedTagsProfile, tag]);
      handleAddTagCheckbox(e, tag);
    }
  };

  const transferInFolder = async () => {
    if (!selectedFolder) {
      toast.error(t('Please select 1 folder'));
      return;
    }

    const foundedFolder = selectedFolder ? selectedFolder.value : null;
    const folderName = selectedFolder ? selectedFolder.label : null;
    const foundedProfileId = Array.from(selectedRows);
    const teamId = localStorage.getItem('teamId');

    if (foundedProfileId.length > 0) {
      try {
        const requests = foundedProfileId.map((profileId) =>
          fetchData({
            url: `/profile/${profileId}`,
            method: 'PATCH',
            data: { folders: [foundedFolder] },
            team: teamId,
          }),
        );

        const results = await Promise.all(requests);

        results.forEach((res) => {
          if (!res.is_success) {
            toast.error(res.errorMessage);
          } else {
            toast.success(t('Folder info', { folderName }));
          }
        });

        setIsOpenTransferFolderPopup(false);
        setSelectedFolder(null);
        await fetchProfile();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setSelectedRows(new Set());
      }
    } else {
      toast.info(t('Please select at least 1 profile'));
    }
  };
  const removeFromFolder = async () => {
    const foundedProfileId = Array.from(selectedRows);
    const teamId = localStorage.getItem('teamId');

    if (!foundedProfileId) {
      toast.error('Please select 1 folder');
      return;
    }

    if (foundedProfileId.length > 0) {
      try {
        const requests = foundedProfileId.map((profileId) =>
          fetchData({
            url: `/profile/${profileId}`,
            method: 'PATCH',
            data: { folders: [] },
            team: teamId,
          }),
        );

        const results = await Promise.all(requests);

        results.forEach((res) => {
          if (!res.is_success) {
            toast.error(res.errorMessage);
          } else {
            toast.success(t('Profile has been successfully removed from the folder'));
          }
        });

        setIsOpenRemoveFolder(false);
        setSelectedFolder(null);
        await fetchProfile();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setSelectedRows(new Set());
      }
    } else {
      toast.info(t('Please select at least 1 profile'));
    }
  };

  const getFilteredTags = () => {
    return allTags.filter((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()));
  };

  const editProfileTags = async () => {
    const teamId = localStorage.getItem('teamId');
    const selectedProfiles = Array.from(selectedRows);

    if (selectedProfiles.length > 0) {
      try {
        const requests = selectedProfiles.map((profileId) =>
          fetchData({
            url: `/profile/${profileId}`,
            method: 'PATCH',
            data: { tags: profileTags },
            team: teamId,
          }),
        );

        const results = await Promise.all(requests);

        results.forEach((res) => {
          if (!res.is_success) {
            toast.error(res.errorMessage);
          }
        });

        closeChangeTagsPopup();
        await fetchProfile();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.info('Please select at least 1 profile');
    }
  };

  const handleMenuClick = () => {
    setSidebarMode((prev) => (prev === SidebarMode.FULL ? SidebarMode.MINI : SidebarMode.FULL));
  };

  const handleFoldersClick = () => {
    setFoldersMode((prev) => (prev === FoldersMode.FULL ? FoldersMode.NONE : FoldersMode.FULL));
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
    fetchData({ url: '/profile', method: 'GET', team: teamId })
      .then((data: any) => {
        if (data.errorCode === 7 && data.errorMessage && data.errorMessage.includes('not found')) {
          return dispatch(setToken(''));
        }
        if (data.is_success) {
          const profilesNotBasket = data?.data.filter(
            (profile: any) => profile.date_basket === null,
          );
          setProfilesAllData(profilesNotBasket);
        } else {
          toast.error(data.errorMessage);
        }
      })
      .catch((err) => {});
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as HTMLElement)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={cls.autoregHeader}>
      <div className={cls.actionsLeft}>
        {/*<div>*/}
        {/*    <button className={cls.btnSidebar} onClick={handleMenuClick}>*/}
        {/*        <Arrow2Left className={clsx(isMiniSidebar && cls.arrowDeg, isMiniSidebar ? cls.marginLeftPlus1 : cls.marginLeftMinus1)} />*/}
        {/*    </button>*/}
        {/*</div>*/}
        <div>
          <button className={cls.btnSidebar} onClick={handleFoldersClick}>
            {foldersMode === 'full' && <FolderLeft />}
            {foldersMode === 'none' && <FolderRight />}
          </button>
        </div>
        <button
          className={cls.btnTransfer}
          onClick={() => {
            if (checkTariff()) {
              openTransferFolder();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <IconFolderAdd width={16} height={15} />
        </button>
        <Button
          className={clsx(cls.btn, cls[ButtonTypes.edit], cls.btnEdit)}
          color="primary"
          onClick={() => {
            if (checkTariff()) {
              handleEditProfile().then();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <IconEdit width={16} height={15} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Edit')}
          </p>
        </Button>

        <Button
          className={clsx(cls.btn, cls[ButtonTypes.changeProxy])}
          onClick={() => {
            if (checkTariff()) {
              openChangeProxyPopup();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}
          disabled={selectedRows.size == 0}
          color="primary">
          <IconChange width={16} height={15} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Change proxy')}
          </p>
        </Button>

        <Button
          disabled={selectedRows.size == 0}
          className={clsx(cls.btn, cls[ButtonTypes.download])}
          onClick={() => {
            if (checkTariff()) {
              handleImportCookies().then();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <IconImport width={16} height={15} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Import cookies')}
          </p>
        </Button>

        <Button
          disabled={selectedRows.size == 0}
          className={clsx(cls.btn, cls[ButtonTypes.upload])}
          onClick={() => {
            if (checkTariff()) {
              exportCookies().then();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <IconExport width={16} height={15} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Export cookies')}
          </p>
        </Button>

        <Button
          className={clsx(cls.btn, cls[ButtonTypes.tags])}
          onClick={() => {
            if (checkTariff()) {
              handleChangeTags();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <IconTags width={16} height={15} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Tags')}
          </p>
        </Button>

        <Button
          className={clsx(cls.btn, cls[ButtonTypes.passToUser])}
          disabled={selectedRows.size == 0}
          onClick={() => {
            if (checkTariff()) {
              openSendUserPopup();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <IconSend width={16} height={15} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Send to user')}
          </p>
        </Button>

        <Button
          className={clsx(cls.btn, cls[ButtonTypes.deleteIcon])}
          isActionIcon
          disabled={selectedRows.size == 0}
          onClick={() => {
            if (checkTariff()) {
              openDeleteProfilesPopup();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <IconTrash
            width={16}
            height={15}
            className={clsx(
              platform && platform === 'Windows' ? cls.iconDeleteWin : cls.iconDelete,
            )}
          />
          {contentWidth && contentWidth >= 1400 && (
            <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
              {t('Delete')}
            </p>
          )}
        </Button>
      </div>

      <div className={cls.actionsRight}>
        <Button
          className={clsx(
            cls[ButtonTypes.runProfiles],
            contentWidth && contentWidth < 1400 && cls.paddingLeft13,
          )}
          color="primary"
          variant="outline"
          leftIcon={<IconPlay width={16} height={12} />}
          onClick={() => {
            if (checkTariff()) {
              handleOpenWindows();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}
          notNeedSpan={!!(contentWidth && contentWidth < 1400)}>
          {contentWidth && contentWidth >= 1400 && (
            <p
              className={clsx(
                platform && platform === 'Windows' ? cls.btnStopRun : cls.btnStopRunWin,
              )}>
              {t('Run profiles')}
            </p>
          )}
        </Button>

        <Button
          className={clsx(
            cls[ButtonTypes.stopProfiles],
            contentWidth && contentWidth < 1400 && cls.paddingLeft13,
          )}
          color="danger"
          variant="outline"
          leftIcon={<IconPause width={9} height={10} style={{ margin: '0 1px' }} />}
          onClick={() => {
            if (checkTariff()) {
              handleCloseWindows();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}
          notNeedSpan={!!(contentWidth && contentWidth < 1400)}>
          {contentWidth && contentWidth >= 1400 && (
            <p
              className={clsx(
                platform && platform === 'Windows' ? cls.btnStopRun : cls.btnStopRunWin,
              )}>
              {t('Stop')}
            </p>
          )}
        </Button>

        {/*<RefetchButton onClick={() => handleRefetch()} />*/}

        <Button
          className={clsx(cls[ButtonTypes.createProfile], clsBtn.btnCreate)}
          color="primary"
          onClick={() => {
            if (checkTariff()) {
              handleCreateProfile();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}
          leftIcon={<IconPlusCircle width={18} height={18} className={cls.marginRight} />}
          // notNeedSpan={!!(contentWidth && contentWidth < 1400)}
        >
          <p
            className={clsx(
              platform && platform === 'Windows' ? clsBtn.btnCreateTextWin : clsBtn.btnCreateText,
            )}>
            {t('Create Profile')}
          </p>
          {/*{contentWidth && contentWidth >= 1400 && (*/}
          {/*    <p className={clsx(platform && platform === 'Windows' ? clsBtn.btnCreateTextWin : clsBtn.btnCreateText)}>{t('Create Profile')}</p>*/}
          {/*)}*/}
        </Button>
      </div>
      {/*<ProfileProxyDrawer opened={isProfileProxyDrawer} setOpened={setIsProfileProxyDrawer}/>*/}
      <ProfileCreationDrawer opened={isProfileCreationDrawer} />
      <EditProfileDrawer
        opened={isEditProfileDrawer}
        profileToEdit={profileToEdit}
        setSelectedRows={setSelectedRows}
      />
      {/*<ProfileImportExportCookiesDrawer exportCookies={exportCookies} selectedRows={selectedRows}*/}
      {/*                                  opened={false}*/}
      {/*                                  setOpened={false}/>*/}
      <ModalWindow modalWindowOpen={isOpenSendUserPopup} onClose={closeSendUserPopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <p className={cls.modalTitle}>{t('Send to user')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={() => closeSendUserPopup()} />
        </div>
        <div className={cls.sendUserPopupContent}>
          <div className={cls.inputsWrapper}>
            <div className={cls.inputContent}>
              <div className={cls.inputWrapper}>
                <input
                  value={userName}
                  onChange={(e) => {
                    setFreeNick(null);
                    setUserName(e.target.value);
                  }}
                  type="text"
                  placeholder={t('Nickname')}
                  maxLength={50}
                  className={cls.editUsersInput}
                />
              </div>
              {freeNick === false && (
                <p className={cls.errorValid}>{t('The nickname does not exist')}</p>
              )}
            </div>
            <div className={cls.inputContent}>
              <div className={cls.inputWrapper}>
                <input
                  value={teamTitle}
                  onChange={(e) => {
                    setFreeTeamTitle(null);
                    setTeamTitle(e.target.value);
                  }}
                  type="text"
                  placeholder={t('Team title')}
                  maxLength={50}
                  className={cls.editUsersInput}
                />
              </div>
              {freeTeamTitle === false && (
                <p className={cls.errorValid}>{t('The team title does not exist')}</p>
              )}
            </div>
            {checkNickTitleError && <p className={cls.errorValid}>{t('Error')}</p>}
          </div>
          <div className={cls.approveContentModalWindow}>
            <button className={cls.btnCancelModalWindow} onClick={() => closeSendUserPopup()}>
              {t('Exit')}
            </button>
            <button className={cls.btnApproveModalWindow} onClick={() => sendData()}>
              {t('Send')}
            </button>
          </div>
        </div>
      </ModalWindow>
      <ModalWindow modalWindowOpen={isOpenRemoveFolder} onClose={closeRemoveProfileFromFolder}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <TrashIcon1 />
            <p className={cls.modalTitle}>{t('Remove profile from folder')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={closeRemoveProfileFromFolder} />
        </div>
        <div className={cls.modalContent}>
          <div className={cls.warningTextContent}>
            <p className={cls.warningText1}>{t('Remove profile from folder')}?</p>
            <p className={cls.warningText2}>
              {t('If you delete profiles from folders, they will remain in the "All Profiles"')}
            </p>
          </div>
          <div className={cls.approveContent}>
            <button className={cls.btnCancel} onClick={closeRemoveProfileFromFolder}>
              {t('Cancel')}
            </button>
            <button className={cls.btnDelete} onClick={removeFromFolder}>
              {t('Remove')}
            </button>
          </div>
        </div>
      </ModalWindow>
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
            <p className={cls.warningText2}>{t('Deleted files will be moved to the trash')}</p>
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
      <ModalWindow modalWindowOpen={isOpenImportCookies} onClose={closeImportCookiesPopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <p className={cls.modalTitle}>{t('Import cookies')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={() => closeImportCookiesPopup()} />
        </div>
        {successImportCookies ? (
          <div className={cls.modalContentImportCookies}>
            <p className={cls.successImportCookieMessage}>
              {t('Cookies have been successfully imported')}
            </p>
            <div className={cls.approveContentModalWindow}>
              <button
                className={cls.btnCancelModalWindow}
                onClick={() => closeImportCookiesPopup()}>
                {t('Exit')}
              </button>
            </div>
          </div>
        ) : (
          <div className={cls.modalContentImportCookies}>
            <CookiesAreaPopup textFile={textFile} setTextFile={setTextFile} />
            <div className={cls.approveContentModalWindow}>
              <button
                className={cls.btnCancelModalWindow}
                onClick={() => closeImportCookiesPopup()}>
                {t('Exit')}
              </button>
              <button className={cls.btnApproveModalWindow} onClick={() => importCookies()}>
                {t('Import')}
              </button>
            </div>
          </div>
        )}
      </ModalWindow>
      <ModalWindow modalWindowOpen={isOpenChangeProxyPopup} onClose={closeChangeProxyPopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <p className={cls.modalTitle}>{t('Change proxy')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={closeChangeProxyPopup} />
        </div>
        <div className={cls.changeProxyPopupWrapper}>
          <SegmentedControl
            value={addProxyOption}
            className={cls.segmentedControlCustom}
            onChange={(newValue) => {
              setAddProxyOption(newValue);
            }}
            options={options.profileProxyOpt}
            getOptionLabel={(o) => t(o.label)}
          />
          {addProxyOption == 1 && (
            <div className={cls.wrapperProxyForm}>
              <InputCustom
                title="Protocol"
                renderComponent={
                  <div className={cls.wrapperProtocols}>
                    <div
                      className={clsx(cls.wrapperRound, {
                        [cls.roundActive]: proxyData.type === 'http',
                      })}
                      onClick={() => {
                        setProxyData({ ...proxyData, type: 'http' });
                        setProxyType('http');
                      }}>
                      <div className={cls.roundText}>HTTP(S)</div>
                    </div>
                    <div
                      className={clsx(cls.wrapperRound, {
                        [cls.roundActive]: proxyData.type === 'socks5',
                      })}
                      onClick={() => {
                        setProxyData({ ...proxyData, type: 'socks5' });
                        setProxyType('socks5');
                      }}>
                      <div className={cls.roundText}>SOCKS5</div>
                    </div>
                    <div
                      className={clsx(cls.wrapperRound, {
                        [cls.roundActive]: proxyData.type === 'socks4',
                      })}
                      onClick={() => {
                        setProxyData({ ...proxyData, type: 'socks4' });
                        setProxyType('socks4');
                      }}>
                      <div className={cls.roundText}>SOCKS4</div>
                    </div>
                    <div
                      className={clsx(cls.wrapperRound, {
                        [cls.roundActive]: proxyData.type === 'ssh',
                      })}
                      onClick={() => {
                        setProxyData({ ...proxyData, type: 'ssh' });
                        setProxyType('ssh');
                      }}>
                      <div className={cls.roundText}>SSH</div>
                    </div>
                  </div>
                }
              />
              <div className={cls.inputProxyFormatCustomWrapper}>
                <div className={cls.inputProxyFormatCustom}>
                  <InputCustom
                    className={cls.inputUniq}
                    title="Proxy"
                    inputType
                    inputValue={proxyHost}
                    placeholder={'Host:Port:Login:Password'}
                    handleInput={(e) => {
                      const proxyValue = e.target.value;
                      setProxyHost(proxyValue);
                      const [host, port, login, password] = proxyValue.split(':');
                      const proxy = {
                        host,
                        port: parseInt(port, 10),
                        login,
                        password,
                      };
                      setProxyData({
                        ...proxyData,
                        host: proxy.host,
                        port: proxy.port,
                        login: proxy.login,
                        password: proxy.password,
                      });
                      proxyValue.length === 0 ? setProxyError('') : false;
                    }}
                  />
                  <button
                    className={cls.formatButton}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCheckProxyExternal().then();
                    }}>
                    {isCheckingProxy ? (
                      <LoaderDotsWhite />
                    ) : (
                      <div className={cls.checkProxyBtn}>
                        <ArrowsIcon className={cls.formatButtonIcon} width={23} height={15} />
                        <p>{t('Check')}</p>
                      </div>
                    )}
                  </button>
                </div>
                <div
                  className={cls.wrapperProxyBottom}
                  data-check-proxy-success={checkProxySuccess}
                  data-proxy-error={proxyError !== ''}>
                  {proxyError === 'error' && (
                    <div className={cls.errorButton}>
                      <div className={cls.errorText}>{t('accStatuses.Error')}</div>
                    </div>
                  )}
                  {proxyError === 'success' && (
                    <div className={cls.successButton}>
                      <div className={cls.successText}>{t('Success')}</div>
                    </div>
                  )}
                  {proxyError === 'used' && (
                    <div className={cls.successButton}>
                      <div className={cls.successText}>{t('Proxy already in use')}</div>
                    </div>
                  )}
                  {proxyError === 'incorrect' && (
                    <div className={cls.errorButton}>
                      <div className={cls.errorText}>{t('Input params are incorrect')}</div>
                    </div>
                  )}
                </div>
              </div>
              <InputCustom
                className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                title="Link to change IP"
                inputType
                inputValue={proxyData.link_rotate}
                placeholder={t('Link to change IP')}
                handleInput={(e) => setProxyData({ ...proxyData, link_rotate: e.target.value })}
              />
              <InputCustom
                className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                title={t('Proxy name')}
                inputType
                inputValue={proxyData.title}
                placeholder={t('Proxy name')}
                handleInput={(e) => setProxyData({ ...proxyData, title: e.target.value })}
              />
            </div>
          )}
          {addProxyOption == 2 && (
            <div className={cls.chooseProxySelect}>
              <InputCustom
                title={t('Proxy name')}
                renderComponent={
                  <Select
                    className={cls.select}
                    placeholder={t('Choose Proxy')}
                    getOptionLabel={(o) => o.label}
                    options={options.profileProxyExternalOpt}
                    value={
                      options.profileProxyExternalOpt.find(
                        (c: any) => c.value === selectedProxy?.value,
                      ) || ''
                    }
                    onChange={(option) => {
                      setSelectedProxy({ ...option });
                    }}
                  />
                }
              />
            </div>
          )}
          <div className={cls.approveContentModalWindowProxies}>
            <button className={cls.btnCancelModalWindow} onClick={closeChangeProxyPopup}>
              {t('Exit')}
            </button>
            <button className={cls.btnApproveModalWindow} onClick={() => changeProxyInProfile()}>
              {t('Change')}
            </button>
          </div>
        </div>
      </ModalWindow>
      <ModalWindow modalWindowOpen={isOpenChangeTags} onClose={closeChangeTagsPopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <p className={cls.modalTitle}>{t('Tags')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={() => closeChangeTagsPopup()} />
        </div>
        <div className={cls.modalChangeTags}>
          <div className={clsx(cls.field, cls.selectTagsWidth)} ref={dropdownRef}>
            <div className={clsx(cls.controlsHeaderCustom, cls.width100Percent)}>
              <div className={cls.width100Percent}>
                <div className={cls.customTagsContainer}>
                  <div className={cls.customTagsLeftSide}>
                    <div className={cls.tagItemsWrapper}>
                      {profileTags.map((item: string, index: number) => (
                        <div key={index} className={cls.tagItemWrapper}>
                          <p>{item}</p>
                          <Cross3Icon
                            width={11}
                            height={11}
                            className={cls.tagItemRemove}
                            onClick={(e) => handleTagRemove(e, item)}
                          />
                        </div>
                      ))}
                    </div>
                    <input
                      className={cls.inputTags}
                      type="text"
                      placeholder={t('Tags')}
                      onBlur={handleTagInputBlur}
                      onKeyDown={handleTagInputKeyDown}
                    />
                  </div>
                  <div className={cls.customTagsRightSide}>
                    {profileTags.length > 0 && (
                      <Cross1Icon
                        width={10}
                        height={10}
                        className={cls.tagItemsRemove}
                        onClick={(event) => handleDeleteAllTags(event)}
                      />
                    )}
                    <ArrowFilledDownIcon
                      width={14}
                      height={10}
                      className={cls.openDropDown}
                      onClick={(e) => toggleDropdown(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {isDropdownOpen && (
              <div className={cls.dropdown}>
                <div className={cls.searchTagsWrapper}>
                  <input
                    className={cls.inputSearchTags}
                    type="text"
                    placeholder={t('Find tags')}
                    onChange={(event) => setSearchTag(event.target.value)}
                  />
                  <SearchIcon />
                </div>
                <div className={cls.dropdownContent}>
                  {getFilteredTags().map((tag, index) => (
                    <div
                      key={index}
                      className={cls.dropdownItem}
                      onClick={(e) => handleTagCheckboxChange(e, tag)}>
                      <label htmlFor={`tag-${index}`} className={cls.labelTag}>
                        {tag}
                      </label>
                      <div className={cls.customCheckbox}>
                        {selectedTagsProfile.includes(tag) ? (
                          <CheckboxSelectedIcon className={cls.checkboxSelected} />
                        ) : (
                          <CheckboxIcon />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={cls.approveContentModalWindow}>
            <button className={cls.btnCancelModalWindow} onClick={() => closeChangeTagsPopup()}>
              {t('Exit')}
            </button>
            <button className={cls.btnApproveModalWindow} onClick={() => editProfileTags()}>
              {t('Save')}
            </button>
          </div>
        </div>
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
      <ModalWindow modalWindowOpen={isOpenTransferFolderPopup} onClose={closeTransferFolder}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <p className={cls.modalTitle}>{t('Move profile')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={closeTransferFolder} />
        </div>
        <div className={cls.changeProxyPopupWrapper}>
          <p className={cls.textTransferFolder}>
            {t(
              'Select the folder where you want to move the profile/profiles. If there are no folders, create them',
            )}
          </p>
          <div className={cls.chooseProxySelect}>
            <InputCustom
              title={t('Folder name')}
              renderComponent={
                <Select
                  className={cls.select}
                  placeholder={t('Choose Folder')}
                  getOptionLabel={(o) => o.label}
                  options={folders.map((folder) => ({
                    label: folder.title,
                    value: folder.external_id,
                  }))}
                  value={selectedFolder}
                  onChange={(option) => {
                    setSelectedFolder({ ...option });
                  }}
                />
              }
            />
          </div>
          <div className={cls.approveContentModalWindowProxies}>
            <button className={cls.btnCancelModalWindow} onClick={closeTransferFolder}>
              {t('Exit')}
            </button>
            <button className={cls.btnApproveModalWindow} onClick={transferInFolder}>
              {t('Accept')}
            </button>
          </div>
        </div>
      </ModalWindow>
    </div>
  );
};
