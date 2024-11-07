import { Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ProxyDrawer } from '@/features/profile/components/ProxyDrawer/ProxyDrawer';
import { ProfileProxyCreationForm } from './ProfileProxyCreationForm/ProfileProxyCreationForm';

interface ProfileProxyDrawerProps {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>;
}

export const ProfileProxyDrawer = (props: ProfileProxyDrawerProps) => {
    const { opened, setOpened } = props;

    const { t } = useTranslation();


    const onClose = useCallback(() => setOpened(false), []);

    return (
        <ProxyDrawer opened={opened} onClose={onClose}>
            {/* COMMENTED PROXY DRAWER BUT WAS CREATED NEW*/}
            {/*<ProfileProxyCreationForm setIsDrawerOpened={setOpened} />*/}
        </ProxyDrawer>
    )
};