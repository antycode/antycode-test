import {memo, ReactNode, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import clsx from 'clsx';
import cls from './LangSwitcher.module.scss';
import {LOCAL_STORAGE_LOCALE_KEY} from '@/shared/const/localStorage';
import {ReactComponent as ArrowWhiteIcon} from '@/shared/assets/icons/arrow-white.svg';
import {fetchData} from "@/shared/config/fetch";
import {useProfilesStore} from "@/features/profile/store";
import {useWorkspacesStore} from "@/features/workspace/store";
import {useSelector} from "react-redux";

interface LangSwitcherProps {
    className?: string;
}

export const LangSwitcher = memo((props: LangSwitcherProps) => {
    const {className} = props;
    const {i18n, t} = useTranslation();

    const {setProfilesConfigData, configData, setLoaderProfilesPage} = useProfilesStore();
    const {myTeams, setVerticals, setPositions, setNotifications, filteredNotice, setFilteredNotice } = useWorkspacesStore();
    const token = useSelector((state: any) => state.authReducer.token)

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleLangChange = async (locale: 'ua' | 'ru' | 'en' | 'pt' | 'zh') => {
        if (!isLoadingConfig) {
            await i18n.changeLanguage(locale);
            await localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, locale);
            await setIsOpen(false);
            if (token && myTeams) {
                setIsLoadingConfig(true);
                await setLoaderProfilesPage(true);
                await fetchProfileConfig(locale);
                await fetchVerticals(locale);
                await fetchPositions(locale);
                await fetchNotification(locale);
            }
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const fetchVerticals = (lang: string) => {
        const teamId = localStorage.getItem('teamId');
        const urlApi = lang === 'ru' ? '/customer/vertical' : `/${lang}/customer/vertical`;
        fetchData({url: urlApi, method: 'GET', team: teamId}).then((data: any) => {
            if (data.is_success) {
                if (data.data) {
                    setVerticals(data?.data);
                }
            }
        }).catch((err: Error) => {
            console.log('/customer/login error: ', err);
        })
    };

    const fetchNotification = (lang: string) => {
        const teamId = localStorage.getItem('teamId');
        const urlApi = lang === 'ru' ? '/notification' : `/${lang}/notification`;
        fetchData({url: urlApi, method: 'GET', team: teamId}).then((data: any) => {
            if (data.is_success) {
                setNotifications(data?.data);
                if (!filteredNotice.length) {
                    setFilteredNotice(data?.data);
                }
            }
        }).catch((err) => {
            console.log('notification', err);
        });
    };

    const fetchPositions = (lang: string) => {
        const teamId = localStorage.getItem('teamId');
        const urlApi = lang === 'ru' ? '/customer/position' : `/${lang}/customer/position`;
        fetchData({url: urlApi, method: 'GET', team: teamId}).then((data: any) => {
            if (data.is_success) {
                if (data.data) {
                    setPositions(data?.data);
                }
            }
        }).catch((err: Error) => {
            console.log('/customer/login error: ', err);
        })
    };

    const fetchProfileConfig = (lang: string) => {
        const teamId = localStorage.getItem('teamId');
        const urlApi = lang === 'ru' ? '/profile/config' : `/${lang}/profile/config`;
        fetchData({url: urlApi, method: 'GET', team: teamId}).then((data: any) => {
            if (data.is_success) {
                setProfilesConfigData(data.data);
            }
            setLoaderProfilesPage(false);
            setIsLoadingConfig(false);
        }).catch((err: Error) => {
            console.log(err);
            setIsLoadingConfig(false);
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={clsx(cls.langSwitcher, className)} ref={dropdownRef}>
            <div className={cls.langSelector}>
                <button className={cls.btn} onClick={toggleDropdown}>
                    {i18n.language === 'zh'
                        ? <p>中文</p>
                        : <p>{i18n.language.toUpperCase()}</p>
                    }
                </button>
            </div>
            {isOpen && (
                <div className={cls.dropdown}>
                    <button
                        className={clsx(cls.dropdownItem, i18n.language === 'ua' && cls.active)}
                        onClick={() => handleLangChange('ua')}
                    >
                        UA <span>{t('Ukrainian')}</span>
                    </button>
                    <button
                        className={clsx(cls.dropdownItem, i18n.language === 'ru' && cls.active)}
                        onClick={() => handleLangChange('ru')}
                    >
                        RU <span>{t('Russian')}</span>
                    </button>
                    <button
                        className={clsx(cls.dropdownItem, i18n.language === 'en' && cls.active)}
                        onClick={() => handleLangChange('en')}
                    >
                        EN <span>{t('English')}</span>
                    </button>
                    <button
                        className={clsx(cls.dropdownItem, i18n.language === 'pt' && cls.active)}
                        onClick={() => handleLangChange('pt')}
                    >
                        PT <span>{t('Portuguese')}</span>
                    </button>
                    <button
                        className={clsx(cls.dropdownItem, i18n.language === 'zh' && cls.active)}
                        onClick={() => handleLangChange('zh')}
                    >
                        中文 <span>{t('Chinese')}</span>
                    </button>
                </div>
            )}
        </div>
    );
});
