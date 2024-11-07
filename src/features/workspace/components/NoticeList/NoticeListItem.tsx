import React, {Dispatch, memo, SetStateAction, useState} from 'react';
import {Table} from '@/shared/components/Table/Table';
import cls from './NoticeList.module.scss';
import {User} from '../../../user/types';
import {Checkbox} from '@/shared/components/Checkbox/Checkbox';
import {ReactComponent as IconUser1} from '@/shared/assets/icons/user1.svg';
import {useTranslation} from "react-i18next";
import clsx from "clsx";
import {fetchData} from "@/shared/config/fetch";
import {useUsersStore} from "@/features/user/store";
import tableCls from "@/shared/components/Table/Table.module.scss";
import {formatDateShorter} from "@/shared/utils";
import {ReactComponent as Cross2Icon} from "@/shared/assets/icons/cross2.svg";
import {Button} from "@/shared/components/Button";
import {ReactComponent as TrashIcon1} from "@/shared/assets/icons/trash-icon-1.svg";
import {ReactComponent as CloseIcon} from "@/shared/assets/icons/close.svg";
import {ModalWindow} from "@/shared/components/ModalWindow/ModalWindow";
import {useWorkspacesStore} from "@/features/workspace/store";
import {ReactComponent as ArrowDownWhite} from "@/shared/assets/icons/arrow-down-white.svg";
import {ReactComponent as NoticeIcon} from "@/shared/assets/icons/notice-icon.svg";
import {setToken} from "@/store/reducers/AuthReducer";
import {useDispatch} from "react-redux";
import {LOCAL_STORAGE_LOCALE_KEY} from "@/shared/const/localStorage";
import {AppRoutes} from "@/shared/const/router";
import {useNavigate} from "react-router-dom";

interface NoticeListItemProps {
    item: any;
    isSelected: boolean;
    selectRow: (id: string, isSelected: boolean) => void;
    selectedRows: Set<string>,
    setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>
}

