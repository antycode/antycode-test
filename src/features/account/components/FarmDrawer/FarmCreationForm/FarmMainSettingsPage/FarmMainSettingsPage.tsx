import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Select } from '@/shared/components/Select/Select';
import { Input } from '@/shared/components/Input/Input';
import { NumberInput } from '@/shared/components/NumberInput/NumberInput';
import { useFarmFormInitData } from '@/features/account/hooks/useFarmFormInitData';
import { TFarmCreationForm } from '../FarmCreationForm';
import cls from '../FarmCreationForm.module.scss';

export const FarmMainSettingsPage = () => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
  } = useFormContext<TFarmCreationForm>();

  const { options } = useFarmFormInitData();

  return (
    <div className={cls.formPage}>
      <div className={cls.field}>
        <div className={cls.label}>{t('How many SMS services to use')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="smsServicesCount"
            render={({ field }) => (
              <NumberInput
                {...field}
                min={20}
                max={300}
                error={errors.smsServicesCount?.message}
              />
            )}
          />
        </div>
      </div>

      <div className={cls.field}>
        <div className={cls.label}>{t('SMS activation service 1')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="smsActivationService1"
            render={({ field }) => (
              <Input {...field} error={errors.smsActivationService1?.message} />
            )}
          />
        </div>
      </div>

      <div className={cls.field}>
        <div className={cls.label}>{t('GEO of number 1')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="geo1"
            render={({ field }) => (
              <Select
                ref={field.ref}
                name={field.name}
                getOptionLabel={(o) => t(`countries.${o.label}`)}
                options={options.geo1}
                value={options.geo1.find((c) => c.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </div>
      </div>

      <div className={cls.field}>
        <div className={cls.label}>{t('SMS service API key 1')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="smsServiceKey1"
            render={({ field }) => (
              <Input {...field} error={errors.smsServiceKey1?.message} />
            )}
          />
        </div>
      </div>

      <div className={cls.field}>
        <div className={cls.label}>{t('SMS activation service 2')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="smsActivationService2"
            render={({ field }) => (
              <Input {...field} error={errors.smsActivationService2?.message} />
            )}
          />
        </div>
      </div>

      <div className={cls.field}>
        <div className={cls.label}>{t('GEO of number 2')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="geo2"
            render={({ field }) => (
              <Select
                ref={field.ref}
                name={field.name}
                getOptionLabel={(o) => t(`countries.${o.label}`)}
                options={options.geo2}
                value={options.geo2.find((c) => c.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </div>
      </div>

      <div className={cls.field}>
        <div className={cls.label}>{t('SMS service API key 2')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="smsServiceKey2"
            render={({ field }) => (
              <Input {...field} error={errors.smsServiceKey2?.message} />
            )}
          />
        </div>
      </div>

      <div className={cls.field}>
        <div className={cls.label}>{t('Token for mail from a penny')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="token"
            render={({ field }) => (
              <Input {...field} error={errors.token?.message} />
            )}
          />
        </div>
      </div>

      <div className={cls.field}>
        <div className={cls.label}>{t('ruCaptcha token')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="tokenRuCaptcha"
            render={({ field }) => (
              <Input {...field} error={errors.tokenRuCaptcha?.message} />
            )}
          />
        </div>
      </div>
    </div>
  );
};
