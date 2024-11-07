import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { LangSwitcher } from '@/features/langSwitcher';
import { Navigation } from '../Navigation/Navigation';
import { ReactComponent as LogoIcon } from '@/shared/assets/icons/logo.svg';
import { ReactComponent as Logout } from '@/shared/assets/icons/logout.svg';
import { ReactComponent as UserIcon } from '@/shared/assets/icons/user-icon.svg';
import { ReactComponent as ArrowDownWhite2Icon } from '@/shared/assets/icons/arrow-down-white2.svg';
import { ReactComponent as WalletIcon } from '@/shared/assets/icons/wallet.svg';
import { ReactComponent as SettingsIcon } from '@/shared/assets/icons/settings.svg';
import { ReactComponent as CheckedIcon } from '@/shared/assets/icons/checked.svg';
import { ReactComponent as IconPlusCircle } from '@/shared/assets/icons/plus-circle.svg';
import { AppRoutes } from '@/shared/const/router';
import cls from './Sidebar.module.scss';
import { SidebarModeContext, SidebarModeContextType } from '@/shared/context/SidebarModeContext';
import { SidebarMode } from '@/shared/const/context';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { setToken } from '@/store/reducers/AuthReducer';
import { useDispatch } from 'react-redux';
import { setIsEditProfileDrawer, setIsProfileCreationDrawer } from '@/store/reducers/Drawers';
import clsx from 'clsx';
import { useProfilesStore } from '@/features/profile/store';
import { useWorkspacesStore } from '@/features/workspace/store';
import { fetchData } from '@/shared/config/fetch';
import { usePaymentStore } from '@/features/payment/store';
import { ReactComponent as EditIcon } from '@/shared/assets/icons/edit-icon.svg';
import { useResetZustandStores } from '@/features/profile/hooks/useResetStore';