export const NoticeListItem = memo(
    ({
         item,
         isSelected,
         selectRow,
         selectedRows,
         setSelectedRows
     }: NoticeListItemProps) => {
        const {external_id} = item
        const {t} = useTranslation();

        const dispatch = useDispatch();

        const navigate = useNavigate();

        const {
            setTeamCustomers,
            teamCustomers,
            positions,
            setMyTeams,
            setCustomerData,
            myTeams,
            customerData,
            setNotifications,
            filteredNotice, setFilteredNotice
        } = useWorkspacesStore();

        const [isOpenAddingTeamPopup, setIsOpenAddingTeamPopup] = useState<boolean>(false);

        const dataTeam = myTeams.filter((i: any) => i.external_id === item.workspace_external_id)[0] || null;

        const openAddingTeamPopup = () => {
            setIsOpenAddingTeamPopup(true);
        };

        const closeAddingTeamPopup = () => {
            setIsOpenAddingTeamPopup(false);
        };

        const setInvite = (confirm: boolean) => {
            const teamId = localStorage.getItem('teamId');
            const dataSubmit = {
                is_confirmed: confirm
            };
            const customerId = dataTeam?.external_id;
            fetchData({url: `/team/${customerId}`, method: 'PATCH', data: dataSubmit, team: teamId})
                .then((data: any) => {
                    console.log('Confirm add to team user', data);
                    if (data.is_success) {
                        if (data.data) {
                            fetchData({
                                url: `/notification/${item.external_id}`,
                                method: 'DELETE',
                                team: teamId
                            }).then((dataDeleteNotice: any) => {
                                console.log('Confirm delete notice', dataDeleteNotice);
                                if (dataDeleteNotice.is_success) {
                                    handleRefetch();
                                }
                            }).catch((err: Error) => {
                                console.log('/Confirm delete notice error: ', err);
                            });
                        }
                    }
                })
                .catch((err: Error) => {
                    console.log('/team patch error: ', err);
                });
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
                }
            }).catch((err) => {
                console.log('Tariff', err);
            });
        };

        const fetchNotification = () => {
            const lang = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);
            const teamId = localStorage.getItem('teamId');
            const urlApi = lang === 'ru' ? '/notification' : `/${lang}/notification`;
            fetchData({url: urlApi, method: 'GET', team: teamId}).then((data: any) => {
                console.log('notification', data);
                if (data.is_success) {
                    setNotifications(data?.data);
                    setFilteredNotice(data?.data);
                }
            }).catch((err) => {
                console.log('notification', err);
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
                    return {is_success: false};
                }
            } catch (error) {
                console.error('Error fetching my teams:', error);
                return {is_success: false};
            }
        };

        const handleRefetch = () => {
            fetchMyTeams().then(() => {
                fetchCustomerData();
                fetchTeamCustomers();
                fetchNotification();
            });
        };

        return (
            <div>
                <Table.Row isSelected={isSelected}>
                    <Table.Col className={cls.colCheck}>
                        <Checkbox
                            checked={isSelected}
                            onChange={(e) => selectRow(external_id, e.currentTarget.checked)}
                        />
                    </Table.Col>
                    <Table.Col className={clsx(cls.colChapter, cls.colChapterChild)}>
                        {item.type.includes('team') && (
                            <p>{t('Team')}</p>
                        )}
                        {item.type.includes('tariff') && (
                            <p>{t('Tariff')}</p>
                        )}
                    </Table.Col>
                    <Table.Col className={cls.colSubject}>
                        {item.topic}
                    </Table.Col>
                    <Table.Col className={cls.colNotification}>
                        {item.message}
                    </Table.Col>
                    <Table.Col className={cls.colAction}>
                        {item.type === 'customer_invite_team' && (
                            <button className={cls.actionBtn} onClick={openAddingTeamPopup}>
                                {t('Look')}
                            </button>
                        )}
                        {item.type === 'expires_tariff_anty' && (
                            <button className={cls.actionBtn} onClick={() => navigate(AppRoutes.PAYMENT)}>
                                {t('Extend')}
                            </button>
                        )}
                    </Table.Col>
                    <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colDateChild)}>
                        {item.date_added}
                    </Table.Col>
                </Table.Row>
                <ModalWindow modalWindowOpen={isOpenAddingTeamPopup} onClose={closeAddingTeamPopup}>
                    <div className={cls.modalWindowHeader}>
                        <span className={cls.freeSpace}/>
                        <div className={cls.modalDeleteHeaderTitle}>
                            <p className={cls.modalDeleteTitle}>{t('Invite to the team')}</p>
                        </div>
                        <CloseIcon className={cls.closeBtn} onClick={closeAddingTeamPopup}/>
                    </div>
                    <div className={cls.inviteContainer}>
                        <p className={cls.popupMessage}>
                            {item.topic}
                        </p>
                        <div className={cls.transferWrapper}>
                            <div className={cls.transferItem}>
                                <p className={cls.viewTitle}>{t('View profiles')}</p>
                                {dataTeam?.is_can_transfer_profile
                                    ? <p className={cls.transferTitle}>{t('Allow')}</p>
                                    : <p className={cls.transferTitle}>{t('Deny')}</p>
                                }
                            </div>
                            <div className={cls.transferItem}>
                                <p className={cls.viewTitle}>{t('View proxies')}</p>
                                {dataTeam?.is_can_transfer_proxy
                                    ? <p className={cls.transferTitle}>{t('Allow')}</p>
                                    : <p className={cls.transferTitle}>{t('Deny')}</p>
                                }
                            </div>
                        </div>
                        <div className={cls.actionsPopup}>
                            <button className={cls.acceptBtn} onClick={() => setInvite(true)}>
                                {t('Accept')}
                            </button>
                            <button className={cls.rejectBtn} onClick={() => setInvite(false)}>
                                {t('Reject')}
                            </button>
                        </div>
                    </div>
                </ModalWindow>
            </div>
        );
    }
);
