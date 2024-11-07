import React, {Dispatch, SetStateAction, useState} from 'react';
import cls from '../../../../pages/PaymentPage/components/PaymentPage.module.scss';
import {useTranslation} from "react-i18next";
import { ReactComponent as PaymentIcon } from '@/shared/assets/icons/payment.svg';
import { ReactComponent as MastercardVisaIcon } from '@/shared/assets/icons/mastercard-visa.svg';
import { ReactComponent as Privat24Icon } from '@/shared/assets/icons/privat24.svg';
import { ReactComponent as UsdtTrc20Icon } from '@/shared/assets/icons/usdt-trc20.svg';
import { ReactComponent as ApplePayIcon } from '@/shared/assets/icons/apple-pay.svg';
import { ReactComponent as GooglePayIcon } from '@/shared/assets/icons/google-pay.svg';
import { ReactComponent as PaypalIcon } from '@/shared/assets/icons/paypal.svg';
import { ReactComponent as CapitalistIcon } from '@/shared/assets/icons/capitalist.svg';
import { ReactComponent as BinancePayIcon } from '@/shared/assets/icons/binance-pay.svg';
import { ReactComponent as CryptocurrencyIcon } from '@/shared/assets/icons/cryptocurrency-pay.svg';
import clsx from "clsx";

interface PropsChoosePayment {
    setOpenedPaymentMethod: Dispatch<SetStateAction<string>>;
    depositValue: string;
    setDepositValue: Dispatch<SetStateAction<string>>;
}

export const ChoosePayment = (props: PropsChoosePayment) => {
    const {setOpenedPaymentMethod, depositValue, setDepositValue} = props;

    const { t } = useTranslation();

    const [minDeposit, setMinDeposit] = useState<number>(10);
    const [errorMinAmountOfMoney, setErrorMinAmountOfMoney] = useState<boolean>(false);

    const paymentOptions = [
        { value: 'mastercardVisa', label: 'Bank card', icon: <MastercardVisaIcon /> },
        { value: 'privat24', label: 'Privat24', icon: <Privat24Icon /> },
        { value: 'usdtTrc20', label: 'USDT (TRC20)', icon: <UsdtTrc20Icon /> },
        { value: 'applePay', label: 'ApplePay', icon: <ApplePayIcon /> },
        { value: 'googlePay', label: 'GooglePay', icon: <GooglePayIcon /> },
        { value: 'paypal', label: 'PayPal', icon: <PaypalIcon /> },
        { value: 'capitalist', label: 'Capitalist', icon: <CapitalistIcon /> },
        { value: 'binancePay', label: 'BinancePay', icon: <BinancePayIcon /> },
        { value: 'cryptocurrency', label: 'Cryptocurrency', icon: <CryptocurrencyIcon /> }
    ];

    const handleAmountChange = (e: any) => {
        const inputValue = e.target.value;

        // Use a regular expression to validate the input format
        const validInput = /^\d+(\.\d{0,2})?$/; // Allows digits, an optional dot, and up to 2 decimal places

        if (inputValue === '' || validInput.test(inputValue)) {
            // If the input is empty or valid, update the state
            setDepositValue(inputValue);
        }

        if (errorMinAmountOfMoney) {
            if (inputValue === '') {
                setErrorMinAmountOfMoney(false)
            }
        }
    };

    const handlePaymentMethod = (paymentMethod: string) => {
        +depositValue < minDeposit ? setErrorMinAmountOfMoney(true) : setOpenedPaymentMethod(paymentMethod);
    };

    return (
        <div className={cls.paymentWrapper}>
            <div className={cls.paymentHeader}>
                <div className={cls.paymentHeaderTitleWrapper}>
                    <PaymentIcon />
                    <p className={cls.paymentHeaderTitle}>{t('Payment')}</p>
                </div>
            </div>
            <div className={cls.paymentContent}>
                <div className={cls.depositAmount}>
                    <p className={cls.enterAmountText}>{t('Enter the deposit amount')}:</p>
                    <div className={cls.amountInputContent}>
                        <div className={clsx(cls.dollarSign, depositValue !== '' ? cls.dollarSignActive : '')}>$</div>
                        <input
                            className={cls.amountInput}
                            type="text"
                            placeholder={'0.00'}
                            value={depositValue}
                            onChange={handleAmountChange}
                        />
                    </div>
                    {errorMinAmountOfMoney
                        ? <p className={cls.errorValidation}>{t('Amount should not be less than')} ${minDeposit}</p>
                        : false
                    }
                    <p className={cls.minAmountText}>{t('Minimum deposit amount')}: ${minDeposit}</p>
                </div>
                <div className={cls.paymentMethods}>
                    <div className={cls.paymentMethodsTexts}>
                        <p className={cls.paymentMethodsText1}>{t('Choose payment method')}:</p>
                        <p className={cls.paymentMethodsText2}>{t('Commission for any payment method is 0%')}</p>
                    </div>
                    <div className={cls.paymentOptions}>
                        {paymentOptions.map((option, index) => (
                            <div key={option.value} className={cls.paymentOption} onClick={() => handlePaymentMethod(option.value)}>
                                <span className={cls.paymentOptionIcon}>{option.icon}</span>
                                <p className={cls.paymentOptionLabel}>{t(option.label)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};