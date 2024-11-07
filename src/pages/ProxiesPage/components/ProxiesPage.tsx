import React, { useEffect, useState } from 'react';
import { ProxyList } from '@/features/proxy';
import { useProxiesStore } from '@/features/proxy/store';
import { ProxiesPageHeader } from './ProxiesPageHeader/ProxiesPageHeader';
import cls from './ProxiesPage.module.scss';
import { useRowSelection } from '@/shared/hooks';
import { fetchData } from '@/shared/config/fetch';
import { ProfileProxyCreationForm } from '@/features/profile/components/ProfileProxyDrawer/ProfileProxyCreationForm/ProfileProxyCreationForm';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAccumulatedProxiesForCheck,
  setAccumulatedProxiesForCheckSingle,
  setProxiesForCheck,
  setProxySingleForCheck,
} from '@/store/reducers/ProxiesForCheckReducer';
import { setProxiesData, setProxiesSingleData } from '@/store/reducers/ProxiesDataReducer';
import { useWorkspacesStore } from '@/features/workspace/store';
import { usePaymentStore } from '@/features/payment/store';
import { setToken } from '@/store/reducers/AuthReducer';
import { Loader } from '@/shared/components/Loader';
import { AccountInfo } from '@/features/accountInfo';
import EditProxyForm from '@/features/profile/components/ProfileProxyDrawer/EditProxyForm/EditProxyForm';
import clsx from 'clsx';
import ProxyPagination from '@/features/proxy/components/ProxyPagination/ProxyPagination';

