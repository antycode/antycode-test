import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import clsx from 'clsx';
import {Button} from '@/shared/components/Button';
import cls from './TeamPageHeader.module.scss';
import {useDispatch, useSelector} from "react-redux";
import clsBtn from "@/shared/components/Button/Button.module.scss";
import {ReactComponent as IconPlusCircle} from "@/shared/assets/icons/plus-circle.svg";
import {ReactComponent as CloseIcon} from '@/shared/assets/icons/close.svg';
import {ReactComponent as IconTrash} from '@/shared/assets/icons/trash.svg';
import {ReactComponent as IconEdit} from '@/shared/assets/icons/edit.svg';
import {ReactComponent as UsersIcon} from '@/shared/assets/icons/users-icon.svg';
import {ReactComponent as SearchIcon} from '@/shared/assets/icons/search.svg';
import {ReactComponent as NoticeIcon} from '@/shared/assets/icons/notice-icon.svg';
import {ReactComponent as ArrowDownWhite} from '@/shared/assets/icons/arrow-down-white.svg';
import {ModalWindow2} from "@/shared/components/ModalWindow2/ModalWindow2";
import {fetchData} from "@/shared/config/fetch";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {use} from "i18next";
import {ReactComponent as TrashIcon1} from "@/shared/assets/icons/trash-icon-1.svg";
import {ModalWindow} from "@/shared/components/ModalWindow/ModalWindow";
import {useWorkspacesStore} from "@/features/workspace/store";
import {setToken} from "@/store/reducers/AuthReducer";
import {ReactComponent as Arrow2Left} from "@/shared/assets/icons/arrow-2-left.svg";
import {SidebarMode} from "@/shared/const/context";
import {SidebarModeContext, SidebarModeContextType} from "@/shared/context/SidebarModeContext";
import {AppRoutes} from "@/shared/const/router";
import {useNavigate} from "react-router-dom";
import {Loader} from "@/shared/components/Loader";

enum ButtonTypes {
    deleteIcon = 'btnDeleteIcon',
    addUser = 'btnAddUser',
}

interface TeamPageHeaderProps {
    selectedRows: Set<string>;
    setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
    filteredUsers: any[];
    setFilteredUsers: Dispatch<SetStateAction<any[]>>;
    setLoaderIsActive: Dispatch<SetStateAction<boolean>>;
    setPage: Dispatch<SetStateAction<number>>;
}