export const Sidebar = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { customerData, teamCustomers, myTeams, setCustomerData, setMyTeams } =
    useWorkspacesStore();
  const { profilesAll } = useProfilesStore();
  const { tariffs } = usePaymentStore();

  const dispatch = useDispatch();

  const resetStore = useResetZustandStores();

  const { sidebarMode, setSidebarMode } = useContext(SidebarModeContext) as SidebarModeContextType;

  const isMiniSidebar = sidebarMode === SidebarMode.MINI;

  const fileInputAvatarRef: MutableRefObject<null> | any = useRef(null);

  const [avatarBase64, setAvatarBase64] = useState<string>(customerData.customer?.avatar);

  const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false);
  const [isOpenTeamDropdown, setIsOpenTeamDropdown] = useState<boolean>(false);

  const [userDataOpen, setUserDataOpen] = useState<boolean>(false);

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const userRef = useRef<HTMLDivElement | null>(null);

  const nickname = customerData?.customer?.nickname;

  const isLongNickname = nickname && nickname.length > 6;

  const userSecondRef = useRef<HTMLDivElement | null>(null);
  const userAvatarMiniRef = useRef<HTMLDivElement | null>(null);

  const handleMenuClick = () => {
    setSidebarMode((prev) => (prev === SidebarMode.FULL ? SidebarMode.MINI : SidebarMode.FULL));
  };

  const toggleUserData = () => {
    setUserDataOpen((prev: any) => !prev);
  };

  const handleLogout = async () => {
    const teamId = localStorage.getItem('teamId');
    try {
      const response = await fetchData({ url: '/customer/logout', method: 'GET', team: teamId });

      if (response.is_success) {
        localStorage.removeItem('cryptopayData');
        localStorage.removeItem('teamId');
        dispatch(setToken(''));
        resetStore();
      } else {
        console.error('Logout failed:', response.errors);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleOpenLogoutPopup = () => {
    dispatch(setIsProfileCreationDrawer(false));
    setIsOpenModalWindow(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const openTeamDropdown = () => {
    setIsOpenTeamDropdown((prev) => !prev);
  };

  const teamId = localStorage.getItem('teamId');

  const handleClickAvatar = (ev: any) => {
    ev.preventDefault();
    resetFileAvatar(ev);
    if (fileInputAvatarRef.current) {
      fileInputAvatarRef.current.click();
    }
  };

  const resetFileAvatar = (ev: any) => {
    ev.preventDefault();
    setAvatarBase64('');
    fileInputAvatarRef.current.value = '';
  };

  const handleFileChangeAvatar = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
        const dataSubmit = {
          avatar_customer: reader.result,
        };
        fetchData({
          url: `/customer`,
          method: 'PATCH',
          data: dataSubmit,
          team: teamId,
        })
          .then((data: any) => {
            console.log('customer patch', data);
            if (data.is_success) {
              if (data.data) {
                setCustomerData(data?.data);
                fetchCustomerData();
              }
            }
          })
          .catch((err: Error) => {
            console.log('/customer patch error: ', err);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchCustomerData = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: `/customer`, method: 'GET', team: teamId })
      .then((data: any) => {
        console.log('customer data', data);
        if (data.is_success) {
          if (data.data) {
            setCustomerData(data?.data);
            setAvatarBase64(data?.data.customer.avatar);
          }
        }
      })
      .catch((err: Error) => {
        console.log('/customer get error: ', err);
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
        localStorage.setItem('teamId', response.data[0].external_id);
        return response.data[0].external_id;
      } else {
        return { is_success: false };
      }
    } catch (error) {
      console.error('Error fetching my teams:', error);
      return { is_success: false };
    }
  };

  const closeProfileDrawers = () => {
    dispatch(setIsProfileCreationDrawer(false));
    dispatch(setIsEditProfileDrawer(false));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userSecondRef.current &&
        !userSecondRef.current.contains(event.target as Node) &&
        userAvatarMiniRef.current &&
        !userAvatarMiniRef.current.contains(event.target as Node)
      ) {
        setUserDataOpen(false);
      }
    };

    if (userDataOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDataOpen]);

  useEffect(() => {
    fetchMyTeams().then();
    if (!customerData) {
      fetchCustomerData();
    }
  }, []);

  return (
    <div className={cls.sidebar} data-mini-sidebar={isMiniSidebar}>
      <Link className={cls.logo} to={AppRoutes.MAIN}>
        <LogoIcon className={cls.logoImage} onClick={closeProfileDrawers} />
        <span className={cls.logoText}>anty-code</span>
      </Link>

      <Navigation isMini={isMiniSidebar} />

      <div className={cls.user} ref={userRef}>
        <div className={cls.userContent}>
          <div
            className={cls.userAvatarMini}
            ref={userAvatarMiniRef}
            style={{ cursor: 'pointer' }}
            onClick={toggleUserData}>
            <div className={cls.avatar}>
              {customerData.customer?.avatar ? (
                <img
                  src={customerData.customer?.avatar}
                  alt="User Avatar"
                  className={clsx(cls.avatarRadius, cls.avatarSidebarMini)}
                  width={36}
                  height={36}
                />
              ) : (
                <UserIcon width={36} height={36} className={cls.avatarSidebarMini} />
              )}
            </div>
          </div>
        </div>
        {customerData && userDataOpen && (
          <div className={cls.userSecond} ref={userSecondRef}>
            <div className={cls.userSecondContent}>
              {isOpenTeamDropdown ? (
                <div className={cls.teamDropdown}>
                  <div className={cls.teamDropdownItems}>
                    <p className={cls.chooseTeam}>{t('Choose the team')}:</p>
                    <div style={{ maxHeight: '280px' }}>
                      {myTeams
                        .filter((i: any) => i.is_confirmed === true)
                        ?.map((team, idx) => (
                          <div
                            key={idx}
                            className={clsx(cls.teamDropdownItem, {
                              [cls.activeTeam]: team.external_id === teamId,
                            })}
                            onClick={() => {
                              if (team.external_id !== teamId) {
                                localStorage.setItem('teamId', team.external_id);
                                setIsOpenTeamDropdown(false);
                                window.location.reload();
                              }
                            }}>
                            <p className={cls.teamDropdownTitle}>{team.nickname}</p>
                            {team.external_id === teamId && <CheckedIcon />}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cls.userInfo}>
                  <div className={cls.user1Data}>
                    <div className={cls.user1DataLeft}>
                      <div className={cls.userAvatar}>
                        <div className={cls.avatar}>
                          {customerData.customer?.avatar ? (
                            <div className={cls.imageWrapper}>
                              <img
                                src={customerData.customer?.avatar}
                                alt="User Avatar"
                                className={cls.avatarRadius}
                                width={71}
                                height={71}
                              />
                              <span className={cls.editIcon} onClick={handleClickAvatar}>
                                <EditIcon />
                              </span>
                              <input
                                type="file"
                                accept=".jpg, .png"
                                ref={fileInputAvatarRef}
                                onChange={handleFileChangeAvatar}
                                style={{ display: 'none' }}
                              />
                            </div>
                          ) : (
                            <div className={cls.imageWrapper}>
                              <UserIcon width={71} height={71} />
                              <span className={cls.editIcon} onClick={handleClickAvatar}>
                                <EditIcon />
                              </span>
                              <input
                                type="file"
                                accept=".jpg, .png"
                                ref={fileInputAvatarRef}
                                onChange={handleFileChangeAvatar}
                                style={{ display: 'none' }}
                              />
                            </div>
                          )}
                        </div>
                        <div
                          onMouseEnter={() => isLongNickname && setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          style={{ display: 'inline-block' }}>
                          {!isHovered && (
                            <p
                              style={{
                                fontSize: '12px',
                                fontWeight: '700',
                              }}>
                              {nickname}
                            </p>
                          )}

                          {isHovered && isLongNickname && (
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                display: 'block',
                              }}
                              className={cls.nickPopup}>
                              {nickname}
                            </span>
                          )}
                        </div>
                        {/*<p style={{*/}
                        {/*    fontSize: '12px',*/}
                        {/*    fontWeight: '700'*/}
                        {/*}}>{customerData?.customer?.nickname}</p>*/}
                        {/*<span style={{*/}
                        {/*    fontSize: '12px',*/}
                        {/*    fontWeight: '700',*/}
                        {/*    // display: 'none'*/}
                        {/*}}*/}
                        {/*      className={cls.nickPopup}*/}
                        {/*>*/}
                        {/*    {customerData?.customer?.nickname}*/}
                        {/*</span>*/}
                      </div>
                    </div>
                    <div className={cls.user1DataRight}>
                      <div className={cls.user1DataItem}>
                        <WalletIcon />
                        <div className={cls.balance}>
                          <p>{t('Balance')}:</p>
                          <p>${customerData.customer && customerData.customer.balance}</p>
                        </div>
                        <IconPlusCircle
                          height={18}
                          width={18}
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(AppRoutes.PAYMENT)}
                        />
                      </div>
                      <div className={cls.user1DataItem}>
                        <SettingsIcon />
                        <p style={{ marginTop: '4px', fontSize: '12px' }}>{t('Settings')}</p>
                      </div>
                      <div
                        className={cls.user1DataItem}
                        style={{ fontSize: '12px', cursor: 'pointer' }}
                        onClick={handleOpenLogoutPopup}>
                        <Logout />
                        <p style={{ marginTop: '4px' }}>{t('Log out')}</p>
                      </div>
                    </div>
                  </div>
                  <div className={cls.user2Data}>
                    <div className={cls.user2DataItem}>
                      <p>{t('Plan')}:</p>
                      {tariffs.find(
                        (tariff: any) =>
                          tariff.external_id === customerData?.tariff?.tariff_external_id,
                      ) ? (
                        <p>
                          {
                            tariffs.find(
                              (tariff: any) =>
                                tariff.external_id === customerData?.tariff?.tariff_external_id,
                            ).title
                          }{' '}
                          ({formatDate(customerData?.tariff?.date_tariff_finish)})
                        </p>
                      ) : (
                        <p>{t('-')}</p>
                      )}
                    </div>
                    <div
                      className={cls.user2DataItem}
                      style={{ borderLeft: '1px solid #adadad', borderRight: '1px solid #adadad' }}>
                      <p>{t('Users')}:</p>
                      <p>
                        {teamCustomers?.length}/{customerData.limits?.total_token}
                      </p>
                    </div>
                    <div className={cls.user2DataItem}>
                      <p>{t('Profiles')}</p>
                      <p>
                        {profilesAll?.length}/{customerData.limits?.total_profile}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className={cls.team} onClick={openTeamDropdown}>
                <div className={cls.teamWrapper}>
                  {customerData.team?.avatar ? (
                    <img
                      src={customerData.team?.avatar}
                      alt="Team Avatar"
                      className={cls.avatarRadius}
                      width={35}
                      height={35}
                    />
                  ) : (
                    <UserIcon width={35} height={35} className={cls.avatarRadius} />
                  )}
                  {customerData.team?.title ? (
                    <div>
                      <p className={cls.teamTitle}>
                        {t('Team')}:{' '}
                        <span className={cls.teamTitle2}>{customerData.team?.title}</span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className={cls.teamTitle}>
                        {t('Team')}: <span className={cls.teamTitle2}>{t('No title')}</span>
                      </p>
                    </div>
                  )}
                </div>
                <ArrowDownWhite2Icon />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={cls.lang}>
        <LangSwitcher />
      </div>
      <div className={cls.decor}/>

      <ModalWindow modalWindowOpen={isOpenModalWindow} onClose={() => setIsOpenModalWindow(false)}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalLogoutHeaderTitle}>
            <p className={cls.modalLogoutTitle}>{t('Log out')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={() => setIsOpenModalWindow(false)} />
        </div>
        <div className={cls.modalLogoutContent}>
          <div className={cls.warningTextContent}>
            <p className={cls.warningText1}>{t('Do you really want to log out?')}</p>
          </div>
          <div className={cls.approveLogoutContent}>
            <button className={cls.btnCancel} onClick={() => setIsOpenModalWindow(false)}>
              {t('No')}
            </button>
            <button className={cls.btnApprove} onClick={handleLogout}>
              {t('Yes')}
            </button>
          </div>
        </div>
      </ModalWindow>
    </div>
  );
};
