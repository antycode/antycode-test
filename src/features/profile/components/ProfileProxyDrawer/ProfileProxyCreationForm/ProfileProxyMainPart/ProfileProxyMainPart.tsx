import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { TProfileProxyCreationForm } from '../ProfileProxyCreationForm';
import cls from '../ProfileProxyCreationForm.module.scss';
import { useProfileInitData } from '@/features/profile/hooks/useProfileInitData';
import { fetchData } from '@/shared/config/fetch';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useCreateProxyExternal } from '@/features/profile/hooks/useCreateProxyExternal';
import { useProfilesStore } from '@/features/profile/store';
import { useProxiesStore } from '@/features/proxy/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  setAccumulatedProxiesForCheck,
  setProxiesForCheck,
} from '@/store/reducers/ProxiesForCheckReducer';
import { loadConfigFromFile } from 'vite';
import { useWorkspacesStore } from '@/features/workspace/store';
import { InputCustom } from '@/shared/components/Input/InputCustom';
import clsx from 'clsx';
import { hostname } from 'os';
import AddProxyLeftSide from './AddProxy/AddProxyLeftSide';

interface ProxyResult {
  type?: string;
  login?: string;
  password?: string;
  host?: string;
  port?: any;
  title?: string;
  link_rotate?: string;
}

interface ProfileProxyMainPartProps {
  setIsProxyFormActive: Dispatch<SetStateAction<boolean>>;
  proxyInputValue: string;
  setProxyInputValue: Dispatch<SetStateAction<string>>;
  useSortSpeed: boolean;
  setUseSortSpeed: Dispatch<SetStateAction<boolean>>;
  useSortStatus: boolean;
  setUseSortStatus: Dispatch<SetStateAction<boolean>>;
}

