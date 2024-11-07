import { InputCustom } from '@/shared/components/Input/InputCustom';
import cls from '../../ProfileProxyCreationForm.module.scss';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchData } from '@/shared/config/fetch';
import { TProfileProxyCreationForm } from '../../ProfileProxyCreationForm';
import { toast } from 'react-toastify';

interface AddProxyLeftSide {
  getProxy: (resolve: any) => void;
  setProxyCheckMessage: Dispatch<SetStateAction<string>>;
}

const AddProxyLeftSide = ({ getProxy, setProxyCheckMessage }: AddProxyLeftSide) => {
  const { t } = useTranslation();
  const [proxyType, setProxyType] = useState<string>('http');

  const {
    control,
    formState: { errors },
    getValues,
    reset,
  } = useFormContext<TProfileProxyCreationForm>();

  const handleAddProxy = async () => {
    return new Promise<any>((resolve, reject) => {
      const teamId = localStorage.getItem('teamId');
      const field = getValues();
      const dataToSend = {
        host: field.proxy_external_options.host,
        port: Number(field.proxy_external_options.port),
        login: field.proxy_external_options.login,
        password: field.proxy_external_options.password,
        type: proxyType,
        link_rotate: field.proxy_external_options.link_rotate,
        title: field.proxy_external_options.title,
      };

      fetchData({
        url: '/profile/proxy',
        method: 'POST',
        data: dataToSend,
        team: teamId,
      })
        .then((res) => {
          if (!res?.is_success) {
            toast.error(res.errorMessage);
          }
          if (res?.is_success) {
            getProxy(resolve);
            reset();
          } else if (
            res.errorCode === 12 &&
            res.errorMessage &&
            res.errorMessage.includes('exists')
          ) {
            setProxyCheckMessage('used');
            resolve(false);
          } else if (res.errorCode === 9) {
            setProxyCheckMessage('incorrect');
            resolve(false);
          } else if (
            res.errorCode === 12 &&
            res.errorMessage &&
            !res.errorMessage.includes('exists')
          ) {
            setProxyCheckMessage('error');
            resolve(false);
          } else {
            setProxyCheckMessage('');
            resolve(false);
          }
        })
        .catch((e) => {
          console.log('error', e);
          setProxyCheckMessage('error');
          resolve(false);
        });
    });
  };

  return (
    <form className={cls.addProxyLeftSide}>
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
                    port: e.target.value,
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
        <button
          className={cls.buttonAddProxyLeft}
          onClick={(e) => {
            e.preventDefault();
            handleAddProxy();
          }}>
          {t('Add proxy')}
        </button>
      </div>
    </form>
  );
};

export default AddProxyLeftSide;
