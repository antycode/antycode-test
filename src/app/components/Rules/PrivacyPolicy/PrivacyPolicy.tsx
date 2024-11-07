import React, {Dispatch, SetStateAction} from 'react';
import cls from "../Rules.module.scss";
import {AuthorizationFormHeader, HandleDialogParamsProps} from "@/app/components/AuthorizationForm";
import {useTranslation} from "react-i18next";
import {PrivacyPolicyContent} from "@/app/components/Rules/PrivacyPolicy/PrivacyPolicyContent";
import {ReactComponent as AuthIcon} from "@/shared/assets/icons/auth-icon.svg";
import {LangSwitcher} from "@/features/langSwitcher";
import {ReactComponent as CloseIcon} from "@/shared/assets/icons/close.svg";

interface PrivacyPolicyProps {
    setPrivacyPolicyOpen: Dispatch<SetStateAction<boolean>>;
}

export const PrivacyPolicy = (props: PrivacyPolicyProps) => {
    const {setPrivacyPolicyOpen} = props;
    const {t} = useTranslation();

    const closeTab = () => {
        setPrivacyPolicyOpen(false);
    };

    return (
        <div>
            <div className={cls.headerBox}>
                <span className={cls.freeSpace}/>
                <div className={cls.headerBoxTitleWrapper}>
                    <p className={cls.formTitle}>{t('Privacy policy')}</p>
                </div>
                <div className={cls.langSwitcherContent}>
                    <LangSwitcher/>
                    <CloseIcon className={cls.closeIcon} onClick={closeTab}/>
                </div>
            </div>
            <div className={cls.contentWrapper}>
                <div className={cls.content}>
                    <div className={cls.text}>
                        <PrivacyPolicyContent/>
                    </div>
                </div>
            </div>
        </div>
    );
};