import React, { useEffect, useState } from 'react';
import { TeamPageHeader } from './TeamPageHeader/TeamPageHeader';
import cls from './TeamPage.module.scss';
import { useRowSelection } from '@/shared/hooks';
import { fetchData } from '@/shared/config/fetch';
import { setToken } from '@/store/reducers/AuthReducer';
import { useUsersStore } from '@/features/user/store';
import { setProxiesData, setProxiesSingleData } from '@/store/reducers/ProxiesDataReducer';
import { ReactComponent as UsersAvaIcon } from '@/shared/assets/icons/users-ava.svg';
import { ReactComponent as EditIcon } from '@/shared/assets/icons/edit-icon.svg';
import { useTranslation } from 'react-i18next';
import { useWorkspacesStore } from '@/features/workspace/store';
import teamBackground2 from '@/shared/assets/icons/team-background-2.jpg';
import { ReactComponent as UserIcon } from '@/shared/assets/icons/user-icon.svg';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { Team } from '@/features/workspace/components/Team/Team';
import { Loader } from '@/shared/components/Loader';
import { Notice } from '@/features/workspace/components/Notice/Notice';
import { AccountInfoSimple } from '@/features/accountInfo/components/AccountInfoSimple';

export const TeamPage = () => {
  const { t } = useTranslation();
  const { customerData, myTeams, setCustomerData, setMyTeams } = useWorkspacesStore();
  const dispatch = useDispatch();

  const [loaderIsActive, setLoaderIsActive] = useState<boolean>(true);

  // const deleteProfiles = async () => {
  //     try {
  //         const profileArr = [...selectedRows];
  //         const promises = profileArr.map(external_id => fetchData({
  //             url: `/profile/${external_id}`,
  //             method: 'DELETE'
  //         }));
  //         await Promise.all(promises);
  //         const profiles = profilesAll.filter((profile: any) => !profileArr.includes(profile.external_id));
  //         setProfilesAllData(profiles);
  //         setSelectedRows(new Set());
  //     } catch (err) {
  //         console.log(err);
  //     }
  // };
  // const fetchProfile = () => {
  //     fetchData({url: '/profile', method: 'GET'}).then((data: any) => {
  //         if (data.errorCode === 7 && data.errorMessage && data.errorMessage.includes('not found')) {
  //             return dispatch(setToken(''));
  //         }
  //         if (data.is_success) {
  //             setProfilesAllData(data?.data);
  //         }
  //     }).catch((err) => {
  //     });
  // }
  //
  // const fetchRecords = () => {
  //     fetchData({url: '/profile/proxy', method: 'GET'}).then((data: any) => {
  //         if (data.is_success) {
  //             setAllProxiesData(data?.data || []);
  //         }
  //     }).catch((err: Error) => {
  //         console.log(err);
  //     });
  // }
  //
  // const fetchProfileConfig = () => {
  //     fetchData({url: '/profile/config', method: 'GET'}).then((data: any) => {
  //         setProfilesConfigData(data.data);
  //     }).catch((err: Error) => {
  //         console.log(err);
  //     });
  // }
  //

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
        setLoaderIsActive(false);
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

  useEffect(() => {
    fetchMyTeams().then(() => {
      fetchCustomerData();
    });
  }, []);

  return (
    <div className="page">
      <div className={cls.content}>
        <Team loaderIsActive={loaderIsActive} setLoaderIsActive={setLoaderIsActive} />
      </div>
      <AccountInfoSimple className={cls.info}/>
    </div>
  );
};
