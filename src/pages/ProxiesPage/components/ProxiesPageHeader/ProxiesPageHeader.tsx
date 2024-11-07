import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Button } from '@/shared/components/Button';
import cls from './ProxiesPageHeader.module.scss';
import { ReactComponent as IconPlusCircle } from '@/shared/assets/icons/plus-circle.svg';
import { RefetchButton } from '@/shared/components/RefetchButton/RefetchButton';
import { ProfileProxyDrawer } from '@/features/profile/components/ProfileProxyDrawer/ProfileProxyDrawer';
import { ReactComponent as ExchangeIcon } from '@/shared/assets/icons/exchange.svg';
import { ReactComponent as ChangeProxyIcon } from '@/shared/assets/icons/change-proxy.svg';
import { ReactComponent as PassIcon } from '@/shared/assets/icons/pass.svg';
import { ReactComponent as TrashIcon } from '@/shared/assets/icons/trash.svg';
import { ReactComponent as CheckoutIcon } from '@/shared/assets/icons/checkout.svg';
import { ReactComponent as ArrowDownLightIcon } from '@/shared/assets/icons/arrow-down-light.svg';
import { ReactComponent as ChangeIpIcon } from '@/shared/assets/icons/change-ip.svg';
import { ReactComponent as BtnUpIcon } from '@/shared/assets/icons/btn-up.svg';
import { ReactComponent as BtnDownIcon } from '@/shared/assets/icons/btn-down.svg';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { ReactComponent as FlagUkraineIcon } from '@/shared/assets/icons/flag-ukraine.svg';
import { ReactComponent as FlagPolandIcon } from '@/shared/assets/icons/flag-poland.svg';
import { ReactComponent as TrashIcon1 } from '@/shared/assets/icons/trash-icon-1.svg';
import { useProfileInitData } from '@/features/profile/hooks/useProfileInitData';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { useBuyProxyData } from '@/pages/ProxiesPage/components/BuyProxy/useBuyProxyData';
import { array, string } from 'zod';
import { use } from 'i18next';
import { useSelector } from 'react-redux';
import { useProxiesStore } from '@/features/proxy/store';
import { ReactComponent as Arrow2Left } from '@/shared/assets/icons/arrow-2-left.svg';
import { SidebarMode } from '@/shared/const/context';
import { SidebarModeContext, SidebarModeContextType } from '@/shared/context/SidebarModeContext';
import { fetchData } from '@/shared/config/fetch';
import { AppRoutes } from '@/shared/const/router';
import { useNavigate } from 'react-router-dom';
import { useWorkspacesStore } from '@/features/workspace/store';
import { ReactComponent as IconEdit } from '@/shared/assets/icons/edit.svg';

enum ButtonTypes {
  checkProxy = 'btnCheckProxy',
  changeIp = 'btnChangeIp',
  changeProtocol = 'btnChangeProtocol',
  buyProxy = 'btnBuyProxy',
  passToUser = 'btnPassToUser',
  deleteIcon = 'btnDeleteIcon',
  createProxy = 'btnCreateProxy',
}

interface ProxiesPageHeader {
  deleteProxies: any;
  handleRefetch?: () => void;
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  setIsProxyFormActive: Dispatch<SetStateAction<boolean>>;
  isProxyFormActive: boolean;
  checkProxies: any;
  rotateProxiesLinks: any;
  errorDeleteProxies: any[];
  errorDeleteProxiesState: any[];
  setErrorDeleteProxiesState: Dispatch<SetStateAction<any[]>>;
  setLoaderProxiesPage: Dispatch<SetStateAction<boolean>>;
  editProxyActive: boolean;
  setEditProxyActive: Dispatch<SetStateAction<boolean>>;
}

interface ProxyQuantities {
  1: number;
  2: number;
  3: number;
}

interface ProtocolOption {
  value: string;
  label: string;
}

interface ProxyQuantities {
  [key: number]: number;
}

