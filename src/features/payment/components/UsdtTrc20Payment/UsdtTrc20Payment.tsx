import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import cls from "@/pages/PaymentPage/components/PaymentPage.module.scss";
import {ReactComponent as PaymentIcon} from "@/shared/assets/icons/payment.svg";
import {ReactComponent as CloseIcon} from '@/shared/assets/icons/close.svg';
import {ReactComponent as UsdtTrc20Icon} from '@/shared/assets/icons/usdt-trc20.svg';
import {ReactComponent as QrcodeIcon} from '@/shared/assets/icons/qrcode.svg';
import {ReactComponent as CopyIcon} from '@/shared/assets/icons/copy.svg';
import {ReactComponent as TimeErrorIcon} from '@/shared/assets/icons/time-error.svg';
import {useTranslation} from "react-i18next";
import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import clsx from "clsx";
import {usePaymentStore} from "@/features/payment/store";

interface PropsChoosePayment {
    depositValue: string;
}

export const UsdtTrc20Payment = (props: PropsChoosePayment) => {
    const {depositValue} = props;

    const {t, i18n} = useTranslation();
    const locale = i18n.language;

    const {activeCryptopayPopup, setActiveCryptopayPopup, timePassed, setTimePassed} = usePaymentStore();

    const cryptopayData = JSON.parse(localStorage.getItem('cryptopayData') as string);

    // const closeCryptopayPopup = () => {
    //     setActiveCryptopayPopup(false);
    // };

    const calculateRemainingTime = (startTime: string) => {
        const startDate = new Date(startTime);
        const currentDate = new Date();
        const differenceInMs: number = currentDate.getTime() - startDate.getTime();
        return Math.floor(differenceInMs / 1000);
    };

    const time = () => {
        const elapsedTime = calculateRemainingTime(cryptopayData?.date_created) || 0;
        const duration = 1800;
        const remainingTime = duration - elapsedTime;

        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return (
            <div role="timer" aria-live="assertive" className={cls.timer}>
                {formattedMinutes}:{formattedSeconds}
            </div>
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    useEffect(() => {
        console.log('timePassed', timePassed)
    }, []);

    return (
        <div className={cls.usdtTrc20Wrapper} data-active-usdt={activeCryptopayPopup && !timePassed} style={!activeCryptopayPopup ? { pointerEvents: 'none'} : {}}>
            {/*<div className={cls.paymentOptionHeader}>*/}
            {/*    <span className={cls.freeSpace} />*/}
            {/*    <div className={cls.paymentOptionHeaderTitleWrapper}>*/}
            {/*        <PaymentIcon/>*/}
            {/*        <p className={cls.paymentOptionHeaderTitle}>{t('Payment')}</p>*/}
            {/*    </div>*/}
            {/*    <CloseIcon className={cls.closeIcon} onClick={() => setActiveCryptopayPopup(false)}/>*/}
            {/*</div>*/}
            <div className={cls.usdtTrc20Content}>
                <div className={cls.usdtTrc20Timer}>
                    <div className={cls.usdtTrc20IconContent}>
                        <UsdtTrc20Icon/>
                        <div className={cls.usdtTrc20IconContentTitle}>
                            <p className={cls.usdtTrc20IconContentTitleText1}>USDT</p>
                            <p className={cls.usdtTrc20IconContentTitleText2}>(TRC20)</p>
                        </div>
                    </div>
                    <div className={cls.timerWrapper}>
                        {!timePassed
                            ? <CountdownCircleTimer
                                isPlaying
                                duration={1800 - calculateRemainingTime(cryptopayData?.date_created)}
                                colors={'#418B8B'}
                                size={65}
                                strokeWidth={6}
                                onComplete={() => {
                                    // do your stuff here
                                    return setTimePassed(true) // repeat animation in 1.5 seconds
                                }}
                            >
                                {time}
                            </CountdownCircleTimer>
                            : <TimeErrorIcon/>
                        }
                    </div>
                </div>
                <div className={cls.usdtTrc20Data}>
                    {!timePassed
                        ?   <div className={cls.dataPayWrapper}>
                            <div className={cls.qrCodeWrapper}>
                                <span className={cls.qrCode} dangerouslySetInnerHTML={{ __html: cryptopayData?.qr }} />
                            </div>
                            <div className={cls.dataPay}>
                                <div className={cls.usdtTrc20AddressContent}>
                                    <div className={cls.usdtTrc20Address}>
                                        <p className={cls.addressText}>{t('Address')} (USDT TRC20)</p>
                                        <p className={cls.addressData}>{cryptopayData?.address}</p>
                                    </div>
                                    <div className={cls.copySide} onClick={() => copyToClipboard(cryptopayData?.address)}>
                                        <CopyIcon/>
                                        <button
                                            className={clsx(locale === 'ru' ? cls.btnCopyRu : cls.btnCopyEn)}>{t('Copy')}</button>
                                    </div>
                                </div>
                                <div className={cls.totalAmountContent}>
                                    <div className={cls.totalAmount}>
                                        <p className={cls.totalAmountText}>{t('Total Amount')}</p>
                                        <p className={cls.total}>{depositValue}</p>
                                    </div>
                                    <div className={cls.copySide} onClick={() => copyToClipboard(depositValue)}>
                                        <CopyIcon/>
                                        <button
                                            className={clsx(locale === 'ru' ? cls.btnCopyRu : cls.btnCopyEn)}>{t('Copy')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :   <div className={cls.errorTimerMessageWrapper}>{t('payment.The time for payment has expired, the wallet number that was specified for payment is no longer relevant. If you would like to try paying again, please close this window, enter the amount and select a payment method')}.</div>
                    }
                    {/*<div className={cls.payConditions}>*/}
                    {/*    <p className={cls.paymentNote}>*/}
                    {/*        {t('payment.Note')}*/}
                    {/*    </p>*/}
                    {/*    <div className={cls.paymentRules}>*/}
                    {/*        <p className={cls.paymentRule}>1) {t('payment.Send the amount indicated above! But even if you send an amount less or more than indicated above, then exactly the amount you sent will still be credited to your balance')}.</p>*/}
                    {/*        <p className={cls.paymentRule}>2) {t('payment.Do not send money to the same wallet 2 times, since a new wallet number is allocated for each payment')}.</p>*/}
                    {/*        <p className={cls.paymentRule}>3) {t('payment.Consider the network commission when sending cryptocurrency')}.</p>*/}
                    {/*        <p className={cls.paymentRule}>4) {t('payment.Pay within 30 minutes, the counter is indicated above')}.</p>*/}
                    {/*    </div>*/}
                    {/*    <p className={cls.paymentCondition}>*/}
                    {/*        {t('payment.As soon as the money arrives in our wallet, the balance in your personal account will be replenished automatically! If for some reason you violated one of the points, don’t worry, write to support on Telegram')}*/}
                    {/*        <span className={cls.linkTelegramSupport}>@zproxysupport</span> {t('payment.and we will fix everything')}.*/}
                    {/*    </p>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
};