import React from 'react';
import {useTranslation} from "react-i18next";
import cls from './../Rules.module.scss';

export const PrivacyPolicyContent = () => {
    const {t} = useTranslation();
    return (
        <>
            <div className={cls.rulesContent}>
                <div className={cls.mainTitles}>
                    <h5 className={cls.mainTitle}>
                        {t('privacyPolicy.title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.main_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.main_2')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>{t('privacyPolicy.1_title')}</h5>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.1_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.1_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.1_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.1_3_second')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.1_4')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.1_5')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.1_6')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.1_7')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.2_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.2_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.2_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.2_3')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.3_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.3_1')}
                    </p>
                    <div>
                        <p className={cls.textPart}>{t('privacyPolicy.3_1_1')}</p>
                        <ul>
                            {(t('privacyPolicy.3_1_1_list', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={index} className={cls.textPart}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className={cls.textPart}>{t('privacyPolicy.3_1_2')}</p>
                        <ul>
                            {(t('privacyPolicy.3_1_2_list', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={index} className={cls.textPart}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className={cls.textPart}>{t('privacyPolicy.3_1_3')}</p>
                        <ul>
                            {(t('privacyPolicy.3_1_3_list', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={index} className={cls.textPart}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.3_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.3_3')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.4_title')}
                    </h5>
                    <p>
                        <p className={cls.textPart}>{t('privacyPolicy.4_1')}</p>
                        <ul>
                            {(t('privacyPolicy.4_1_list', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={index} className={cls.textPart}>{item}</li>
                            ))}
                        </ul>
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.4_2')}
                    </p>
                    <p className={cls.textPart}>
                        <p className={cls.textPart}>{t('privacyPolicy.4_3')}</p>
                        <ul>
                            {(t('privacyPolicy.4_3_list', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={index} className={cls.textPart}>{item}</li>
                            ))}
                        </ul>
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.4_4')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.4_5')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.5_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.5_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.5_2')}
                    </p>
                    <p className={cls.textPart}>
                        <p className={cls.textPart}>{t('privacyPolicy.5_3')}</p>
                        <ul>
                            {(t('privacyPolicy.5_3_1_list', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={index} className={cls.textPart}>{item}</li>
                            ))}
                            {(t('privacyPolicy.5_3_2_list', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={index} className={cls.textPart}>{item}</li>
                            ))}
                        </ul>
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.5_4')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.6_title')}
                    </h5>
                    <ul>
                        {(t('privacyPolicy.6_1_list', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={index} className={cls.textPart}>{item}</li>
                        ))}
                    </ul>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.6_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.6_3')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.7_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.7')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.7_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.7_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.7_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.7_4')}
                    </p>
                    <ul>
                        {(t('privacyPolicy.7_5_list', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={index} className={cls.textPart}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.8_title')}
                    </h5>
                    <ul>
                        {(t('privacyPolicy.8_1_list', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={index} className={cls.textPart}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.9_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.9_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.9_2')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.10_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.10_1')}
                    </p>
                </div>
                <div>
                    <h5 className={cls.secondaryTitle}>
                        {t('privacyPolicy.11_title')}
                    </h5>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.11_1')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.11_2')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.11_3')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.11_4')}
                    </p>
                    <p className={cls.textPart}>
                        {t('privacyPolicy.11_5')}
                    </p>
                </div>
                <p className={cls.textPart}>14.04.24</p>
            </div>
        </>
    );
};