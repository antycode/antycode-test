import {Dispatch, SetStateAction, useCallback, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileDrawer } from '../ProfileDrawer/ProfileDrawer';
import { ProfileImportCookiesForm } from './ProfileImportExportCookiesForm/ProfileImportCookiesForm';
import { ProfileExportCookiesForm } from './ProfileImportExportCookiesForm/ProfileExportCookiesForm';

interface ProfileImportExportCookiesDrawerProps {
    opened: boolean;
    exportCookies:boolean;
    selectedRows: Set<string>;
    setOpened: Dispatch<SetStateAction<boolean>>;
}

export const ProfileImportExportCookiesDrawer = (props: ProfileImportExportCookiesDrawerProps) => {
    const { opened, setOpened, selectedRows, exportCookies } = props;

    const { t } = useTranslation();

    const onClose = useCallback(() => setOpened(false), []);
     return (
         <div></div>
        // <ProfileDrawer opened={opened} onClose={onClose}>
        //     {exportCookies ?
        //         <ProfileExportCookiesForm
        //             selectedRows={selectedRows}
        //             setIsDrawerOpened={setOpened}/> :
        //         <ProfileImportCookiesForm
        //             selectedRows={selectedRows}
        //             setIsDrawerOpened={setOpened}/>
        //     }
        // </ProfileDrawer>
    )
};
