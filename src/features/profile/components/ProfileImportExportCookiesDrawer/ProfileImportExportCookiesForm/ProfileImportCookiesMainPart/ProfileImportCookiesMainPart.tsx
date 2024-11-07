import {useTranslation} from 'react-i18next';
import {Controller, useFormContext} from 'react-hook-form';
import {TProfileImportCookiesForm} from '../ProfileImportCookiesForm';
import cls from '../ProfileImportExportCookiesForm.module.scss';
import React, {useState} from 'react';
import {
    CookiesArea
} from "@/features/profile/components/ProfileCreationDrawer/ProfileCreationForm/ProfileCreationFormHeaderPart/CookiesArea";


export const ProfileImportCookiesMainPart = () => {
    const {t} = useTranslation();
    const [cookies, setCookies] = useState('');
    const {
        control,
    } = useFormContext<TProfileImportCookiesForm>();

    return (
        <div className={cls.form}>
            <div className={cls.formTitle}>{t('Import cookies')}</div>
            <div className={cls.formTitleDivider}>{t('Import cookies')}</div>
            <div className={cls.optionsForm}>
                <div className={cls.wrapperCookie}>
                    <Controller
                        control={control}
                        name="cookies"
                        render={({field}) => (
                            <CookiesArea {...field}
                                         onChange={(cookieText: string) => {
                                             setCookies(cookieText)
                                             field.onChange(cookieText)
                                         }}
                            />
                        )}/>
                </div>
            </div>
            <div className={cls.formFooter}>
                <button
                    type="submit"
                    disabled={!cookies}
                    className={cls.btnSubmit}
                >
                    {t('Import')}
                </button>
            </div>
        </div>
    );
};
