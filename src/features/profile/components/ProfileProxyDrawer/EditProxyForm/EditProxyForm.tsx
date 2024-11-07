import { InputCustom } from '@/shared/components/Input/InputCustom';
import cls from './EditProxyForm.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchData } from '@/shared/config/fetch';
import {
  ProxyTabHeader,
  TProfileProxyCreationForm,
} from '../ProfileProxyCreationForm/ProfileProxyCreationForm';
import { useProxiesStore } from '@/features/proxy/store';
import { toast } from 'react-toastify';
import { Button } from '@/shared/components/Button';

interface AddProxyLeftSide {
  getProxy: () => void;
  setProxyCheckMessage?: Dispatch<SetStateAction<string>>;
  editProxyActive: boolean;
  setEditProxyActive: Dispatch<SetStateAction<boolean>>;
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  isProxyFormActive: boolean;
}

type TData = TProfileProxyCreationForm['proxy_external_options'];

const EditProxyForm = ({
  editProxyActive,
  setEditProxyActive,
  selectedRows,
  isProxyFormActive,
  getProxy,
  setSelectedRows,
}: AddProxyLeftSide) => {
  const { t } = useTranslation();

  const [proxyType, setProxyType] = useState<string>('http');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCloseEditForm = () => {
    setEditProxyActive(false);
    setSelectedRows(new Set());
  };

  const { allProxies } = useProxiesStore();

  const {
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm<TProfileProxyCreationForm>({
    defaultValues: {
      proxy_external_options: {
        type: proxyType,
        host: '',
        port: undefined,
        login: '',
        password: '',
        link_rotate: '',
        title: '',
      },
    },
  });

  const getFilteredProxies = () => {
    const selectedProxies = Array.from(selectedRows);
    const filteredProxies = allProxies.filter((proxy) =>
      selectedProxies.includes(proxy.external_id),
    );
    return filteredProxies;
  };

  const getProxyById = () => {
    const filteredProxies = getFilteredProxies();

    if (filteredProxies.length > 0) {
      const proxyData = filteredProxies[0];
      reset({
        proxy_external_options: {
          type: proxyData.type || proxyType,
          host: proxyData.host || '',
          port: proxyData.port || undefined,
          login: proxyData.login || '',
          password: proxyData.password || '',
          link_rotate: proxyData.link_rotate || '',
          title: proxyData.title || '',
        },
      });
    } else {
      console.warn('No proxies found for selected IDs');
    }
  };

  const handleEditProxy = async () => {
    const teamId = localStorage.getItem('teamId');
    const selectedProxies = Array.from(selectedRows);
    const filteredProxies = getFilteredProxies();

    const dataProxy = getValues('proxy_external_options');

    const updatedFields: Partial<TData> = {};

    if (filteredProxies.length > 0) {
      const proxyData: TData = filteredProxies[0];

      (Object.keys(dataProxy) as Array<keyof TData>).forEach((key) => {
        if (dataProxy[key] !== proxyData[key]) {
          // @ts-ignore
          updatedFields[key] = dataProxy[key];
        }
      });

      const hasUpdatedFields = Object.keys(updatedFields).length > 0;
      if (!hasUpdatedFields) {
        setEditProxyActive(false);
        setSelectedRows(new Set());
        return;
      }
    }
    try {
      setLoading(true);
      const response = await fetchData({
        url: `/profile/proxy/${selectedProxies}`,
        method: 'PATCH',
        data: updatedFields,
        team: teamId,
      });

      if (response.is_success) {
        getProxy();
        setEditProxyActive(false);
        console.log('Proxy updated successfully:', response.data);
      } else {
        toast.error(response.errorMessage);
        console.error('Failed to update proxy:', response.errors);
      }
    } catch (error) {
      console.error('Error updating proxy:', error);
    } finally {
      setSelectedRows(new Set());
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editProxyActive) {
      getProxyById();
    }
  }, [editProxyActive]);

  return (
    <div
      className={clsx(cls.editProxy, {
        [cls.editProxyHidden]: isProxyFormActive,
      })}
      data-proxy-active={editProxyActive}>
      <ProxyTabHeader text="Edit proxy" closeProxyForm={handleCloseEditForm} />
      <form className={cls.formWrapper}>
        <Controller
          control={control}
          name="proxy_external_options"
          render={({ field }) => (
            <div className={cls.wrapperProxyForm}>
              <InputCustom
                title="Protocol"
                renderComponent={
                  <div className={cls.wrapperProtocols}>
                    <div
                      className={clsx(cls.wrapperRound, {
                        [cls.roundActive]: field.value.type === 'http',
                      })}
                      onClick={() => {
                        field.onChange({
                          ...field.value,
                          type: 'http',
                        });
                        setProxyType('http');
                      }}>
                      <div className={cls.roundText}>HTTP(S)</div>
                    </div>
                    <div
                      className={clsx(cls.wrapperRound, {
                        [cls.roundActive]: field.value.type === 'socks5',
                      })}
                      onClick={() => {
                        field.onChange({
                          ...field.value,
                          type: 'socks5',
                        });
                        setProxyType('socks5');
                      }}>
                      <div className={cls.roundText}>SOCKS5</div>
                    </div>
                    <div
                      className={clsx(cls.wrapperRound, {
                        [cls.roundActive]: field.value.type === 'socks4',
                      })}
                      onClick={() => {
                        field.onChange({
                          ...field.value,
                          type: 'socks4',
                        });
                        setProxyType('socks4');
                      }}>
                      <div className={cls.roundText}>SOCKS4</div>
                    </div>
                    <div
                      className={clsx(cls.wrapperRound, {
                        [cls.roundActive]: field.value.type === 'ssh',
                      })}
                      onClick={() => {
                        field.onChange({
                          ...field.value,
                          type: 'ssh',
                        });
                        setProxyType('ssh');
                      }}>
                      <div className={cls.roundText}>SSH</div>
                    </div>
                  </div>
                }
              />
              <div className={cls.rowInput}>
                <InputCustom
                  {...field}
                  className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                  title="Host"
                  inputType
                  inputValue={field.value.host}
                  placeholder={t('Host')}
                  handleInput={(e) =>
                    field.onChange({
                      ...field.value,
                      host: e.target.value,
                    })
                  }
                />
                <InputCustom
                  {...field}
                  className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                  title="Port"
                  inputType
                  inputValue={field.value.port}
                  placeholder={t('Port')}
                  handleInput={(e) =>
                    field.onChange({
                      ...field.value,
                      port: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className={cls.rowInput}>
                <InputCustom
                  {...field}
                  className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                  title="Login"
                  inputType
                  inputValue={field.value.login}
                  placeholder={t('Login')}
                  handleInput={(e) =>
                    field.onChange({
                      ...field.value,
                      login: e.target.value,
                    })
                  }
                />
                <InputCustom
                  {...field}
                  className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                  title="Password"
                  inputType
                  inputValue={field.value.password}
                  placeholder={t('Password')}
                  handleInput={(e) =>
                    field.onChange({
                      ...field.value,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <InputCustom
                {...field}
                className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                title="Link to change IP"
                inputType
                inputValue={field.value.link_rotate}
                placeholder={t('Link to change IP')}
                handleInput={(e) =>
                  field.onChange({
                    ...field.value,
                    link_rotate: e.target.value,
                  })
                }
              />
              <InputCustom
                {...field}
                className={clsx(cls.inputGreenBorder, cls.inputProxyCustom)}
                title={t('Proxy name')}
                inputType
                inputValue={field.value.title}
                placeholder={t('Proxy name')}
                handleInput={(e) => field.onChange({ ...field.value, title: e.target.value })}
              />
            </div>
          )}
        />

        <div className={cls.btnWrapper}>
          <Button
            loading={loading}
            className={cls.buttonEditProxy}
            onClick={(e) => {
              e.preventDefault();
              handleEditProxy();
            }}>
            {t('Edit proxy')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProxyForm;
