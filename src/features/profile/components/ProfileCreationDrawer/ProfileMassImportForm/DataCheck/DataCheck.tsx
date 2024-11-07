import React from 'react';
import {Table} from "@/shared/components/Table/Table";
import cls from "./DataCheck.module.scss";
import {DataCheckItem} from "@/features/profile/components/ProfileCreationDrawer/ProfileMassImportForm/DataCheck/DataCheckItem";
import {useTranslation} from "react-i18next";

interface DataCheckProps {
    dataFromTemplate: any[]
}

export const DataCheck = (props: DataCheckProps) => {
    const {dataFromTemplate} = props;
    const {t} = useTranslation();
    return (
        <>
            <Table place='dataCheck'>
                <Table.Header>
                    <Table.Col className={cls.colName}>
                        {t('Profile name')}
                    </Table.Col>
                    <Table.Col className={cls.colCookie}>
                        {t('Cookie')}
                    </Table.Col>
                    <Table.Col className={cls.colProxyType}>
                        {t('Proxy type')}
                    </Table.Col>
                    <Table.Col className={cls.colProxy}>
                        {t('Proxy')}
                    </Table.Col>
                    <Table.Col className={cls.colUseragent}>
                        {t('User agent')}
                    </Table.Col>
                    <Table.Col className={cls.colNote}>
                        {t('Note')}
                    </Table.Col>
                </Table.Header>

                <Table.Main>
                    <div className={cls.tableMainWrapper}>
                        {dataFromTemplate.map((item, idx) => (
                            <DataCheckItem
                                key={idx}
                                item={item}
                            />
                        ))}
                    </div>
                </Table.Main>
            </Table>
        </>
    );
};