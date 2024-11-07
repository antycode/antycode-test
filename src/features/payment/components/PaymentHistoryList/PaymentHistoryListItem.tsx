import React, {memo} from 'react';
import {Table} from '@/shared/components/Table/Table';
import cls from '@/pages/PaymentPage/components/PaymentPage.module.scss';
import {useTranslation} from 'react-i18next';
import clsx from "clsx";

interface ProfileListItemProps {
    item: { [key: string]: any };
    index: number;
}

export const PaymentHistoryListItem = memo(
    (props: ProfileListItemProps) => {
        const {
            item,
            index
        } = props;

        const {t} = useTranslation();

        const getDate = () => {
            const date = new Date(item.created_at);

            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();

            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const seconds = String(date.getUTCSeconds()).padStart(2, '0');

            const formattedDate = `${day}.${month}.${year}`;
            const formattedTime = `${hours}:${minutes}:${seconds}`;

            return (
                <div className={cls.dateRow}>
                    <span style={{fontWeight: 900}}>{formattedDate}</span>
                    <span style={{fontWeight: 500}}>{formattedTime}</span>
                </div>
            );
        };

        const getAmount = () => {
            const balance_difference = item.balance_after - item.balance_before;

            if (balance_difference > 0) {
                return (
                    <p style={{fontWeight: 550}}>
                        +{balance_difference}
                    </p>
                );
            }
            return (
                <p style={{fontWeight: 550}}>
                    {balance_difference}
                </p>
            );
        };

        const getType = () => {
            if (item.payment_system === 'payment_tariff_anty') {
                return (
                    <div style={{fontWeight: 550}}>{t('Purchase: 35 days')}</div>
                );
            } else if (item.payment_system === 'cryptocurrency') {
                return (
                    <div style={{fontWeight: 550}}>{t('Withdrawal')}</div>
                );
            } else if (item.payment_system === 'buy_proxy') {
                return (
                    <div style={{fontWeight: 550}}>{t('Purchasing a proxy')}</div>
                );
            } else if (item.payment_system === 'bank_card') {
                return (
                    <div style={{fontWeight: 550}}>{t('Withdrawal')}</div>
                );
            } else if (item.payment_system === 'liqpay' || item.payment_system === 'capitalist' || item.payment_system === 'cryptopay') {
                return (
                    <div style={{fontWeight: 550}}>{t('Deposit')}</div>
                );
            }
        };

        return (
            <Table.Row>
                <Table.Col className={cls.colNumber}>
                    <p className={cls.transNum}>{index + 1}</p>
                </Table.Col>
                <Table.Col className={clsx(cls.colDate, cls.dateItem)}>
                    {getDate()}
                </Table.Col>
                <Table.Col className={cls.colAmount}>
                    {getAmount()}
                </Table.Col>
                <Table.Col className={cls.colOperation}>
                    {item.type
                        ? <p className={cls.income}>{t('Income')}</p>
                        : <p className={cls.expenses}>{t('Expenses')}</p>
                    }
                </Table.Col>
                <Table.Col className={cls.colType}>
                    {getType()}
                </Table.Col>
                <Table.Col className={cls.colBalance}>
                    <p style={{fontWeight: 550}}>${item.balance_before}</p>
                </Table.Col>
                <Table.Col className={cls.colBalance}>
                    <p style={{fontWeight: 550}}>${item.balance_after}</p>
                </Table.Col>
            </Table.Row>
        );
    }
);
