import { ipcRenderer } from 'electron';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { ProfileCreationFormHeaderPart } from './ProfileCreationFormHeaderPart/ProfileCreationFormHeaderPart';
import { ProfileCreationFormMainPart } from './ProfileCreationFormMainPart/ProfileCreationFormMainPart';
import { ProfileCreationFormFooterPart } from './ProfileCreationFormFooterPart/ProfileCreationFormFooterPart';
import { useTranslation } from 'react-i18next';
import cls from './ProfileCreationForm.module.scss';
import clsx from 'clsx';
import { useProfileInitData } from '@/features/profile/hooks/useProfileInitData';
import { fetchData } from '@/shared/config/fetch';
import { useCreateNewProfileData } from '@/features/profile/hooks/useCreateNewProfile';
import { useProfilesStore } from '@/features/profile/store';
import ProfileReview from '@/features/profile/components/ProfileCreationDrawer/ProfileCreationForm/ProfileReview/ProfileReview';
import { useCreateProxyExternal } from '@/features/profile/hooks/useCreateProxyExternal';
import { useProxiesStore } from '@/features/proxy/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAccumulatedProxiesForCheckSingle,
  setProxySingleForCheck,
} from '@/store/reducers/ProxiesForCheckReducer';
import { setIsProfileCreationDrawer } from '@/store/reducers/Drawers';
import { useWorkspacesStore } from '@/features/workspace/store';

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
  webgl_external_id: z.string(),
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

export type TProfileCreationForm = z.TypeOf<typeof validationSchema>;

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

interface ProfileCreationFormProps {
  isDrawerOpened: boolean;
}

