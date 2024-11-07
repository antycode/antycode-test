import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import cls from '@/pages/TeamPage/components/TeamPage.module.scss';
import teamBackground2 from '@/shared/assets/icons/team-background-2.jpg';
import { ReactComponent as UserIcon } from '@/shared/assets/icons/user-icon.svg';
import clsx from 'clsx';
import { ReactComponent as EditIcon } from '@/shared/assets/icons/edit-icon.svg';
import { TeamPageHeader } from '@/pages/TeamPage/components/TeamPageHeader/TeamPageHeader';
import { useWorkspacesStore } from '@/features/workspace/store';
import { useTranslation } from 'react-i18next';
import { useRowSelection } from '@/shared/hooks';
import { TeamList } from '@/features/workspace/components/TeamList/TeamList';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { ReactComponent as ArrowDownWhite } from '@/shared/assets/icons/arrow-down-white.svg';
import { ReactComponent as NoticeIcon } from '@/shared/assets/icons/notice-icon.svg';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { fetchData } from '@/shared/config/fetch';
import { ReactComponent as CheckboxSortIcon } from '@/shared/assets/icons/checkbox-sort.svg';
import { ReactComponent as CheckboxSortSelectedIcon } from '@/shared/assets/icons/checkbox-sort-selected.svg';
import { setToken } from '@/store/reducers/AuthReducer';
import { useDispatch } from 'react-redux';
import { Loader } from '@/shared/components/Loader';

interface TeamProps {
  loaderIsActive: boolean;
  setLoaderIsActive: Dispatch<SetStateAction<boolean>>;
}

