import React, {Dispatch, SetStateAction} from 'react';
import {AuthorizationFormHeader, HandleDialogParamsProps} from "@/app/components/AuthorizationForm";
import {useTranslation} from "react-i18next";
import cls from "@/app/components/Rules/Rules.module.scss";
import {PublicOfferAgreementContent} from "@/app/components/Rules/PublicOfferAgreement/PublicOfferAgreementContent";
import {LangSwitcher} from "@/features/langSwitcher";
import {ReactComponent as CloseIcon} from "@/shared/assets/icons/close.svg";

interface PublicOfferAgreementProps {
    setPublicOfferOpen: Dispatch<SetStateAction<boolean>>;
}

export const PublicOfferAgreement = (props: PublicOfferAgreementProps) => {
    const {setPublicOfferOpen} = props;
    const {t} = useTranslation();

    const closeTab = () => {
        setPublicOfferOpen(false);
    };

    return (
        <div>
            <div className={cls.headerBox}>
                <span className={cls.freeSpace}/>
                <div className={cls.headerBoxTitleWrapper}>
                    <p className={cls.formTitle}>{t('Public offer agreement')}</p>
                </div>
                <div className={cls.langSwitcherContent}>
                    <LangSwitcher/>
                    <CloseIcon className={cls.closeIcon} onClick={closeTab}/>
                </div>
            </div>
            <div className={cls.contentWrapper}>
                <div className={cls.content}>
                    <div className={cls.text}>
                        <PublicOfferAgreementContent />
                    </div>
                </div>
            </div>
        </div>
    );
};