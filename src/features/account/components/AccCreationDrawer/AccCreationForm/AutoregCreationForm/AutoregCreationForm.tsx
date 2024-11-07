import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Select } from '@/shared/components/Select/Select';
import { Input } from '@/shared/components/Input/Input';
import { NumberInput } from '@/shared/components/NumberInput/NumberInput';
import { useAccFormInitData } from '@/features/account/hooks/useAccFormInitData';
import { TAccCreationForm } from '../AccCreationForm';
import cls from '../AccCreationForm.module.scss';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { generateYearOptions } from '@/features/account/utils/generateYearOptions';
import { SegmentedControl } from '@/shared/components/SegmentedControl/SegmentedControl';
import clsx from 'clsx';
import { useProfileInitData } from '@/features/profile/hooks/useProfileInitData';
import { toast } from 'react-toastify';

export const AutoregCreationForm = () => {
  const { t } = useTranslation();

  const {
    watch,
    control,
    formState: { errors },
    setValue,
    register,
  } = useFormContext<TAccCreationForm>();

  const { options } = useAccFormInitData();
  const { options: profileOptions } = useProfileInitData();
  const [streamCount, setStreamCount] = useState<null | number>(null);
  const [servicesUse, setServicesUse] = useState<null | number>(1);
  const [proxyInputs, setProxyInputs] = useState<string[]>([]);
  const [serviceInputs, setServiceInputs] = useState<string[]>([]);

  const allProxies = profileOptions.profileProxyExternalOpt;

  const yearFrom = watch('birthYearFrom');
  const yearTo = watch('birthYearTo');

  const handleKeyUp = (elem: HTMLInputElement) => {
    const oldValue = elem.dataset.value || '';
    const value = elem.value;
    const n = Number(value);

    if (value === '-' || (!isNaN(n) && n <= 1 && n >= 0 && n % 1 === 0)) {
      elem.dataset.value = n.toString();
      elem.value = n.toString();
      setServicesUse(n);
      return true;
    } else {
      elem.value = oldValue;
      return false;
    }
  };

  const handleInputServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target;
    let inputValue = inputElement.value;
    if (inputValue.length > 1) {
      inputValue = inputValue.replace(/^0+(?!$)/, '');
    }
    const n = Number(inputValue);
    if (!isNaN(n) && n <= 50 && n >= 0 && n % 1 === 0) {
      setServicesUse(n);
    } else {
      inputElement.value = servicesUse === null ? '' : servicesUse.toString();
    }
  };

  const handleStreamCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = allProxies.length;
    const inputValue = Number(e.target.value);
    const proxyInfo = t('Proxy info', { count });
  
    if (inputValue > count) {
      toast.error(proxyInfo); 
      setStreamCount(count);
      return;
    }
  
    if (e.target.value === '') {
      setStreamCount(null); 
    } else {
      const value = Math.max(1, inputValue); 
      setStreamCount(value);
    }
  };

  useMemo(() => {
    const result = generateYearOptions(yearFrom);
    return result;
  }, [yearFrom]);

  useLayoutEffect(() => {
    if (yearFrom > yearTo) {
      setValue('birthYearTo', yearFrom);
    }
  }, [yearFrom, yearTo]);

  useEffect(() => {
    const updateInputs = (
      count: number | null,
      setInputs: React.Dispatch<React.SetStateAction<string[]>>,
    ) => {
      const validCount = Math.max(0, count ?? 0);
      setInputs(new Array(validCount).fill(''));
    };

    updateInputs(streamCount, setProxyInputs);
    updateInputs(servicesUse, setServiceInputs);
  }, [streamCount, servicesUse]);

  return (
    <div className={cls.formPage}>
      <div className={cls.mainTitle}>{t('Account details')}</div>
      <div className={cls.field}>
        <div className={cls.label}>{t('Gender')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <SegmentedControl
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                options={options.gender}
                getOptionLabel={(o) => t(o.label)}
              />
            )}
          />
        </div>
      </div>
      <div className={cls.field}>
        <div className={cls.label}>{t('First and last name')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="alphabetType"
            render={({ field }) => (
              <SegmentedControl
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                options={options.locale}
                getOptionLabel={(o) => t(o.label)}
              />
            )}
          />
        </div>
      </div>

      <div className={cls.field}>
        <div className={cls.label}>{t('Birth Year From / To')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="birthYearFrom"
            render={({ field }) => (
              <Select
                ref={field.ref}
                name={field.name}
                options={options.yearFrom}
                value={options.yearFrom.find((c) => c.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                placeholder={t('Select from the list')}
              />
            )}
          />
          <Controller
            control={control}
            name="birthYearTo"
            render={({ field }) => (
              <Select
                ref={field.ref}
                name={field.name}
                options={options.yearFrom}
                value={options.yearFrom.find((c) => c.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
                placeholder={t('Select from the list')}
              />
            )}
          />
        </div>
      </div>
      <div className={cls.mainTitle}>{t('Main settings')}</div>
      <div className={cls.field}>
        <div className={cls.label}>{t('Account count')}</div>
        <div className={cls.controls}>
          <Input
            {...register('accountNumbers', {
              valueAsNumber: true,
            })}
            type="number"
            className={cls.autoregInput}
            error={errors.accountNumbers?.message}
          />
        </div>
      </div>
      <div className={cls.field}>
        <div className={cls.label}>{t('Registration via')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="platformType"
            render={({ field }) => (
              <Select
                ref={field.ref}
                name={field.name}
                getOptionLabel={(o) => t(`${o.label}`)}
                options={options.registrationVia}
                value={options.registrationVia.find((c) => c.value === field.value)}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </div>
      </div>
      <div className={cls.field}>
        <div className={cls.label}>{t('How many SMS services to use')}</div>
        <div className={cls.controls}>
          <Input
            type="number"
            min={1}
            max={1}
            className={cls.autoregInput}
            value={1}
            // value={servicesUse === null ? '' : servicesUse}
            // onKeyUp={(e) => handleKeyUp(e.target as HTMLInputElement)}
            // onChange={handleInputServiceChange}
          />
        </div>
      </div>
      <div className={cls.field}>
        <div className={cls.label}>{t('Select SMS service')}</div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="serviceSmsNumbers"
            render={({ field }) => (
              <Select
                ref={field.ref}
                name={field.name}
                options={options.smsService}
                value={
                  options.smsService.find((o) => o.value === field.value) || {
                    value: 1,
                    label: 'SMS-Activate',
                  }
                }
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </div>
      </div>
      {serviceInputs.map((_, index) => (
        <>
          {/* <div key={index} className={cls.servicesWrapper}>
            <div className={cls.label}>{`${t('SMS activation service')} ${index + 1}`}</div>
            <div className={cls.contollerWidth}>
              <Controller
                control={control}
                name={`smsBeans.${index}.name`}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Service Name"
                    className={cls.inputClass}
                    error={errors?.smsBeans?.[index]?.name?.message}
                  />
                )}
              />
            </div>
          </div> */}

          <div className={cls.servicesWrapper}>
            <div className={cls.label}>{`${t('SMS service API key')}`}</div>
            <div className={cls.contollerWidth}>
              <Controller
                control={control}
                name={`smsBeans.${index}.apiKey`}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="API Key"
                    className={cls.inputClass}
                    error={errors?.smsBeans?.[index]?.apiKey?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className={cls.servicesWrapper}>
            <div className={cls.label}>{`${t('GEO numbers')}`}</div>
            <div className={cls.contollerWidth}>
              <Controller
                control={control}
                name={`smsBeans.${index}.geoLocation`}
                render={({ field }) => (
                  <Select
                    ref={field.ref}
                    name={field.name}
                    getOptionLabel={(o) => t(`countries.${o.label}`)}
                    options={options.geo}
                    value={options.geo.find((c) => c.value === field.value)}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </div>
          </div>
        </>
      ))}

      <div className={cls.field}>
        <div className={cls.label}>
          {t('How long to wait for an SMS from the activation service in minutes')}
        </div>
        <div className={cls.controls}>
          <Controller
            control={control}
            name="activationSmsTimeout"
            render={({ field }) => (
              <NumberInput
                {...field}
                className={clsx(cls.autoregInput, cls.inputClass)}
                min={20}
                max={300}
                error={
                  errors.activationSmsTimeout?.message &&
                  t(errors.activationSmsTimeout.message, { ns: 'errors', min: 20, max: 301 })
                }
              />
            )}
          />
        </div>
      </div>
      <div className={cls.mainTitle}>{t('Proxies and streams')}</div>
      <div className={cls.fieldWrapper}>
        <div className={cls.field}>
          <div className={cls.label}>{t('Number of threads (mobile proxy)')}</div>
          <div className={cls.controls}>
            <Input
              type="number"
              className={cls.autoregInput}
              value={streamCount ?? ''}
              max={allProxies.length}
              onChange={handleStreamCountChange}
            />
          </div>
        </div>
        {proxyInputs.map((_, index) => (
          <div className={cls.field} key={index}>
            <div className={cls.label}>{`${t('Proxy')} ${index + 1}`}</div>
            <div className={cls.controls}>
              <Controller
                control={control}
                name={`proxyThreads.${index}`}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={cls.select}
                    placeholder={t('Choose Proxy')}
                    getOptionLabel={(o) => o.label}
                    options={allProxies}
                    value={allProxies.find((c: any) => c.value === field.value) || null}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
