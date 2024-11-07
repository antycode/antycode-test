import React, {useState} from 'react';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import cls from './LoginForm.module.scss';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useTranslation} from 'react-i18next';
import {Input} from '@/shared/components/Input';

import clsx from 'clsx';
import {fetchData} from '@/shared/config/fetch';
import {FormNames, HandleDialogParamsProps, AuthorizationFormHeader} from '@/app/components/AuthorizationForm';
import {useDispatch} from "react-redux";
import {setToken} from "@/store/reducers/AuthReducer";
import {usePaymentStore} from "@/features/payment/store";
import {AppRoutes} from "@/shared/const/router";
import {PrivacyPolicy} from "@/app/components/Rules/PrivacyPolicy";
import {PublicOfferAgreement} from "@/app/components/Rules/PublicOfferAgreement/PublicOfferAgreement";


type LoginFormProps = {
    handleDialog: (data?: HandleDialogParamsProps) => void;
    setCurrentFormName: React.Dispatch<React.SetStateAction<string>>;
    currentFormName: string;
};


export const LoginForm = (props: LoginFormProps) => {
    const {handleDialog, setCurrentFormName, currentFormName} = props;

    const dispatch = useDispatch();

    const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState<boolean>(false);
    const [publicOfferOpen, setPublicOfferOpen] = useState<boolean>(false);

    const [loginError, setLoginError] = useState<string>('');
    const {t} = useTranslation();
    const validationSchema = z
        .object({
            email: z.string().min(1, {message: t('Email is required')}).email({
                message: t('Must be a valid email'),
            }),
            password: z
                .string()
                .min(1, {message: t('Password is required')}),
        })


    type LoginFormValidationType = z.TypeOf<typeof validationSchema>;


    const formMethods = useForm<LoginFormValidationType>({
        resolver: zodResolver(validationSchema),
        defaultValues: {}
    });


    const {
        control,
        formState: {errors},
        handleSubmit,
    } = formMethods;
    const onSubmit = async (data: LoginFormValidationType) => {
        setLoginError('');
        const loginData = {...data};
        fetchData({url: '/customer/login', method: 'POST', data}).then((data: any) => {
            console.log('login', data)
            if (data.is_success) {
                const token = data.data.customer.token;
                if (token) {
                    localStorage.removeItem("cryptopayData");
                    dispatch(setToken(token));
                    handleDialog({newUserToken: token, formToDisplay: FormNames.not_displayed});
                    // if (!data.data.tariff.tariff_external_id) {
                    //     window.location.href = AppRoutes.PAYMENT;
                    // }
                    // window.location.href = AppRoutes.MAIN;
                }
            } else {
                setLoginError('Error login!');
            }
        }).catch((err: Error) => {
            if (err.message) {
                setLoginError(err.message);
            }
        })
    };

    const openPrivacyPolicy = () => {
      setPrivacyPolicyOpen(true);
      setPublicOfferOpen(false);
    };

    const openPublicOffer = () => {
        setPrivacyPolicyOpen(false);
        setPublicOfferOpen(true);
    };

    return (
        <div>
            {!publicOfferOpen && !privacyPolicyOpen && (
                <>
                    <AuthorizationFormHeader formTitle={t('Login to your personal account')} setCurrentFormName={setCurrentFormName} currentFormName={currentFormName}/>
                    <FormProvider {...formMethods}>
                        <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
                            <div className={cls.formPage}>

                                <div className={cls.field}>
                                    <div className={cls.label}>{t('Enter E-mail')}</div>
                                    <div className={cls.controls}>
                                        <Controller
                                            control={control}
                                            name='email'
                                            render={({field}) => (
                                                <Input {...field}
                                                       onChange={(evt) => {
                                                           setLoginError('')
                                                           field.onChange(evt)
                                                       }}
                                                       className={clsx(cls.formInput, cls.modalFormInput)}
                                                       placeholder={t('Enter E-mail')}
                                                       error={errors.email?.message}/>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className={cls.field}>
                                    <div className={cls.label}>{t('Password')}</div>
                                    <div className={cls.controls}>
                                        <Controller
                                            control={control}
                                            name='password'
                                            render={({field}) => (
                                                <Input {...field}
                                                       onChange={(evt) => {
                                                           setLoginError('')
                                                           field.onChange(evt)
                                                       }}
                                                       className={clsx(cls.formInput, cls.modalFormInput)}
                                                       type='password'
                                                       placeholder={t('Your password')}
                                                       error={errors.password?.message}/>
                                            )}/>
                                    </div>
                                </div>
                            </div>

                            {loginError !== '' &&
                            <div className={cls.field}>
                                {/*<div className={cls.label}></div>*/}
                                <div className={cls.controls}>
                                    <div className={cls.formErrorMessage}>
                                        <div>{t('Sorry, some error occurred when signing in')}.</div>
                                    </div>
                                </div>
                            </div>
                            }

                            <div className={cls.forgotPassword}>
                                <p className={cls.forgotPasswordBtn} onClick={() => setCurrentFormName('ForgotPasswordForm')}>{t('Forgot your password?')}</p>
                            </div>

                            <div className={cls.formBottomBtn}>
                                <button
                                    type='submit'
                                    className={cls.btnSubmit}
                                >
                                    {t('Sign in')}
                                </button>
                            </div>

                            <div className={cls.formBottom}>
                                <div className={cls.noAccount}>
                                    <p>{t("Don't have an account?")}</p>
                                    <p className={cls.registerBtn} onClick={() => setCurrentFormName('RegisterForm')}>{t('Register')}</p>
                                </div>
                                <div className={cls.privacyPolicy}>
                                    <p className={cls.privacyPolicyText}>{t('By clicking on the button, you consent to the processing of personal data and agree to')} <span className={cls.privacyPolicyBtn}
                                                                                                                                                                             onClick={openPrivacyPolicy}>{t('Privacy policy').toLowerCase()} </span> {t('and')} <span className={cls.privacyPolicyBtn}
                                                                                                                                                                                                                                                                      onClick={openPublicOffer}>{t('Public offer agreement').toLowerCase()}</span>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </>
            )}
            {privacyPolicyOpen && (
                <PrivacyPolicy setPrivacyPolicyOpen={setPrivacyPolicyOpen} />
            )}
            {publicOfferOpen && (
                <PublicOfferAgreement setPublicOfferOpen={setPublicOfferOpen} />
            )}
        </div>
    );
};