export const ProfileCreationForm = (props: ProfileCreationFormProps) => {
  const { isDrawerOpened } = props;

  const { t } = useTranslation();

  const { options, defaultValues } = useProfileInitData();
  const {
    configData,
    setProfilesAllData,
    setProfilesConfigData,
    profilesAll,
    selectedFolder,
    folders,
  } = useProfilesStore();
  const { myTeams, customerData, setUserAgent, userAgent, } = useWorkspacesStore();

  const { setAllProxiesData } = useProxiesStore();

  const [customerDataTeamId, setCustomerDataTeamId] = useState<any>(null);

  const formMethods = useForm<TProfileCreationForm>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = formMethods;
  
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

  const [proxyHost, setProxyHost] = useState<string>('');
  const [proxyType, setProxyType] = useState<string>('http');
  const [proxyCreationFirstField, setProxyCreationFirstField] = useState<boolean>(false);
  const [proxyError, setProxyError] = useState<string>('');
  const [checkProxyData, setCheckProxyData] = useState<any>(null);
  const [geo, setGeo] = useState<GeoType>({ longitude: 0, latitude: 0, precision: 10 });
  const [media, setMedia] = useState<MediaType>({ microphone: 0, speaker: 0, camera: 0 });

  const [geoOption, setGeoOption] = useState<string | number>(0);
  const [mediaOption, setMediaOption] = useState<string | number>(0);
  const [screenOption, setScreenOption] = useState<string | number>(0);
  const [ramOption, setRamOption] = useState<string | number>(0);
  const [processorOption, setProcessorOption] = useState<string | number>(0);
  const [webglInfoOption, setWebglInfoOption] = useState<string | number>(0);
  const [addProxyOption, setAddProxyOption] = useState<number | string>(0);
  const [timezoneOption, setTimezoneOption] = useState<number | string>(0);
  const [languageOption, setLanguageOption] = useState<number | string>(0);
  const [audioOption, setAudioOption] = useState<number | string>(0);
  const [portsOption, setPortsOption] = useState<number | string>(0);
  const [isOpenAdvancedSettings, setIsOpenAdvancedSettings] = useState(false);
  

  // For review
  const [profileDataReview, setProfileDataReview] = useState<any>({
    profileName: '',
    profileStatus: '',
    profileTags: [],
    profileUseragent: '',
    profileProxyType: 'No proxy',
    profileSite: '',
    profileWebRtc: configData.webrtcs?.find(
      (item: any) => item.external_id === defaultValues.webrtc_external_id,
    ).title,
    profileCanvas: configData.canvases?.find(
      (item: any) => item.external_id === defaultValues.canvas_external_id,
    ).title,
    profileWebGL: configData.webgls?.find(
      (item: any) => item.external_id === defaultValues.webgl_external_id,
    ).title,
    profileWebGLInfo:
      configData.video_card?.find(
        (item: any) => item.external_id === defaultValues.webgl_info_external_id,
      ) && 'Real',
    profileClientsRects: configData.client_rects?.find(
      (item: any) => item.external_id === defaultValues.clientrects_external_id,
    ).title,
    profileTimezone:
      configData.timezone?.find(
        (item: any) => item.external_id === defaultValues.timezone_external_id,
      ) && 'Auto',
    profileLanguage:
      configData.languages?.find(
        (item: any) => item.external_id === defaultValues.language_external_id,
      ) && 'Auto',
    profileGeo: 'Auto',
    profileProcessor:
      configData.processors?.find(
        (item: any) => item.external_id === defaultValues.processor_external_id,
      ) && 'Real',
    profileRam:
      configData.rams?.find((item: any) => item.external_id === defaultValues.ram_external_id) &&
      'Real',
    profileScreen:
      configData.screens?.find(
        (item: any) => item.external_id === defaultValues.screen_external_id,
      ) && 'Real',
    profileAudio:
      configData.audio?.find((item: any) => item.external_id === defaultValues.audio_external_id) &&
      'Real',
    profileMedia: 'Real',
    profilePorts: 'Real',
    profileIsDoNotTrack: defaultValues.is_do_not_track ? 'Enable' : 'Disable',
    profileFolders:
      selectedFolder !== 'all' ? [folders.find((i: any) => i.external_id === selectedFolder)] : [],
  });


  const [platformValue, setPlatformValue] = useState<string>('');
  const [platformLabel, setPlatformLabel] = useState<string>('');

  const [errorProfilesCount, setErrorProfilesCount] = useState<boolean>(false);

  let allTags: string[] = [];
  profilesAll?.forEach((profile: any) => {
    profile.tags.map((tag: string) => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  const handleOpenAdvancedSettings = () => {
    setIsOpenAdvancedSettings(!isOpenAdvancedSettings)
  }

  const [isCheckingProxy, setIsCheckingProxy] = useState<boolean>(false);

  const onSubmit = async (data: TProfileCreationForm) => {
    if (customerDataTeamId.limits.total_profile > customerDataTeamId.used.total_profile) {
      setErrorProfilesCount(false);
      const handleCheckProfile = () => {
        let profileData = { ...data };
        mediaOption == 1 ? (profileData = { ...profileData, media: { ...media } }) : false;
        geoOption == 1 ? (profileData = { ...profileData, geolocation: { ...geo } }) : false;
        if (addProxyOption == 0) {
          profileData = { ...profileData, proxy_external_id: null };
        }
        profileData = { ...profileData, tags: profileDataReview.profileTags };
        const foldersData = profileDataReview.profileFolders.map(
          (folder: any) => folder.external_id,
        );
        const dataSubmit = useCreateNewProfileData({
          newProfile: { ...profileData, folders: foldersData, platform_external_id: platformValue },
          userAgent,
          paramsWhatHaveRandomOption: {
            mediaOption,
            screenOption,
            ramOption,
            processorOption,
            webglInfoOption,
            geoOption,
          },
          defaultValues,
          options,
          configData,
        });
        console.log('dataSubmit', dataSubmit)
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
        dispatch(setIsProfileCreationDrawer(false));
        fetchData({ url: '/profile', method: 'POST', data: {...dataSubmit }, team: teamId })
          .then(async (data: any) => {
            // Close Drawer
            // if (data?.is_success) {
            //     dispatch(setIsProfileCreationDrawer(false));
            // }
          })
          .catch((err: Error) => {
            console.log(err);
          })
          .finally(() => {
            const teamId = localStorage.getItem('teamId');
            let url = `/profile?is_basket=0`;
            if (selectedFolder && selectedFolder !== 'all') {
                url += `&folders=${selectedFolder}`;
            }
            fetchData({
                url: url,
                method: 'GET',
                team: teamId,
            })
            .then((response: any) => {
                if (response.is_success) {
                    const profilesNotBasket = response.data.filter(
                        (profile: any) => profile.date_basket === null,
                    );
                    setProfilesAllData(profilesNotBasket);
                } else {
                    console.error('Fetch failed:', response.errors);
                }
            })
            .catch((err) => {
                console.log('Fetch error:', err);
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
              const teamId = localStorage.getItem('teamId');
              fetchData({ url: '/profile/proxy', method: 'GET', team: teamId })
                .then((data: any) => {
                  setProfilesConfigData({ ...configData, proxies: data?.data });
                  fetchRecords();
                  return data;
                })
                .then((proxiesData) => {
                  mediaOption == 1
                    ? (profileData = { ...profileData, media: { ...media } })
                    : false;
                  geoOption == 1
                    ? (profileData = { ...profileData, geolocation: { ...geo } })
                    : false;

                  if (checkProxyData === null) {
                    console.log('checkProxyData', false);
                    setCheckProxyData(null);
                  } else {
                    console.log('checkProxyData', true);
                    setCheckProxyData(null);
                  }
                  profileData = { ...profileData, tags: profileDataReview.profileTags };
                  const foldersData = profileDataReview.profileFolders.map(
                    (folder: any) => folder.external_id,
                  );
                  const dataSubmit = useCreateNewProfileData({
                    newProfile: {
                      ...profileData,
                      folders: foldersData,
                      platform_external_id: platformValue,
                      proxy_external_id: proxiesData.data[0].external_id,
                    },
                    userAgent,
                    paramsWhatHaveRandomOption: {
                      mediaOption,
                      screenOption,
                      ramOption,
                      processorOption,
                      webglInfoOption,
                      geoOption,
                    },
                    defaultValues,
                    options,
                    configData,
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
                  dispatch(setIsProfileCreationDrawer(false));
                  fetchData({
                    url: '/profile',
                    method: 'POST',
                    data: { ...dataSubmit },
                    team: teamId,
                  })
                    .then((data: any) => {
                      // Close Drawer
                      if (data?.is_success) {
                        // dispatch(setIsProfileCreationDrawer(false));
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
    } else {
      setErrorProfilesCount(true);
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
      setCheckProxySuccess(false);
      setIsCheckingProxy(false);
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

  const getUserOS = () => {
    const platform = navigator.platform;
    if (platform.toLowerCase().includes('win')) {
      return 'Windows';
    } else if (platform.toLowerCase().includes('mac')) {
      return 'Macos';
    } else if (platform.toLowerCase().includes('linux')) {
      return 'Linux';
    }
    // Return a default OS if not one of the above
    return 'Windows';
  };

  useEffect(() => {
    const platformValueConst =
      options.profilePlatformExternalOpt &&
      options.profilePlatformExternalOpt.find((item: any) => item.label === getUserOS());
    setPlatformValue(platformValueConst.value);
    setPlatformLabel(platformValueConst.label);

    if (platformValueConst.label) {
      if (platformValueConst.label === 'Windows') {
        setUserAgent(defaultValues.user_agent_windows);
        setProfileDataReview({
          ...profileDataReview,
          profileUseragent: defaultValues.user_agent_windows,
        });
      } else if (platformValueConst.label === 'Macos') {
        setUserAgent(defaultValues.user_agent_macos);
        setProfileDataReview({
          ...profileDataReview,
          profileUseragent: defaultValues.user_agent_macos,
        });
      } else if (platformValueConst.label === 'Linux') {
        setUserAgent(defaultValues.user_agent_linux);
        setProfileDataReview({
          ...profileDataReview,
          profileUseragent: defaultValues.user_agent_linux,
        });
      }
    }
  }, []);

  useEffect(() => {
    const selectedTeamId = localStorage.getItem('teamId');
    setCustomerDataTeamId(myTeams.find((team: any) => team.external_id === selectedTeamId));
  }, []);

  return (
    <FormProvider {...formMethods}>
      <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={cls.formPages}>
          <ProfileCreationFormHeaderPart
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
            proxyType={proxyType}
            handleCheckProxyExternal={handleCheckProxyExternal}
            checkProxySuccess={checkProxySuccess}
            isCheckingProxy={isCheckingProxy}
            setAddProxyOption={setAddProxyOption}
            addProxyOption={addProxyOption}
            allTags={allTags}
            handleOpenAdvancedSettings={handleOpenAdvancedSettings}
            isOpenAdvancedSettings={isOpenAdvancedSettings}
          />
          <div className={clsx(cls.advancedSettings,{
            [cls.advancedSettingsOpen]:isOpenAdvancedSettings
          })}>
            <ProfileCreationFormMainPart
              geo={geo}
              setGeo={setGeo}
              setProcessorOption={setProcessorOption}
              setWebglInfoOption={setWebglInfoOption}
              webglInfoOption={webglInfoOption}
              setGeoOption={setGeoOption}
              profileDataReview={profileDataReview}
              setProfileDataReview={setProfileDataReview}
              setTimezoneOption={setTimezoneOption}
              timezoneOption={timezoneOption}
              setLanguageOption={setLanguageOption}
              languageOption={languageOption}
              geoOption={geoOption}
              processorOption={processorOption}
            />
            <ProfileCreationFormFooterPart
              media={media}
              setMedia={setMedia}
              setRamOption={setRamOption}
              setScreenOption={setScreenOption}
              setMediaOption={setMediaOption}
              ramOption={ramOption}
              setProfileDataReview={setProfileDataReview}
              profileDataReview={profileDataReview}
              screenOption={screenOption}
              setAudioOption={setAudioOption}
              audioOption={audioOption}
              mediaOption={mediaOption}
              setPortsOption={setPortsOption}
              portsOption={portsOption}
            />
          </div>
          {errorProfilesCount && (
            <p className={cls.errorValidation}>
              {t('The file contains more profiles than you can afford in this tariff plan')}
            </p>
          )}
        </div>
          <div className={cls.formFooter}>
            <span className={cls.freeSpace} />
            <div className={cls.footerButtons}>
              <button className={cls.btnCancel}>{t('Cancel')}</button>
              <button type="submit" className={cls.btnSubmit}>
                {t('Create Profile')}
              </button>
            </div>
          </div>
      </form>
      <ProfileReview setProfileDataReview={setProfileDataReview} profileDataReview={profileDataReview} platformLabel={platformLabel} />
    </FormProvider>
  );
};
