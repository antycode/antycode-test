import React from 'react';
import {useTranslation} from "react-i18next";
import cls from './../Rules.module.scss';

export const PublicOfferAgreementContent = () => {
    const {t} = useTranslation();
    return (
        <>
            <div className={cls.rulesContent}>
                <h4 className={cls.mainTitle}>
                    {t('publicOfferAgreement.title')}
                </h4>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.1_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.1_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.1_1_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.1_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.1_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.1_4')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.1_5')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.1_6')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.1_7')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.2_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.2_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.2_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.2_3')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.3_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.3_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.3_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.3_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.3_4')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.4_title')}
                    </h5>
                    {(t('publicOfferAgreement.4_1_list', { returnObjects: true }) as string[]).map((item, index) => (
                        <p key={index} className={cls.textPart}>{item}</p>
                    ))}
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.4_2')}
                    </p>
                    {(t('publicOfferAgreement.4_2_list', { returnObjects: true }) as string[]).map((item, index) => (
                        <p key={index} className={cls.textPart}>{item}</p>
                    ))}
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.4_3')}
                    </p>
                    {(t('publicOfferAgreement.4_3_list', { returnObjects: true }) as string[]).map((item, index) => (
                        <p key={index} className={cls.textPart}>{item}</p>
                    ))}
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.4_4')}
                    </p>
                    {(t('publicOfferAgreement.4_4_list', { returnObjects: true }) as string[]).map((item, index) => (
                        <p key={index} className={cls.textPart}>{item}</p>
                    ))}
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.5_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.5_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.5_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.5_3')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.6_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.6_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.6_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.6_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.6_4')}
                    </p>
                    {(t('publicOfferAgreement.6_5_list', { returnObjects: true }) as string[]).map((item, index) => (
                        <p key={index} className={cls.textPart}>{item}</p>
                    ))}
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.7_title')}
                    </h5>
                    {(t('publicOfferAgreement.7_1_list', { returnObjects: true }) as string[]).map((item, index) => (
                        <p key={index} className={cls.textPart}>{item}</p>
                    ))}
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.8_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.8_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.8_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.8_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.8_4')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.8_4_1')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.9_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.9_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.9_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.9_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.9_4')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.9_5')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.10_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.10_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.10_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.10_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.10_4')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('publicOfferAgreement.11_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.11_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.11_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.11_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.11_4')}
                    </p>
                    <p className={cls.textPart}>
                        {t('publicOfferAgreement.11_5')}
                    </p>
                </div>
                <p className={cls.textPart}>14.04.24</p>
            </div>
        </>
    );
};