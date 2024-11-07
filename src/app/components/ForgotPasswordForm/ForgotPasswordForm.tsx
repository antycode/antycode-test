import React, {useState} from 'react';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import cls from './ForgotPasswordForm.module.scss';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useTranslation} from 'react-i18next';
import {Input} from '@/shared/components/Input';

import clsx from 'clsx';
import {fetchData} from '@/shared/config/fetch';
import {FormNames, HandleDialogParamsProps, AuthorizationFormHeader} from '@/app/components/AuthorizationForm';
import {useDispatch} from "react-redux";

type ForgotPasswordFormProps = {
    handleDialog: (data?: HandleDialogParamsProps) => void;
    setCurrentFormName: React.Dispatch<React.SetStateAction<string>>;
    currentFormName: string;
};


export const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const {handleDialog, setCurrentFormName, currentFormName} = props;

    const dispatch = useDispatch();

    const {t} = useTranslation();

    const [emailError, setEmailError] = useState<string>('');
    const [sendMessageSuccess, setSendMessageSuccess] = useState<boolean | null>(null);
    const [email, setEmail] = useState<string>('');
    const [resendEmailSuccess, setResendEmailSuccess] = useState<boolean | null>(null);

    const validationSchema = z
        .object({
            email: z.string().min(1, {message: t('Email is required')}).email({
                message: t('Must be a valid email'),
            })
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
        const dataEmail = data.email;
        fetchData({url: '/customer/forget-password', method: 'POST', data}).then((data: any) => {
            if (!data.is_success) {
                setEmailError('Error email!');
                setSendMessageSuccess(false);
                setResendEmailSuccess(false);
            } else {
                setEmail(dataEmail);
                setSendMessageSuccess(true);
            }
        }).catch((err: Error) => {
            if (err.message) {
                setEmailError(err.message);
                setSendMessageSuccess(false);
            }
        });
    };

    const resendEmail = (e: any) => {
        e.preventDefault();
        setResendEmailSuccess(null);
        fetchData({url: '/customer/forget-password', method: 'POST', data: {email: email}}).then((data: any) => {
            if (!data.is_success) {
                setEmailError('Error email!');
                setResendEmailSuccess(false);
            } else {
                setResendEmailSuccess(true);
            }
        }).catch((err: Error) => {
            if (err.message) {
                setEmailError(err.message);
            }
        });
    };

    return (
        <div>
            <AuthorizationFormHeader formTitle={t('Forgot your password?')} setCurrentFormName={setCurrentFormName}
                                     currentFormName={currentFormName}/>
            {sendMessageSuccess &&
            (<div className={cls.messageContentWrapper}>
                <div className={cls.messageContent}>
                    <div className={cls.messageMainContent}>
                        <p className={cls.message}>{t('An email with a confirmation link has been sent to your contact E-mail')}</p>
                        <button className={cls.resendBtn} onClick={(e) => resendEmail(e)}>
                            {t('Resend')}
                        </button>
                    </div>
                    {resendEmailSuccess && (
                        <p className={cls.resendMessageSuccess}>{t('The email was resent successfully')}</p>
                    )}
                    {resendEmailSuccess === false && (
                        <p className={cls.resendMessageError}>{t('A letter can be sent once every 30 seconds')}</p>
                    )}
                </div>
                <button className={cls.btnSubmit} onClick={() => setCurrentFormName('LoginForm')}>
                    {t('Exit')}
                </button>
            </div>)
            }
            {!sendMessageSuccess && (<FormProvider {...formMethods}>
                <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={cls.formPage}>
                        <div className={cls.receivePasswordRule}>
                            <p className={cls.receivePasswordRuleText}>{t('Enter your account email address. Click continue to receive your password by email')}.</p>
                        </div>
                        <div className={cls.field}>
                            <div className={cls.label}>{t('E-mail address')}:</div>
                            <div className={cls.controls}>
                                <Controller
                                    control={control}
                                    name='email'
                                    render={({field}) => (
                                        <Input {...field}
                                               onChange={(evt) => {
                                                   setEmailError('');
                                                   field.onChange(evt);
                                               }}
                                               className={clsx(cls.formInput, cls.modalFormInput)}
                                               placeholder={t('E-mail address')}
                                            // error={errors.email?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {resendEmailSuccess === false && (
                            <p className={cls.resendMessageError}>{t('A letter can be sent once every 30 seconds')}</p>
                        )}
                    </div>
                    <div className={cls.formBottomBtn}>
                        <button
                            type='submit'
                            className={cls.btnSubmit}
                        >
                            {t('Continue')}
                        </button>
                        <button className={cls.btnBack} onClick={() => setCurrentFormName('LoginForm')}>
                            {t('Back')}
                        </button>
                    </div>
                </form>
            </FormProvider>)
            }
        </div>
    );
};
