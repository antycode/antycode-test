import cls from './AuthorizationForm.module.scss';
import {ReactComponent as CloseIcon} from '@/shared/assets/icons/close.svg';
import {ReactComponent as AuthIcon} from "@/shared/assets/icons/auth-icon.svg";
import React from "react";
import {LangSwitcher} from "@/features/langSwitcher";

type AuthorizationFormHeaderProps = {
    formTitle?: string;
    setCurrentFormName: React.Dispatch<React.SetStateAction<string>>;
    currentFormName: string;
    prevFormName?: string;
}

export const AuthorizationFormHeader = (props: AuthorizationFormHeaderProps) => {
    const {formTitle, setCurrentFormName, currentFormName, prevFormName} = props;

    const backToLogin = () => {
        if ((currentFormName === 'PrivacyPolicy' || currentFormName === 'PublicOfferAgreement') && prevFormName) {
            setCurrentFormName(prevFormName);
        } else if (currentFormName !== 'LoginForm') {
            setCurrentFormName('LoginForm');
        }
    };

    return (
        <div className={cls.headerBox}>
            <span className={cls.freeSpace}/>
            <div className={cls.headerBoxTitleWrapper}>
                {(currentFormName !== 'PrivacyPolicy' && currentFormName !== 'PublicOfferAgreement') && <AuthIcon/>}
                <p className={cls.formTitle}>{formTitle}</p>
            </div>
            {currentFormName !== 'LoginForm'
                ? <div className={cls.langSwitcherContent}>
                    <LangSwitcher />
                    <CloseIcon className={cls.closeIcon} onClick={() => backToLogin()}/>
                </div>
                : <LangSwitcher />
            }
        </div>
    );
};
