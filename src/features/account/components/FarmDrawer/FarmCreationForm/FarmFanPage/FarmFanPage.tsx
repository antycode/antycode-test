import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { SegmentedControl } from '@/shared/components/SegmentedControl/SegmentedControl';
import { useFarmFormInitData } from '@/features/account/hooks/useFarmFormInitData';
import { TFarmCreationForm } from '../FarmCreationForm';
import cls from '../FarmCreationForm.module.scss';
import React from "react";

export const FarmFanPage = () => {
    const { t } = useTranslation();

    const { control } = useFormContext<TFarmCreationForm>();

    const { options } = useFarmFormInitData();

    return (
        <div className={cls.formPage}>
            <div className={cls.mainTitle}>
                {t('Fan Page')}
            </div>
            <div className={cls.field}>
                <div className={cls.label}>{t('Create FanPage')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="createFanPage"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.createFanPage}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>

            <div className={cls.field}>
                <div className={cls.label}>{t('Set an avatar')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="avatar"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.avatar}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>

            <div className={cls.field}>
                <div className={clsx(cls.label, cls.labelBackImage)}>{t('Set background')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="fanPageImage"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.fanPageImage}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
