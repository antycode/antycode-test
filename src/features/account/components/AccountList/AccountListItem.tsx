import {memo} from 'react';
import {Table} from '@/shared/components/Table/Table';
import cls from './AccountList.module.scss';
import {AccStatus, Account, InProgressAccount} from '../../types';
import {Checkbox} from '@/shared/components/Checkbox/Checkbox';
import {useTranslation} from 'react-i18next';
import {Button} from '@/shared/components/Button';
import {ReactComponent as ImportIcon} from '@/shared/assets/icons/import-1.svg';
import {ReactComponent as IconCheck} from '@/shared/assets/icons/checkAcc.svg';
import {ReactComponent as PassIcon} from '@/shared/assets/icons/pass.svg';
import {ReactComponent as UaIcon} from '@/shared/assets/icons/flag-ukraine.svg';
import {ReactComponent as IconThreeDots} from '@/shared/assets/icons/three-dots.svg';

interface AccountListItemProps {
    item?: Account | InProgressAccount;
    isSelected?: boolean;
    selectRow?: (id: string, isSelected: boolean) => void;
}

export const AccountListItem = memo(({item, isSelected, selectRow}: AccountListItemProps) => {
    // const { status, created_at, id } = item;

    const {t} = useTranslation();

    // const getName = () => {
    //   if (item.status === AccStatus.InProgress) return <Table.EmptyCol />;

    //   const accountItem = item as Account;
    //   return accountItem.first_name + ' ' + accountItem.last_name;
    // };

    return (
        <Table.Row isSelected={isSelected}>
            <Table.Col className={cls.colCheck}>
                {/* <Checkbox checked={isSelected} onChange={(e) => selectRow(id, e.currentTarget.checked)} /> */}
                <Checkbox checked={isSelected} onChange={() => {
                }}/>
            </Table.Col>

            <Table.Col className={cls.colGeo}>
                <div className={cls.geoContent}>
                    <UaIcon/>
                    <p>{t('UA')}</p>
                </div>
            </Table.Col>

            <Table.Col className={cls.colName}>{'Первый созданный профиль'}</Table.Col>
            <Table.Col className={cls.colRegister}>
                <IconCheck/>
            </Table.Col>

            <Table.Col className={cls.colFp}>
                <IconCheck/>
            </Table.Col>
            <Table.Col className={cls.colPolicy}>
                <IconCheck/>
            </Table.Col>
            <Table.Col className={cls.colToken}>
                <IconCheck/>
            </Table.Col>
            <Table.Col className={cls.colZrd}><p>{t('ZRD')}</p></Table.Col>
            <Table.Col className={cls.colBm}>
                <IconCheck/>
            </Table.Col>
            <Table.Col className={cls.colFarm}>
                <IconThreeDots/>
            </Table.Col>
            <Table.Col className={cls.colDate}>28 октября 15:23</Table.Col>
            <Table.Col className={cls.colDownload}>
                <Button className={cls.btnDownload}>
                    <ImportIcon/>
                </Button>
            </Table.Col>
            <Table.Col className={cls.colShare}>
                <Button className={cls.btnShare} leftIcon={<PassIcon width={16} height={16}/>}>
                    {t('Hand over')}
                </Button>
            </Table.Col>
        </Table.Row>
    );
});
