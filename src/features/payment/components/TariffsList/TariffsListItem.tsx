import React, {useEffect, useState, useRef, Dispatch, SetStateAction} from 'react';
import cls from "@/pages/PaymentPage/components/PaymentPage.module.scss";
import {ReactComponent as BtnUpIcon} from "@/shared/assets/icons/btn-up.svg";
import {ReactComponent as BtnDownIcon} from "@/shared/assets/icons/btn-down.svg";
import {useTranslation} from "react-i18next";
import {fetchData} from "@/shared/config/fetch";
import {shell} from "electron";
import {useWorkspacesStore} from "@/features/workspace/store";
import LoaderDotsWhite from "@/shared/assets/loaders/loadersDotsWhite/LoaderDotsWhite";
import {setToken} from "@/store/reducers/AuthReducer";
import {useDispatch} from "react-redux";

interface TariffsListItemProps {
    option: { [key: string]: any };
    activeTariffsPopup: boolean;
    insufficientBalanceError: boolean;
    setInsufficientBalanceError: Dispatch<SetStateAction<boolean>>;
    setTariffSuccessBought: Dispatch<SetStateAction<boolean | null>>;
}

export const TariffsListItem = (props: TariffsListItemProps) => {
    const {
        option,
        activeTariffsPopup,
        insufficientBalanceError,
        setInsufficientBalanceError,
        setTariffSuccessBought
    } = props;
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {myTeams, customerData, setMyTeams, setCustomerData} = useWorkspacesStore();

    const [totalProfiles, setTotalProfiles] = useState<number>(option.total_profile);
    const [totalTokens, setTotalTokens] = useState<number | string>(option.total_token);
    const [tariffPrice, setTariffPrice] = useState<number>(option.price);
    const [priceLoaderActive, setPriceLoaderActive] = useState<boolean>(false);
    const [canNotCalcTariff, setCanNotCalcTariff] = useState<boolean>(false);

    const debounceTimeout = useRef<any>(null);

    const debounceCalcTariff = (totalTokens: number | string, totalProfiles: number) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            calcTariff(totalTokens, totalProfiles);
            setCanNotCalcTariff(true);
        }, 2000);
    };

    const handleQuantityProfilesChange = (method: string) => {
        if (!canNotCalcTariff) {
            setPriceLoaderActive(true);
            if (method === 'plus') {
                setTotalProfiles((prevState) => {
                    const newProfiles = prevState + option.total_profile;
                    debounceCalcTariff(totalTokens, newProfiles);
                    return newProfiles;
                });
                // setTariffPrice((prevState) => prevState + option.price_profile);
            } else if (method === 'minus') {
                setTotalProfiles((prevState) => {
                    if (prevState > option.total_profile) {
                        const newProfiles = prevState - option.total_profile;
                        debounceCalcTariff(totalTokens, newProfiles);
                        // setTariffPrice((prevState) => prevState - option.price_profile);
                        return newProfiles;
                    }
                    return prevState;
                });
            }
        }
    };

    const handleQuantityTokensChange = (method: string) => {
        if (!canNotCalcTariff) {
            setPriceLoaderActive(true);
            if (method === 'plus') {
                setTotalTokens((prevState) => {
                    const newTokens = (prevState as number) + option.total_token;
                    debounceCalcTariff(newTokens, totalProfiles);
                    return newTokens;
                });
                // setTariffPrice((prevState) => prevState + option.price_token);
            } else if (method === 'minus') {
                setTotalTokens((prevState) => {
                    if (prevState > option.total_token) {
                        const newTokens = (prevState as number) - option.total_token;
                        debounceCalcTariff(newTokens, totalProfiles);
                        // setTariffPrice((prevState) => prevState - option.price_token);
                        return newTokens;
                    }
                    return prevState;
                });
            }
        }
    };

    const handleChangeTokens = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canNotCalcTariff) {
            const value = parseInt(e.target.value, 10);
            if (isNaN(value)) {
                setTotalTokens('');
            } else {
                setTotalTokens(value);
                debounceCalcTariff(value, totalProfiles);
            }
        }
    };

    const handleBlurTokens = () => {
        if (totalTokens < option.total_token) {
            setTotalTokens(option.total_token);
            // setTariffPrice(option.price);
        }
    };

    const buyTariff = () => {
        if (totalProfiles >= option.total_profile && totalTokens >= option.total_token) {
            if (Object.keys(customerData).length && customerData.customer?.balance > tariffPrice) {
                let teamId: any;
                if (myTeams.length) {
                    teamId = myTeams[0].external_id;
                    let submitData: any;
                    if (customerData.tariff.tariff_external_id === option.external_id) {
                        submitData = {
                            tariff_external_id: option.external_id,
                            total_token: totalTokens,
                            total_profile: totalProfiles,
                            is_duration: false
                        };
                    } else {
                        submitData = {
                            tariff_external_id: option.external_id,
                            total_token: totalTokens,
                            total_profile: totalProfiles,
                            is_duration: true
                        };
                    }
                    console.log('submitData', submitData);
                    fetchData({
                        url: '/customer/tariff',
                        method: 'POST',
                        data: submitData,
                        team: teamId
                    }).then((data: any) => {
                        console.log('Data after buy tariff: ', data);
                        if (data.is_success) {
                            setTariffSuccessBought(true);
                        }
                    }).catch((err) => {
                        console.log('Buy tariff', err);
                    });
                } else {
                    fetchMyTeams().then((data: any) => {
                        if (data && data.length) {
                            teamId = data[0].external_id;
                            let submitData: any;
                            if (customerData.tariff.tariff_external_id === option.external_id) {
                                submitData = {
                                    tariff_external_id: option.external_id,
                                    total_token: totalTokens,
                                    total_profile: totalProfiles,
                                    is_duration: false
                                };
                            } else {
                                submitData = {
                                    tariff_external_id: option.external_id,
                                    total_token: totalTokens,
                                    total_profile: totalProfiles,
                                    is_duration: true
                                };
                            }
                            console.log('submitData', submitData);
                            fetchData({
                                url: '/customer/tariff',
                                method: 'POST',
                                data: submitData,
                                team: teamId
                            }).then((data: any) => {
                                console.log('Data after buy tariff: ', data);
                                if (data.is_success) {
                                    setTariffSuccessBought(true);
                                    fetchCustomerData();
                                }
                            }).catch((err) => {
                                console.log('Buy tariff', err);
                            });
                        }
                    });
                }
            } else {
                setInsufficientBalanceError(true);
                console.log('Insufficient funds on balance!');
            }
        } else {
            console.log('Submit data not valid!');
        }
    };

    const calcTariff = (totalToken: number | string, totalProfile: number) => {
        let teamId: any;
        if (myTeams.length) {
            teamId = myTeams[0].external_id;
            let submitData: any;
            if (customerData.tariff.tariff_external_id === option.external_id) {
                submitData = {
                    tariff_external_id: option.external_id,
                    total_token: totalToken,
                    total_profile: totalProfile,
                    is_duration: false
                };
            } else {
                submitData = {
                    tariff_external_id: option.external_id,
                    total_token: totalToken,
                    total_profile: totalProfile,
                    is_duration: true
                };
            }
            console.log('submitData', submitData)
            fetchData({
                url: '/customer/tariff/calc',
                method: 'POST',
                data: submitData,
                team: teamId
            }).then((data: any) => {
                if (data.is_success) {
                    setTariffPrice(data.data.use_price);
                }
                console.log('Calc tariff: ', data);
                setPriceLoaderActive(false);
                setCanNotCalcTariff(false);
            }).catch((err) => {
                console.log('Calc tariff error: ', err);
                setPriceLoaderActive(false);
                setCanNotCalcTariff(false);
            });
        } else {
            fetchMyTeams().then((data: any) => {
                if (data && data.length) {
                    teamId = data[0].external_id;
                    let submitData: any;
                    if (customerData.tariff.tariff_external_id === option.external_id) {
                        submitData = {
                            tariff_external_id: option.external_id,
                            total_token: totalToken,
                            total_profile: totalProfile,
                            is_duration: true
                        };
                    } else {
                        submitData = {
                            tariff_external_id: option.external_id,
                            total_token: totalToken,
                            total_profile: totalProfile,
                            is_duration: true
                        };
                    }
                    console.log('submitData', submitData)
                    fetchData({
                        url: '/customer/tariff/calc',
                        method: 'POST',
                        data: submitData,
                        team: teamId
                    }).then((data: any) => {
                        if (data.is_success) {
                            setTariffPrice(data.data.use_price);
                        }
                        console.log('Calc tariff: ', data);
                        setPriceLoaderActive(false);
                        setCanNotCalcTariff(false);
                    }).catch((err) => {
                        console.log('Calc tariff error: ', err);
                        setPriceLoaderActive(false);
                        setCanNotCalcTariff(false);
                    });
                }
            });
        }
    };

    const fetchMyTeams = async () => {
        try {
            const response = await fetchData({url: '/team/my-teams', method: 'GET'});
            if (response.errorCode === 7 && response.errorMessage && response.errorMessage.includes('not found')) {
                return dispatch(setToken(''));
            }
            if (response.is_success) {
                setMyTeams(response.data);
                const localTeamId = localStorage.getItem('teamId');
                const teamFromList = response.data.find((i: any) => i.external_id === localTeamId);
                if (teamFromList) {
                    return response.data;
                }
                localStorage.setItem('teamId', response.data[0].external_id);
                return response.data;
            } else {
                return {is_success: false};
            }
        } catch (error) {
            console.error('Error fetching my teams:', error);
            return {is_success: false};
        }
    };

    const fetchCustomerData = () => {
        const teamId = localStorage.getItem('teamId');
        fetchData({url: `/customer`, method: 'GET', team: teamId}).then((data: any) => {
            console.log('customer data', data)
            if (data.is_success) {
                if (data.data) {
                    setCustomerData(data?.data);
                }
            }
        }).catch((err: Error) => {
            console.log('/customer get error: ', err);
        })
    };

    useEffect(() => {
        setTotalProfiles(option.total_profile);
        setTotalTokens(option.total_token);
        setTariffPrice(option.price);
        setInsufficientBalanceError(false);
        setTariffSuccessBought(null);

        if (customerData.tariff?.tariff_external_id === option.external_id) {
            setPriceLoaderActive(true);
            calcTariff(option.total_token, option.total_profile);
        }
    }, [activeTariffsPopup]);

    return (
        <div className={cls.optionWrapper}>
            <div className={cls.optionTitleWrapper}>
                <p className={cls.optionTitle}>
                    {option.title}
                </p>
                <p className={cls.optionTitle}>
                    {priceLoaderActive
                        ? <LoaderDotsWhite/>
                        : <>${tariffPrice}</>
                    }
                </p>
            </div>
            <div className={cls.listWrapper}>
                <ul className={cls.list}>
                    <li className={cls.listItem}>{option.total_profile} {t('Profiles').toLowerCase()}</li>
                    <li className={cls.listItem}>
                        {option.total_token
                            ? <span>{option.total_token} {t('Users').toLowerCase()}</span>
                            : <span>{t('Without users')}</span>
                        }
                    </li>
                    <li className={cls.listItem}>
                        {option.price_token
                            ? <p>{t('Adding a user')}: ${option.price_token}</p>
                            : <p>{t('Cannot add user')}</p>
                        }
                    </li>
                    <li className={cls.listItem}>
                        {option.price_profile
                            ? <p>{t('Add.')} {option.total_profile} {t('profiles')}: ${option.price_profile}</p>
                            : <p>{t('Profiles cannot be added')}</p>
                        }
                    </li>
                    <li className={cls.listItem}>{t('All functionality of the anti-detect browser is available')}</li>
                </ul>
            </div>
            <div className={cls.tariffForm}>
                <div className={cls.optionInputWrapper}>
                    <label className={cls.quantityLabel}>{t('Profiles')}:</label>
                    <input
                        type="number"
                        value={totalProfiles}
                        className={cls.optionInput}
                        disabled
                    />
                    {option.price_profile !== 0 && (
                        <div className={cls.changeQuantityBtnsWrapper}>
                            <BtnUpIcon
                                className={cls.iconUp}
                                onClick={() => {
                                    handleQuantityProfilesChange('plus')
                                }}
                            />
                            <BtnDownIcon
                                className={cls.iconDown}
                                onClick={() => {
                                    handleQuantityProfilesChange('minus')
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className={cls.optionInputWrapper}>
                    <label className={cls.quantityLabel}>{t('Users')}:</label>
                    <input
                        type="number"
                        value={totalTokens}
                        disabled
                        className={cls.optionInput}
                        onChange={(e) => handleChangeTokens(e)}
                        onBlur={handleBlurTokens}
                    />
                    {option.price_token !== 0 && (
                        <div className={cls.changeQuantityBtnsWrapper}>
                            <BtnUpIcon
                                className={cls.iconUp}
                                onClick={() => {
                                    handleQuantityTokensChange('plus')
                                }}
                            />
                            <BtnDownIcon
                                className={cls.iconDown}
                                onClick={() => {
                                    handleQuantityTokensChange('minus')
                                }}
                            />
                        </div>
                    )}
                </div>
                <button className={cls.optionSubmitBtn} onClick={buyTariff}>{t('Buy')}</button>
                {/*{customerData.tariff?.tariff_external_id === option.external_id && (*/}
                {/*    <button className={cls.optionSubmitBtn} onClick={buyTariff}>{t('Extend')}</button>)}*/}
                {/*{customerData.tariff?.tariff_external_id !== option.external_id && (*/}
                {/*    <button className={cls.optionSubmitBtn} onClick={buyTariff}>{t('Buy')}</button>)}*/}
            </div>
        </div>
    );
};