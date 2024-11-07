import {useTranslation} from 'react-i18next';
import {Controller, useFormContext} from 'react-hook-form';
import {TProfileMassImport} from '../ProfileMassImportForm';
import cls from '../ProfileMassImportForm.module.scss';
import clsx from 'clsx';
import {SegmentedControl} from '@/shared/components/SegmentedControl/SegmentedControl';
import {InputCustom} from '@/shared/components/Input/InputCustom';
import {Select} from '@/shared/components/Select';
import {RenderCountComponent} from '../ProfileRenderCount/ProfileRenderCount';
import {ReactComponent as ReloadIcon} from "@/shared/assets/icons/reload.svg";
import {Input} from "@/shared/components/Input";
import React, {useEffect, useState} from "react";
import {useProfileMassImportInitData} from "@/features/profile/hooks/useProfileMassImportInitData";
import {useProfilesStore} from "@/features/profile/store";

interface Geo {
    longitude: number,
    latitude: number,
    precision: number
}

interface ProfileMassImportFormMainPartProps {
    userAgent: string,
    setUserAgent: React.Dispatch<React.SetStateAction<string>>,
    geo: Geo,
    setGeo: React.Dispatch<React.SetStateAction<Geo>>,
    setProcessorOption: React.Dispatch<React.SetStateAction<number | string>>,
    setWebglInfoOption: React.Dispatch<React.SetStateAction<number | string>>,
    setGeoOption: React.Dispatch<React.SetStateAction<number | string>>,
    setProfileDataReview: React.Dispatch<React.SetStateAction<any>>,
    profileDataReview: any,
    webglInfoOption: number | string,
    timezoneOption: number | string,
    setTimezoneOption: React.Dispatch<React.SetStateAction<number | string>>,
    setLanguageOption: React.Dispatch<React.SetStateAction<string | number>>,
    languageOption: number | string,
    geoOption: number | string,
    processorOption: number | string,
    platformValue: string
}

