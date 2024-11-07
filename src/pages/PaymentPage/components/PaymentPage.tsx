import React, { useEffect, useState } from 'react';
import cls from './PaymentPage.module.scss';
import { UsdtTrc20Payment } from '@/features/payment/components/UsdtTrc20Payment/UsdtTrc20Payment';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ReactComponent as MastercardVisaIcon } from '@/shared/assets/icons/mastercard-visa.svg';
import { ReactComponent as Privat24Icon } from '@/shared/assets/icons/privat24.svg';
import { ReactComponent as UsdtTrc20Icon } from '@/shared/assets/icons/usdt-trc20.svg';
import { ReactComponent as ApplePayIcon } from '@/shared/assets/icons/apple-pay.svg';
import { ReactComponent as GooglePayIcon } from '@/shared/assets/icons/google-pay.svg';
import { ReactComponent as PaypalIcon } from '@/shared/assets/icons/paypal.svg';
import { ReactComponent as CapitalistIcon } from '@/shared/assets/icons/capitalist.svg';
import { ReactComponent as BinancePayIcon } from '@/shared/assets/icons/binance-pay.svg';
import { ReactComponent as CryptocurrencyIcon } from '@/shared/assets/icons/cryptocurrency-pay.svg';
import { ReactComponent as MastercardSecureCodeIcon } from '@/shared/assets/icons/mastercard-secure-code.svg';
import { ReactComponent as VerifiedByVisaIcon } from '@/shared/assets/icons/verified-by-visa.svg';
import { ReactComponent as LiqpayIcon } from '@/shared/assets/icons/liqpay.svg';
import { ReactComponent as PayIcon } from '@/shared/assets/icons/pay.svg';
import { PaymentHistoryList } from '@/features/payment/components/PaymentHistoryList/PaymentHistoryList';
import { fetchData } from '@/shared/config/fetch';
import { useWorkspacesStore } from '@/features/workspace/store';
import { shell } from 'electron';
import { ModalWindow2 } from '@/shared/components/ModalWindow2/ModalWindow2';
import { usePaymentStore } from '@/features/payment/store';
import { Loader } from '@/shared/components/Loader';
import { TariffsList } from '@/features/payment/components/TariffsList/TariffsList';
import { setToken } from '@/store/reducers/AuthReducer';
import { useDispatch } from 'react-redux';
import { AccountInfo } from '@/features/accountInfo';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { string } from 'zod';
import { ReactComponent as FlagUkraineIcon } from '@/shared/assets/icons/flag-ukraine.svg';
import { ReactComponent as FlagPolandIcon } from '@/shared/assets/icons/flag-poland.svg';
import { ReactComponent as ArrowDownLightIcon } from '@/shared/assets/icons/arrow-down-light.svg';
import { ReactComponent as BtnUpIcon } from '@/shared/assets/icons/btn-up.svg';
import { ReactComponent as BtnDownIcon } from '@/shared/assets/icons/btn-down.svg';
import { ModalWindow } from '@/shared/components/ModalWindow/ModalWindow';
import { useBuyProxyData } from '@/pages/ProxiesPage/components/BuyProxy/useBuyProxyData';
import { AppRoutes } from '@/shared/const/router';

