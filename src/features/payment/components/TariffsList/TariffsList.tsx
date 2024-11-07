import React, {Dispatch, SetStateAction} from 'react';
import cls from '@/pages/PaymentPage/components/PaymentPage.module.scss';
import {ReactComponent as CloseIcon} from "@/shared/assets/icons/close.svg";
import {ReactComponent as ArrowDownLightIcon} from "@/shared/assets/icons/arrow-down-light.svg";
import {ReactComponent as BtnUpIcon} from "@/shared/assets/icons/btn-up.svg";
import {ReactComponent as BtnDownIcon} from "@/shared/assets/icons/btn-down.svg";
import {useTranslation} from "react-i18next";
import {usePaymentStore} from "@/features/payment/store";
import {TariffsListItem} from "@/features/payment/components/TariffsList/TariffsListItem";

interface TariffsListProps {
    setActiveTariffsPopup: Dispatch<SetStateAction<boolean>>;
    activeTariffsPopup: boolean;
    insufficientBalanceError: boolean;
    setInsufficientBalanceError: Dispatch<SetStateAction<boolean>>;
    tariffSuccessBought: boolean | null;
    setTariffSuccessBought: Dispatch<SetStateAction<boolean | null>>;
}

export const TariffsList = (props: TariffsListProps) => {
    const {setActiveTariffsPopup, activeTariffsPopup, insufficientBalanceError, setInsufficientBalanceError, tariffSuccessBought, setTariffSuccessBought} = props;

    const {t} = useTranslation();

    const {setTariffs, tariffs} = usePaymentStore();

    return (
        <>
            <div className={cls.modalWindowHeader}>
                <span className={cls.freeSpace}/>
                <p className={cls.modalWindowTitle}>{t('Buy plan')}</p>
                <CloseIcon className={cls.closeBtn} onClick={() => setActiveTariffsPopup(false)}/>
            </div>
            <div className={cls.tariffsWrapper}>
                {insufficientBalanceError && (
                    <div className={cls.balanceError}>{t('Insufficient funds on balance')}</div>
                )}
                {tariffSuccessBought && (
                    <div className={cls.tariffSuccess}>{t('The plan was successfully purchased')}</div>
                )}
                <div className={cls.tariffsContent}>
                    {tariffs.map((option: any) =>
                        <TariffsListItem key={option.external_id} option={option} activeTariffsPopup={activeTariffsPopup} insufficientBalanceError={insufficientBalanceError} setInsufficientBalanceError={setInsufficientBalanceError} setTariffSuccessBought={setTariffSuccessBought} />
                    )}
                </div>
            </div>
        </>
    );
};