export const ProxiesPageHeader = (props: ProxiesPageHeader) => {
  let {
    deleteProxies,
    handleRefetch,
    selectedRows,
    setSelectedRows,
    setIsProxyFormActive,
    isProxyFormActive,
    checkProxies,
    rotateProxiesLinks,
    errorDeleteProxies,
    errorDeleteProxiesState,
    setErrorDeleteProxiesState,
    setLoaderProxiesPage,
    editProxyActive,
    setEditProxyActive,
  } = props;
  const { t } = useTranslation();
  const { options } = useProfileInitData();
  const navigate = useNavigate();
  const { allProxies, setAllProxiesData } = useProxiesStore();
  const { customerData, myTeams } = useWorkspacesStore();
  const platform = useSelector((state: any) => state.platformReducer.platform);

  const { sidebarMode, setSidebarMode } = useContext(SidebarModeContext) as SidebarModeContextType;
  const isMiniSidebar = sidebarMode === SidebarMode.MINI;

  const [isOpenErrorTariff, setIsOpenErrorTariff] = useState<boolean>(false);

  const protocolRef = useRef<HTMLDivElement | null>(null);
  const [isOpenDeleteProxyPopup, setIsOpenDeleteProxyPopup] = useState<boolean>(false);
  const [buyProxyFormActive, setBuyProxyFormActive] = useState<boolean>(false);
  const [selectedGeo, setSelectedGeo] = useState<{ [key: number]: string }>({
    1: 'Ukraine',
    2: 'Ukraine',
    3: 'Ukraine',
  });
  const [isOpen, setIsOpen] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
  });
  // const [proxyQuantity, setProxyQuantity] = useState<number>(1);
  const [proxyQuantities, setProxyQuantities] = useState<ProxyQuantities>({
    1: 1,
    2: 1,
    3: 1,
  });

  const [isOpenSendUserPopup, setIsOpenSendUserPopup] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [teamTitle, setTeamTitle] = useState<string>('');
  const [freeNick, setFreeNick] = useState<boolean | null>(null);
  const [freeTeamTitle, setFreeTeamTitle] = useState<boolean | null>(null);
  const [checkNickTitleError, setCheckNickTitleError] = useState<boolean>(false);

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

  const sendData = async () => {
    setLoaderProxiesPage(true);
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
          console.log('submitData', submitData);
          fetchData({
            url: `/profile/proxy/${external_id}`,
            method: 'PATCH',
            data: submitData,
            team: teamId,
          }).then((data: any) => {
            if (data.is_success) {
              closeSendUserPopup();
              setAllProxiesData(
                allProxies.filter((proxy: any) => proxy.external_id !== external_id),
              );
            } else {
              setCheckNickTitleError(true);
              return null;
            }
          });
        });
        await Promise.all(promises);
        await setLoaderProxiesPage(false);
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

  const toggleDropdown = (optionId: number) => {
    setIsOpen((prevIsOpen) => ({
      ...prevIsOpen,
      [optionId]: !prevIsOpen[optionId],
    }));
  };

  const handleOptionClick = (optionId: number, optionGeo: string) => {
    setSelectedGeo((prevSelectedGeo) => ({
      ...prevSelectedGeo,
      [optionId]: optionGeo,
    }));
    toggleDropdown(optionId);
  };

  const proxyOptions = useBuyProxyData(selectedGeo);

  const handleQuantityChange = (optionId: number, newQuantity: number) => {
    setProxyQuantities((prevQuantities) => ({
      ...prevQuantities,
      [optionId]: newQuantity,
    }));
  };

  // const handleCreateProxy = () => {
  //     setIsProxyProxyDrawer(true);
  // };

  const handleAddProxy = () => {
    setIsProxyFormActive(true);
  };

  const closeBuyProxyPopup = () => {
    setSelectedGeo({
      1: 'Ukraine',
      2: 'Ukraine',
      3: 'Ukraine',
    });
    setIsOpen({
      1: false,
      2: false,
      3: false,
    });
    setProxyQuantities({
      1: 1,
      2: 1,
      3: 1,
    });
    setBuyProxyFormActive(false);
  };

  const closeDeleteProxyPopup = () => {
    setErrorDeleteProxiesState([]);
    errorDeleteProxies = [];
    setIsOpenDeleteProxyPopup(false);
  };

  const openDeleteProxyPopup = () => {
    setIsOpenDeleteProxyPopup(true);
  };

  // const deleteSelectedProxies = async () => {
  //   // await deleteProxies();
  //   // if (errorDeleteProxies.length > 0) {
  //   //   errorDeleteProxies = allProxies.filter((proxy) => {
  //   //     return errorDeleteProxies.includes(proxy.external_id);
  //   //   });
  //   //   setErrorDeleteProxiesState([...errorDeleteProxies]);
  //   // } else {
  //   //   await setIsOpenDeleteProxyPopup(false);
  //   //   await setSelectedRows(new Set());
  //   // }
    
  // };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

  const deleteSelectedProxies = async () => {
    const teamId = localStorage.getItem('teamId');
    try {
        const proxieArr = [...selectedRows];
        const promises = proxieArr.map((external_id) => {
            const timestamp = Date.now();
            const currentTime = formatTimestamp(timestamp);
            const submitData = {
              date_basket: currentTime,
            };
            return fetchData({
                url: `/profile/proxy/${external_id}`,
                method: 'PATCH',
                data: submitData,
                team: teamId,
            });
        });

        await Promise.all(promises);
        const profilesNotBasket = allProxies.filter(
            (profile: any) => !proxieArr.includes(profile.external_id),
        );
        setAllProxiesData(profilesNotBasket);
        setIsOpenDeleteProxyPopup(false)
        setSelectedRows(new Set());
    } catch (err) {
        console.log(err);
    }
};

  const checkSelectedProxies = async () => {
    await checkProxies();
    await setSelectedRows(new Set());
  };

  const rotateSelectedProxiesLinks = async () => {
    await rotateProxiesLinks();
    await setSelectedRows(new Set());
  };

  const handleMenuClick = () => {
    setSidebarMode((prev) => (prev === SidebarMode.FULL ? SidebarMode.MINI : SidebarMode.FULL));
  };

  const openEditForm = () => {
    if (selectedRows.size === 1) {
      setEditProxyActive(true);
    }
  };

  useEffect(() => {
    if (selectedRows.size > 1 || selectedRows.size === 0) {
      setEditProxyActive(false);
    }
  }, [selectedRows]);

  return (
    <div className={cls.autoregHeader} data-header-margin={isProxyFormActive}>
      <div className={cls.actionsLeft}>
        {/*<div>*/}
        {/*    <button className={cls.btnSidebar} onClick={handleMenuClick}>*/}
        {/*        <Arrow2Left style={isMiniSidebar ? {marginLeft: '1px'} : {marginLeft: '-1px'}} className={isMiniSidebar ? cls.arrowDeg : undefined} />*/}
        {/*    </button>*/}
        {/*</div>*/}
        <Button
          className={clsx(cls.btn, cls[ButtonTypes.checkProxy])}
          color="primary"
          disabled={selectedRows.size == 0}
          onClick={() => {
            if (checkTariff()) {
              checkSelectedProxies().then();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <ExchangeIcon width={16} height={15} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Check Proxy')}
          </p>
        </Button>

        <Button
          className={clsx(cls.btn, cls[ButtonTypes.changeIp])}
          color="primary"
          disabled={selectedRows.size == 0}
          onClick={() => {
            if (checkTariff()) {
              rotateSelectedProxiesLinks().then();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <ChangeIpIcon width={18} height={18} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Change IP')}
          </p>
        </Button>

        <div className={cls.changeProtocol}>
          <button
            className={clsx(cls.btn, cls[ButtonTypes.changeProtocol], cls.selectBtn)}
            // disabled={selectedRows.size == 0}
            //     disabled
            onClick={openEditForm}
            color="primary">
            <IconEdit />
            <p
              className={clsx(
                platform && platform === 'Windows' ? cls.selectBtnTextWin : cls.selectBtnText,
              )}>
              {t('Edit')}
            </p>
          </button>
        </div>

        <Button
          className={clsx(cls.btn, cls[ButtonTypes.passToUser])}
          color="primary"
          disabled={selectedRows.size == 0}
          onClick={() => {
            if (checkTariff()) {
              openSendUserPopup();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <PassIcon width={16} height={15} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Hand Over')}
          </p>
        </Button>

        <Button
          className={clsx(cls.btn, cls[ButtonTypes.deleteIcon])}
          color="primary"
          disabled={selectedRows.size == 0}
          isActionIcon
          onClick={() => {
            if (checkTariff()) {
              openDeleteProxyPopup();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <TrashIcon
            width={16}
            height={15}
            className={clsx(
              platform && platform === 'Windows' ? cls.iconDeleteWin : cls.iconDelete,
            )}
          />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Delete')}
          </p>
        </Button>
      </div>

      <div className={cls.actionsRight}>
        <Button
          className={clsx(cls.btn, cls[ButtonTypes.buyProxy])}
          color="primary"
          onClick={() => {
            if (checkTariff()) {
              setBuyProxyFormActive(true);
            } else {
              setIsOpenErrorTariff(true);
            }
          }}>
          <CheckoutIcon width={18} height={18} />
          <p className={clsx(platform && platform === 'Windows' ? cls.btnTextWin : cls.btnText)}>
            {t('Buy proxy')}
          </p>
        </Button>
        <Button
          className={clsx(cls.btn, cls[ButtonTypes.createProxy])}
          color="primary"
          onClick={() => {
            if (checkTariff()) {
              handleAddProxy();
            } else {
              setIsOpenErrorTariff(true);
            }
          }}
          leftIcon={<IconPlusCircle width={18} height={18} style={{ marginRight: '2px' }} />}>
          <p
            className={clsx(
              platform && platform === 'Windows' ? cls.addProxyTextWin : cls.addProxyText,
            )}>
            {t('Add proxy')}
          </p>
        </Button>
      </div>
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
            {checkNickTitleError && (
              <p className={cls.errorValid}>
                {t('Error')}:{' '}
                {t(
                  'If the proxy is linked to the profile, unlink the proxy. Or the proxy is not working',
                )}
              </p>
            )}
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
      <ModalWindow modalWindowOpen={buyProxyFormActive} onClose={closeBuyProxyPopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <p className={cls.modalWindowTitle}>{t('Buy proxy')}</p>
          <CloseIcon className={cls.closeBtn} onClick={() => closeBuyProxyPopup()} />
        </div>
        <div className={cls.modalWindowContent}>
          {proxyOptions.map((option: any) => (
            <div key={option.id} className={cls.optionWrapper}>
              <div className={cls.optionTitleWrapper}>
                <p className={cls.optionTitle}>
                  {t(option.titles[selectedGeo[option.id] || 'Ukraine'])}
                </p>
              </div>
              <div className={cls.listWrapper}>
                <ul className={cls.list}>
                  {option.list?.map((listItem: string) => (
                    <li className={cls.listItem} key={listItem}>
                      {t(listItem)}
                    </li>
                  ))}
                </ul>
              </div>
              <form className={cls.optionForm}>
                <div className={cls.optionInputsWrapper}>
                  <div className={cls.selectGeo}>
                    <div
                      className={`${cls.selectValue} ${
                        isOpen[option.id] ? cls.selectValueActive : ''
                      }`}>
                      <div className={cls.selectGeoText}>
                        {t('Geo')}:{' '}
                        <span className={cls.geo}>{t(selectedGeo[option.id] || 'Ukraine')}</span>
                      </div>
                      <div className={cls.changeGeo} onClick={() => toggleDropdown(option.id)}>
                        {selectedGeo[option.id] === 'Ukraine' ? (
                          <FlagUkraineIcon className={cls.flag} />
                        ) : (
                          <FlagPolandIcon className={cls.flag} />
                        )}
                        {isOpen[option.id] ? (
                          <ArrowDownLightIcon className={cls.rotatedSelectArrow} />
                        ) : (
                          <ArrowDownLightIcon />
                        )}
                      </div>
                    </div>
                    {isOpen[option.id] && (
                      <div className={cls.selectOptions}>
                        {option.geo?.map((optionGeo: string) => (
                          <div
                            key={optionGeo}
                            className={`${cls.selectOption} ${
                              selectedGeo[option.id] === optionGeo ? cls.selected : ''
                            }`}
                            onClick={() => handleOptionClick(option.id, optionGeo)}>
                            <span>{t(optionGeo)}</span>
                            <span>
                              {optionGeo === 'Ukraine' ? (
                                <FlagUkraineIcon className={cls.flag} />
                              ) : (
                                <FlagPolandIcon className={cls.flag} />
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={cls.optionInputWrapper}>
                    <label className={cls.quantityLabel}>{t('Quantity')}:</label>
                    <input
                      type="number"
                      value={proxyQuantities[option.id]}
                      className={cls.optionInput}
                      onChange={(e) => handleQuantityChange(option.id, parseInt(e.target.value))}
                    />
                    <div className={cls.changeQuantityBtnsWrapper}>
                      <BtnUpIcon
                        className={cls.iconUp}
                        onClick={() =>
                          handleQuantityChange(option.id, (proxyQuantities[option.id] || 1) + 1)
                        }
                      />
                      <BtnDownIcon
                        className={cls.iconDown}
                        onClick={() =>
                          handleQuantityChange(
                            option.id,
                            Math.max((proxyQuantities[option.id] || 1) - 1, 0),
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <button className={cls.optionSubmitBtn}>{t('Buy')}</button>
              </form>
            </div>
          ))}
        </div>
      </ModalWindow>
      <ModalWindow modalWindowOpen={isOpenDeleteProxyPopup} onClose={closeDeleteProxyPopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalDeleteHeaderTitle}>
            <TrashIcon1 />
            <p className={cls.modalDeleteTitle}>{t('Delete proxy')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={() => closeDeleteProxyPopup()} />
        </div>
        <div className={cls.modalDeleteContent}>
          {errorDeleteProxiesState.length > 0 ? (
            <div className={cls.errorProxiesWrapper}>
              <p>{t('The proxies could not be deleted, firstly unlink it from your profiles')}:</p>
              <ul className={cls.errorProxiesUl}>
                {errorDeleteProxiesState.map((proxy: any, index: number) => (
                  <li key={index}>{proxy.title ? proxy.title : `${proxy.host}:${proxy.port}`}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={cls.warningTextContent}>
              <p className={cls.warningText1}>
                {t('Are you sure you want to delete the selected proxies?')}
              </p>
              <p className={cls.warningText2}>{t('The files will be deleted permanently')}</p>
            </div>
          )}
          <div className={cls.approveDeleteContent}>
            {errorDeleteProxiesState.length > 0 ? (
              <button className={cls.btnCancel} onClick={() => closeDeleteProxyPopup()}>
                {t('Exit')}
              </button>
            ) : (
              <>
                <button className={cls.btnCancel} onClick={() => closeDeleteProxyPopup()}>
                  {t('Cancel')}
                </button>
                <button className={cls.btnDelete} onClick={() => deleteSelectedProxies()}>
                  {t('Delete')}
                </button>
              </>
            )}
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
      {/*<ProfileProxyDrawer opened={isProxyProxyDrawer} setOpened={setIsProxyProxyDrawer}/>*/}
    </div>
  );
};