export const Team = (props: TeamProps) => {
  const { loaderIsActive, setLoaderIsActive } = props;

  const { t } = useTranslation();
  const {
    customerData,
    myTeams,
    setCustomerData,
    setMyTeams,
    verticals,
    setTeamCustomers,
    teamCustomers,
  } = useWorkspacesStore();

  const dispatch = useDispatch();

  const [activePages, setActivePages] = useState<[number, ...number[]]>([1]);
  const [firstLoad, setFirstLoad] = useState(false);

  const { selectedRows, selectRow, setSelectedRows } = useRowSelection();

  const [filteredUsers, setFilteredUsers] = useState<any[]>(teamCustomers);
  const [page, setPage] = useState<number>(1);

  const [customerName, setCustomerName] = useState<string>(customerData.customer?.nickname);
  const [customerTeamName, setCustomerTeamName] = useState<string>(customerData.team?.title);
  const [avatarBase64, setAvatarBase64] = useState<string>(customerData.customer?.avatar);
  const [teamAvatarBase64, setTeamAvatarBase64] = useState<string>(customerData.team?.avatar);
  const [teamBackgroundBase64, setTeamBackgroundBase64] = useState<string>(
    customerData.team?.background,
  );

  const [fileNameAvatar, setFileNameAvatar] = useState<string>(
    customerData.customer?.avatar ? 'Customer has an avatar' : '',
  );
  const [fileNameTeamAvatar, setFileNameTeamAvatar] = useState<string>(
    customerData.team?.avatar ? 'Team has an avatar' : '',
  );
  const [fileNameBack, setFileNameBack] = useState<string>(
    customerData.team?.background ? 'Team has a background' : '',
  );

  const [selectedVerticals, setSelectedVerticals] = useState<any[]>(customerData.team?.verticals);

  const fileInputAvatarRef: MutableRefObject<null> | any = useRef(null);
  const fileInputTeamAvatarRef: MutableRefObject<null> | any = useRef(null);
  const fileInputBackRef: MutableRefObject<null> | any = useRef(null);

  const [freeNick, setFreeNick] = useState<boolean | null>(null);
  const [freeTeamTitle, setFreeTeamTitle] = useState<boolean | null>(null);

  const [isOpenEditProfile, setIsOpenEditProfile] = useState<boolean>(false);

  const handleEditProfile = () => {
    setFileNameAvatar(customerData.customer?.avatar ? 'Customer has an avatar' : '');
    setFileNameTeamAvatar(customerData.team?.avatar ? 'Team has an avatar' : '');
    setFileNameBack(customerData.team?.background ? 'Team has a background' : '');
    setTeamBackgroundBase64(customerData.team?.background);
    setTeamAvatarBase64(customerData.team?.avatar);
    setAvatarBase64(customerData.customer?.avatar);
    setIsOpenEditProfile(true);
  };

  const closeEditProfilePopup = () => {
    setIsOpenEditProfile(false);
    setFileNameAvatar('');
    setFileNameTeamAvatar('');
    setFileNameBack('');
    setTeamBackgroundBase64('');
    setTeamAvatarBase64('');
    setAvatarBase64('');
    setCustomerName(customerData.customer?.nickname);
    setCustomerTeamName(customerData.team?.title);
  };

  const handleClickAvatar = (ev: any) => {
    ev.preventDefault();
    if (fileInputAvatarRef.current) {
      fileInputAvatarRef.current.click();
    }
  };

  const resetFileAvatar = (ev: any) => {
    ev.preventDefault();
    setFileNameAvatar('');
    setAvatarBase64('');
    fileInputAvatarRef.current.value = '';
  };

  const handleFileChangeAvatar = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileNameAvatar(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickTeamAvatar = (ev: any) => {
    ev.preventDefault();
    resetFileTeamAvatar(ev);
    if (fileInputTeamAvatarRef.current) {
      fileInputTeamAvatarRef.current.click();
    }
  };

  const resetFileTeamAvatar = (ev: any) => {
    ev.preventDefault();
    setFileNameTeamAvatar('');
    setTeamAvatarBase64('');
    fileInputTeamAvatarRef.current.value = '';
  };

  const handleFileChangeTeamAvatar = (event: any) => {
    const file = event.target.files[0];
    const teamId = localStorage.getItem('teamId');
    if (file) {
      setFileNameTeamAvatar(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamAvatarBase64(reader.result as string);
        const dataSubmit = {
          avatar_team: reader.result,
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
                handleRefetch();
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

  const handleClickBack = (ev: any) => {
    ev.preventDefault();
    resetFileBack(ev);
    if (fileInputBackRef.current) {
      fileInputBackRef.current.click();
    }
  };

  const resetFileBack = (ev: any) => {
    ev.preventDefault();
    setFileNameBack('');
    setTeamBackgroundBase64('');
    fileInputBackRef.current.value = '';
  };

  const handleFileChangeBack = (event: any) => {
    const file = event.target.files[0];
    const teamId = localStorage.getItem('teamId');
    if (file) {
      setFileNameBack(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamBackgroundBase64(reader.result as string);
        const dataSubmit = {
          background_team: reader.result,
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
                handleRefetch();
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

  const saveProfileData = () => {
    const teamId = localStorage.getItem('teamId');
    const dataSubmit = {
      nickname: customerName,
      title_team: customerTeamName,
      // avatar_customer: avatarBase64,
      // avatar_team: teamAvatarBase64,
      // background_team: teamBackgroundBase64,
      verticals: selectedVerticals,
    };
    fetchData({
      url: '/customer/is-free-nickname',
      method: 'POST',
      data: { nickname: dataSubmit.nickname },
    })
      .then((dataNickname: any) => {
        fetchData({
          url: '/customer/is-free-title-team',
          method: 'POST',
          data: { title_team: dataSubmit.title_team },
          team: teamId,
        })
          .then((dataTeamTitle: any) => {
            if (dataNickname.is_success && dataTeamTitle.is_success) {
              if (dataNickname.data.is_free) {
                setFreeNick(true);
              } else if (
                !dataNickname.data.is_free &&
                customerData?.customer?.nickname !== dataSubmit.nickname
              ) {
                setFreeNick(false);
              }
              if (dataTeamTitle.data.is_free) {
                setFreeTeamTitle(true);
              } else if (
                !dataTeamTitle.data.is_free &&
                customerData?.team?.title !== dataSubmit.title_team
              ) {
                setFreeTeamTitle(false);
              }
              if (
                (dataNickname.data.is_free && dataTeamTitle.data.is_free) ||
                (customerData?.team?.title !== dataSubmit.title_team &&
                  customerData?.customer?.nickname === dataSubmit.nickname) ||
                (customerData?.team?.title === dataSubmit.title_team &&
                  customerData?.customer?.nickname !== dataSubmit.nickname) ||
                (customerData?.team?.title === dataSubmit.title_team &&
                  customerData?.customer?.nickname === dataSubmit.nickname)
              ) {
                console.log('dataSubmit', dataSubmit);
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
                        handleRefetch();
                        closeEditProfilePopup();
                      }
                    }
                  })
                  .catch((err: Error) => {
                    console.log('/customer patch error: ', err);
                  });
              }
            }
          })
          .catch((err) => {
            console.log('/customer/is-free-title-team err post: ', err);
          });
      })
      .catch((err) => {
        console.log('/customer/is-free-nickname err post: ', err);
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
            setAvatarBase64(data?.data.customer.avatar);
            setTeamAvatarBase64(data?.data.team.avatar);
            setTeamBackgroundBase64(data?.data.team.background);
          }
        }
      })
      .catch((err: Error) => {
        console.log('/customer get error: ', err);
      });
  };

  const fetchTeamCustomers = () => {
    const teamId = localStorage.getItem('teamId');
    
    fetchData({ url: '/team/customers', method: 'GET', team: teamId })
      .then((data: any) => {
        console.log('customers', data);
        if (data.is_success) {
          setTeamCustomers(data?.data);
          setFilteredUsers(data?.data);
          setLoaderIsActive(false);
        }
      })
      .catch((err) => {
        console.log('Tariff', err);
      });
  };

  const fetchMyTeams = async () => {
    if(firstLoad) {
      setLoaderIsActive(true);
    }
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
        firstLoad
        setMyTeams(response.data);
        const localTeamId = localStorage.getItem('teamId');
        const teamFromList = response.data.find((i: any) => i.external_id === localTeamId);
        if (teamFromList) {
          return teamFromList.external_id;
        }
        setFirstLoad(false)
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

  const handleRefetch = () => {
    fetchMyTeams().then(() => {
      fetchCustomerData();
      fetchTeamCustomers();
    });
  };

  const handleVerticalSelect = (vertical: any) => {
    setSelectedVerticals((prevSelected) => {
      if (prevSelected.includes(vertical.external_id)) {
        return prevSelected.filter((id) => id !== vertical.external_id);
      } else {
        return [...prevSelected, vertical.external_id];
      }
    });
  };

  useEffect(() => {
    handleRefetch();
  }, []);

  return (
    <>
        <div className={cls.contentTeam}>
          <div className={cls.main}>
            <p className={cls.teamName}>
              {customerData.team?.title ? (
                <p className={cls.teamTitle}>{customerData.team?.title}</p>
              ) : (
                <p className={cls.teamTitle}>No title</p>
              )}
            </p>
            <div className={cls.teamBackground}>
              <div className={cls.imageWrapper}>
                <div
                  className={cls.teamImg}
                  style={{ backgroundImage: `url(${customerData.team?.background || teamBackground2})` }}
                />
                <span className={cls.editIcon} onClick={handleClickBack}>
                  <EditIcon />
                </span>
                <input
                  type="file"
                  accept=".jpg, .png"
                  ref={fileInputBackRef}
                  onChange={handleFileChangeBack}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className={cls.teamOwner}>
              <div className={cls.ownerInfo}>
                <div className={clsx(cls.teamOwnerAva)}>
                  {customerData.team?.avatar ? (
                    <img
                      src={customerData.team?.avatar}
                      alt="Team Avatar"
                      className={clsx(cls.avatarRadius, cls.teamOwnerAva)}
                      width={160}
                      height={160}
                    />
                  ) : (
                    <UserIcon
                      width={160}
                      height={160}
                      className={clsx(cls.avatarRadius, cls.teamOwnerAva)}
                    />
                  )}
                  <span className={cls.editIcon2} onClick={handleClickTeamAvatar}>
                    <EditIcon />
                  </span>
                  <input
                    type="file"
                    accept=".jpg, .png"
                    ref={fileInputTeamAvatarRef}
                    onChange={handleFileChangeTeamAvatar}
                    style={{ display: 'none' }}
                  />
                </div>
                <p className={cls.ownerNick}>
                  {t('Owner')}: {customerData.customer?.nickname}
                </p>
              </div>
              <div className={cls.editOwnerTeamBtns}>
                <div className={cls.verticals}>
                  <p className={cls.verticalsTitle}>{t('Verticals')}:</p>
                  {customerData.team?.verticals?.length > 0 ? (
                    <ul className={cls.verticalsList}>
                      {customerData.team?.verticals?.map((item: any, index: number) => (
                        <>
                          <li key={index}>
                            {verticals.length > 0 &&
                              verticals.find((vertical: any) => vertical.external_id === item)
                                .title}
                          </li>
                          {index < customerData.team?.verticals?.length - 1 && (
                            <span className={cls.slash}>/</span>
                          )}
                        </>
                      ))}
                    </ul>
                  ) : (
                    <p>{t('None')}</p>
                  )}
                </div>
                <button className={cls.editOwnerBtn} onClick={handleEditProfile}>
                  <span>
                    <EditIcon />
                  </span>
                  <p>{t('Edit profile')}</p>
                </button>
              </div>
            </div>
          </div>
          <div>
            <TeamPageHeader
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              filteredUsers={filteredUsers}
              setFilteredUsers={setFilteredUsers}
              setLoaderIsActive={setLoaderIsActive}
              setPage={setPage}
            />
            <TeamList
              activePages={activePages}
              setActivePages={setActivePages}
              selectedRows={selectedRows}
              selectRow={selectRow}
              setSelectedRows={setSelectedRows}
              filteredUsers={filteredUsers}
              setFilteredUsers={setFilteredUsers}
              page={page}
              setPage={setPage}
            />
          </div>
          <ModalWindow modalWindowOpen={isOpenEditProfile} onClose={closeEditProfilePopup}>
            <div className={cls.modalWindowHeader}>
              <span className={cls.freeSpace} />
              <div className={cls.modalDeleteHeaderTitle}>
                <p className={cls.modalDeleteTitle}>{t('Edit profile')}</p>
              </div>
              <CloseIcon className={cls.closeBtn} onClick={closeEditProfilePopup} />
            </div>
            <div className={cls.editProfileContainer}>
              <div className={cls.editProfileContent}>
                {/*<div className={cls.editTitleWrapper}>*/}
                {/*    <div className={cls.editProfileWrapper}>*/}
                {/*        <input*/}
                {/*            value={customerName}*/}
                {/*            onChange={(e) => {*/}
                {/*                setFreeNick(null);*/}
                {/*                setCustomerName(e.target.value);*/}
                {/*            }}*/}
                {/*            placeholder={t('Nickname')}*/}
                {/*            type='text'*/}
                {/*            maxLength={50}*/}
                {/*            className={cls.addUserInput}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    {freeNick === false && <p className={cls.formErrorMessage}>{t('Nickname is already taken')}</p>}*/}
                {/*</div>*/}
                <div className={cls.editTitleWrapper}>
                  <div className={cls.editProfileWrapper}>
                    <input
                      value={customerTeamName}
                      onChange={(e) => {
                        setFreeTeamTitle(null);
                        setCustomerTeamName(e.target.value);
                      }}
                      placeholder={t('Team title')}
                      type="text"
                      maxLength={50}
                      className={cls.addUserInput}
                    />
                  </div>
                  {freeTeamTitle === false && (
                    <p className={cls.formErrorMessage}>{t('Team title is already taken')}</p>
                  )}
                </div>
                <div className={cls.selectItemsWrapper} style={{ paddingTop: '10px' }}>
                  <p className={cls.verticalsTitle} style={{ marginBottom: '15px' }}>
                    {t('Select verticals')}:
                  </p>
                  <div className={cls.selectItems}>
                    {verticals &&
                      verticals.length > 0 &&
                      verticals.map((vertical: any, index: number) => (
                        <div
                          className={cls.selectItem}
                          key={index}
                          onClick={() => handleVerticalSelect(vertical)}>
                          <p className={cls.tagText}>{vertical.title}</p>
                          {selectedVerticals.length > 0 &&
                          selectedVerticals.includes(vertical.external_id) ? (
                            <CheckboxSortSelectedIcon className={cls.checkboxSelected} />
                          ) : (
                            <CheckboxSortIcon />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                {/*    <div className={cls.rowField}>*/}
                {/*        <div className={cls.fieldFile}>*/}
                {/*            <div className={cls.importFileContent}>*/}
                {/*                {fileNameAvatar && (*/}
                {/*                    <div className={cls.fileName}>*/}
                {/*                        {t(fileNameAvatar)}*/}
                {/*                    </div>*/}
                {/*                )}*/}
                {/*                <button*/}
                {/*                    className={cls.importFileBtn}*/}
                {/*                    onClick={fileNameAvatar == '' ? handleClickAvatar : resetFileAvatar}*/}
                {/*                >*/}
                {/*                    {fileNameAvatar == '' ? t('Upload avatar') : t('Delete')}*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*            <input*/}
                {/*                ref={fileInputAvatarRef}*/}
                {/*                id="file_picker_avatar"*/}
                {/*                type="file"*/}
                {/*                accept=".jpg, .png"*/}
                {/*                onChange={(ev: any) => {*/}
                {/*                    handleFileChangeAvatar(ev);*/}
                {/*                }}*/}
                {/*                style={{display: "none"}}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className={cls.rowField}>*/}
                {/*        <div className={cls.fieldFile}>*/}
                {/*            <div className={cls.importFileContent}>*/}
                {/*                {fileNameTeamAvatar && (*/}
                {/*                    <div className={cls.fileName}>*/}
                {/*                        {t(fileNameTeamAvatar)}*/}
                {/*                    </div>*/}
                {/*                )}*/}
                {/*                <button*/}
                {/*                    className={cls.importFileBtn}*/}
                {/*                    onClick={fileNameTeamAvatar == '' ? handleClickTeamAvatar : resetFileTeamAvatar}*/}
                {/*                >*/}
                {/*                    {fileNameTeamAvatar == '' ? t('Upload team avatar') : t('Delete')}*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*            <input*/}
                {/*                ref={fileInputTeamAvatarRef}*/}
                {/*                id="file_picker_team_avatar"*/}
                {/*                type="file"*/}
                {/*                accept=".jpg, .png"*/}
                {/*                onChange={(ev: any) => {*/}
                {/*                    handleFileChangeTeamAvatar(ev);*/}
                {/*                }}*/}
                {/*                style={{display: "none"}}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className={cls.rowField}>*/}
                {/*        <div className={cls.fieldFile}>*/}
                {/*            <div className={cls.importFileContent}>*/}
                {/*                {fileNameBack && (*/}
                {/*                    <div className={cls.fileName}>*/}
                {/*                        {t(fileNameBack)}*/}
                {/*                    </div>*/}
                {/*                )}*/}
                {/*                <button*/}
                {/*                    className={cls.importFileBtn}*/}
                {/*                    onClick={fileNameBack == '' ? handleClickBack : resetFileBack}*/}
                {/*                >*/}
                {/*                    {fileNameBack == '' ? t('Upload team background') : t('Delete')}*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*            <input*/}
                {/*                ref={fileInputBackRef}*/}
                {/*                id="file_picker_back"*/}
                {/*                type="file"*/}
                {/*                accept=".jpg, .png"*/}
                {/*                onChange={(ev: any) => {*/}
                {/*                    handleFileChangeBack(ev);*/}
                {/*                }}*/}
                {/*                style={{display: "none"}}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </div>*/}
              </div>
              <div className={cls.editProfileBtnWrapper}>
                <button className={cls.editProfileBtn} onClick={saveProfileData}>
                  {t('Save')}
                </button>
              </div>
            </div>
          </ModalWindow>
        </div>
    </>
  );
};
