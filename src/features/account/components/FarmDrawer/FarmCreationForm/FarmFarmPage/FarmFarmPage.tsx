import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Select } from '@/shared/components/Select/Select';
import { useFarmFormInitData } from '@/features/account/hooks/useFarmFormInitData';
import { TFarmCreationForm } from '../FarmCreationForm';
import cls from '../FarmCreationForm.module.scss';

export const FarmFarmPage = () => {
    const { t } = useTranslation();

    const { control } = useFormContext<TFarmCreationForm>();

    const { options } = useFarmFormInitData();

    return (
        <div className={cls.formPage}>
            <div className={cls.field}>
                <div className={cls.label}>{t('Action 1')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="action1"
                        render={({ field }) => (
                            <Select
                                defaultValue={{ value: 0, label: 'Select from the list' }}
                                ref={field.ref}
                                name={field.name}
                                getOptionLabel={(o) => t(`actions.${o.label}`)}
                                options={options.action1}
                                value={options.action1.find((c) => c.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={cls.field}>
                <div className={cls.label}>{t('Action 2')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="action2"
                        render={({ field }) => (
                            <Select
                                defaultValue={{ value: 0, label: 'Select from the list' }}
                                ref={field.ref}
                                name={field.name}
                                getOptionLabel={(o) => t(`actions.${o.label}`)}
                                options={options.action2}
                                value={options.action2.find((c) => c.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