export const ProxiesPage = () => {
  const { setAllProxiesData, currentPage, allProxies } = useProxiesStore();
  const { myTeams, setCustomerData, setMyTeams } = useWorkspacesStore();

  const dispatch = useDispatch();

  const checkedProxies = useSelector((state: any) => state.proxiesDataReducer.proxies);
  const checkedProxiesSingle = useSelector((state: any) => state.proxiesDataReducer.proxiesSingle);
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

  const [activePages, setActivePages] = useState<number[]>([currentPage]);
  const [isProxyFormActive, setIsProxyFormActive] = useState<boolean>(false);

  const [useSortSpeed, setUseSortSpeed] = useState<boolean>(false);
  const [useSortStatus, setUseSortStatus] = useState<boolean>(false);
  const [editProxyActive, setEditProxyActive] = useState<boolean>(false);

  const [errorDeleteProxiesState, setErrorDeleteProxiesState] = useState<any[]>([]);

  const [loaderProxiesPage, setLoaderProxiesPage] = useState<boolean>(false);

  // Functionality with Proxies

  const { selectedRows, selectRow, setSelectedRows } = useRowSelection();

  let errorDeleteProxies: any[] = [];
  const deleteProxies = async () => {
    const teamId = localStorage.getItem('teamId');
    try {
      const selectedProxies = Array.from(selectedRows);
      const promises = selectedProxies.map((external_id) =>
        fetchData({
          url: `/profile/proxy/${external_id}`,
          method: 'DELETE',
          team: teamId,
        }),
      );
      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        if (!response.is_success) {
          const proxy_external_id = response.errorMessage?.split("'")[1];
          setErrorDeleteProxiesState((prevState: any[]) => [...prevState, proxy_external_id]);
          errorDeleteProxies.push(proxy_external_id);
        }
      });

      //If all DELETE requests were successful, update localStorage
      if (responses.every((response) => response.is_success)) {
        let updatedProxyData = checkedProxies.filter(
          (proxy: { [key: string]: any }) => !selectedProxies.includes(proxy.external_id),
        );
        dispatch(setProxiesData(updatedProxyData));
        updatedProxyData = checkedProxiesSingle.filter(
          (proxy: { [key: string]: any }) => !selectedProxies.includes(proxy.external_id),
        );
        dispatch(setProxiesSingleData(updatedProxyData));
      }

      fetchRecords();
      return responses;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  };

  const rotateProxyLink = async (proxyItem: { [key: string]: any }) => {
    let proxyForRotate = [{ ...proxyItem, needCheckSpeed: false, needRotateLink: true }];
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

  const rotateProxiesLinks = async () => {
    const teamId = localStorage.getItem('teamId');
    const selectedProxies = Array.from(selectedRows);
    const promises = selectedProxies.map((external_id) =>
      fetchData({
        url: `/profile/proxy/${external_id}`,
        method: 'GET',
        team: teamId,
      }),
    );
    const responses = await Promise.all(promises);
    let proxiesForRotateLink: any[] = [];
    for (const proxy of responses) {
      const proxyOptions: any = proxy.data;
      if (proxyOptions.link_rotate) {
        proxiesForRotateLink.push({ ...proxyOptions, needCheckSpeed: false, needRotateLink: true });
      }
    }
    const checkingProxiesAtTheMoment = [
      ...proxiesForCheck,
      ...proxySingleForCheck,
      ...accumulatedProxiesForCheck,
      ...accumulatedProxiesForCheckSingle,
    ];
    checkingProxiesAtTheMoment.map((proxy) => {
      proxiesForRotateLink = proxiesForRotateLink.filter(
        (item: any) => item.external_id !== proxy.external_id,
      );
    });
    if (proxiesForCheck.length > 0) {
      dispatch(
        setAccumulatedProxiesForCheck([...accumulatedProxiesForCheck, ...proxiesForRotateLink]),
      );
    } else {
      dispatch(setProxiesForCheck(proxiesForRotateLink));
    }
    await setSelectedRows(new Set());
  };

  // Main function of check proxy
  const checkProxies = async () => {
    const teamId = localStorage.getItem('teamId');
    const selectedProxies = Array.from(selectedRows);
    const promises = selectedProxies.map((external_id) =>
      fetchData({
        url: `/profile/proxy/${external_id}`,
        method: 'GET',
        team: teamId,
      }),
    );
    const responses = await Promise.all(promises);
    let responsesUpdated = responses.map((item: any) => {
      return { ...item.data, needCheckSpeed: false };
    });
    const checkingProxiesAtTheMoment = [
      ...proxiesForCheck,
      ...proxySingleForCheck,
      ...accumulatedProxiesForCheck,
      ...accumulatedProxiesForCheckSingle,
    ];
    checkingProxiesAtTheMoment.map((proxy) => {
      responsesUpdated = responsesUpdated.filter(
        (item: any) => item.external_id !== proxy.external_id,
      );
    });
    if (proxiesForCheck.length > 0) {
      dispatch(setAccumulatedProxiesForCheck([...accumulatedProxiesForCheck, ...responsesUpdated]));
    } else {
      dispatch(setProxiesForCheck(responsesUpdated));
    }
    await setSelectedRows(new Set());
  };

  // const handleRefetch = () => {
  //     fetchRecords()
  // };
  // const fetchRecords = () => {
  //     setAllProxiesData(initialProxies);
  // }

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
    fetchMyTeams().then();
    // fetchRecords();
    fetchCustomerData();
  }, []);

  return (
    <div className="page">
      <div className={cls.content}>
        <ProfileProxyCreationForm
          isProxyFormActive={isProxyFormActive}
          setIsProxyFormActive={setIsProxyFormActive}
          useSortSpeed={useSortSpeed}
          setUseSortSpeed={setUseSortSpeed}
          useSortStatus={useSortStatus}
          setUseSortStatus={setUseSortStatus}
        />
        <EditProxyForm
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          getProxy={fetchRecords}
          editProxyActive={editProxyActive}
          setEditProxyActive={setEditProxyActive}
          isProxyFormActive={isProxyFormActive}
        />
        <ProxiesPageHeader
          editProxyActive={editProxyActive}
          setEditProxyActive={setEditProxyActive}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          deleteProxies={deleteProxies}
          checkProxies={checkProxies}
          rotateProxiesLinks={rotateProxiesLinks}
          // handleRefetch={handleRefetch}
          setIsProxyFormActive={setIsProxyFormActive}
          isProxyFormActive={isProxyFormActive}
          errorDeleteProxies={errorDeleteProxies}
          setErrorDeleteProxiesState={setErrorDeleteProxiesState}
          errorDeleteProxiesState={errorDeleteProxiesState}
          setLoaderProxiesPage={setLoaderProxiesPage}
        />
        <ProxyList
          setEditProxyActive={setEditProxyActive}
          activePages={activePages}
          setActivePages={setActivePages}
          selectedRows={selectedRows}
          selectRow={selectRow}
          setSelectedRows={setSelectedRows}
          rotateProxyLink={rotateProxyLink}
          useSortSpeed={useSortSpeed}
          setUseSortSpeed={setUseSortSpeed}
          useSortStatus={useSortStatus}
          setUseSortStatus={setUseSortStatus}
          isProxyFormActive={isProxyFormActive}
        />
      </div>
      <ProxyPagination activePages={activePages} setActivePages={setActivePages} />
      {/* <AccountInfo activePages={activePages} currentPage={currentPage} perPageCount={p}/> */}
      {loaderProxiesPage && <Loader size={75} />}
    </div>
  );
};
