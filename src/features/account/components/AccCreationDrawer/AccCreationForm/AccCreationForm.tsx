import React from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormProvider, useForm} from 'react-hook-form';
import {useAccFormInitData} from '@/features/account/hooks/useAccFormInitData';
import {useTranslation} from 'react-i18next';
import cls from './AccCreationForm.module.scss';
import {
    AutoregCreationForm
} from '@/features/account/components/AccCreationDrawer/AccCreationForm/AutoregCreationForm/AutoregCreationForm';
import {toast} from 'react-toastify';
import axios from 'axios';

const smsBeanSchema = z.object({
    name: z.string().nonempty('Name is required'),
    geoLocation: z.number().min(1, 'Invalid geo location'),
    apiKey: z.string().nonempty('API key is required'),
});

const validationSchema = z.object({
    accountNumbers: z
        .number({
            invalid_type_error: 'Value must be a number',
        })
        .refine((val) => !isNaN(val) && val > 0, {
            message: 'Value must be a positive number and cannot be empty',
        }),
    serviceSmsNumbers: z.number(),
    activationSmsTimeout: z
        .number({invalid_type_error: 'Field is required'})
        .refine((val) => val >= 20 && val <= 300, {
            message: 'Value must be in the range: {{min}}–{{max}}',
        }),
    alphabetType: z.number(),
    gender: z.number(),
    birthYearFrom: z.number(),
    birthYearTo: z.number(),
    platformType: z.string(),
    proxyThreads: z.array(z.string(), {
        invalid_type_error: 'Proxy threads must be an array of strings',
    }),
    mailToken: z.string(),
    ruCaptchaToken: z.string(),
    smsBeans: z.array(smsBeanSchema),
});

export type TAccCreationForm = z.TypeOf<typeof validationSchema>;

interface AccCreationFormProps {
    setIsDrawerOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AccCreationForm = (props: AccCreationFormProps) => {
    const {defaultValues} = useAccFormInitData();

    const {setIsDrawerOpened} = props;

    const {t} = useTranslation();

    const formMethods = useForm<TAccCreationForm>({
        resolver: zodResolver(validationSchema),
        defaultValues,
    });

    const {
        handleSubmit,
    } = formMethods;

    const onSubmit = async (data: TAccCreationForm) => {
        try {
            await axios.post('https://autoreg-api.anty-code.com/autoreg/api/form', data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        } finally {
            setIsDrawerOpened(false);
        }
    };

    return (
        <FormProvider {...formMethods}>
            <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={cls.formPages}>
                    <AutoregCreationForm/>
                </div>
                <div className={cls.autoregCreationFooter}>
                    <div className={cls.autoregCreationFooterContent}>
                        <button onClick={() => setIsDrawerOpened(false)} className={cls.btnCancel}>
                            <p className={cls.btnText}>{t('Cancel')}</p>
                        </button>
                        <button type="submit" className={cls.btnRun}>
                            <p className={cls.btnText}>{t('Run')}</p>
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};