export const TeamPageHeader = (props: TeamPageHeaderProps) => {
    const { selectedRows, setSelectedRows, filteredUsers, setFilteredUsers, setLoaderIsActive, setPage } = props;
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const platform = useSelector((state: any) => state.platformReducer.platform);
    const { positions, setCustomerData, setTeamCustomers, teamCustomers, setMyTeams, customerData, myTeams } = useWorkspacesStore();

    const {sidebarMode, setSidebarMode} = useContext(SidebarModeContext) as SidebarModeContextType;
    const isMiniSidebar = sidebarMode === SidebarMode.MINI;

    const [isOpenErrorTariff, setIsOpenErrorTariff] = useState<boolean>(false);

    const dropdownRoleAddRef = useRef<HTMLDivElement | null>(null);
    const dropdownProfilesAddRef = useRef<HTMLDivElement | null>(null);
    const dropdownProxiesAddRef = useRef<HTMLDivElement | null>(null);

    const dropdownRoleEditRef = useRef<HTMLDivElement | null>(null);
    const dropdownProfilesEditRef = useRef<HTMLDivElement | null>(null);
    const dropdownProxiesEditRef = useRef<HTMLDivElement | null>(null);

    const [isOpenAddUserPopup, setIsOpenAddUserPopup] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [isOpenDeleteUsersPopup, setIsOpenDeleteUsersPopup] = useState<boolean>(false);
    const [isOpenDropdownTitle, setIsOpenDropdownTitle] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [transferProfiles, setTransferProfiles] = useState<boolean>(false);
    const [transferProxies, setTransferProxies] = useState<boolean>(false);
    const [tariffError, setTariffError] = useState<boolean>(false);

    const [isOpenEditUsersPopup, setIsOpenEditUsersPopup] = useState<boolean>(false);
    const [selectedEditUsers, setSelectedEditUsers] = useState<any[]>([]);
    const [selectedNicksUsers, setSelectedNicksUsers] = useState<string>('');

    const [freeNick, setFreeNick] = useState<boolean | null>(null);
    const [filterNick, setFilterNick] = useState<any[]>([]);
    const [filterNickLoader, setFilterNickLoader] = useState<boolean>(false);
    const [inputDisabled, setInputDisabled] = useState<boolean>(false);

    const [searchUsersVal, setSearchUsersVal] = useState<string>('');

    const transferBoolean = [true, false];

    const handleAddUser = () => {
        setIsOpenAddUserPopup(true);
    };

    const closeAddUserPopup = () => {
        setUserName('');
        setIsOpenAddUserPopup(false);
        setSelectedRole(null);
        setTransferProfiles(false);
        setTransferProxies(false);
        setIsOpenDropdownTitle('');
        setTariffError(false);
        setFilterNick([]);
    };

    const closeEditUsersPopup = () => {
        setSelectedRows(new Set());
        setIsOpenEditUsersPopup(false);
        setSelectedRole(null);
        setTransferProfiles(false);
        setTransferProxies(false);
        setIsOpenDropdownTitle('');
    };

    const openEditUsersPopup = () => {
        if (selectedRows.size > 0) {
            setSelectedEditUsers(Array.from(selectedRows));
            const selectedUsers = teamCustomers
                .filter((customer: any) => selectedRows.has(customer.external_id))
                .map((customer: any) => customer.nickname);
            setSelectedNicksUsers(selectedUsers.join(', '));
            setIsOpenEditUsersPopup(true);
        }
    };

    const openDeleteUsersPopup = () => {
        setSelectedEditUsers(Array.from(selectedRows));
        setIsOpenDeleteUsersPopup(true);
    };

    const closeDeleteUsersPopup = () => {
        setIsOpenDeleteUsersPopup(false);
        setSelectedEditUsers([]);
        setSelectedRows(new Set());
    };

    const toggleDropdown = (title: string) => {
        setIsOpenDropdownTitle((prevTitle) => (prevTitle === title ? '' : title));
    };

    const selectRole = (i: any) => {
        setSelectedRole(i);
        setIsOpenDropdownTitle('');
    };

    const selectProfiles = (i: boolean) => {
        setTransferProfiles(i);
        setIsOpenDropdownTitle('');
    };

    const selectProxies = (i: boolean) => {
        setTransferProxies(i);
        setIsOpenDropdownTitle('');
    };

    const addUser = () => {
        if (userName.length > 0) {
            const teamId = localStorage.getItem('teamId');
            const dataSubmit = {
                position_external_id: selectedRole ? selectedRole.external_id : '',
                nickname: userName,
                is_can_transfer_proxy: transferProxies,
                is_can_transfer_profile: transferProfiles,
            };
            // console.log('dataSubmit', dataSubmit);
            // fetchData({ url: `/team`, method: 'POST', data: dataSubmit, team: teamId })
            //     .then((data: any) => {
            //         console.log('add user', data);
            //         if (data.is_success) {
            //             if (data.data) {
            //                 handleRefetch();
            //                 closeAddUserPopup();
            //             }
            //         } else if (data.errorCode === 20) {
            //             setTariffError(true);
            //         }
            //     })
            //     .catch((err: Error) => {
            //         console.log('/team post error: ', err);
            //     });
            fetchData({url: '/customer/is-free-nickname', method: 'POST', data: {nickname: dataSubmit.nickname}}).then((dataNickname: any) => {
                if (dataNickname.is_success) {
                    if (dataNickname.data.is_free) {
                        setFreeNick(true);
                    } else {
                        console.log('dataSubmit', dataSubmit);
                        fetchData({ url: `/team`, method: 'POST', data: dataSubmit, team: teamId })
                            .then((data: any) => {
                                console.log('add user', data);
                                if (data.is_success) {
                                    if (data.data) {
                                        handleRefetch();
                                        closeAddUserPopup();
                                    }
                                } else if (data.errorCode === 20) {
                                    setTariffError(true);
                                }
                            })
                            .catch((err: Error) => {
                                console.log('/team post error: ', err);
                            });
                    }
                }
            }).catch((err) => {
                console.log('/customer/is-free-nickname err post: ', err);
            });
        }
    };

    const editUsers = async () => {
        const teamId = localStorage.getItem('teamId');
        for (const i of selectedEditUsers) {
            const nick = teamCustomers.find((customer: any) => customer.external_id === i).nickname;
            const customerIsConfirmed = teamCustomers.find((customer: any) => customer.external_id === i).is_confirmed;
            let dataSubmit: any;
            if (selectedRole) {
                dataSubmit = {
                    position_external_id: selectedRole.external_id,
                    is_can_transfer_proxy: transferProxies,
                    is_can_transfer_profile: transferProfiles,
                };
            } else {
                dataSubmit = {
                    is_can_transfer_proxy: transferProxies,
                    is_can_transfer_profile: transferProfiles,
                };
            }

            try {
                const data = await fetchData({ url: `/team/${i}`, method: 'PATCH', data: dataSubmit, team: teamId });
                console.log('Edit user', data);
                if (data.is_success) {
                    console.log(`Edit user via id ${i} is success`);
                }
            } catch (err) {
                console.log('/team post error: ', err);
            }
        }

        await handleRefetch();
        await closeEditUsersPopup();
    };

    const deleteUsers = async () => {
        const teamId = localStorage.getItem('teamId');
        await setLoaderIsActive(true);
        await closeDeleteUsersPopup();
        for (const i of selectedEditUsers) {
            try {
                const data = await fetchData({ url: `/team/${i}`, method: 'DELETE', team: teamId });
                console.log('Delete user', data);
                if (data.is_success) {
                    console.log(`Delete user via id ${i} is success`);
                }
            } catch (err) {
                console.log('/team Delete user error: ', err);
            }
        }

        await setSelectedRows(new Set());
        await handleRefetch();
        await setLoaderIsActive(false);
    };

    const filterUsersBySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchUsersVal(searchValue);

        const filtered = teamCustomers.filter((customer) => {
            const nicknameMatch = customer.nickname.toLowerCase().includes(searchValue);

            const position = positions.find(pos => pos.external_id === customer.position_external_id);
            const positionTitle = position ? position.title.toLowerCase() : '';
            const positionMatch = positionTitle.includes(searchValue);

            return nicknameMatch || positionMatch;
        });

        setFilteredUsers(filtered);
        setPage(1);
    };

    const fetchCustomerData = () => {
        const teamId = localStorage.getItem('teamId');
        fetchData({url: `/customer`, method: 'GET', team: teamId}).then((data: any) => {
            console.log('customer data', data)
            if (data.is_success) {
                if (data.data) {
                    setCustomerData(data?.data);
                }
            }
        }).catch((err: Error) => {
            console.log('/customer get error: ', err);
        })
    };

    const fetchTeamCustomers = () => {
        const teamId = localStorage.getItem('teamId');
        fetchData({url: '/team/customers', method: 'GET', team: teamId}).then((data: any) => {
            console.log('customers', data);
            if (data.is_success) {
                setTeamCustomers(data?.data);
                setFilteredUsers(data?.data);
            }
        }).catch((err) => {
            console.log('Tariff', err);
        });
    };

    const fetchMyTeams = async () => {
        try {
            const response = await fetchData({url: '/team/my-teams', method: 'GET'});
            if (response.errorCode === 7 && response.errorMessage && response.errorMessage.includes('not found')) {
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

    const handleRefetch = () => {
        fetchMyTeams().then(() => {
            fetchCustomerData();
            fetchTeamCustomers();
        });
    };

    const handleMenuClick = () => {
        setSidebarMode((prev) =>
            prev === SidebarMode.FULL ? SidebarMode.MINI : SidebarMode.FULL
        );
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
        } else if (selectedTeam && selectedTeam.is_confirmed && selectedTeam.limits?.total_profile > 0) {
            return true;
        }
        return false;
    };

    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const fetchNicknames = useCallback((nickname: string) => {
        setInputDisabled(true);
        const teamId = localStorage.getItem('teamId');
        fetchData({ url: '/customer/filter-nickname', method: 'POST', data: { nickname }, team: teamId })
            .then((data: any) => {
                console.log('customer/filter-nickname', data);
                if (data.is_success) {
                    setFilterNick([...data?.data]);
                }
                setInputDisabled(false);
                setFilterNickLoader(false);
            })
            .catch((err) => {
                console.log('customer/filter-nickname', err);
                setInputDisabled(false);
                setFilterNickLoader(false);
            });
    }, []);

    const debouncedFetchNicknames = useCallback(
        debounce((nickname: string) => fetchNicknames(nickname), 2000),
        [fetchNicknames]
    );

    const handleInputNick = (e: any) => {
        const value = e.target.value;
        setUserName(value);
        setFreeNick(null);
        setFilterNick([]);

        if (value.length > 0) {
            setFilterNickLoader(true);
            debouncedFetchNicknames(value);
        } else {
            setFilterNickLoader(false);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            (dropdownRoleAddRef.current && !dropdownRoleAddRef.current.contains(event.target as Node)) &&
            (dropdownProfilesAddRef.current && !dropdownProfilesAddRef.current.contains(event.target as Node)) &&
            (dropdownProxiesAddRef.current && !dropdownProxiesAddRef.current.contains(event.target as Node)) &&
            (dropdownRoleEditRef.current && !dropdownRoleEditRef.current.contains(event.target as Node)) &&
            (dropdownProfilesEditRef.current && !dropdownProfilesEditRef.current.contains(event.target as Node)) &&
            (dropdownProxiesEditRef.current && !dropdownProxiesEditRef.current.contains(event.target as Node))
        ) {
            setIsOpenDropdownTitle('');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={cls.autoregHeader}>
            <div className={cls.actions}>
                {/*<div>*/}
                {/*    <button className={cls.btnSidebar} onClick={handleMenuClick}>*/}
                {/*        <Arrow2Left style={isMiniSidebar ? {marginLeft: '1px'} : {marginLeft: '-1px'}} className={isMiniSidebar ? cls.arrowDeg : undefined} />*/}
                {/*    </button>*/}
                {/*</div>*/}
                <Button
                    className={clsx(cls[ButtonTypes.addUser], clsBtn.btnCreate)}
                    color="primary"
                    onClick={() => {
                        if (checkTariff()) {
                            openEditUsersPopup();
                        } else {
                            setIsOpenErrorTariff(true);
                        }
                    }}
                    leftIcon={
                        <IconEdit width={18} height={18} style={{marginRight: '2px'}}/>
                    }
                >
                    <p className={clsx(clsBtn.btnCreateText, platform === 'Windows' ? clsBtn.btnCreateTextWin : '')}>{t('Edit')}</p>
                </Button>
                <Button
                    className={clsx(cls[ButtonTypes.addUser], clsBtn.btnCreate)}
                    color="primary"
                    onClick={() => {
                        if (checkTariff()) {
                            openDeleteUsersPopup();
                        } else {
                            setIsOpenErrorTariff(true);
                        }
                    }}
                    leftIcon={
                        <IconTrash width={18} height={18} style={{marginRight: '2px'}}/>
                    }
                >
                    <p className={clsx(clsBtn.btnCreateText, platform === 'Windows' ? clsBtn.btnCreateTextWin : '')}>{t('Delete')}</p>
                </Button>
                <div className={cls.findUserWrapper}>
                    <input
                        value={searchUsersVal}
                        onChange={(e) => filterUsersBySearch(e)}
                        placeholder={t('search by users in a team...')}
                        type='text'
                        className={cls.findUserInput}
                    />
                    <SearchIcon/>
                </div>
                <Button
                    className={clsx(cls[ButtonTypes.addUser], clsBtn.btnCreate)}
                    color="primary"
                    onClick={() => {
                        if (checkTariff()) {
                            handleAddUser();
                        } else {
                            setIsOpenErrorTariff(true);
                        }
                    }}
                    leftIcon={
                        <IconPlusCircle width={18} height={18} style={{marginRight: '2px'}}/>
                    }
                >
                    <p className={clsx(clsBtn.btnCreateText, platform === 'Windows' ? clsBtn.btnCreateTextWin : '')}>{t('Add user')}</p>
                </Button>
            </div>
            <ModalWindow modalWindowOpen={isOpenAddUserPopup} onClose={closeAddUserPopup}>
                <div className={cls.modalWindowHeader}>
                    <span className={cls.freeSpace}/>
                    <div className={cls.modalDeleteHeaderTitle}>
                        <p className={cls.modalDeleteTitle}>{t('Adding / setting up access rights')}</p>
                    </div>
                    <CloseIcon className={cls.closeBtn} onClick={closeAddUserPopup}/>
                </div>
                <div className={cls.addUserContainer}>
                    <div className={cls.addUserNickname}>
                        <div className={clsx(cls.addUserWrapper, filterNick.length > 0 && cls.addUserWrapperActive)}>
                            <input
                                value={userName}
                                onChange={(e) => {
                                    handleInputNick(e);
                                }}
                                disabled={inputDisabled}
                                placeholder={t('Nickname')}
                                type='text'
                                maxLength={50}
                                className={cls.addUserInput}
                            />
                        </div>
                        {freeNick && <p className={cls.formErrorMessage}>{t('Nickname does not exist')}</p>}
                        {filterNick.length > 0 && (
                            <ul className={cls.dropdownListNicks}>
                                {filterNick.map((i, index) => (
                                    <li key={index} className={cls.dropdownItem}
                                        onClick={() => {
                                            setUserName(i);
                                            setFilterNick([]);
                                        }}
                                    >
                                        {i}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className={cls.transfer}>
                        <div className={cls.transferItem}>
                            <p className={cls.transferText}>{t('User role')}</p>
                            <div className={cls.dropdown} ref={dropdownRoleAddRef}>
                                <div
                                    className={clsx(cls.dropdownMain, isOpenDropdownTitle === 'role' && cls.dropdownActive)}
                                    onClick={() => toggleDropdown('role')}
                                >
                                    {selectedRole !== null
                                        ? <p>{t(`${selectedRole.title}`)}</p>
                                        : <p>- {t('Select a role from the list')} -</p>
                                    }
                                    <ArrowDownWhite/>
                                </div>
                                {isOpenDropdownTitle === 'role' && (
                                    <ul className={cls.dropdownList}>
                                        {positions.map((i, index) => (
                                            <li key={index} className={cls.dropdownItem}
                                                onClick={() => selectRole(i)}>
                                                {t(`${i.title}`)}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className={cls.transferItem}>
                            <p className={cls.transferText}>{t('Access to profiles')}</p>
                            <div className={cls.dropdown} ref={dropdownProfilesAddRef}>
                                <div
                                    className={clsx(cls.dropdownMain, isOpenDropdownTitle === 'profiles' && cls.dropdownActive)}
                                    onClick={() => toggleDropdown('profiles')}
                                >
                                    {transferProfiles
                                        ? <p>{t('Allow')}</p>
                                        : <p>{t('Denied')}</p>
                                    }
                                    <ArrowDownWhite/>
                                </div>
                                {isOpenDropdownTitle === 'profiles' && (
                                    <ul className={cls.dropdownList}>
                                        {transferBoolean.map((i, index) => (
                                            <li key={index} className={cls.dropdownItem}
                                                onClick={() => selectProfiles(i)}>
                                                {i
                                                    ? <p>{t('Allow')}</p>
                                                    : <p>{t('Denied')}</p>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className={cls.transferItem}>
                            <p className={cls.transferText}>{t('Access to proxies')}</p>
                            <div className={cls.dropdown} ref={dropdownProxiesAddRef}>
                                <div
                                    className={clsx(cls.dropdownMain, isOpenDropdownTitle === 'proxies' && cls.dropdownActive)}
                                    onClick={() => toggleDropdown('proxies')}
                                >
                                    {transferProxies
                                        ? <p>{t('Allow')}</p>
                                        : <p>{t('Denied')}</p>
                                    }
                                    <ArrowDownWhite/>
                                </div>
                                {isOpenDropdownTitle === 'proxies' && (
                                    <ul className={cls.dropdownList}>
                                        {transferBoolean.map((i, index) => (
                                            <li key={index} className={cls.dropdownItem}
                                                onClick={() => selectProxies(i)}>
                                                {i
                                                    ? <p>{t('Allow')}</p>
                                                    : <p>{t('Denied')}</p>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={cls.addUserBtnWrapper}>
                        {tariffError &&
                        <p style={{color: "red"}}>{t('Your tariff does not allow you to add a user')}</p>}
                        <button className={cls.addUserBtn} onClick={addUser}>
                            <NoticeIcon/>
                            <p>{t('Send a request to the user')}</p>
                        </button>
                    </div>
                    {filterNickLoader && (<Loader size={75} addUserPopup={true} />)}
                </div>
            </ModalWindow>
            <ModalWindow modalWindowOpen={isOpenEditUsersPopup} onClose={closeEditUsersPopup}>
                <div className={cls.modalWindowHeader}>
                    <span className={cls.freeSpace}/>
                    <div className={cls.modalDeleteHeaderTitle}>
                        <p className={cls.modalDeleteTitle}>{t('Adding / setting up access rights')}</p>
                    </div>
                    <CloseIcon className={cls.closeBtn} onClick={closeEditUsersPopup}/>
                </div>
                <div className={cls.addUserContainer}>
                    <div className={cls.addUserNickname}>
                        <div className={cls.addUserWrapper}>
                            <input
                                value={selectedNicksUsers}
                                onChange={(e) => setUserName(e.target.value)}
                                type='text'
                                disabled
                                className={cls.editUsersInput}
                            />
                        </div>
                    </div>
                    <div className={cls.transfer}>
                        <div className={cls.transferItem}>
                            <p className={cls.transferText}>{t('User role')}</p>
                            <div className={cls.dropdown} ref={dropdownRoleEditRef}>
                                <div
                                    className={clsx(cls.dropdownMain, isOpenDropdownTitle === 'role' && cls.dropdownActive)}
                                    onClick={() => toggleDropdown('role')}
                                >
                                    {selectedRole !== null
                                        ? <p>{t(`${selectedRole.title}`)}</p>
                                        : <p>- {t('Select a role from the list')} -</p>
                                    }
                                    <ArrowDownWhite/>
                                </div>
                                {isOpenDropdownTitle === 'role' && (
                                    <ul className={cls.dropdownList}>
                                        {positions.map((i, index) => (
                                            <li key={index} className={cls.dropdownItem}
                                                onClick={() => selectRole(i)}>
                                                {t(`${i.title}`)}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className={cls.transferItem}>
                            <p className={cls.transferText}>{t('Access to profiles')}</p>
                            <div className={cls.dropdown} ref={dropdownProfilesEditRef}>
                                <div
                                    className={clsx(cls.dropdownMain, isOpenDropdownTitle === 'profiles' && cls.dropdownActive)}
                                    onClick={() => toggleDropdown('profiles')}
                                >
                                    {transferProfiles
                                        ? <p>{t('Allow')}</p>
                                        : <p>{t('Denied')}</p>
                                    }
                                    <ArrowDownWhite/>
                                </div>
                                {isOpenDropdownTitle === 'profiles' && (
                                    <ul className={cls.dropdownList}>
                                        {transferBoolean.map((i, index) => (
                                            <li key={index} className={cls.dropdownItem}
                                                onClick={() => selectProfiles(i)}>
                                                {i
                                                    ? <p>{t('Allow')}</p>
                                                    : <p>{t('Denied')}</p>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className={cls.transferItem}>
                            <p className={cls.transferText}>{t('Access to proxies')}</p>
                            <div className={cls.dropdown} ref={dropdownProxiesEditRef}>
                                <div
                                    className={clsx(cls.dropdownMain, isOpenDropdownTitle === 'proxies' && cls.dropdownActive)}
                                    onClick={() => toggleDropdown('proxies')}
                                >
                                    {transferProxies
                                        ? <p>{t('Allow')}</p>
                                        : <p>{t('Denied')}</p>
                                    }
                                    <ArrowDownWhite/>
                                </div>
                                {isOpenDropdownTitle === 'proxies' && (
                                    <ul className={cls.dropdownList}>
                                        {transferBoolean.map((i, index) => (
                                            <li key={index} className={cls.dropdownItem}
                                                onClick={() => selectProxies(i)}>
                                                {i
                                                    ? <p>{t('Allow')}</p>
                                                    : <p>{t('Denied')}</p>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={cls.addUserBtnWrapper}>
                        {tariffError &&
                        <p style={{color: "red"}}>{t('Your tariff does not allow you to add a user')}</p>}
                        <button className={cls.addUserBtn} onClick={editUsers}>
                            <NoticeIcon/>
                            <p>{t('Send a request to the users')}</p>
                        </button>
                    </div>
                </div>
            </ModalWindow>
            <ModalWindow modalWindowOpen={isOpenDeleteUsersPopup} onClose={closeDeleteUsersPopup}>
                <div className={cls.modalWindowHeader}>
                    <span className={cls.freeSpace}/>
                    <div className={cls.modalDeleteHeaderTitle}>
                        <TrashIcon1/>
                        <p className={cls.modalDeleteTitle}>{t('Delete users')}</p>
                    </div>
                    <CloseIcon className={cls.closeBtn} onClick={closeDeleteUsersPopup}/>
                </div>
                <div className={cls.modalDeleteContent}>
                    <div className={cls.warningTextContent}>
                        <p className={cls.warningText1}>{t('Are you sure you want to delete the selected users?')}</p>
                        <p className={cls.warningText2}>{t('Deleted files will be moved to the trash')}</p>
                    </div>
                    <div className={cls.approveDeleteContent}>
                        <button className={cls.btnCancelDeleteToken}
                                onClick={closeDeleteUsersPopup}>{t('Cancel')}</button>
                        <button className={cls.btnDelete} onClick={() => deleteUsers()}>{t('Delete')}</button>
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
                    <button className={cls.btnApproveModalWindow} style={{margin: '0 20px 20px 20px'}} onClick={() => navigate(AppRoutes.PAYMENT)}>{t('Buy plan')}</button>
                </div>
            </ModalWindow>
        </div>
    );
};