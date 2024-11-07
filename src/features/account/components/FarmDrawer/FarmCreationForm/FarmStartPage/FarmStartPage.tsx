import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { useFarmFormInitData } from '@/features/account/hooks/useFarmFormInitData';
import { TFarmCreationForm } from '../FarmCreationForm';
import cls from '../FarmCreationForm.module.scss';
import React, { MutableRefObject, useRef } from 'react';
import {SegmentedControl} from "@/shared/components/SegmentedControl/SegmentedControl";

export const FarmStartPage = () => {

    const avatarUploader: MutableRefObject<null> | any = useRef(null);
    const backgroundUploader: MutableRefObject<null> | any = useRef(null);

    const { t } = useTranslation();

    const { control } = useFormContext<TFarmCreationForm>();

    const { options, defaultValues } = useFarmFormInitData();

    const showFileWay = (id: string) => {
        let element: any = document.getElementById(id);
        if (element) {
            console.log(element.value);
        };
    };


    return (
        <div className={cls.formPage}>
            <div className={cls.mainTitle}>
                {t('Farm')}
            </div>
            <div className={cls.field}>
                <div className={cls.label}>{t('Set an avatar')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="farmAvatar"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.farmAvatar}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={cls.field}>
                <div className={cls.label}>{t('Set background')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="background"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.background}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>
            {/*<div className={cls.field}>*/}
            {/*    <div className={cls.label}>{t('Directory for avatar image')}</div>*/}
            {/*    <div className={cls.controls}>*/}
            {/*        <Controller*/}
            {/*            control={control}*/}
            {/*            name="directoryForAvatar"*/}
            {/*            render={({ field }) => (*/}
            {/*                <div className={cls.wrapperImageInput}>*/}
            {/*                    <div className={cls.text}>{defaultValues.directoryForAvatar}</div>*/}
            {/*                    <input*/}
            {/*                        multiple*/}
            {/*                        id='directoryForAvatar'*/}
            {/*                        ref={avatarUploader}*/}
            {/*                        style={{ display: 'none' }}*/}
            {/*                        type="file"*/}
            {/*                        accept="image/*"*/}
            {/*                        onChange={(option) => {*/}
            {/*                            showFileWay("directoryForAvatar");*/}
            {/*                            field.onChange(option?.target?.files)*/}
            {/*                        }}*/}
            {/*                    />*/}
            {/*                    <button className={cls.button}*/}
            {/*                        onClick={() => {*/}
            {/*                            avatarUploader.current.click();*/}
            {/*                        }}>*/}
            {/*                        <div className={cls.text}>{t('CHOOSE')}</div>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className={cls.field}>*/}
            {/*    <div className={cls.label}>{t('Directory for background image')}</div>*/}
            {/*    <div className={cls.controls}>*/}
            {/*        <Controller*/}
            {/*            control={control}*/}
            {/*            name="directoryForBackImage"*/}
            {/*            render={({ field }) => (*/}
            {/*                <div className={cls.wrapperImageInput}>*/}
            {/*                    <div className={cls.text}>{defaultValues.directoryForBackImage}</div>*/}
            {/*                    <input*/}
            {/*                        multiple*/}
            {/*                        id='directoryForBackImage'*/}
            {/*                        ref={backgroundUploader}*/}
            {/*                        style={{ display: 'none' }}*/}
            {/*                        type="file"*/}
            {/*                        accept="image/*"*/}
            {/*                        onChange={(option) => {*/}
            {/*                            showFileWay("directoryForBackImage");*/}
            {/*                            field.onChange(option?.target?.files)*/}
            {/*                        }}*/}
            {/*                    />*/}
            {/*                    <button className={cls.button}*/}
            {/*                        onClick={() => {*/}
            {/*                            backgroundUploader.current.click();*/}
            {/*                        }}>*/}
            {/*                        <div className={cls.text}>{t('CHOOSE')}</div>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};