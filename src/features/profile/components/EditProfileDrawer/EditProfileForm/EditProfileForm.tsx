import { ipcRenderer } from 'electron';
import React, { useEffect, useRef, useState } from 'react';
import { array, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { EditProfileFormHeaderPart } from './EditProfileFormHeaderPart/EditProfileFormHeaderPart';
import { EditProfileFormMainPart } from './EditProfileFormMainPart/EditProfileFormMainPart';
import { EditProfileFormFooterPart } from './EditProfileFormFooterPart/EditProfileFormFooterPart';
import { useTranslation } from 'react-i18next';
import cls from './EditProfileForm.module.scss';
import clsx from 'clsx';
import { useEditProfileInitData } from '@/features/profile/hooks/useEditProfileInitData';
import { fetchData } from '@/shared/config/fetch';
import { useProfilesStore } from '@/features/profile/store';
import { useCreateProxyExternal } from '@/features/profile/hooks/useCreateProxyExternal';
import { useProxiesStore } from '@/features/proxy/store';
import {
  setAccumulatedProxiesForCheckSingle,
  setProxySingleForCheck,
} from '@/store/reducers/ProxiesForCheckReducer';
import { useDispatch, useSelector } from 'react-redux';
import EditProfileReview from '@/features/profile/components/EditProfileDrawer/EditProfileForm/EditProfileReview/EditProfileReview';
import { useEditProfileData } from '@/features/profile/hooks/useEditProfile';
import { log } from 'util';
import { useProfileInitData } from '@/features/profile/hooks/useProfileInitData';
import { setIsEditProfileDrawer } from '@/store/reducers/Drawers';

const validationSchema = z.object({
  title: z.string().nonempty().max(100),
  cookies: z.string().max(2000000).or(z.null()),
  profile_type: z.string().max(255),
  tags: z.string().array().or(z.null().array()),
  user_agent_windows: z.string().nonempty().max(2048),
  user_agent_macos: z.string().nonempty().max(2048),
  user_agent_linux: z.string().nonempty().max(2048),
  login: z.string().min(5).max(100).or(z.string().max(100)),
  password: z.string().min(6).max(100).or(z.string().max(100)),
  token: z.string().max(100),
  custom_flags: z.string().max(255),
  custom_flags_value: z.boolean(),
  note: z.string().max(1024),
  json: z.string().or(z.null()),
  is_do_not_track: z.boolean(),
  ports: z.number().array(),
  ports_value: z.number(),
  media_value: z.number(),
  media: z
    .object({
      microphone: z.number(),
      speaker: z.number(),
      camera: z.number(),
    })
    .or(z.null()),
  geolocation_external_value: z.number(),
  geolocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      precision: z.number(),
    })
    .or(z.null()),
  platform_external_id: z.string(),
  proxy_external_value: z.number(),
  proxy_external_options: z.object({
    link_rotate: z.string(),
    title: z.string(),
    host: z.string(),
    port: z.any(),
    login: z.string().or(z.undefined()),
    type: z.string(),
    password: z.string().or(z.undefined()),
  }),
  proxy_external_id: z.string().or(z.null()),
  webrtc_external_id: z.string().or(z.null()).or(z.number()),
  canvas_external_id: z.string().or(z.null()),
  webgl_external_id: z.string().or(z.null()).or(z.number()),
  webgl_info_external_id: z.string().or(z.null()),
  webgl_info_external_value: z.number(),
  clientrects_external_id: z.string().or(z.null()),
  audio_external_id: z.string().or(z.null()),
  timezone_external_value: z.number(),
  timezone_external_id: z.string().or(z.null()),
  language_external_value: z.number(),
  language_external_id: z.string().or(z.null()),
  processor_external_value: z.number(),
  processor_external_id: z.string().or(z.null()),
  ram_external_value: z.number(),
  ram_external_id: z.string().or(z.null()),
  screen_external_value: z.number(),
  screen_external_id: z.string().or(z.null()),
  status_external_id: z.string().or(z.null()),
});

export type TEditProfileForm = z.TypeOf<typeof validationSchema>;

interface MediaType {
  microphone: number;
  speaker: number;
  camera: number;
}

interface GeoType {
  longitude: number;
  latitude: number;
  precision: number;
}