export const ProfileMassImportFormMainPart = (props: ProfileMassImportFormMainPartProps) => {
    const {
        userAgent,
        setUserAgent,
        geo,
        setGeo,
        setProcessorOption,
        setWebglInfoOption,
        webglInfoOption,
        setGeoOption,
        setProfileDataReview,
        profileDataReview,
        timezoneOption,
        setTimezoneOption,
        setLanguageOption,
        languageOption,
        geoOption,
        processorOption,
        platformValue
    } = props;

    const {t} = useTranslation();

    const {configData} = useProfilesStore();

    const {
        control,
        formState: {errors},
    } = useFormContext<TProfileMassImport>();

    const {options, defaultValues} = useProfileMassImportInitData();

    const [longitudeError, setLongitudeError] = useState<boolean>(false);
    const [latitudeError, setLatitudeError] = useState<boolean>(false);
    const [precisionError, setPrecisionError] = useState<boolean>(false);

    const handleLongitude = (e: any) => {
        let inputValue = e.target.value;

        // Remove leading zero if the input starts with "-" followed by "0" and then a digit (not a dot)
        if (inputValue.startsWith('-0') && inputValue.charAt(2) !== '.' && /^\d/.test(inputValue.charAt(2))) {
            inputValue = '-' + inputValue.slice(2);
        }

        // Remove leading zero if the input starts with "0" and is followed by a digit (not a dot)
        if (inputValue.startsWith('0') && inputValue.charAt(1) !== '.' && /^\d/.test(inputValue.charAt(1))) {
            inputValue = inputValue.slice(1);
        }

        // Use a regular expression to validate the input format
        const validInput = /^-?\d+(\.\d*)?$/; // Allow digits, an optional dot, and an optional minus sign at the beginning

        if (inputValue === '' || validInput.test(inputValue)) {
            // If the input is empty or valid, update the state
            const valueNum = +inputValue;
            if (valueNum < -180 || valueNum > 180) {
                setLongitudeError(true);
            } else {
                setLongitudeError(false);
            }
            setGeoOption1({...geoOption1, longitude: inputValue});
            setProfileDataReview({...profileDataReview, profileGeo: {...profileDataReview.profileGeo, longitude: inputValue}});
            setGeo({...geo, longitude: inputValue});
        }
    };
    const handleLatitude = (e: any) => {
        let inputValue = e.target.value;

        // Remove leading zero if the input starts with "-" followed by "0" and then a digit (not a dot)
        if (inputValue.startsWith('-0') && inputValue.charAt(2) !== '.' && /^\d/.test(inputValue.charAt(2))) {
            inputValue = '-' + inputValue.slice(2);
        }

        // Remove leading zero if the input starts with "0" and is followed by a digit (not a dot)
        if (inputValue.startsWith('0') && inputValue.charAt(1) !== '.' && /^\d/.test(inputValue.charAt(1))) {
            inputValue = inputValue.slice(1);
        }

        // Use a regular expression to validate the input format
        const validInput = /^-?\d+(\.\d*)?$/; // Allow digits, an optional dot, and an optional minus sign at the beginning

        if (inputValue === '' || validInput.test(inputValue)) {
            // If the input is empty or valid, update the state
            const valueNum = +inputValue;
            if (valueNum < -90 || valueNum > 90) {
                setLatitudeError(true);
            } else {
                setLatitudeError(false);
            }
            setGeoOption1({...geoOption1, latitude: inputValue});
            setProfileDataReview({...profileDataReview, profileGeo: {...profileDataReview.profileGeo, latitude: inputValue}});
            setGeo({...geo, latitude: inputValue});
        }
    };
    const handlePrecision = (e: any) => {
        let inputValue = e.target.value;

        // Remove leading zero if the input starts with "-" followed by "0" and then a digit (not a dot)
        if (inputValue.startsWith('-0') && inputValue.charAt(2) !== '.' && /^\d/.test(inputValue.charAt(2))) {
            inputValue = '-' + inputValue.slice(2);
        }

        // Remove leading zero if the input starts with "0" and is followed by a digit (not a dot)
        if (inputValue.startsWith('0') && inputValue.charAt(1) !== '.' && /^\d/.test(inputValue.charAt(1))) {
            inputValue = inputValue.slice(1);
        }

        // Use a regular expression to validate the input format
        const validInput = /^-?\d+(\.\d*)?$/; // Allow digits, an optional dot, and an optional minus sign at the beginning

        if (inputValue === '' || validInput.test(inputValue)) {
            // If the input is empty or valid, update the state
            const valueNum = +inputValue;
            if (valueNum < 1 || valueNum > 1000) {
                setPrecisionError(true);
            } else {
                setPrecisionError(false);
            }
            setGeo({...geo, precision: inputValue});
        }
    };

    const [webglInfoOption1, setWebglInfoOption1] = useState<string>(configData.video_card?.find((item: any) => item.external_id === defaultValues.webgl_info_external_id).title);

    useEffect(() => {
        if (webglInfoOption == 0) {
            setProfileDataReview({...profileDataReview, profileWebGLInfo: 'Real'});
        } else if (webglInfoOption == 1) {
            setProfileDataReview({...profileDataReview, profileWebGLInfo: webglInfoOption1});
        } else if (webglInfoOption == 2) {
            setProfileDataReview({...profileDataReview, profileWebGLInfo: 'Random'});
        }
    }, [webglInfoOption]);

    const platformNameFind = () => {
        const platform = options.profilePlatformExternalOpt.find((item: any) =>
            item.value === platformValue);
        return platform?.label;
    };

    const handleUserAgentWindows = (e: any) => {
        e.preventDefault();
        const userAgentsWindows = options.user_agent_windows;
        const randomIndex = Math.floor(Math.random() * userAgentsWindows.length);

        setUserAgent(userAgentsWindows[randomIndex]);
        setProfileDataReview({...profileDataReview, profileUseragent: userAgentsWindows[randomIndex]});
    };
    const handleUserAgentMacos = (e: any) => {
        e.preventDefault();
        const userAgentsMacos = options.user_agent_macos;
        const randomIndex = Math.floor(Math.random() * userAgentsMacos.length);

        setUserAgent(userAgentsMacos[randomIndex]);
        setProfileDataReview({...profileDataReview, profileUseragent: userAgentsMacos[randomIndex]});
    };
    const handleUserAgentLinux = (e: any) => {
        e.preventDefault();
        const userAgentsLinux = options.user_agent_linux;
        const randomIndex = Math.floor(Math.random() * userAgentsLinux.length);

        setUserAgent(userAgentsLinux[randomIndex]);
        setProfileDataReview({...profileDataReview, profileUseragent: userAgentsLinux[randomIndex]});
    };

    const [timezoneOption1, setTimezoneOption1] = useState<any>(configData.timezone?.find((item: any) => item.external_id === defaultValues.timezone_external_id));

    useEffect(() => {
        if (timezoneOption == 0) {
            setProfileDataReview({...profileDataReview, profileTimezone: 'Auto'});
        } else if (timezoneOption == 1) {
            setProfileDataReview({...profileDataReview, profileTimezone: timezoneOption1});
        }
    }, [timezoneOption]);

    const [languageOption1, setLanguageOption1] = useState<string>(configData.languages?.find((item: any) => item.external_id === defaultValues.language_external_id).title);


    useEffect(() => {
        if (languageOption == 0) {
            setProfileDataReview({...profileDataReview, profileLanguage: 'Auto'});
        } else if (languageOption == 1) {
            setProfileDataReview({...profileDataReview, profileLanguage: languageOption1});
        }
    }, [languageOption]);

    const [geoOption1, setGeoOption1] = useState<any>({ longitude: 0, latitude: 0, precision: 10 });

    useEffect(() => {
        if (geoOption == 0) {
            setProfileDataReview({...profileDataReview, profileGeo: 'Auto'});
        } else if (geoOption == 1) {
            setProfileDataReview({...profileDataReview, profileGeo: geoOption1});
        }
    }, [geoOption]);

    const [processorOption1, setProcessorOption1] = useState<string>(configData.processors?.find((item: any) => item.external_id === defaultValues.processor_external_id).title);

    useEffect(() => {
        if (processorOption == 0) {
            setProfileDataReview({...profileDataReview, profileProcessor: 'Real'});
        } else if (processorOption == 1) {
            setProfileDataReview({...profileDataReview, profileProcessor: processorOption1});
        } else if (processorOption == 2) {
            setProfileDataReview({...profileDataReview, profileProcessor: 'Random'});
        }
    }, [processorOption]);

    const changeUseragentOption = (value: number | string) => {
        if (value == 0) {
            setProfileDataReview({...profileDataReview, profileUseragent: userAgent});
        } else if (value == 1) {
            setProfileDataReview({...profileDataReview, profileUseragent: 'From file'});
        } else if (value == 2) {
            setProfileDataReview({...profileDataReview, profileUseragent: 'Random'});
        }
    };

    return (
        <div className={clsx(cls.formPage, cls.formPageFormMainPart)}>
            <div className={clsx(cls.field, cls.mainTop)}>
                <div className={cls.label}>{t('Useragent')}</div>
                <div className={cls.controlsUseragent}>
                    <div className={cls.controlsHeaderCustom}>
                        <Controller
                            control={control}
                            name="useragent_external_value"
                            render={({field}) => (
                                <div className={cls.userAgentWrapper}>
                                    <div className={cls.userAgentWrapperFirstChild}>
                                        <SegmentedControl
                                            name={field.name}
                                            value={field.value}
                                            onChange={(newValue: any) => {
                                                changeUseragentOption(newValue);
                                                field.onChange(newValue);
                                            }}
                                            options={options.profileUseragentOpt}
                                            getOptionLabel={(o) => t(o.label)}
                                        />
                                    </div>
                                    {field.value == 0 && (
                                        <Controller
                                            control={control}
                                            name="platform_external_id"
                                            render={({field}) => (
                                                <>
                                                    {(platformNameFind() === 'Windows') && (
                                                        <Controller
                                                            control={control}
                                                            name="user_agent_windows"
                                                            render={({field}) => (
                                                                <div className={cls.userAgentInputWrapper}>
                                                                    <div className={cls.profileInputWrapper}>
                                                                        <button
                                                                            className={cls.reloadButton}
                                                                            onClick={(e) => handleUserAgentWindows(e)}
                                                                        >
                                                                            <ReloadIcon/>
                                                                        </button>
                                                                        <Input {...field}
                                                                               value={userAgent}
                                                                               onChange={(e) => {
                                                                                   setProfileDataReview({
                                                                                       ...profileDataReview,
                                                                                       profileUseragent: (e.target as HTMLInputElement).value
                                                                                   });
                                                                                   setUserAgent((e.target as HTMLInputElement).value);
                                                                               }}
                                                                               className={clsx(cls.profileInput, cls.profileInputUserAgent)}
                                                                               placeholder={t('User agent')}
                                                                               error={errors.user_agent_windows?.message}/>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                    )}
                                                    {(platformNameFind() === 'Macos') && (
                                                        <Controller
                                                            control={control}
                                                            name="user_agent_macos"
                                                            render={({field}) => (
                                                                <div className={cls.userAgentInputWrapper}>
                                                                    <div className={cls.profileInputWrapper}>
                                                                        <button
                                                                            className={cls.reloadButton}
                                                                            onClick={(e) => handleUserAgentMacos(e)}
                                                                        >
                                                                            <ReloadIcon/>
                                                                        </button>
                                                                        <Input {...field}
                                                                               value={userAgent}
                                                                               onChange={(e) => {
                                                                                   setProfileDataReview({
                                                                                       ...profileDataReview,
                                                                                       profileUseragent: (e.target as HTMLInputElement).value
                                                                                   });
                                                                                   setUserAgent((e.target as HTMLInputElement).value);
                                                                               }}
                                                                               className={clsx(cls.profileInput, cls.profileInputUserAgent)}
                                                                               placeholder={t('User agent')}
                                                                               error={errors.user_agent_macos?.message}/>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                    )}
                                                    {(platformNameFind() === 'Linux') && (
                                                        <Controller
                                                            control={control}
                                                            name="user_agent_linux"
                                                            render={({field}) => (
                                                                <div className={cls.userAgentInputWrapper}>
                                                                    <div className={cls.profileInputWrapper}>
                                                                        <button
                                                                            className={cls.reloadButton}
                                                                            onClick={(e) => handleUserAgentLinux(e)}
                                                                        >
                                                                            <ReloadIcon/>
                                                                        </button>
                                                                        <Input {...field}
                                                                               value={userAgent}
                                                                               onChange={(e) => {
                                                                                   setProfileDataReview({
                                                                                       ...profileDataReview,
                                                                                       profileUseragent: (e.target as HTMLInputElement).value
                                                                                   });
                                                                                   setUserAgent((e.target as HTMLInputElement).value);
                                                                               }}
                                                                               className={clsx(cls.profileInput, cls.profileInputUserAgent)}
                                                                               placeholder={t('User agent')}
                                                                               error={errors.user_agent_linux?.message}/>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        />
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('WebRTC')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="webrtc_external_id"
                        render={({field}) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={(newValue) => {
                                    const webrtc = configData.webrtcs?.find((item: any) => item.external_id === newValue);
                                    setProfileDataReview({...profileDataReview, profileWebRtc: webrtc.title});
                                    field.onChange(newValue);
                                }}
                                options={options.profileWebrtcExternalOpt}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('Canvas')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="canvas_external_id"
                        render={({field}) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={(newValue) => {
                                    const canvas = configData.canvases?.find((item: any) => item.external_id === newValue);
                                    setProfileDataReview({...profileDataReview, profileCanvas: canvas.title});
                                    field.onChange(newValue);
                                }}
                                options={options.profileCanvasExternalOpt}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('WebGL')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="webgl_external_id"
                        render={({field}) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={(newValue) => {
                                    const webgl = configData.webgls?.find((item: any) => item.external_id === newValue);
                                    setProfileDataReview({...profileDataReview, profileWebGL: webgl.title});
                                    field.onChange(newValue);
                                }}
                                options={options.profileWebglExternalOpt}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('WebGL info')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="webgl_info_external_value"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <SegmentedControl
                                    name={field.name}
                                    value={field.value}
                                    onChange={(newValue) => {
                                        setWebglInfoOption(newValue);
                                        field.onChange(newValue);
                                    }}
                                    options={options.profileWebglInfoOpt}
                                    getOptionLabel={(o) => t(o.label)}
                                />
                                {(field.value === 1) &&
                                <div className={cls.optionsForm}>
                                    <Controller
                                        control={control}
                                        name="webgl_info_external_id"
                                        render={({field}) => (
                                            <div className={cls.webglInfo}>
                                                {/*<InputCustom*/}
                                                {/*    title='WebGL Google inc'*/}
                                                {/*    titleBottom*/}
                                                {/*    renderComponent={<Select*/}
                                                {/*        className={clsx(cls.select, cls.webglSelect)}*/}
                                                {/*        ref={field.ref}*/}
                                                {/*        placeholder={'Google Inc.'}*/}
                                                {/*        name={field.name}*/}
                                                {/*        getOptionLabel={(o) => t(o.label)}*/}
                                                {/*        // options={options.profileWebglInfoChangingOpt}*/}
                                                {/*        // value={options.profileWebglInfoChangingOpt*/}
                                                {/*        //     .find((c:any) => c.value === field.value)}*/}
                                                {/*        onChange={(option) => field.onChange(option?.value)}*/}
                                                {/*    />}*/}
                                                {/*/>*/}
                                                <InputCustom
                                                    title='WebGL'
                                                    titleBottom
                                                    renderComponent={<Select
                                                        className={clsx(cls.select, cls.webglSelect)}
                                                        ref={field.ref}
                                                        placeholder={'ANGLE (Intel(R) UHD Graphics'}
                                                        name={field.name}
                                                        getOptionLabel={(o) => t(o.label)}
                                                        options={options.profileWebglInfoChangingOpt}
                                                        value={options.profileWebglInfoChangingOpt
                                                            .find((c: any) => c.value === field.value)}
                                                        onChange={(option) => {
                                                            const webglInfo = configData.video_card?.find((item: any) => item.external_id === option?.value);
                                                            setWebglInfoOption1(webglInfo.title);
                                                            setProfileDataReview({
                                                                ...profileDataReview,
                                                                profileWebGLInfo: webglInfo.title
                                                            });
                                                            field.onChange(option?.value);
                                                        }}
                                                    />}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                }
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('Clients Rects')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="clientrects_external_id"
                        render={({field}) => (
                            <SegmentedControl
                                name={field.name}
                                value={field.value}
                                onChange={(newValue) => {
                                    const client_rects = configData.client_rects?.find((item: any) => item.external_id === newValue);
                                    setProfileDataReview({
                                        ...profileDataReview,
                                        profileClientsRects: client_rects.title
                                    });
                                    field.onChange(newValue);
                                }}
                                options={options.profileClientrectsOpt}
                                getOptionLabel={(o) => t(o.label)}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('Timezone')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="timezone_external_value"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <SegmentedControl
                                    name={field.name}
                                    value={field.value}
                                    onChange={(newValue) => {
                                        setTimezoneOption(newValue);
                                        field.onChange(newValue);
                                    }}
                                    options={options.profileTimezoneOpt}
                                    getOptionLabel={(o) => t(o.label)}
                                />
                                {(field.value === 1) &&
                                <div className={cls.optionsForm}>
                                    <Controller
                                        control={control}
                                        name="timezone_external_id"
                                        render={({field}) => (
                                            <div className={cls.wrapperProxyForm}>
                                                <InputCustom
                                                    title='Change time zone'
                                                    renderComponent={<Select
                                                        className={cls.select}
                                                        placeholder={t('Choose timezone')}
                                                        ref={field.ref}
                                                        name={field.name}
                                                        getOptionLabel={(o: any) => {
                                                            return (<div className={cls.timezoneContent}>
                                                                <span>[{o.utc}]</span>
                                                                <p>{t(o.label)}</p>
                                                            </div>) as unknown as string;
                                                        }}
                                                        options={options.profileTimezoneChangingOpt}
                                                        value={options.profileTimezoneChangingOpt.find((c: any) => c.value === field.value)}
                                                        onChange={(option) => {
                                                            const timezone = configData.timezone?.find((item: any) => item.external_id === option?.value);
                                                            setTimezoneOption1(timezone);
                                                            setProfileDataReview({
                                                                ...profileDataReview,
                                                                profileTimezone: timezone
                                                            });
                                                            field.onChange(option?.value);
                                                        }}
                                                    />}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                }
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('Language')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="language_external_value"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <SegmentedControl
                                    name={field.name}
                                    value={field.value}
                                    onChange={(newValue) => {
                                        setLanguageOption(newValue);
                                        field.onChange(newValue);
                                    }}
                                    options={options.profileLanguageOpt}
                                    getOptionLabel={(o) => t(o.label)}
                                />
                                {(field.value === 1) &&
                                <div className={cls.optionsForm}>
                                    <Controller
                                        control={control}
                                        name="language_external_id"
                                        render={({field}) => (
                                            <div className={cls.wrapperProxyForm}>
                                                <InputCustom
                                                    title='Change language'
                                                    renderComponent={<Select
                                                        className={cls.select}
                                                        placeholder={t('Choose language')}
                                                        ref={field.ref}
                                                        name={field.name}
                                                        getOptionLabel={(o) => t(o.label)}
                                                        options={options.profileLanguageExternalOpt}
                                                        value={options.profileLanguageExternalOpt.find((c: any) => c.value === field.value)}
                                                        onChange={(option) => {
                                                            const language = configData.languages?.find((item: any) => item.external_id === option?.value);
                                                            setLanguageOption1(language.title);
                                                            setProfileDataReview({...profileDataReview, profileLanguage: language.title});
                                                            field.onChange(option?.value);
                                                        }}
                                                    />}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                }
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('Geolocation')}</div>
                <div className={cls.controlsGeo}>
                    <Controller
                        control={control}
                        name="geolocation_external_value"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <div className={cls.geoSegmentedControl}>
                                    <SegmentedControl
                                        name={field.name}
                                        value={field.value}
                                        onChange={(newValue) => {
                                            setGeoOption(newValue);
                                            field.onChange(newValue);
                                        }}
                                        options={options.profileGeolocationExternalOpt}
                                        getOptionLabel={(o) => t(o.label)}
                                    />
                                </div>
                                {(field.value === 1) &&
                                <div className={cls.geoWrapper}>
                                    <div className={cls.geoOption}>
                                        <label className={cls.geoLabel}>{t('Longitude')}:</label>
                                        <input
                                            type="number"
                                            value={geo.longitude.toString()}
                                            onChange={handleLongitude}
                                            className={cls.inputNumGeo}
                                        />
                                        <div className={cls.geoErrorContainer}
                                             data-geo-error-longitude={longitudeError}>
                                            <p className={cls.geoErrorText}>{t('Longitude can be set from -180 to 180')}</p>
                                        </div>
                                    </div>
                                    <div className={cls.geoOption}>
                                        <label className={cls.geoLabel}>{t('Latitude')}:</label>
                                        <input
                                            type="number"
                                            value={geo.latitude.toString()}
                                            onChange={handleLatitude}
                                            className={cls.inputNumGeo}
                                        />
                                        <div className={cls.geoErrorContainer} data-geo-error-latitude={latitudeError}>
                                            <p className={cls.geoErrorText}>{t('Latitude can be set from -90 to 90')}</p>
                                        </div>
                                    </div>
                                    <div className={cls.geoOption}>
                                        <label className={cls.geoLabel}>{t('Precision')}:</label>
                                        <input
                                            type="number"
                                            value={geo.precision.toString()}
                                            onChange={handlePrecision}
                                            className={cls.inputNumGeo}
                                        />
                                        <div className={cls.geoErrorContainer}
                                             data-geo-error-precision={precisionError}>
                                            <p className={cls.geoErrorText}>{t('Accuracy can be set from 1 to 1000')}</p>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                        )}
                    />
                </div>
            </div>
            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('Processor')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="processor_external_value"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <SegmentedControl
                                    name={field.name}
                                    value={field.value}
                                    onChange={(newValue) => {
                                        setProcessorOption(newValue);
                                        field.onChange(newValue);
                                    }}
                                    options={options.profileProcessorOpt}
                                    getOptionLabel={(o) => t(o.label)}
                                />
                                {(field.value === 1) &&
                                <div className={cls.optionsForm}>
                                    <Controller
                                        control={control}
                                        name="processor_external_id"
                                        render={({field}) => (
                                            <div className={cls.wrapperProxyForm}>
                                                <InputCustom
                                                    title='Сores'
                                                    renderComponent={
                                                        <SegmentedControl
                                                            name={field.name}
                                                            value={field.value}
                                                            onChange={(newValue) => {
                                                                const processor = configData.processors?.find((item: any) => item.external_id === newValue);
                                                                setProcessorOption1(processor.title);
                                                                setProfileDataReview({...profileDataReview, profileProcessor: processor.title});
                                                                field.onChange(newValue);
                                                            }}
                                                            options={options.profileProcessorExternalOpt}
                                                            getOptionLabel={(o) => t(o.label)}
                                                        />
                                                    }
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                }
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