export const PaymentPage = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { myTeams, setMyTeams, customerData } = useWorkspacesStore();
  const {
    setTransactions,
    isLoading,
    setIsLoading,
    tariffs,
    transactions,
    setFilteredTransactions,
    filteredTransactions,
    setActiveCryptopayPopup,
    activeCryptopayPopup,
    timePassed,
    setTimePassed,
    paymentSuccess,
    setPaymentSuccess,
    currentPage,
    setCurrentPage,
    perPageCount,
    setPerPageCount,
    setTotalPages,
    totalPages,
  } = usePaymentStore();

  const [depositValue, setDepositValue] = useState<string>('');
  // const [activeCryptopayPopup, setActiveCryptopayPopup] = useState<boolean>(false);
  const [activeTariffsPopup, setActiveTariffsPopup] = useState<boolean>(false);
  // const [timePassed, setTimePassed] = useState<boolean>(false);

  const [minDeposit, setMinDeposit] = useState<number>(10);
  const [errorMinAmountOfMoney, setErrorMinAmountOfMoney] = useState<boolean>(false);
  const [insufficientBalanceError, setInsufficientBalanceError] = useState<boolean>(false);
  const [tariffSuccessBought, setTariffSuccessBought] = useState<boolean | null>(null);
  const [activePages, setActivePages] = useState<number[]>([1]);

  const [isOpenErrorTariff, setIsOpenErrorTariff] = useState<boolean>(false);

  const [buyProxyFormActive, setBuyProxyFormActive] = useState<boolean>(false);
  const [selectedGeo, setSelectedGeo] = useState<{ [key: number]: string }>({
    1: 'Ukraine',
    2: 'Ukraine',
    3: 'Ukraine',
  });
  const [isOpen, setIsOpen] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
  });
  // const [proxyQuantity, setProxyQuantity] = useState<number>(1);
  const [proxyQuantities, setProxyQuantities] = useState<any>({
    1: 1,
    2: 1,
    3: 1,
  });

  const paymentOptions = [
    { payment_system: 'liqpay', label: 'Bank card', icon: <MastercardVisaIcon /> },
    { payment_system: 'liqpay', label: 'Privat24', icon: <Privat24Icon /> },
    { payment_system: 'cryptopay', label: 'USDT (TRC20)', icon: <UsdtTrc20Icon /> },
    { payment_system: 'liqpay', label: 'ApplePay', icon: <ApplePayIcon /> },
    { payment_system: 'liqpay', label: 'GooglePay', icon: <GooglePayIcon /> },
    { payment_system: 'liqpay', label: 'PayPal', icon: <PaypalIcon /> },
    { payment_system: 'capitalist', label: 'Capitalist', icon: <CapitalistIcon /> },
    { payment_system: 'binance_pay', label: 'BinancePay', icon: <BinancePayIcon /> },
    { payment_system: 'cryptopay', label: 'Cryptocurrency', icon: <CryptocurrencyIcon /> },
  ];

  const closeBuyProxyPopup = () => {
    setSelectedGeo({
      1: 'Ukraine',
      2: 'Ukraine',
      3: 'Ukraine',
    });
    setIsOpen({
      1: false,
      2: false,
      3: false,
    });
    setProxyQuantities({
      1: 1,
      2: 1,
      3: 1,
    });
    setBuyProxyFormActive(false);
  };

  const toggleDropdown = (optionId: number) => {
    setIsOpen((prevIsOpen) => ({
      ...prevIsOpen,
      [optionId]: !prevIsOpen[optionId],
    }));
  };

  const handleOptionClick = (optionId: number, optionGeo: string) => {
    setSelectedGeo((prevSelectedGeo) => ({
      ...prevSelectedGeo,
      [optionId]: optionGeo,
    }));
    toggleDropdown(optionId);
  };

  const proxyOptions = useBuyProxyData(selectedGeo);

  const handleQuantityChange = (optionId: number, newQuantity: number) => {
    setProxyQuantities((prevQuantities: any) => ({
      ...prevQuantities,
      [optionId]: newQuantity,
    }));
  };

  const handleAmountChange = (e: any) => {
    setErrorMinAmountOfMoney(false);

    const inputValue = e.target.value;

    const validInput = /^\d{0,8}(\.\d{0,2})?$/;

    if (inputValue === '' || validInput.test(inputValue)) {
      setDepositValue(inputValue);
    }

    if (errorMinAmountOfMoney) {
      if (inputValue === '') {
        setErrorMinAmountOfMoney(false);
      }
    }
  };

  const closeCryptopayPopup = () => {
    setActiveCryptopayPopup(false);
  };

  const closeTariffsPopup = () => {
    setActiveTariffsPopup(false);
  };

  const openTariffsPopup = () => {
    if (tariffs.length) {
      setActiveTariffsPopup(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setActivePages([page]);
  };

  const handlePaymentMethod = (paymentSystem: string) => {
    if (+depositValue < minDeposit) {
      setErrorMinAmountOfMoney(true);
    } else {
      upBalance(paymentSystem, +depositValue);
    }
  };

  const upBalance = (paymentSystem: string, amount: number) => {
    if (paymentSystem === 'cryptopay') {
      const cachedData = localStorage.getItem('cryptopayData');
      if (cachedData && !timePassed) {
        const parsedData = JSON.parse(cachedData);
        const currentTime = new Date().getTime();
        const dataTime = new Date(parsedData.date_created).getTime();
        const thirtyMinutes = 30 * 60 * 1000;

        if (currentTime - dataTime < thirtyMinutes) {
          console.log('Using cached data:', parsedData);
          setActiveCryptopayPopup(true);
        } else {
          localStorage.removeItem('cryptopayData');
          const submitData = { amount: amount };
          const teamId = localStorage.getItem('teamId');
          fetchData({
            url: '/billing/cryptopay',
            method: 'POST',
            data: submitData,
            team: teamId,
          })
            .then((data: any) => {
              if (data.is_success) {
                localStorage.setItem('cryptopayData', JSON.stringify(data.data));
                setTimePassed(false);
                setActiveCryptopayPopup(true);
              }
            })
            .catch((err) => {
              console.log('Up balance', err);
            });
        }
      } else {
        const submitData = { amount: amount };
        const teamId = localStorage.getItem('teamId');
        fetchData({
          url: '/billing/cryptopay',
          method: 'POST',
          data: submitData,
          team: teamId,
        })
          .then((data: any) => {
            if (data.is_success) {
              localStorage.setItem('cryptopayData', JSON.stringify(data.data));
              setTimePassed(false);
              setActiveCryptopayPopup(true);
            }
          })
          .catch((err) => {
            console.log('Up balance', err);
          });
      }
    } else {
      const submitData = { payment_system: paymentSystem, amount: amount };
      const teamId = localStorage.getItem('teamId');
      fetchData({
        url: '/billing/payment',
        method: 'POST',
        data: submitData,
        team: teamId,
      })
        .then((data: any) => {
          if (data.is_success && data.data.url) {
            setDepositValue('');
            shell.openExternal(data.data.url).catch((err) => {
              console.log('Shell open link error: ', err);
            });
          }
        })
        .catch((err) => {
          console.log('Up balance', err);
        });
    }
  };

  const fetchTransactions = () => {
    const teamId = localStorage.getItem('teamId');
    fetchData({ url: '/billing/transaction', method: 'GET', team: teamId })
      .then((data: any) => {
        if (data.is_success) {
          setTransactions(data?.data);
          if (!filteredTransactions.length) {
            setFilteredTransactions(data?.data);
          }
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        console.log('Error of get cookies:', err);
      });
  };

  const fetchMyTeams = async () => {
    try {
      const response = await fetchData({ url: '/team/my-teams', method: 'GET' });
      if (
        response.errorCode === 7 &&
        response.errorMessage &&
        response.errorMessage.includes('not found')
      ) {
        return dispatch(setToken(''));
      }
      if (response.is_success) {
        setMyTeams(response.data);
        const localTeamId = localStorage.getItem('teamId');
        const teamFromList = response.data.find((i: any) => i.external_id === localTeamId);
        if (teamFromList) {
          return teamFromList.external_id;
        }
        localStorage.setItem('teamId', response.data[0].external_id);
        return response.data;
      } else {
        return { is_success: false };
      }
    } catch (error) {
      console.error('Error fetching my teams:', error);
      return { is_success: false };
    }
  };

  // const getCurrentCustomerTariff = () => {
  //     const teamId = localStorage.getItem('teamId');
  //     fetchData({url: '/customer/tariff', method: 'GET', team: teamId}).then((data: any) => {
  //         if (data.is_success) {
  //             console.log('Current tariff: ', data);
  //             // setTransactions(data?.data);
  //         }
  //     }).catch((err: Error) => {
  //         console.log('Error current tariff:', err);
  //     });
  // };

  const checkTariff = () => {
    const teamIdFromLocal = localStorage.getItem('teamId');
    const selectedTeam = myTeams?.find((team: any) => team.external_id === teamIdFromLocal);
    if (selectedTeam && customerData?.customer?.nickname === selectedTeam.nickname) {
      const dateTariffFinish = new Date(customerData?.tariff?.date_tariff_finish);
      if (customerData?.tariff?.date_tariff_finish && new Date() <= dateTariffFinish) {
        return true;
      }
      return false;
    } else if (
      selectedTeam &&
      selectedTeam.is_confirmed &&
      selectedTeam.limits?.total_profile > 0
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchMyTeams().then();
    fetchTransactions();
  }, []);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  return (
    <div className="page">
      <div className={cls.content}>
        <div className={cls.header}>
          <div className={cls.navWrapper}>
            <div className={cls.navContent}>
              <div className={cls.activeNavBtnWrapper}>
                <button>{t('Add funds')}</button>
              </div>
              <div className={cls.navBtnWrapper}>
                <button className={cls.navBtn} onClick={openTariffsPopup}>
                  {t('Buy plan')}
                </button>
              </div>
              <div className={cls.navBtnWrapper}>
                <button
                  className={cls.navBtn}
                  onClick={() => {
                    if (checkTariff()) {
                      setBuyProxyFormActive(true);
                    } else {
                      setIsOpenErrorTariff(true);
                    }
                  }}>
                  {t('Buy proxy')}
                </button>
              </div>
            </div>
          </div>
          <div className={cls.paymentAndUsdtPopup}>
            <div className={cls.payment}>
              <div className={cls.amountWrapper}>
                <div className={cls.textWrapper}>
                  <p className={cls.mainText}>{t('Enter the top-up amount')}:</p>
                  <p className={cls.amountText}>{t('Minimum deposit amount $10')}</p>
                </div>
                <div>
                  <div className={cls.amountAndPayment}>
                    <div className={cls.amountInputContent}>
                      <div
                        className={clsx(
                          cls.dollarSign,
                          depositValue !== '' ? cls.dollarSignActive : '',
                        )}>
                        $
                      </div>
                      <input
                        className={cls.amountInput}
                        type="text"
                        placeholder={'0.00'}
                        value={depositValue}
                        onChange={handleAmountChange}
                      />
                    </div>
                    <div className={cls.paymentbadge}>
                      <span className={cls.paymentOptionIcon}>
                        <UsdtTrc20Icon />
                      </span>
                      <p className={cls.paymentOptionLabel}>USDT (TRC20)</p>
                    </div>
                  </div>
                  <p
                    className={cls.errorValidation}
                    style={{ opacity: errorMinAmountOfMoney ? '1' : '0' }}>
                    {t('Amount should not be less than')} ${minDeposit}
                  </p>
                </div>
                <div>
                  <button
                    className={cls.btnPayment}
                    onClick={() => handlePaymentMethod('cryptopay')}>
                    {t('Top up')}
                  </button>
                </div>
              </div>
              <div className={cls.paymentMethods}>
                <p className={cls.paymentMethodsText2}>
                  {t(
                    'The wallet number for payment changes every 30 minutes. Pay within 30 minutes, the counter is indicated above. If you did not manage to pay on time, write to us in support via telegram, ',
                  )}
                  <a href="#" target="_blank">
                    @antycodesupport
                  </a>{' '}
                  {t('and we will top up your balance.')}
                </p>
              </div>
              {paymentSuccess === true && (
                <p className={cls.paymentSuccess}>{t('Payment was successful')}!</p>
              )}
            </div>
            <UsdtTrc20Payment depositValue={depositValue} />
          </div>
        </div>
        <PaymentHistoryList setActivePages={setActivePages}/>
      </div>
      <AccountInfo
        withoutPerPageSelect
        activePages={activePages}
        currentPage={currentPage}
        totalPages={totalPages}
        perPageCount={perPageCount}
        handlePageChange={handlePageChange}
      />
      {isLoading && <Loader size={75} />}
      {/*<ModalWindow2 modalWindowOpen={activeCryptopayPopup} onClose={closeCryptopayPopup}>*/}
      {/*    <UsdtTrc20Payment setActiveCryptopayPopup={setActiveCryptopayPopup} depositValue={depositValue}*/}
      {/*                      timePassed={timePassed} setTimePassed={setTimePassed}/>*/}
      {/*</ModalWindow2>*/}
      <ModalWindow2 modalWindowOpen={activeTariffsPopup} onClose={closeTariffsPopup}>
        <TariffsList
          tariffSuccessBought={tariffSuccessBought}
          setTariffSuccessBought={setTariffSuccessBought}
          setActiveTariffsPopup={setActiveTariffsPopup}
          activeTariffsPopup={activeTariffsPopup}
          insufficientBalanceError={insufficientBalanceError}
          setInsufficientBalanceError={setInsufficientBalanceError}
        />
      </ModalWindow2>
      <ModalWindow modalWindowOpen={buyProxyFormActive} onClose={closeBuyProxyPopup}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <p className={cls.modalWindowTitle}>{t('Buy proxy')}</p>
          <CloseIcon className={cls.closeBtn} onClick={() => closeBuyProxyPopup()} />
        </div>
        <div className={cls.modalWindowContent}>
          {proxyOptions.map((option: any) => (
            <div key={option.id} className={cls.optionWrapper}>
              <div className={cls.optionTitleWrapper}>
                <p className={cls.optionTitle}>
                  {t(option.titles[selectedGeo[option.id] || 'Ukraine'])}
                </p>
              </div>
              <div className={cls.listWrapper}>
                <ul className={cls.list}>
                  {option.list?.map((listItem: string) => (
                    <li className={cls.listItem} key={listItem}>
                      {t(listItem)}
                    </li>
                  ))}
                </ul>
              </div>
              <form className={cls.optionForm}>
                <div className={cls.optionInputsWrapper}>
                  <div className={cls.selectGeo}>
                    <div
                      className={`${cls.selectValue} ${
                        isOpen[option.id] ? cls.selectValueActive : ''
                      }`}>
                      <div className={cls.selectGeoText}>
                        {t('Geo')}:{' '}
                        <span className={cls.geo}>{t(selectedGeo[option.id] || 'Ukraine')}</span>
                      </div>
                      <div className={cls.changeGeo} onClick={() => toggleDropdown(option.id)}>
                        {selectedGeo[option.id] === 'Ukraine' ? (
                          <FlagUkraineIcon className={cls.flag} />
                        ) : (
                          <FlagPolandIcon className={cls.flag} />
                        )}
                        {isOpen[option.id] ? (
                          <ArrowDownLightIcon className={cls.rotatedSelectArrow} />
                        ) : (
                          <ArrowDownLightIcon />
                        )}
                      </div>
                    </div>
                    {isOpen[option.id] && (
                      <div className={cls.selectOptions}>
                        {option.geo?.map((optionGeo: string) => (
                          <div
                            key={optionGeo}
                            className={`${cls.selectOption} ${
                              selectedGeo[option.id] === optionGeo ? cls.selected : ''
                            }`}
                            onClick={() => handleOptionClick(option.id, optionGeo)}>
                            <span>{t(optionGeo)}</span>
                            <span>
                              {optionGeo === 'Ukraine' ? (
                                <FlagUkraineIcon className={cls.flag} />
                              ) : (
                                <FlagPolandIcon className={cls.flag} />
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={cls.optionInputWrapper}>
                    <label className={cls.quantityLabel}>{t('Quantity')}:</label>
                    <input
                      type="number"
                      value={proxyQuantities[option.id]}
                      className={cls.optionInput}
                      onChange={(e) => handleQuantityChange(option.id, parseInt(e.target.value))}
                    />
                    <div className={cls.changeQuantityBtnsWrapper}>
                      <BtnUpIcon
                        className={cls.iconUp}
                        onClick={() =>
                          handleQuantityChange(option.id, (proxyQuantities[option.id] || 1) + 1)
                        }
                      />
                      <BtnDownIcon
                        className={cls.iconDown}
                        onClick={() =>
                          handleQuantityChange(
                            option.id,
                            Math.max((proxyQuantities[option.id] || 1) - 1, 0),
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <button className={cls.optionSubmitBtn}>{t('Buy')}</button>
              </form>
            </div>
          ))}
        </div>
      </ModalWindow>
      <ModalWindow modalWindowOpen={isOpenErrorTariff} onClose={() => setIsOpenErrorTariff(false)}>
        <div className={cls.modalWindowHeader}>
          <span className={cls.freeSpace} />
          <div className={cls.modalHeaderTitle}>
            <p className={cls.modalTitle}>{t('Error')}</p>
          </div>
          <CloseIcon className={cls.closeBtn} onClick={() => setIsOpenErrorTariff(false)} />
        </div>
        <p className={cls.tariffErrorContent}>{t('You must purchase a plan')}</p>
        <div className={cls.approveContentModalWindow}>
          <button
            className={cls.btnApproveModalWindow}
            style={{ margin: '0 20px 20px 20px' }}
            onClick={() => {
              setIsOpenErrorTariff(false);
              openTariffsPopup();
            }}>
            {t('Buy plan')}
          </button>
        </div>
      </ModalWindow>
    </div>
  );
};
