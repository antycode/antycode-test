import React, { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { Table } from '@/shared/components/Table/Table';
import cls from './ProxyList.module.scss';
import { Proxy } from '../../types';
import { Checkbox } from '@/shared/components/Checkbox/Checkbox';
import { RefetchButton } from '@/shared/components/RefetchButton/RefetchButton';
import { ReactComponent as IconRedCircle } from '@/shared/assets/icons/red_circle.svg';
import { ReactComponent as IconGreenCircle } from '@/shared/assets/icons/green_circle.svg';
import { ReactComponent as IconReload } from '@/shared/assets/icons/reload.svg';
import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags';
import clsx from 'clsx';
import { useCreateProxyExternal } from '@/features/profile/hooks/useCreateProxyExternal';
import { fetchData } from '@/shared/config/fetch';
import { useProxiesStore } from '@/features/proxy/store';
import { useSelector } from 'react-redux';
import LoaderDotsWhite from '@/shared/assets/loaders/loadersDotsWhite/LoaderDotsWhite';
import LoaderCircle from '@/shared/assets/loaders/loaderCircle/LoaderCircle';
import LoaderCircleMedium from '@/shared/assets/loaders/loaderCirldeMedium/LoaderCircleMedium';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { AppRoutes } from '@/shared/const/router';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { useNavigate } from 'react-router-dom';
import { useWorkspacesStore } from '@/features/workspace/store';

interface ProxyListItemProps {
  item: Proxy;
  isSelected: boolean;
  selectRow: (id: string, isSelected: boolean) => void;
  setEditProxyActive: Dispatch<SetStateAction<boolean>>;
  rotateProxyLink: (proxyItem: { [key: string]: any }) => void;
}

export const ProxyListItem = memo(
  ({ item, isSelected, selectRow, rotateProxyLink, setEditProxyActive }: ProxyListItemProps) => {
    const { external_id } = item;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { setAllProxiesData } = useProxiesStore();
    const { customerData, myTeams } = useWorkspacesStore();

    const checkedProxies = useSelector((state: any) => state.proxiesDataReducer.proxies);
    const checkedProxySingle = useSelector((state: any) => state.proxiesDataReducer.proxiesSingle);
    const proxiesForCheck = useSelector(
      (state: any) => state.proxiesForCheckReducer.proxiesForCheck,
    );
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

    const [changeIpStatus, setChangeIpStatus] = useState<boolean | null>(null);
    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
    const [showPassPopup, setShowPassPopup] = useState<boolean>(false);

    const [isOpenErrorTariff, setIsOpenErrorTariff] = useState<boolean>(false);

    let proxyDataFromLocalStorage: { [key: string]: any } | undefined;
    if (
      checkedProxies.find((proxy: { [key: string]: any }) => proxy.external_id === item.external_id)
    ) {
      proxyDataFromLocalStorage = checkedProxies.find(
        (proxy: { [key: string]: any }) => proxy.external_id === item.external_id,
      );
    } else if (
      checkedProxySingle.find(
        (proxy: { [key: string]: any }) => proxy.external_id === item.external_id,
      )
    ) {
      proxyDataFromLocalStorage = checkedProxySingle.find(
        (proxy: { [key: string]: any }) => proxy.external_id === item.external_id,
      );
    }

    const handleMouseEnter = (item: string) => {
      if (item === 'login') {
        setShowLoginPopup(true);
      } else if (item === 'pass') {
        setShowPassPopup(true);
      }
    };

    const handleMouseLeave = (item: string) => {
      if (item === 'login') {
        setShowLoginPopup(false);
      } else if (item === 'pass') {
        setShowPassPopup(false);
      }
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

    const openEditProxy = () => {
      selectRow(external_id, true);
      setEditProxyActive(true)
    }

    useEffect(() => {
      const proxiesAreChecking = [
        ...proxiesForCheck,
        ...proxySingleForCheck,
        ...accumulatedProxiesForCheck,
        ...accumulatedProxiesForCheckSingle,
      ];
      if (proxiesAreChecking.find((proxy) => proxy.external_id === external_id)) {
        setChangeIpStatus(null);
        const allProxiesForChangeIp = [...proxiesChangeIpResult];
        const foundProxy = allProxiesForChangeIp.find((proxy) => proxy.external_id === external_id);
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

    return (
      <>
        <Table.Row isSelected={isSelected}>
          <Table.Col className={cls.colCheck}>
            <Checkbox
              checked={isSelected}
              onChange={(e) => selectRow(external_id, e.currentTarget.checked)}
            />
          </Table.Col>

          <Table.Col className={cls.colStatusChecked}>
            {proxyDataFromLocalStorage ? (
              <IconGreenCircle id={item.external_id} />
            ) : (
              <IconRedCircle id={item.external_id} />
            )}
          </Table.Col>

          <Table.Col onClick={openEditProxy} className={cls.colName}>
            {[
              ...proxiesForCheck,
              ...proxySingleForCheck,
              ...accumulatedProxiesForCheck,
              ...accumulatedProxiesForCheckSingle,
            ].find((proxy) => proxy.external_id === external_id && !proxy.needCheckSpeed) ? (
              <LoaderDotsWhite />
            ) : item.title.length === 0 ? (
              `${item.host}:${item.port}`
            ) : (
              item.title
            )}
          </Table.Col>

          <Table.Col onClick={openEditProxy} className={cls.colHost}>{item.host}</Table.Col>

          <Table.Col onClick={openEditProxy} className={clsx(cls.colPort, cls.colPortCell)}>{item.port}</Table.Col>

          <Table.Col onClick={openEditProxy} className={clsx(cls.colLogin, cls.colLoginCell)}>
            <div
              onMouseEnter={() => handleMouseEnter('login')}
              onMouseLeave={() => handleMouseLeave('login')}>
              {item.login.length > 10 ? `${item.login.slice(0, 10)}...` : item.login}
            </div>
            {showLoginPopup && item.login.length > 10 && (
              <div
                className={cls.loginPopup}
                onMouseEnter={() => handleMouseEnter('login')}
                onMouseLeave={() => handleMouseLeave('login')}>
                {item.login}
              </div>
            )}
          </Table.Col>

          <Table.Col onClick={openEditProxy} className={clsx(cls.colPassword, cls.colPasswordCell)}>
            <div
              onMouseEnter={() => handleMouseEnter('pass')}
              onMouseLeave={() => handleMouseLeave('pass')}>
              {item.password.length > 10 ? `${item.password.slice(0, 10)}...` : item.password}
            </div>
            {showPassPopup && item.password.length > 10 && (
              <div
                className={cls.passPopup}
                onMouseEnter={() => handleMouseEnter('pass')}
                onMouseLeave={() => handleMouseLeave('pass')}>
                {item.password}
              </div>
            )}
          </Table.Col>

          <Table.Col onClick={openEditProxy} className={cls.colChangeLink}>{item.link_rotate}</Table.Col>

          <Table.Col onClick={openEditProxy} className={cls.colProtocol}>{item.type.toUpperCase()}</Table.Col>

          <Table.Col className={cls.colRefresh}>
            <div className={cls.colRefreshIp}>
              {proxyDataFromLocalStorage && proxyDataFromLocalStorage.userIP && (
                <>{proxyDataFromLocalStorage.userIP}</>
              )}
            </div>
            {item.link_rotate && proxyDataFromLocalStorage && proxyDataFromLocalStorage.userIP && (
              <div className={cls.changeIpContainer}>
                <div
                  className={cls.iconReloadWrapper}
                  onClick={() => {
                    if (checkTariff()) {
                      rotateProxyLink(item);
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
                      proxy.external_id === external_id &&
                      !proxy.needCheckSpeed &&
                      proxy.needRotateLink,
                  ) ? (
                    <LoaderCircleMedium selectedRow={isSelected} />
                  ) : (
                    (changeIpStatus === true && (
                      <IconReload width={15} height={15} className={clsx([cls.colRefreshGreen])} />
                    )) ||
                    (changeIpStatus === false && (
                      <IconReload width={15} height={15} className={clsx([cls.colRefreshRed])} />
                    )) ||
                    (changeIpStatus === null && <IconReload width={15} height={15} />)
                  )}
                </div>
                {[
                  ...proxiesForCheck,
                  ...proxySingleForCheck,
                  ...accumulatedProxiesForCheck,
                  ...accumulatedProxiesForCheckSingle,
                ].find(
                  (proxy) =>
                    proxy.external_id === external_id &&
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
                        <div className={clsx([cls.tooltipChangeIp, cls.tooltipChangeIpGreen])}>
                          {t('Success')}
                        </div>
                      </div>
                    )) ||
                    (changeIpStatus === false && (
                      <div
                        className={clsx([cls.tooltipChangeIpContainer, cls.changeIpRedContainer])}>
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
          </Table.Col>

          <Table.Col className={clsx(cls.colSpeed, cls.colSpeedCell)}>
            {[
              ...proxiesForCheck,
              ...proxySingleForCheck,
              ...accumulatedProxiesForCheck,
              ...accumulatedProxiesForCheckSingle,
            ].find((proxy) => proxy.external_id === external_id && !proxy.checkFromProfilesPage) ? (
              <LoaderCircle selectedRow={isSelected} />
            ) : proxyDataFromLocalStorage && proxyDataFromLocalStorage.speed ? (
              <>
                {proxyDataFromLocalStorage.speed} {t('Mb/s')}
              </>
            ) : (
              <Table.EmptyCol />
            )}
          </Table.Col>

          <Table.Col className={cls.colGeo}>
            {proxyDataFromLocalStorage && proxyDataFromLocalStorage.country && (
              <>
                <Flag
                  className={cls.colGeoCountryFlag}
                  height="11"
                  code={proxyDataFromLocalStorage.country.toUpperCase()}
                />
                <span>{proxyDataFromLocalStorage.country.toUpperCase()}</span>
              </>
            )}
          </Table.Col>
        </Table.Row>
        <ModalWindow
          modalWindowOpen={isOpenErrorTariff}
          onClose={() => setIsOpenErrorTariff(false)}>
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
  },
);
