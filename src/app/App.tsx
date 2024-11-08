import { Suspense, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppRouter } from '@/app/router';
import i18n from '@/shared/config/i18n/i18n';
import { LOCAL_STORAGE_LOCALE_KEY } from '@/shared/const/localStorage';
// import {TitleBar} from './components/TitleBar/TitleBar';
import { Loader } from '@/shared/components/Loader';
import './styles/index.scss';
import { fetchData } from '@/shared/config/fetch';
import { useProfilesStore } from '@/features/profile/store';
import { useDispatch, useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import {
  setPidProcess,
  setRunBrowsers,
  setRunBrowsersLoader,
} from '@/store/reducers/RunBrowsersReducer';
import { checkProxy, checkProxySingle } from '@/features/profile/hooks/useCheckProxy';
import {
  setAccumulatedProxiesForCheck,
  setAccumulatedProxiesForCheckSingle,
  setProxiesForCheck,
  setProxySingleForCheck,
} from '@/store/reducers/ProxiesForCheckReducer';
import { AuthorizationForm, FormNames } from '@/app/components/AuthorizationForm';
import { useProxiesStore } from '@/features/proxy/store';
import { setToken } from '@/store/reducers/AuthReducer';
import Preload from '@/shared/components/Preload/Preload';
import { setPlatform } from '@/store/reducers/PlatformReducer';
import { EventQueue } from './EventQueue';
// import {setLoaderIsActive} from "@/store/reducers/LoaderReducer";
import { useTimerStore } from '@/features/profile/hooks/useTimerStore';
import { useWorkspacesStore } from '@/features/workspace/store';
import { usePaymentStore } from '@/features/payment/store';
import { FoldersMode, SidebarMode } from '@/shared/const/context';
import { SidebarModeContext, SidebarModeContextType } from '@/shared/context/SidebarModeContext';
import { FoldersModeContext, FoldersModeContextType } from '@/shared/context/FoldersModeContext';
import { useExtensionsStore } from '@/features/account/components/ExtensionList/store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingPage from '@/pages/LoadingPage';
import useApplicationUpdate from '@/shared/hooks/useApplicationUpdate';

function App() {
  const { setProfilesAllData, setProfilesConfigData, setFolders, profilesAll } = useProfilesStore();
  const { setAllProxiesData } = useProxiesStore();
  const { setExtensions } = useExtensionsStore();
  const { timers, removeTimer, saveTimeToLocalStorage } = useTimerStore();
  const {
    myTeams,
    setMyTeams,
    setTeamCustomers,
    setCustomerData,
    teamCustomers,
    setVerticals,
    setPositions,
    setTeamId,
    setNotifications,
    setFilteredNotice,
  } = useWorkspacesStore();
  const {
    setTransactions,
    setIsLoading,
    setTariffs,
    tariffs,
    setFilteredTransactions,
    setActiveCryptopayPopup,
  } = usePaymentStore();

  const { sidebarMode, setSidebarMode } = useContext(SidebarModeContext) as SidebarModeContextType;
  const { foldersMode, setFoldersMode } = useContext(FoldersModeContext) as FoldersModeContextType;

  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.authReducer.token);
  const runBrowsers = useSelector((state: any) => state.runBrowsersReducer.runBrowsers);
  const runBrowsersLoader = useSelector((state: any) => state.runBrowsersReducer.runBrowsersLoader);
  const pidProcess = useSelector((state: any) => state.runBrowsersReducer.pidProcess);
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
  const checkedProxies = useSelector((state: any) => state.proxiesDataReducer.proxies);
  const checkedProxiesSingle = useSelector((state: any) => state.proxiesDataReducer.proxiesSingle);

  const loadingAppRef = useRef<boolean>(true);
  const [isLoadingApp, setIsLoadingApp] = useState<boolean>(true);
  const [isTeamIdLoading, setIsTeamIdLoading] = useState<boolean>(true);
  const { progress, statusMessage, updateAvailable } = useApplicationUpdate();

  const eventQueue = EventQueue();

  const isBrowser = !window.process;

  const fetchMyTeams = async () => {
    setIsTeamIdLoading(true);
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
        const teamId = localStorage.getItem('teamId');
        console.log('teamId', teamId);
        if (
          teamId &&
          response.data.length > 0 &&
          response.data.find((team: any) => team.external_id === teamId && team.is_confirmed)
        ) {
          localStorage.setItem('teamId', teamId);
          setMyTeams(response.data);
          return teamId;
        }
        setMyTeams(response.data);
        localStorage.setItem('teamId', response.data[0].external_id);
        return response.data[0].external_id;
      } else {
        const response2 = await fetchData({ url: '/team/my-teams', method: 'GET' });
        if (response2.is_success) {
          localStorage.setItem('teamId', response2.data[0].external_id);
          return response2.data[0].external_id;
        }
        return { is_success: false };
      }
    } catch (error) {
      console.error('Error fetching my teams:', error);
      const response3 = await fetchData({ url: '/team/my-teams', method: 'GET' });
      if (response3.is_success) {
        localStorage.setItem('teamId', response3.data[0].external_id);
        return response3.data[0].external_id;
      }
      return { is_success: false };
    } finally {
      setIsTeamIdLoading(false);
    }
  };

  const fetchProfile = (myTeamId: string) => {
    fetchData({ url: '/profile', method: 'GET', team: myTeamId })
      .then((data: any) => {
        if (data.errorCode === 7 && data.errorMessage && data.errorMessage.includes('not found')) {
          return dispatch(setToken(''));
        }
        if (data.is_success) {
          const profilesNotBasket = data?.data.filter(
            (profile: any) => profile.date_basket === null,
          );
          setProfilesAllData(profilesNotBasket);
        }
      })
      .catch((err) => {
        console.log('Profiles', err);
      });
  };

  const fetchExtensions = (myTeamId: string) => {
    const teamId = localStorage.getItem('teamId');
    try {
      fetchData({
        url: `/profile/extension`,
        method: 'GET',
        team: myTeamId,
      }).then((data: any) => {
        if (data.is_success) {
          setExtensions(data.data || []);
        } else {
          console.error('Fetch failed:', data.errors);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecords = (myTeamId: string) => {
    fetchData({ url: '/profile/proxy', method: 'GET', team: myTeamId })
      .then((data: any) => {
        if (data.is_success) {
          setAllProxiesData(data?.data || []);
        }
      })
      .catch((err: Error) => {
        console.log('Proxies', err);
      });
  };

  const fetchProfileConfig = (myTeamId: string) => {
    let lang: any = 'en';
    if (localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY)) {
      lang = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, lang);
    }
    const urlApi = lang === 'ru' ? '/profile/config' : `/${lang}/profile/config`;
    fetchData({ url: urlApi, method: 'GET', team: myTeamId })
      .then((data: any) => {
        setProfilesConfigData(data.data);
        // dispatch(setLoaderIsActive(false));
      })
      .catch((err: Error) => {
        console.log('Profile Config', err);
      });
  };

  const fetchTransactions = (myTeamId: string) => {
    fetchData({ url: '/billing/transaction', method: 'GET', team: myTeamId })
      .then((data: any) => {
        if (data.is_success) {
          setTransactions(data?.data);
          setFilteredTransactions(data?.data);
        }
      })
      .catch((err: Error) => {
        console.log('Error of get cookies:', err);
      });
  };

  const fetchTariffs = (myTeamId: string) => {
    fetchData({ url: '/tariff', method: 'GET', team: myTeamId })
      .then((data: any) => {
        console.log('tariffs', data);
        if (data.is_success) {
          setTariffs(data?.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log('Tariff', err);
      });
  };

  const fetchTeamCustomers = (myTeamId: string) => {
    fetchData({ url: '/team/customers', method: 'GET', team: myTeamId })
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

  const fetchCustomerData = (myTeamId: string) => {
    fetchData({ url: `/customer`, method: 'GET', team: myTeamId })
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

  const fetchVerticals = (myTeamId: string) => {
    let lang: any = 'en';
    if (localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY)) {
      lang = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, lang);
    }
    const urlApi = lang === 'ru' ? '/customer/vertical' : `/${lang}/customer/vertical`;
    fetchData({ url: urlApi, method: 'GET', team: myTeamId })
      .then((data: any) => {
        if (data.is_success) {
          if (data.data) {
            setVerticals(data?.data);
          }
        }
      })
      .catch((err: Error) => {
        console.log('/customer/login error: ', err);
      });
  };

  const fetchPositions = (myTeamId: string) => {
    let lang: any = 'en';
    if (localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY)) {
      lang = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, lang);
    }
    const urlApi = lang === 'ru' ? '/customer/position' : `/${lang}/customer/position`;
    fetchData({ url: urlApi, method: 'GET', team: myTeamId })
      .then((data: any) => {
        if (data.is_success) {
          if (data.data) {
            setPositions(data?.data);
          }
        }
      })
      .catch((err: Error) => {
        console.log('/customer/login error: ', err);
      });
  };

  const fetchNotification = (myTeamId: string) => {
    let lang: any = 'en';
    if (localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY)) {
      lang = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, lang);
    }
    const urlApi = lang === 'ru' ? '/notification' : `/${lang}/notification`;
    fetchData({ url: urlApi, method: 'GET', team: myTeamId })
      .then((data: any) => {
        console.log('notification', data);
        if (data.is_success) {
          setNotifications(data?.data);
          setFilteredNotice(data?.data);
        }
      })
      .catch((err) => {
        console.log('notification', err);
      });
  };

  const fetchFolders = (myTeamId: string) => {
    fetchData({ url: '/folder', method: 'GET', team: myTeamId })
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

  // const fetchLanguage = () => {
  //     const data = {code: 'en'};
  //     fetchData({url: '/customer/language', method: 'PUT', data}).then((data: any) => {
  //         console.log('language', data)
  //     }).catch((err: Error) => {
  //         console.log(err);
  //     });
  // };
  //
  // fetchLanguage();

  const handleRefetch = async () => {
    const myTeamsResultData = await fetchMyTeams();
    if (myTeamsResultData && myTeamsResultData.length > 0) {
      await fetchProfile(myTeamsResultData);
      await fetchFolders(myTeamsResultData);
      await fetchProfileConfig(myTeamsResultData);
      await fetchRecords(myTeamsResultData);
      await fetchTransactions(myTeamsResultData);
      await fetchTeamCustomers(myTeamsResultData);
      await fetchCustomerData(myTeamsResultData);
      await fetchVerticals(myTeamsResultData);
      await fetchPositions(myTeamsResultData);
      await fetchNotification(myTeamsResultData);
      await fetchExtensions(myTeamsResultData);
      if (!tariffs.length) {
        await setIsLoading(true);
        await fetchTariffs(myTeamsResultData);
      }
    }
  };

  useEffect(() => {
    if (profilesAll.length > 0) {
      fetchMyTeams();
    }
  }, [profilesAll]);

  const fetchCustomerCheck = (myTeamId: string) => {
    fetchData({ url: '/customer/check', method: 'GET', team: myTeamId })
      .then((data: any) => {
        if (data.is_success) {
          console.log('Customer check GET: ', data);
        }
      })
      .catch((err) => {
        console.log('Customer check GET', err);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const myTeamId = localStorage.getItem('teamId');
      if (myTeamId) {
        fetchCustomerCheck(myTeamId);
      }
    }, 80000 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // useLayoutEffect(() => {
  //     fetchData({url: '/profile', method: 'GET'}).then((data: any) => {
  //         if (data.errorCode === 7 && data.errorMessage.includes('not found')) {
  //             return dispatch(setToken(''));
  //         }
  //         if (data.is_success) {
  //             setProfilesAllData(data?.data);
  //         }
  //     }).catch((err: Error) => {
  //         console.log(err);
  //     });
  // }, []);

  useEffect(() => {
    ipcRenderer.on('getCookies', async (event, result) => {
      if (runBrowsers[result.profileParams.external_id]) {
        try {
          console.log('Result of getting file path to the cookies!', JSON.parse(result.cookies));
          const dataSubmit = {
            cookies: result.cookies,
          };
          const teamId = localStorage.getItem('teamId');
          await fetchData({
            url: `/profile/${result.profileParams.external_id}`,
            method: 'PATCH',
            data: { ...dataSubmit },
            team: teamId,
          }).catch(async (err: Error) => {
            console.log(err);
            const newPidProcess = pidProcess?.filter(
              (item: any) => item?.id !== result.profileParams.external_id,
            );
            dispatch(setPidProcess([...newPidProcess]));
            eventQueue.addToQueue(() => {
              dispatch(
                setRunBrowsers({ ...runBrowsers, [result.profileParams.external_id]: false }),
              );
            });
          });
          const newPidProcess = pidProcess?.filter(
            (item: any) => item?.id !== result.profileParams.external_id,
          );
          dispatch(setPidProcess([...newPidProcess]));
          eventQueue.addToQueue(() => {
            dispatch(setRunBrowsers({ ...runBrowsers, [result.profileParams.external_id]: false }));
          });
        } catch {
          console.log('Cookies JSON are not valid!');
          const newPidProcess = pidProcess?.filter(
            (item: any) => item?.id !== result.profileParams.external_id,
          );
          dispatch(setPidProcess([...newPidProcess]));
          eventQueue.addToQueue(() => {
            dispatch(setRunBrowsers({ ...runBrowsers, [result.profileParams.external_id]: false }));
          });
        }
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('getCookies');
    };
  }, [pidProcess, runBrowsers]);

  useEffect(() => {
    if (proxiesForCheck.length > 0) {
      checkProxy(
        proxiesForCheck,
        proxiesChangeIpResult,
        checkedProxies,
        checkedProxiesSingle,
        dispatch,
      ).then();
    } else if (accumulatedProxiesForCheck.length > 0) {
      dispatch(setProxiesForCheck(accumulatedProxiesForCheck));
      dispatch(setAccumulatedProxiesForCheck([]));
    }
  }, [proxiesForCheck]);

  useEffect(() => {
    if (proxySingleForCheck.length > 0) {
      checkProxySingle(
        proxySingleForCheck,
        proxiesChangeIpResult,
        checkedProxies,
        checkedProxiesSingle,
        dispatch,
      ).then();
    } else if (accumulatedProxiesForCheckSingle.length > 0) {
      dispatch(setProxySingleForCheck(accumulatedProxiesForCheckSingle));
      dispatch(setAccumulatedProxiesForCheckSingle([]));
    }
  }, [proxySingleForCheck]);

  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);
    if (savedLocale) {
      i18n.changeLanguage(savedLocale);
    }
  }, []);

  useEffect(() => {
    if (token) {
      handleRefetch();
    } else {
      setProfilesAllData([]);
      setFolders([]);
      setAllProxiesData([]);
      setTransactions([]);
      setFilteredTransactions([]);
      setTeamCustomers([]);
      setCustomerData([]);
      setNotifications([]);
      setFilteredNotice([]);
      setExtensions([]);
    }
  }, [token]);

  const domReady = (condition: DocumentReadyState[] = ['complete', 'interactive']) => {
    return new Promise((resolve) => {
      if (condition.includes(document.readyState)) {
        resolve(true);
      } else {
        document.addEventListener('readystatechange', () => {
          if (condition.includes(document.readyState)) {
            resolve(true);
          }
        });
      }
    });
  };

  useEffect(() => {
    setActiveCryptopayPopup(false);
    setSidebarMode(SidebarMode.MINI);
    setFoldersMode(FoldersMode.NONE);
    if (loadingAppRef.current) {
      const platform = navigator.platform;
      if (platform.toLowerCase().includes('win')) {
        dispatch(setPlatform('Windows'));
      } else if (platform.toLowerCase().includes('mac')) {
        dispatch(setPlatform('Macos'));
      } else if (platform.toLowerCase().includes('linux')) {
        dispatch(setPlatform('Linux'));
      }
      setTimeout(() => {
        domReady().then(() => {
          setIsLoadingApp(false);
          loadingAppRef.current = false;
        });
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const activeIds = new Set(pidProcess.map((p: any) => p.id));
    const timerIds = Object.keys(timers);

    timerIds.forEach((timerId) => {
      if (!activeIds.has(timerId)) {
        const timer = timers[timerId];
        if (timer) {
          const elapsedTime = Date.now() - timer.startTime;
          saveTimeToLocalStorage(timerId, elapsedTime);
          removeTimer(timerId);
        }
      }
    });
  }, [pidProcess]);
  // if (isTeamIdLoading) {
  //   return <Preload/>
  // }
  return updateAvailable ? (
    <LoadingPage progress={progress} statusMessage={statusMessage} updateAvailable={updateAvailable} />
  ) : isLoadingApp ? (
    <Preload />
  ) : (
    <div className="app">
      {token ? (
        <Suspense fallback={<Loader size={128} style={{ margin: 'auto', opacity: '.6' }} />}>
          <AppRouter />
        </Suspense>
      ) : (
        <Suspense fallback={<Preload />}>
          <AuthorizationForm handleRefetch={handleRefetch} />
        </Suspense>
      )}
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
