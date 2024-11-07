import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { SegmentedControl } from '@/shared/components/SegmentedControl/SegmentedControl';
import { useFarmFormInitData } from '@/features/account/hooks/useFarmFormInitData';
import { TFarmCreationForm } from '../FarmCreationForm';
import cls from '../FarmCreationForm.module.scss';
import { MutableRefObject, useRef } from 'react';

export const FarmAdsPage = () => {

    const documentDownloader: MutableRefObject<null> | any = useRef(null);

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
                {t('ADS hed')}
            </div>
            <div className={cls.field}>
                <div className={cls.label}>{t('Accept AdsManager policy')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="managerPolicy"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.managerPolicy}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>

            <div className={cls.field}>
                <div className={cls.label}>{t('Save token')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="saveFacebookToken"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.saveFacebookToken}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>

            <div className={cls.field}>
                <div className={cls.label}>{t('Check account on ZRD')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="checkZrd"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.checkZrd}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>

            <div className={cls.field}>
                <div className={cls.label}>{t('Pass ZRD')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="passZrd"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.passZrd}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>

            <div className={cls.field}>
                <div className={clsx(cls.label, cls.labelBackImage)}>{t('Create a business manager')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="businessManager"
                        render={({ field }) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                options={options.businessManager}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>

            {/*<div className={cls.field}>*/}
            {/*    <div className={clsx(cls.label, cls.labelBackImage)}>{t('Attempt to call the ZRD')}</div>*/}
            {/*    <div className={cls.controls}>*/}
            {/*        <Controller*/}
            {/*            control={control}*/}
            {/*            name="callZrd"*/}
            {/*            render={({ field }) => (*/}
            {/*                <SegmentedControl*/}
            {/*                    name={field.name}*/}
            {/*                    value={field.value}*/}
            {/*                    onChange={field.onChange}*/}
            {/*                    options={options.callZrd}*/}
            {/*                    getOptionLabel={(o) => t(o.label)}*/}
            {/*                />*/}
            {/*            )}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className={cls.field}>*/}
            {/*    <div className={cls.label}>{t('Download documentation')}</div>*/}
            {/*    <div className={cls.controls}>*/}
            {/*        <Controller*/}
            {/*            control={control}*/}
            {/*            name="documentDownloader"*/}
            {/*            render={({ field }) => (*/}
            {/*                <div className={cls.wrapperImageInput}>*/}
            {/*                    <div className={cls.text}>{defaultValues.documentDownloader}</div>*/}
            {/*                    <input*/}
            {/*                        multiple*/}
            {/*                        id='documentDownloader'*/}
            {/*                        ref={documentDownloader}*/}
            {/*                        style={{ display: 'none' }}*/}
            {/*                        type="file"*/}
            {/*                        accept="image/*"*/}
            {/*                        onChange={(option) => {*/}
            {/*                            showFileWay("documentDownloader");*/}
            {/*                            field.onChange(option?.target?.files)*/}
            {/*                        }}*/}
            {/*                    />*/}
            {/*                    <button className={cls.button}*/}
            {/*                        onClick={() => {*/}
            {/*                            documentDownloader.current.click();*/}
            {/*                        }}>*/}
            {/*                        <div className={cls.text}>{t('CHOOSE')}</div>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={cls.mainTitle}>
                {t('Download documents')}
            </div>
        </div>
    );
};
