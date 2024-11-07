import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import cls from './ProfileProxyCreationForm.module.scss';
import { useProfileInitData } from '@/features/profile/hooks/useProfileInitData';
import { ProfileProxyMainPart } from './ProfileProxyMainPart/ProfileProxyMainPart';
import { ReactComponent as CloseIcon } from '@/shared/assets/icons/close.svg';
import { useTranslation } from 'react-i18next';

const validationSchema = z.object({
  proxy_external_value: z.number(),
  proxy_external_options: z.object({
    link_rotate: z.string(),
    title: z.string(),
    host: z.string(),
    port: z.number().or(z.undefined()),
    login: z.string().or(z.undefined()),
    type: z.string(),
    password: z.string().or(z.undefined()),
  }),
  proxy_external_id: z.string().or(z.null()),
});

export type TProfileProxyCreationForm = z.TypeOf<typeof validationSchema>;

interface ProfileProxyCreationFormProps {
  isProxyFormActive: boolean;
  setIsProxyFormActive: Dispatch<SetStateAction<boolean>>;
  useSortSpeed: boolean;
  setUseSortSpeed: Dispatch<SetStateAction<boolean>>;
  useSortStatus: boolean;
  setUseSortStatus: Dispatch<SetStateAction<boolean>>;
}

export const ProfileProxyCreationForm = (props: ProfileProxyCreationFormProps) => {
  const {
    isProxyFormActive,
    setIsProxyFormActive,
    useSortSpeed,
    setUseSortSpeed,
    useSortStatus,
    setUseSortStatus,
  } = props;

  const { defaultValues } = useProfileInitData();

  const contentHeight = useRef<HTMLDivElement | null>(null);

  const [proxyInputValue, setProxyInputValue] = useState<string>('');

  const formMethods = useForm<TProfileProxyCreationForm>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    formState: { errors },
    reset,
  } = formMethods;

  const closeProxyCreationForm = () => {
    setIsProxyFormActive(false);
    setProxyInputValue('');
    reset();
  };

  const scrollContentHeight = contentHeight?.current?.scrollHeight || 0;

  return (
    <FormProvider {...formMethods}>
      <div
        className={cls.formWrapper}
        style={{
          maxHeight: isProxyFormActive ? scrollContentHeight : '0',
          opacity: isProxyFormActive ? 1 : 0,
          transition: 'max-height 0.3s ease, opacity 0.3s ease',
        }}
        ref={contentHeight}
        data-proxy-active={isProxyFormActive}>
        <ProxyTabHeader closeProxyForm={closeProxyCreationForm} text="Add proxy" />
        <div className={cls.form}>
          <ProxyBanner />
          <div className={cls.formPages}>
            <ProfileProxyMainPart
              setIsProxyFormActive={setIsProxyFormActive}
              proxyInputValue={proxyInputValue}
              setProxyInputValue={setProxyInputValue}
              useSortSpeed={useSortSpeed}
              setUseSortSpeed={setUseSortSpeed}
              useSortStatus={useSortStatus}
              setUseSortStatus={setUseSortStatus}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

function ProxyBanner() {
  const { t } = useTranslation();
  return (
    <div className={cls.addProxyInfo}>
      <p>{t('Allowed formats')}:</p>
      <ul className={cls.formatsList}>
        <li className={cls.formatItem}>
          <span>host:port:login:password</span>
        </li>
        <li className={cls.formatItem}>
          <span>socks5://login:password@host:port</span>
        </li>
        <li className={cls.formatItem}>
          <span>http://host:port:login:password:name[link]</span>
        </li>
      </ul>
      <ul className={cls.formatsRules}>
        <li>*{t('If desired, you can add: title at the end of any option')}</li>
        <li>
          **
          {t(
            'If you do not specify the proxy type at the beginning, the system will mistake them for HTTP',
          )}
        </li>
        <li>
          ***
          {t(
            'At the end, for each proxy you can specify a link to change the IP in square brackets',
          )}
        </li>
      </ul>
    </div>
  );
}

interface IProxyTabHeader {
  closeProxyForm: () => void;
  text: string;
}

export function ProxyTabHeader({ closeProxyForm, text }: IProxyTabHeader) {
  const { t } = useTranslation();
  return (
    <div className={cls.proxyFormHeader}>
      <span className={cls.addProxySpanHeader}>{t(`${text}`)}</span>
      <button className={cls.closeBtn} onClick={() => closeProxyForm()}>
        <CloseIcon />
      </button>
    </div>
  );
}
