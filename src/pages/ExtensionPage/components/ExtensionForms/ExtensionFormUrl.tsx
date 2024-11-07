import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import cls from '../ExtensionPageHeader/ExtensionPageHeader.module.scss';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { CreateExtensionParams } from '../ExtensionPage';
import { useForm } from 'react-hook-form';
import { fetchExtensionData, handleDownloadExtension } from '@/shared/utils/extensions';
import { fetchData } from '@/shared/config/fetch';
import { Button } from '@/shared/components/Button';

interface IExtensionFormUrl {
  getExtensions: (page?: number) => void;
  setActivePages: Dispatch<SetStateAction<number[]>>;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  modalClose: () => void;
}

const ExtensionFormUrl = ({
  getExtensions,
  setActivePages,
  setModalIsOpen,
  modalClose,
}: IExtensionFormUrl) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const createExtension = async (params: CreateExtensionParams) => {
    const { url } = params;
    const teamId = localStorage.getItem('teamId');
    const extensionUrl = '/profile/extension';
    setIsLoading(true);

    try {
      const { iconUrl, title } = await fetchExtensionData(url);

      const trimmedTitle = title.length > 200 ? title.substring(0, 200) : title;

      await fetchData({
        url: extensionUrl,
        method: 'POST',
        data: { title: trimmedTitle, url: url, logo: iconUrl, is_public: true },
        team: teamId,
      });

      await handleDownloadExtension(url);
      getExtensions();
      setActivePages([1]);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Failed to create extension:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const validateUrl = (value: string) => {
    if (!value) return t('This field is required');

    const validStart = 'https://chromewebstore.google.com/detail/';
    return value.startsWith(validStart) ? undefined : `${t('Url must start with')} "${validStart}"`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    clearErrors,
  } = useForm<CreateExtensionParams>({
    defaultValues: {
      title: '',
      url: '',
      logo: '',
      is_public: true,
    },
  });

  const urlValue = watch('url');

  useEffect(() => {
    if (urlValue) {
      clearErrors('url');
    }
  }, [urlValue, clearErrors]);

  const onSubmit = async (data: CreateExtensionParams) => {
    const validationError = validateUrl(data.url);
    if (validationError) {
      setError('url', { message: validationError });
    } else {
      try {
        await createExtension(data);
        reset();
      } catch (error) {
        console.error('Error', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cls.tabContentWrapper}>
      <div className={cls.tabContent}>
        <div>
          <input
            type="text"
            placeholder={t('Link to Chrome Web Store')}
            className={clsx(cls.inputField, {
              [cls.inputFieldError]: errors.url,
            })}
            {...register('url', {
              validate: (value) => validateUrl(value),
            })}
          />
          {errors.url && <p className={cls.errorMessage}>{errors.url.message}</p>}
        </div>
      </div>
      <div className={cls.modalFooter}>
        <Button type="button" className={cls.closeButton} onClick={modalClose}>
          {t('Exit')}
        </Button>
        <Button type="submit" className={cls.addButton} loading={isLoading}>
          {t('Add')}
        </Button>
      </div>
    </form>
  );
};

export default ExtensionFormUrl;