interface EditProfileFormProps {
  isDrawerOpened: boolean;
  profileToEdit: any;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const EditProfileForm = (props: EditProfileFormProps) => {
  const { isDrawerOpened, profileToEdit, setSelectedRows } = props;

  const { t } = useTranslation();

  const { options, defaultValues, foundProfile } = useEditProfileInitData(profileToEdit);
  const { defaultValuesForEditProfile } = useProfileInitData();
  const { configData, setProfilesAllData, setProfilesConfigData, profilesAll, folders } =
    useProfilesStore();

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

  const [checkProxySuccess, setCheckProxySuccess] = useState<boolean>(false);

  const [userAgent, setUserAgent] = useState<string>(foundProfile.user_agent);
  const [proxyHost, setProxyHost] = useState<string>('');
  const [proxyType, setProxyType] = useState<string>('http');
  const [proxyCreationFirstField, setProxyCreationFirstField] = useState<boolean>(false);
  const [proxyError, setProxyError] = useState<string>('');
  const [screen, setScreen] = useState<any>(foundProfile.screen);
  const [portsValue, setPortsValue] = useState<string>(foundProfile.ports);
  const [media, setMedia] = useState<MediaType>(foundProfile.media);
  const [checkProxyData, setCheckProxyData] = useState<any>(null);
  const [geo, setGeo] = useState<GeoType>(foundProfile.geolocation);
  const [platformValue, setPlatformValue] = useState<string>(foundProfile.platform.value);
  const [platformLabel, setPlatformLabel] = useState<string>(foundProfile.platform.label);
  const [isOpenAdvancedSettings, setIsOpenAdvancedSettings] = useState(false);

  const handleOpenAdvancedSettings = () => {
    setIsOpenAdvancedSettings(!isOpenAdvancedSettings);
  };

  const getStartTimezoneOption = (timezone1: string, timezone2: string) => {
    if (timezone1 === timezone2) {
      return 0;
    }
    return 1;
  };

  const getGeoOption = (geo1: { [key: string]: any }, geo2: { [key: string]: any }) => {
    if (
      geo1.longitude == geo2.longitude &&
      geo1.latitude == geo2.latitude &&
      geo1.precision == geo2.precision
    ) {
      return 0;
    }
    return 1;
  };

  const getMediaOption = (media1: { [key: string]: any }, media2: { [key: string]: any }) => {
    if (
      media1.microphone == media2.microphone &&
      media1.speaker == media2.speaker &&
      media1.camera == media2.camera
    ) {
      return 0;
    }
    return 1;
  };

  const areArraysPortsEqual = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) {
      return 1;
    }

    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return 1;
      }
    }
    return 0;
  };

  const [timezoneOption, setTimezoneOption] = useState<string | number>(
    getStartTimezoneOption(
      defaultValuesForEditProfile.timezone_external_id,
      foundProfile.timezone.value,
    ),
  );
  const [geoOption, setGeoOption] = useState<string | number>(
    getGeoOption(defaultValuesForEditProfile.geolocation, foundProfile.geolocation),
  );
  const [mediaOption, setMediaOption] = useState<string | number>(
    getMediaOption(defaultValuesForEditProfile.media, foundProfile.media),
  );
  const [screenOption, setScreenOption] = useState<string | number>(
    foundProfile.screen.value === defaultValuesForEditProfile.screen_external_id ? 0 : 1,
  );
  const [ramOption, setRamOption] = useState<string | number>(
    foundProfile.ram.value == defaultValuesForEditProfile.ram_external_id ? 0 : 1,
  );
  const [processorOption, setProcessorOption] = useState<string | number>(
    foundProfile.processor.value == defaultValuesForEditProfile.processor_external_id ? 0 : 1,
  );
  const [webglInfoOption, setWebglInfoOption] = useState<string | number>(
    foundProfile.webgl_info.value == defaultValuesForEditProfile.webgl_info_external_id ? 0 : 1,
  );

  const [addProxyOption, setAddProxyOption] = useState<number | string>(
    foundProfile.proxy?.value ? 2 : 0,
  );
  const [languageOption, setLanguageOption] = useState<number | string>(
    foundProfile.language.value === defaultValuesForEditProfile.language_external_id ? 0 : 1,
  );
  const [audioOption, setAudioOption] = useState<number | string>(
    foundProfile.audio.value === defaultValuesForEditProfile.audio_external_id ? 0 : 1,
  );
  const [portsOption, setPortsOption] = useState<number | string>(
    areArraysPortsEqual(foundProfile.ports, defaultValuesForEditProfile.ports),
  );

  // For review

  const [profileDataReview, setProfileDataReview] = useState<any>({
    profileName: foundProfile.title,
    profileStatus: foundProfile.status.label,
    profileTags: foundProfile.tags, // need TODO
    profileUseragent: foundProfile.user_agent,
    profileProxyType:
      foundProfile.proxy && foundProfile.proxy.type ? foundProfile.proxy.type : 'No proxy',
    profileSite: '',
    profileWebRtc: configData.webrtcs?.find(
      (item: any) => item.external_id === foundProfile.webrtc.value,
    ).title,
    profileCanvas: configData.canvases?.find(
      (item: any) => item.external_id === foundProfile.canvas.value,
    ).title,
    profileWebGL: configData.webgls?.find(
      (item: any) => item.external_id === foundProfile.webgl.value,
    ).title,
    profileWebGLInfo:
      foundProfile.webgl_info.value === defaultValuesForEditProfile.webgl_info_external_value
        ? 'Real'
        : foundProfile.webgl_info.label,
    profileClientsRects: configData.client_rects?.find(
      (item: any) => item.external_id === foundProfile.client_rect.value,
    ).title,
    profileTimezone: foundProfile.timezone,
    profileLanguage:
      foundProfile.language.value === defaultValuesForEditProfile.language_external_id
        ? 'Auto'
        : foundProfile.language.label,
    profileGeo: geoOption == 0 ? 'Auto' : foundProfile.geolocation,
    profileProcessor:
      foundProfile.processor.value === defaultValuesForEditProfile.processor_external_id
        ? 'Real'
        : foundProfile.processor.label,
    profileRam:
      foundProfile.ram.value === defaultValuesForEditProfile.ram_external_id
        ? 'Real'
        : foundProfile.ram.label,
    profileScreen:
      foundProfile.screen.value === defaultValuesForEditProfile.screen_external_id
        ? 'Real'
        : foundProfile.screen.label,
    profileAudio:
      foundProfile.audio.value === defaultValuesForEditProfile.audio_external_id
        ? 'Real'
        : foundProfile.audio.label,
    profileMedia: mediaOption == 0 ? 'Real' : foundProfile.media,
    profilePorts: portsOption == 0 ? 'Real' : foundProfile.ports.map(String).join(','),
    profileIsDoNotTrack: foundProfile.is_do_not_track ? 'Enable' : 'Disable',
    profileFolders: foundProfile.folders,
  });

  let allTags: string[] = [];
  profilesAll?.forEach((profile: any) => {
    profile.tags.map((tag: string) => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  const [isCheckingProxy, setIsCheckingProxy] = useState<boolean>(false);

  const { setAllProxiesData } = useProxiesStore();

  const formMethods = useForm<TEditProfileForm>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = formMethods;
  console.log(errors);

  const onSubmit = async (data: TEditProfileForm) => {
    const handleCheckProfile = () => {
      let profileData = { ...data };
      mediaOption == 1 ? (profileData = { ...profileData, media: { ...media } }) : false;
      geoOption == 1 ? (profileData = { ...profileData, geolocation: { ...geo } }) : false;
      if (addProxyOption == 0) {
        profileData = { ...profileData, proxy_external_id: null };
      }
      const foldersData = profileDataReview.profileFolders.map((folder: any) => folder.external_id);
      const dataSubmit = useEditProfileData({
        editProfile: { ...profileData, folders: foldersData, tags: profileDataReview.profileTags },
        userAgent,
        foundProfile,
        paramsWhatHaveRandomOption: {
        mediaOption,
          screenOption,
          ramOption,
          processorOption,
          webglInfoOption,
          geoOption,
          timezoneOption,
        },
        defaultValuesForEditProfile,
        options,
      });
      try {
        let cookiesParsed = JSON.parse(dataSubmit.cookies);
        dataSubmit.cookies = cookiesParsed.map((item: { [key: string]: any }) => {
          if (item.sameSite) {
            if (item.sameSite === 'lax') {
              item.sameSite = 'Lax';
            } else if (item.sameSite === 'strict') {
              item.sameSite = 'Strict';
            } else if (item.sameSite === 'none') {
              item.sameSite = 'None';
            } else if (item.sameSite === 'no_restriction') {
              item.sameSite = 'None';
            } else if (item.sameSite === 'unspecified') {
              item.sameSite = 'None';
            } else {
              item.sameSite = 'Lax';
            }
          }
          return item;
        });
        dataSubmit.cookies = JSON.stringify(dataSubmit.cookies);
      } catch {
        console.log('No cookies!');
      }
      console.log();
      const teamId = localStorage.getItem('teamId');
      fetchData({
        url: `/profile/${profileToEdit.external_id}`,
        method: 'PATCH',
        data: { ...dataSubmit },
        team: teamId,
      })
        .then(async (data: any) => {
          // Close Drawer
          if (data?.is_success) {
            dispatch(setIsEditProfileDrawer(false));
            setSelectedRows(new Set());
          }
        })
        .catch((err: Error) => {
          console.log(err);
        })
        .finally(() => {
          const teamId = localStorage.getItem('teamId');
          fetchData({ url: '/profile', method: 'GET', team: teamId })
            .then((data: any) => {
              const profilesNotBasket = data?.data.filter(
                (profile: any) => profile.date_basket === null,
              );
              setProfilesAllData(profilesNotBasket);
            })
            .catch((err: Error) => {
              console.log(err);
            });
        });
    };

    const handleCheckProxyAndProfile = () => {
      let profileData = { ...data };
      if (proxyError == 'checking') {
        return;
      }
      setProxyError('checking');
      const value = getValues('proxy_external_options');
      const proxyOptions = useCreateProxyExternal(value);
      const proxyAll = options.profileProxyExternalOpt;
      const findProxyId = proxyAll.find(
        (item: any) =>
          `${item?.port}` === `${proxyOptions?.port}` &&
          item?.host === proxyOptions?.host &&
          item?.link_rotate === proxyOptions?.link_rotate &&
          item?.type === proxyOptions?.type,
      )?.value;
      const teamId = localStorage.getItem('teamId');
      fetchData({ url: '/profile/proxy', method: 'POST', data: proxyOptions, team: teamId })
        .then((res) => {
          if (res?.is_success) {
            const proxyRecord = res?.data as { external_id: string };
            setProxyError('success');
            fetchData({ url: '/profile/proxy', method: 'GET', team: teamId })
              .then((data: any) => {
                setProfilesConfigData({ ...configData, proxies: data?.data });
                fetchRecords();
                return data;
              })
              .then((proxiesData) => {
                mediaOption == 1
                  ? (profileData = {
                      ...profileData,
                      proxy_external_id: proxyRecord.external_id,
                      media: { ...media },
                    })
                  : (profileData = { ...profileData, proxy_external_id: proxyRecord.external_id });
                geoOption == 1
                  ? (profileData = {
                      ...data,
                      proxy_external_id: proxyRecord.external_id,
                      geolocation: { ...geo },
                    })
                  : (profileData = { ...data, proxy_external_id: proxyRecord.external_id });

                if (checkProxyData === null) {
                  console.log('checkProxyData', false);
                  setCheckProxyData(null);
                } else {
                  console.log('checkProxyData', true);
                  // const storedProxies = fetchProxyDataFromLocalStorage();
                  // saveProxyDataToLocalStorage([...storedProxies, {external_id: proxiesData.data[0].external_id, ...checkProxyData}]);
                  setCheckProxyData(null);
                }
                const foldersData = profileDataReview.profileFolders.map(
                  (folder: any) => folder.external_id,
                );
                const dataSubmit = useEditProfileData({
                  editProfile: {
                    ...profileData,
                    folders: foldersData,
                    proxy_external_id: proxiesData.data[0].external_id,
                  },
                  userAgent,
                  foundProfile,
                  paramsWhatHaveRandomOption: {
                    mediaOption,
                    screenOption,
                    ramOption,
                    processorOption,
                    webglInfoOption,
                    geoOption,
                    timezoneOption,
                  },
                  defaultValuesForEditProfile,
                  options,
                });
                try {
                  let cookiesParsed = JSON.parse(dataSubmit.cookies);
                  dataSubmit.cookies = cookiesParsed.map((item: { [key: string]: any }) => {
                    if (item.sameSite) {
                      if (item.sameSite === 'lax') {
                        item.sameSite = 'Lax';
                      } else if (item.sameSite === 'strict') {
                        item.sameSite = 'Strict';
                      } else if (item.sameSite === 'none') {
                        item.sameSite = 'None';
                      } else if (item.sameSite === 'no_restriction') {
                        item.sameSite = 'None';
                      } else if (item.sameSite === 'unspecified') {
                        item.sameSite = 'None';
                      } else {
                        item.sameSite = 'Lax';
                      }
                    }
                    return item;
                  });
                  dataSubmit.cookies = JSON.stringify(dataSubmit.cookies);
                } catch {
                  console.log('No cookies!');
                }
                const teamId = localStorage.getItem('teamId');
                fetchData({
                  url: `/profile/${profileToEdit.external_id}`,
                  method: 'PATCH',
                  data: { ...dataSubmit, tags: profileDataReview.profileTags },
                  team: teamId,
                })
                  .then((data: any) => {
                    // Close Drawer
                    if (data?.is_success) {
                      dispatch(setIsEditProfileDrawer(false));
                      setSelectedRows(new Set());
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
                    const teamId = localStorage.getItem('teamId');
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
            setValue('proxy_external_id', findProxyId);
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
    };

    //Fetching data (GET/POST) proxies and cookies
    if (proxyCreationFirstField) {
      handleCheckProxyAndProfile();
    } else {
      handleCheckProfile();
    }
  };

  const checkProxyInCreationProfileForm = async (
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
                  const updatedData = await checkProxyInCreationProfileForm(
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
                    const updatedData = await checkProxyInCreationProfileForm(
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
      setIsCheckingProxy(false);
      setCheckProxySuccess(false);
    }
  };

  // Checking Proxy in adding proxy form
  const handleCheckProxyExternal = async () => {
    // Execute this part first
    const proxyOptions = useCreateProxyExternal(getValues('proxy_external_options'));

    //Then, execute the rest of the logic
    const colonRegex = /:/g;
    if ((proxyHost.match(colonRegex) || []).length === 3) {
      checkProxyInCreationProfileForm(proxyOptions).catch((error) => {
        console.error('Error in handleCheckProxyExternal: ', error);
        setProxyError('error');
      });
    } else {
      setProxyError('error');
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

  return (
    <FormProvider {...formMethods}>
      <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={cls.formPages}>
          <EditProfileFormHeaderPart
            userAgent={userAgent}
            setUserAgent={setUserAgent}
            proxyHost={proxyHost}
            setProxyHost={setProxyHost}
            setProxyCreationFirstField={setProxyCreationFirstField}
            profileDataReview={profileDataReview}
            setProfileDataReview={setProfileDataReview}
            platformValue={platformValue}
            setPlatformValue={setPlatformValue}
            setPlatformLabel={setPlatformLabel}
            proxyError={proxyError}
            setProxyError={setProxyError}
            setProxyType={setProxyType}
            handleCheckProxyExternal={handleCheckProxyExternal}
            profileToEdit={profileToEdit}
            checkProxySuccess={checkProxySuccess}
            isCheckingProxy={isCheckingProxy}
            setAddProxyOption={setAddProxyOption}
            addProxyOption={addProxyOption}
            proxyType={proxyType}
            allTags={allTags}
            handleOpenAdvancedSettings={handleOpenAdvancedSettings}
            isOpenAdvancedSettings={isOpenAdvancedSettings}
          />
          <div
            className={clsx(cls.advancedSettings, {
              [cls.advancedSettingsOpen]: isOpenAdvancedSettings,
            })}>
            <EditProfileFormMainPart
              geo={geo}
              setGeo={setGeo}
              profileToEdit={profileToEdit}
              setProcessorOption={setProcessorOption}
              setWebglInfoOption={setWebglInfoOption}
              webglInfoOption={webglInfoOption}
              processorOption={processorOption}
              setGeoOption={setGeoOption}
              geoOption={geoOption}
              setTimezoneOption={setTimezoneOption}
              timezoneOption={timezoneOption}
              setLanguageOption={setLanguageOption}
              languageOption={languageOption}
              profileDataReview={profileDataReview}
              setProfileDataReview={setProfileDataReview}
            />
            <EditProfileFormFooterPart
              media={media}
              setMedia={setMedia}
              profileToEdit={profileToEdit}
              screen={screen}
              setScreen={setScreen}
              portsValue={portsValue}
              setPortsValue={setPortsValue}
              setRamOption={setRamOption}
              setScreenOption={setScreenOption}
              setMediaOption={setMediaOption}
              screenOption={screenOption}
              mediaOption={mediaOption}
              ramOption={ramOption}
              setProfileDataReview={setProfileDataReview}
              profileDataReview={profileDataReview}
              setAudioOption={setAudioOption}
              audioOption={audioOption}
              setPortsOption={setPortsOption}
              portsOption={portsOption}
            />
          </div>
        </div>
        <div className={cls.formFooter}>
          <span className={cls.freeSpace} />
          <div className={cls.footerButtons}>
            <button className={cls.btnCancel}>{t('Cancel')}</button>
            <button type="submit" className={cls.btnSubmit}>
              {t('Save')}
            </button>
          </div>
        </div>
      </form>
      <EditProfileReview profileDataReview={profileDataReview} platformLabel={platformLabel} />
    </FormProvider>
  );
};
