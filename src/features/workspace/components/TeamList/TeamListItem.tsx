import React, {memo, useState} from 'react';
import {Table} from '@/shared/components/Table/Table';
import cls from './TeamList.module.scss';
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

interface TeamListItemProps {
    item: any;
    isSelected: boolean;
    selectRow: (id: string, isSelected: boolean) => void;
}

export const TeamListItem = memo(
    ({
         item,
         isSelected,
         selectRow
     }: TeamListItemProps) => {
        const {external_id} = item
        const {t} = useTranslation();

        const {setTeamCustomers, teamCustomers, positions} = useWorkspacesStore();

        const [isOpenDeleteTokenSinglePopup, setIsOpenDeleteTokenSinglePopup] = useState<boolean>(false);
        const [errorDeleteTokenSingle, setErrorDeleteTokenSingle] = useState<string>('');

        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}.${month}.${year} / ${hours}:${minutes}`;
        };

        const closeDeleteTokenSinglePopup = () => {
            setErrorDeleteTokenSingle('');
            setIsOpenDeleteTokenSinglePopup(false);
        };

        const handleOpenDeleteTokenSingle = () => {
            setIsOpenDeleteTokenSinglePopup(true);
        };

        const deleteToken = () => {
            fetchData({
                url: `/customer/token/${external_id}`,
                method: 'DELETE'
            }).then((data: any) => {
                if (data.is_success) {
                    closeDeleteTokenSinglePopup();
                } else {
                    setErrorDeleteTokenSingle('Failed to delete user');
                }
            }).catch(err => {
                console.log("Error to delete token 'CATCH' ", err);
                setErrorDeleteTokenSingle('Failed to delete user');
            });
        };

        const getRole = () => {
            if (positions) {
                const role = positions.find((i: any) => i.external_id === item.position_external_id);
                return role ? role.title : <Table.EmptyCol/>;
            }
            return <Table.EmptyCol/>;
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
                    <Table.Col className={cls.colUsers}>
                        <div className={cls.userTitleWrapper}>
                            <IconUser1/>
                            <p>{item.nickname}</p>
                        </div>
                    </Table.Col>
                    <Table.Col className={cls.colRole}>
                        {getRole()}
                    </Table.Col>
                    <Table.Col className={cls.colProfiles}>
                        {item.self_used?.total_profile}
                    </Table.Col>
                    <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colProxies)}>
                        {item.self_used?.total_proxy}
                    </Table.Col>
                    <Table.Col className={clsx(tableCls.colActionHeaderCell, cls.colDateChild)}>
                        {formatDate(item.date_added)}
                    </Table.Col>
                </Table.Row>
                <ModalWindow modalWindowOpen={isOpenDeleteTokenSinglePopup} onClose={closeDeleteTokenSinglePopup}>
                    <div className={cls.modalWindowHeader}>
                        <span className={cls.freeSpace} />
                        <div className={cls.modalDeleteHeaderTitle}>
                            <TrashIcon1/>
                            <p className={cls.modalDeleteTitle}>{t('Delete user')}</p>
                        </div>
                        <CloseIcon className={cls.closeBtn} onClick={closeDeleteTokenSinglePopup}/>
                    </div>
                    <div className={cls.modalDeleteContent}>
                        {errorDeleteTokenSingle
                            ? <div className={cls.warningTextContent}>
                                <p className={cls.warningText1}>{t(errorDeleteTokenSingle)}</p>
                            </div>
                            : <div className={cls.warningTextContent}>
                                <p className={cls.warningText1}>{t('Are you sure you want to delete the selected user?')}</p>
                                <p className={cls.warningText2}>{t('Deleted files will be moved to the trash')}</p>
                            </div>
                        }
                        <div className={cls.approveDeleteContent}>
                            <button className={cls.btnCancelDeleteToken}
                                    onClick={closeDeleteTokenSinglePopup}>{t('Cancel')}</button>
                            <button className={cls.btnDelete}
                                    onClick={() => deleteToken()}>{t('Delete')}</button>
                        </div>
                    </div>
                </ModalWindow>
            </div>
        );
    }
);