export const ProfileProxyMainPart = (props: ProfileProxyMainPartProps) => {
  const {
    setIsProxyFormActive,
    proxyInputValue,
    setProxyInputValue,
    useSortSpeed,
    setUseSortSpeed,
    useSortStatus,
    setUseSortStatus,
  } = props;

  const { t } = useTranslation();

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

  // const [profileDataReview, setProfileDataReview] = useState<any>({
  //   profileName: '',
  //   profileStatus: '',
  //   profileTags: [],
  //   profileUseragent: '',
  //   profileProxyType: 'No proxy',
  // });

  const [proxyCheckMessage, setProxyCheckMessage] = useState<string>('');
  const [addProxies, setAddProxies] = useState<any[]>([]);

  const [userAgent, setUserAgent] = useState<string>('');
  const [proxyHost, setProxyHost] = useState<string>('');
  const [proxyType, setProxyType] = useState<string>('http');

  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<TProfileProxyCreationForm>();

  const { options } = useProfileInitData();
  const { configData, setProfilesConfigData } = useProfilesStore();

  const { setAllProxiesData, allProxies } = useProxiesStore();
  const { myTeams } = useWorkspacesStore();

  // Functionality with Proxies

  // Parse proxy from input
  const parseProxy = (value: string): any => {
    setProxyInputValue(value);
    const proxyList: string[] = value.split('\n');
    const parsedProxies: any[] = proxyList.map((proxyString) => {
      const result: any = {};
  
      // Определение типа прокси
      if (proxyString.includes('socks5://')) {
        result.type = 'socks5';
      } else if (proxyString.includes('http://')) {
        result.type = 'http';
      } else {
        result.type = 'http'; // Если тип прокси не указан, по умолчанию считаем HTTP
      }
  
      // Обработка ссылки для смены IP
      if (proxyString.includes('[') && proxyString.includes(']')) {
        result.link_rotate = proxyString.split('[')[1].split(']')[0].trim();
        proxyString = proxyString.replace(/\[.*?\]/, ''); // Удаление ссылки для смены IP из строки
      } else {
        result.link_rotate = '';
      }
  
      // Удаление протокола, если он есть
      if (result.type !== 'http') {
        const protocolIndex = proxyString.indexOf('://');
        if (protocolIndex !== -1) {
          proxyString = proxyString.slice(protocolIndex + 3); // Обрезаем протокол
        }
      }
  
      // Разделение строки на части
      let editedValue = proxyString.trim();
  
      if (editedValue.includes('@')) {
        const [loginPassword, hostPortName] = editedValue.split('@');
        const [login, password] = loginPassword.split(':');
        const [host, port, title] = hostPortName.split(':');
  
        result.host = host?.trim();
        result.port = +port;
        result.login = login?.trim();
        result.password = password?.trim();
        result.title = title?.trim() || ''; // Если название не указано, устанавливаем пустую строку
      } else {
        const [host, port, login, password, title] = editedValue.split(':');
        result.host = host?.trim();
        result.port = +port;
        result.login = login?.trim();
        result.password = password?.trim();
        result.title = title?.trim() || ''; // Если название не указано, устанавливаем пустую строку
      }
  
      // Проверка на дубликаты
      if (![...allProxies].find((proxy) => proxy.host === result.host && proxy.port === result.port)) {
        return result;
      }
    }).filter(Boolean); // Фильтруем undefined значения
  
    setAddProxies([...parsedProxies]);
  };
  

  const getProxy = (resolve: any) => {
    console.log('success', true);
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: '/profile/proxy', method: 'GET', team: teamId })
      .then((data: any) => {
        console.log('get', true);
        console.log('data', data);
        setAllProxiesData(data?.data || []);
        setUseSortSpeed(false);
        setUseSortStatus(false);
        setIsProxyFormActive(false);
        setProxyInputValue('');
        setProfilesConfigData({ ...configData, proxies: data?.data });
        setProxyCheckMessage('success');
        resolve([...data?.data]);
      })
      .catch((err: Error) => {
        console.log(err);
        resolve(err);
      });
  };

  // Fetch proxy
  const fetchProxy = async (proxyOptions: object) => {
    return new Promise<any>((resolve, reject) => {
      const teamId = localStorage.getItem('teamId');
      fetchData({ url: '/profile/proxy', method: 'POST', data: proxyOptions, team: teamId })
        .then((res) => {
          if(!res?.is_success) {
            toast.error(res.errorMessage)
          }
          if (res?.is_success) {
           getProxy(resolve)
          } else if (
            res.errorCode === 12 &&
            res.errorMessage &&
            res.errorMessage.includes('exists')
          ) {
            setProxyCheckMessage('used');
            resolve(false);
          } else if (res.errorCode === 9) {
            setProxyCheckMessage('incorrect');
            resolve(false);
          } else if (
            res.errorCode === 12 &&
            res.errorMessage &&
            !res.errorMessage.includes('exists')
          ) {
            setProxyCheckMessage('error');
            resolve(false);
          } else {
            setProxyCheckMessage('');
            resolve(false);
          }
        })
        .catch((e) => {
          console.log('error', e);
          setProxyCheckMessage('error');
          resolve(false);
        });
    });
  };

  const checkProxies = (proxiesCount: number, allProxiesAfterAdd: any[]) => {
    let proxies = allProxiesAfterAdd.slice(0, proxiesCount);
    const checkingProxiesAtTheMoment = [
      ...proxiesForCheck,
      ...proxySingleForCheck,
      ...accumulatedProxiesForCheck,
      ...accumulatedProxiesForCheckSingle,
    ];
    checkingProxiesAtTheMoment.map((proxy) => {
      proxies = proxies.filter((item: any) => item.external_id !== proxy.external_id);
    });
    if (proxiesForCheck.length > 0) {
      dispatch(setAccumulatedProxiesForCheck([...accumulatedProxiesForCheck, ...proxies]));
    } else {
      dispatch(setProxiesForCheck(proxies));
    }
  };

  // Add proxy
  const handleCheckProxy = async () => {
    console.log('addProxies', addProxies);
    let proxiesCount: number = 0;
    let allProxiesAfterAdd: any[] = [];

    for (const proxyForFetch of addProxies) {
      if (proxyForFetch) {
        const proxyOptions = useCreateProxyExternal(proxyForFetch);
        const foundProxy = allProxies.find(
          (proxy) => proxy.host === proxyOptions.host && proxy.port === proxyOptions.port,
        );

        if (!foundProxy) {
          await fetchProxy(proxyOptions)
            .then((proxies: any) => {
              if (proxies) {
                allProxiesAfterAdd = [...proxies];
                proxiesCount = proxiesCount + 1;
              }
            })
            .catch((err) => {
              console.log('Error in fetchProxy / func in handleCheckProxy', err);
              return false;
            });
        } else {
          console.log(`This proxy - ${proxyOptions.host}:${proxyOptions.port} already exists!`);
          return false;
        }
      } else {
        return false;
      }
    }

    await console.log('proxiesCount', proxiesCount);

    await checkProxies(proxiesCount, allProxiesAfterAdd);
  };

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

  // useEffect(() => {
  //     if (proxiesForCheck.length > 0)
  //         checkProxy(proxiesForCheck, checkedProxies, dispatch)
  //             .then(() => {
  //             setProxyCheckMessage('');
  //         });
  //     }
  // }, [proxiesForCheck]);

  return (
    <div className={cls.formPage}>
      <AddProxyLeftSide setProxyCheckMessage={setProxyCheckMessage} getProxy={getProxy}/>
      <form className={cls.addProxyRightSide}>
        <textarea
          className={cls.inputProxy}
          wrap={'soft'}
          value={proxyInputValue.length > 0 ? proxyInputValue : ''}
          onChange={(e) => parseProxy(e.target.value)}
        />
        <p className={cls.buttonAddProxyWrapper}>
          <button
            className={cls.buttonAddProxy}
            onClick={(e) => {
              e.preventDefault();
              handleCheckProxy();
            }}>
            {t('Add proxy')}
          </button>
        </p>
      </form>
    </div>
  );
};
