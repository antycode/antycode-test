import React, {MutableRefObject, useRef, useState} from 'react';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import cls from './RegisterForm.module.scss';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useTranslation} from 'react-i18next';
import {Input} from '@/shared/components/Input';

import clsx from 'clsx';
import {fetchData} from '@/shared/config/fetch';
import {FormNames, HandleDialogParamsProps, AuthorizationFormHeader} from '@/app/components/AuthorizationForm';
import {PrivacyPolicy} from "@/app/components/Rules/PrivacyPolicy";
import {PublicOfferAgreement} from "@/app/components/Rules/PublicOfferAgreement/PublicOfferAgreement";

function generateUniqueString(length = 255) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

type RegisterFormProps = {
    handleDialog: (data?: HandleDialogParamsProps) => void;
    setCurrentFormName: React.Dispatch<React.SetStateAction<string>>;
    currentFormName: string;
};

// interface IFetchData {
//     email: string;
//     password: string;
//     repeatPassword: string;
// }


export const RegisterForm = (props: RegisterFormProps) => {
    const {handleDialog, setCurrentFormName, currentFormName} = props;

    const {t} = useTranslation();

    const [registerError, setRegisterError] = useState<string>('');
    const [avatarBase64, setAvatarBase64] = useState<string>('');
    const [fileName, setFileName] = useState<any>('');
    const [freeNick, setFreeNick] = useState<boolean | null>(null);
    const fileInputRef: MutableRefObject<null> | any = useRef(null);

    const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState<boolean>(false);
    const [publicOfferOpen, setPublicOfferOpen] = useState<boolean>(false);

    const openPrivacyPolicy = () => {
        setPrivacyPolicyOpen(true);
        setPublicOfferOpen(false);
    };

    const openPublicOffer = () => {
        setPrivacyPolicyOpen(false);
        setPublicOfferOpen(true);
    };

    const validationSchema = z
        .object({
            email: z.string().max(255).min(1, {message: t('Email is required')}).email({
                message: t('Must be a valid email'),
            }),
            password: z
                .string()
                .max(255, {message: t('Password is too long')})
                .min(1, {message: t('Password is required')}),
            repeatPassword: z
                .string()
                .max(255, {message: t('Password is too long')})
                .min(1, {message: t('Password is required')}),
            nickname: z.string()
                .max(50, {message: t('Nickname is too long')})
                .min(1, {message: t('Nickname is required')}),
            refParameter: z.any()
        })


    type RegisterFormValidationType = z.TypeOf<typeof validationSchema>;

    const formMethods = useForm<RegisterFormValidationType>({
        resolver: zodResolver(validationSchema),
        defaultValues: {}
    });

    const {
        control,
        formState: {errors},
        handleSubmit,
    } = formMethods;

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = (ev: any) => {
        ev.preventDefault();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const resetFile = (ev: any) => {
        ev.preventDefault();
        setFileName('');
        setAvatarBase64('');
    };

    const onSubmit = async (dataSubmit: RegisterFormValidationType) => {
        setRegisterError('')
        let data: { [key: string]: string };

        dataSubmit.refParameter && dataSubmit.refParameter.length > 0
            ? data = {
                email: dataSubmit.email,
                password: dataSubmit.password,
                nickname: dataSubmit.nickname,
                avatar: avatarBase64,
                ref_parameter: dataSubmit.refParameter,
                hard_hash: generateUniqueString()
            }
            : data = {
                email: dataSubmit.email,
                password: dataSubmit.password,
                nickname: dataSubmit.nickname,
                avatar: avatarBase64,
                hard_hash: generateUniqueString()
            };

        if (dataSubmit.password === dataSubmit.repeatPassword) {
            console.log('dataSubmit.nickname', dataSubmit.nickname)
            fetchData({
                url: '/customer/is-free-nickname',
                method: 'POST',
                data: {nickname: dataSubmit.nickname}
            }).then((dataNickname: any) => {
                console.log('dataNickname', dataNickname);
                if (dataNickname.is_success) {
                    if (dataNickname.data.is_free) {
                        setFreeNick(true);
                        fetchData({url: '/customer/create', method: 'POST', data}).then((data: any) => {
                            const {errors = []} = data;
                            if (errors.length) {
                                setRegisterError(errors[0].message);
                            } else {
                                setCurrentFormName('LoginForm');
                            }
                        }).catch((err: Error) => {
                            if (err.message) {
                                setRegisterError(err.message);
                            }
                        });
                    } else {
                        setFreeNick(false);
                    }
                }
            }).catch((err: Error) => {
                if (err.message) {
                    setRegisterError(err.message);
                }
            })
        } else {
            setRegisterError('Password mismatch');
        }
    };

    return (
        <div>
            {!privacyPolicyOpen && !publicOfferOpen && (
                <div style={{zoom: '95%'}}>
                    <AuthorizationFormHeader formTitle={t('Registration in your personal account')}
                                             setCurrentFormName={setCurrentFormName} currentFormName={currentFormName}/>
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
                                                           setRegisterError('')
                                                           field.onChange(evt)
                                                       }}
                                                       className={clsx(cls.formInput, cls.modalFormInput)}
                                                       placeholder={t('Enter E-mail')}
                                                       error={errors.email?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className={cls.rowField}>
                                    <div className={cls.field}>
                                        <div className={cls.label}>{t('Nickname')}</div>
                                        <div className={cls.controls}>
                                            <Controller
                                                control={control}
                                                name='nickname'
                                                render={({field}) => (
                                                    <Input {...field}
                                                           onChange={(evt) => {
                                                               setRegisterError('')
                                                               setFreeNick(null);
                                                               field.onChange(evt)
                                                           }}
                                                           className={clsx(cls.formInput, cls.modalFormInput)}
                                                           type='nickname'
                                                           placeholder={t('Nickname')}
                                                           error={errors.nickname?.message}
                                                    />
                                                )}/>
                                        </div>
                                        {freeNick === false &&
                                            <p className={cls.formErrorMessage}>{t('Nickname is already taken')}</p>}
                                    </div>
                                    <div className={cls.field}>
                                        <div className={cls.label}>{t('Promo code')}</div>
                                        <div className={cls.controls}>
                                            <Controller
                                                control={control}
                                                name='refParameter'
                                                render={({field}) => (
                                                    <Input {...field}
                                                           onChange={(evt) => {
                                                               setRegisterError('')
                                                               field.onChange(evt)
                                                           }}
                                                           className={clsx(cls.formInput, cls.modalFormInput)}
                                                           type='refParameter'
                                                           placeholder={t('Promo code')}
                                                        // error={errors.refParameter?.message}
                                                    />
                                                )}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={cls.rowField}>
                                    <div className={cls.field}>
                                        <div className={cls.label}>{t('Password')}</div>
                                        <div className={cls.controls}>
                                            <Controller
                                                control={control}
                                                name='password'
                                                render={({field}) => (
                                                    <Input {...field}
                                                           onChange={(evt) => {
                                                               setRegisterError('')
                                                               field.onChange(evt)
                                                           }}
                                                           className={clsx(cls.formInput, cls.modalFormInput)}
                                                           type='password'
                                                           placeholder={t('Your password')}
                                                           error={errors.password?.message}
                                                    />
                                                )}/>
                                        </div>
                                    </div>

                                    <div className={cls.field}>
                                        <div className={cls.label}>{t('Confirm the password')}</div>
                                        <div className={cls.controls}>
                                            <Controller
                                                control={control}
                                                name='repeatPassword'
                                                render={({field}) => (
                                                    <Input {...field}
                                                           onChange={(evt) => {
                                                               setRegisterError('')
                                                               field.onChange(evt)
                                                           }}
                                                           className={clsx(cls.formInput, cls.modalFormInput)}
                                                           type='password'
                                                           placeholder={t('Repeat password')}
                                                           error={errors.password?.message}
                                                    />
                                                )}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={cls.rowField}>
                                    <div className={cls.fieldFile}>
                                        <div className={cls.importFileContent}>
                                            {fileName && (
                                                <div className={cls.fileName}>
                                                    {fileName}
                                                </div>
                                            )}
                                            <button
                                                className={cls.importFileBtn}
                                                onClick={fileName == '' ? handleClick : resetFile}
                                            >
                                                {fileName == '' ? t('Upload avatar') : t('Delete')}
                                            </button>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            id="file_picker"
                                            type="file"
                                            accept=".jpg, .png"
                                            onChange={(ev: any) => {
                                                handleFileChange(ev);
                                            }}
                                            style={{display: "none"}}
                                        />
                                    </div>
                                </div>
                            </div>

                            {registerError !== '' &&
                                <div className={cls.field}>
                                    {/*<div className={cls.label}></div>*/}
                                    <div className={cls.controls}>
                                        <div className={cls.formErrorMessage}>
                                            <div>{t('Sorry, some error occurred when signing in')}.</div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className={cls.formBottomBtn}>
                                <button
                                    type='submit'
                                    className={cls.btnSubmit}
                                >
                                    {t('Sign up')}
                                </button>
                            </div>

                            <div className={cls.formBottom}>
                                <div className={cls.noAccount}>
                                    <p>{t("Already registered?")}</p>
                                    <button className={cls.registerBtn}
                                            onClick={() => setCurrentFormName('LoginForm')}>{t('Log in')}</button>
                                </div>
                                <div className={cls.privacyPolicy}>
                                    <p className={cls.privacyPolicyText}>{t('By clicking on the button, you consent to the processing of personal data and agree to')}
                                        <span className={cls.privacyPolicyBtn}
                                              onClick={openPrivacyPolicy}>{t('Privacy policy').toLowerCase()} </span> {t('and')}
                                        <span className={cls.privacyPolicyBtn}
                                              onClick={openPublicOffer}>{t('Public offer agreement').toLowerCase()}</span>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}
            {privacyPolicyOpen && (
                <PrivacyPolicy setPrivacyPolicyOpen={setPrivacyPolicyOpen}/>
            )}
            {publicOfferOpen && (
                <PublicOfferAgreement setPublicOfferOpen={setPublicOfferOpen}/>
            )}
        </div>
    );
};
