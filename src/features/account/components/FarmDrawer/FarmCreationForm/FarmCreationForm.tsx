import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useFarmFormInitData } from '@/features/account/hooks/useFarmFormInitData';
import { FarmMainSettingsPage } from './FarmMainSettingsPage/FarmMainSettingsPage';
import { FarmDrawerTabs } from '@/features/account/types';
import cls from './FarmCreationForm.module.scss';
import { FarmFanPage } from './FarmFanPage/FarmFanPage';
import { FarmStartPage } from './FarmStartPage/FarmStartPage';
import { FarmFarmPage } from './FarmFarmPage/FarmFarmPage';
import { FarmAdsPage } from './FarmAdsPage/FarmAdsPage';
import {useTranslation} from "react-i18next";

const validationSchema = z.object({
  smsServicesCount: z.number(),
  smsActivationService1: z.string(),
  geo1: z.number(),
  smsServiceKey1: z.string(),
  smsActivationService2: z.string(),
  geo2: z.number(),
  smsServiceKey2: z.string(),
  token: z.string(),
  tokenRuCaptcha: z.string(),
  createFanPage: z.boolean(),
  avatar: z.boolean(),
  fanPageImage: z.boolean(),
  directoryForAvatar: z.string(),
  directoryForBackImage: z.string(),
  action1: z.number(),
  action2: z.number(),
  saveFacebookToken: z.boolean(),
  managerPolicy: z.boolean(),
  callZrd: z.boolean(),
  checkZrd: z.boolean(),
  passZrd: z.boolean(),
  businessManager: z.boolean(),
  documentDownloader: z.string(),
  farmAvatar: z.boolean(),
  background: z.boolean()
});

export type TFarmCreationForm = z.TypeOf<typeof validationSchema>;

interface FarmDrawerFormProps {
  // activeTab: FarmDrawerTabs;
  setIsDrawerOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FarmCreationForm = (props: FarmDrawerFormProps) => {
  const { setIsDrawerOpened } = props;

  const { t } = useTranslation();

  const { defaultValues } = useFarmFormInitData();

  const formMethods = useForm<TFarmCreationForm>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = formMethods;

  const onSubmit = async (data: TFarmCreationForm) => {
    setIsDrawerOpened(false);
  };

  return (
    <FormProvider {...formMethods}>
      <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={cls.formPages}>
            {/*<FarmMainSettingsPage />*/}
            <FarmStartPage />
            <FarmFanPage />
            {/*<FarmFarmPage />*/}
            <FarmAdsPage />
        </div>
        <div className={cls.farmCreationFooter}>
          <div className={cls.farmCreationFooterContent}>
            <button className={cls.btnCancel}>
              <p className={cls.btnText}>{t('Cancel')}</p>
            </button>
            <button className={cls.btnRun}>
              <p className={cls.btnText}>{t('Run')}</p>
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
