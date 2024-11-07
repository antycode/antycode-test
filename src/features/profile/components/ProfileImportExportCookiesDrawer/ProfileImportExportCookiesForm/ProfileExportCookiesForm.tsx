import {useTranslation} from 'react-i18next';
import cls from './ProfileImportExportCookiesForm.module.scss';
import React, {useState} from "react";
import {fetchData} from "@/shared/config/fetch";
import {Profile} from "@/features/profile/types";

interface ProfileExportCookiesFormProps {
    setIsDrawerOpened: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRows: Set<string>;
}

export const ProfileExportCookiesForm = (props: ProfileExportCookiesFormProps) => {
    const {selectedRows} = props;
    const {t} = useTranslation();
    const [error, setError] = useState<string>('');

    const generateAndDownloadTxtFile = (content:string, fileName:string) => {
        const blob = new Blob([content], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download =  fileName;
        document.body.appendChild(anchor);
        anchor.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(anchor);
    };

    const exportCookies = async () => {
        setError('')
        if (selectedRows.size == 0) {
            console.log('No profile is selected');
            return
        }
        const [firstSelectedExternalID] = selectedRows;
        try {
            const teamId = localStorage.getItem('teamId');
            const profileRecord = await fetchData({
                url: `/profile/${firstSelectedExternalID}`,
                method: 'GET',
                team: teamId
            }).then(res => {
                const {data, errors} = res
                if (errors) {
                    if (errors.length) {
                        setError(`${t('Sorry, something went wrong')}. ${t('Please, try again or contact administrator')}`);
                        throw new Error(errors[0].message)
                    }
                }
                return data
            }) as Profile
              if (profileRecord) {
                if (profileRecord.cookies) {
                    generateAndDownloadTxtFile(profileRecord.cookies, `profile_${profileRecord.title}_cookies.txt`)
                } else {
                    setError(t('Cookie is empty for this profile'));
                }
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className={cls.formPages}>
            <div className={cls.form}>
                <div className={cls.formTitle}>{t('Export cookies')}</div>
                <div className={cls.formTitleDivider}>{t('Export cookies')}</div>
                <div className={cls.optionsForm}>
                </div>
                {error !== '' &&
                 <div className={cls.formErrorMessage}>
                     <div>{error}.</div>
                 </div>
                }
                <div className={cls.formFooter}>
                    <button
                        className={cls.btnSubmit}
                        onClick={exportCookies}
                    >
                        {t('Export')}
                    </button>
                </div>
            </div>
        </div>
    );
};
