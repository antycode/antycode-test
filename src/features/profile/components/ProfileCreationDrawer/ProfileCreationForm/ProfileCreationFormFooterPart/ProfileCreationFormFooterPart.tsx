import {useTranslation} from 'react-i18next';
import {Controller, useFormContext} from 'react-hook-form';
import {SegmentedControl} from '@/shared/components/SegmentedControl/SegmentedControl';
import {TProfileCreationForm} from '../ProfileCreationForm';
import cls from '../ProfileCreationForm.module.scss';
import clsx from 'clsx';
import {useProfileInitData} from '@/features/profile/hooks/useProfileInitData';
import {Input} from '@/shared/components/Input';
import {Switch} from '@/shared/components/Switch/Switch';
import {InputCustom} from '@/shared/components/Input/InputCustom';
import {RenderCountComponent} from '../ProfileRenderCount/ProfileRenderCount';
import {Select} from '@/shared/components/Select';
import React, {useEffect, useState} from "react";
import {useProfilesStore} from "@/features/profile/store";

interface MediaType {
    microphone: number;
    speaker: number;
    camera: number;
}

interface ProfileCreationFormFooterPartProps {
    media: MediaType,
    setMedia: React.Dispatch<React.SetStateAction<MediaType>>,
    setRamOption: React.Dispatch<React.SetStateAction<string | number>>,
    setScreenOption: React.Dispatch<React.SetStateAction<string | number>>,
    setMediaOption: React.Dispatch<React.SetStateAction<string | number>>,
    ramOption: string | number,
    setProfileDataReview: React.Dispatch<React.SetStateAction<any>>,
    profileDataReview: any,
    screenOption: string | number,
    audioOption: string | number,
    setAudioOption: React.Dispatch<React.SetStateAction<string | number>>,
    mediaOption: string | number,
    portsOption: string | number,
    setPortsOption: React.Dispatch<React.SetStateAction<string | number>>
}

export const ProfileCreationFormFooterPart = (props: ProfileCreationFormFooterPartProps) => {
    const {
        media,
        setMedia,
        setRamOption,
        setScreenOption,
        setMediaOption,
        ramOption,
        setProfileDataReview,
        profileDataReview,
        screenOption,
        audioOption,
        setAudioOption,
        mediaOption,
        portsOption,
        setPortsOption
    } = props;

    const {t} = useTranslation();

    const {configData} = useProfilesStore();
    const {defaultValues} = useProfileInitData();

    const [portsValue, setPortsValue] = useState<string>('1234,5678');

    const {control} = useFormContext<TProfileCreationForm>();

    const {options} = useProfileInitData();

    const [ramOption1, setRamOption1] = useState<string>(configData.rams?.find((item: any) => item.external_id === defaultValues.ram_external_id).title);

    useEffect(() => {
        if (ramOption == 0) {
            setProfileDataReview({...profileDataReview, profileRam: 'Real'});
        } else if (ramOption == 1) {
            setProfileDataReview({...profileDataReview, profileRam: ramOption1});
        } else if (ramOption == 2) {
            setProfileDataReview({...profileDataReview, profileRam: 'Random'});
        }
    }, [ramOption]);

    const [screenOption1, setScreenOption1] = useState<string>(configData.screens?.find((item: any) => item.external_id === defaultValues.screen_external_id).title);

    useEffect(() => {
        if (screenOption == 0) {
            setProfileDataReview({...profileDataReview, profileScreen: 'Real'});
        } else if (screenOption == 1) {
            setProfileDataReview({...profileDataReview, profileScreen: screenOption1});
        } else if (screenOption == 2) {
            setProfileDataReview({...profileDataReview, profileScreen: 'Random'});
        }
    }, [screenOption]);

    const [mediaOption1, setMediaOption1] = useState<any>({microphone: 0, speaker: 0, camera: 0});

    useEffect(() => {
        if (mediaOption == 0) {
            setProfileDataReview({...profileDataReview, profileMedia: 'Real'});
        } else if (mediaOption == 1) {
            setProfileDataReview({...profileDataReview, profileMedia: mediaOption1});
        } else if (mediaOption == 2) {
            setProfileDataReview({...profileDataReview, profileMedia: 'Random'});
        }
    }, [mediaOption]);

    const [portsOption1, setPortsOption1] = useState<string>('1234,5678');

    useEffect(() => {
        if (portsOption == 0) {
            setProfileDataReview({...profileDataReview, profilePorts: 'Real'});
        } else if (portsOption == 1) {
            setProfileDataReview({...profileDataReview, profilePorts: portsOption1});
        }
    }, [portsOption]);

    return (
        <div className={cls.formPage}>
            <div className={clsx(cls.field, cls.mainTop, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('Memory')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="ram_external_value"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <SegmentedControl
                                    name={field.name}
                                    value={field.value}
                                    onChange={(newValue) => {
                                        setRamOption(newValue);
                                        field.onChange(newValue);
                                    }}
                                    options={options.profileRamOpt}
                                    getOptionLabel={(o) => t(o.label)}
                                />
                                {(field.value === 1) &&
                                <div className={cls.optionsForm}>
                                    <Controller
                                        control={control}
                                        name="ram_external_id"
                                        render={({field}) => (
                                            <div className={cls.wrapperProxyForm}>
                                                <InputCustom
                                                    title='GB'
                                                    renderComponent={
                                                        <SegmentedControl
                                                            name={field.name}
                                                            value={field.value}
                                                            onChange={(newValue) => {
                                                                const ram = configData.rams?.find((item: any) => item.external_id === newValue);
                                                                setRamOption1(ram.title);
                                                                setProfileDataReview({
                                                                    ...profileDataReview,
                                                                    profileRam: ram.title
                                                                });
                                                                field.onChange(newValue);
                                                            }}
                                                            options={options.profileRamExternalOpt}
                                                            getOptionLabel={(o) => t(o.label)}
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

            <div className={clsx(cls.field, cls.mainTop, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('Screen')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="screen_external_value"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <SegmentedControl
                                    name={field.name}
                                    value={field.value}
                                    onChange={(newValue) => {
                                        setScreenOption(newValue);
                                        field.onChange(newValue);
                                    }}
                                    options={options.profileScreenOpt}
                                    getOptionLabel={(o) => t(o.label)}
                                />
                                {(field.value === 1) &&
                                <div className={cls.optionsForm}>
                                    <Controller
                                        control={control}
                                        name="screen_external_id"
                                        render={({field}) => (
                                            <div className={cls.wrapperProxyForm}>
                                                <InputCustom
                                                    title='Change screen'
                                                    renderComponent={<Select
                                                        className={cls.select}
                                                        ref={field.ref}
                                                        name={field.name}
                                                        getOptionLabel={(o) => t(o.label)}
                                                        options={options.profileScreenExternalOpt}
                                                        value={options.profileScreenExternalOpt.find((c: any) => c.value === field.value)}
                                                        onChange={(option) => {
                                                            const screen = configData.screens?.find((item: any) => item.external_id === option?.value);
                                                            setScreenOption1(screen.title);
                                                            setProfileDataReview({
                                                                ...profileDataReview,
                                                                profileScreen: screen.title
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
                <div className={cls.label}>{t('Audio')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="audio_external_id"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <SegmentedControl
                                    name={field.name}
                                    value={field.value}
                                    options={options.profileAudioOpt}
                                    onChange={(newValue) => {
                                        const audio = configData.audio?.find((item: any) => item.external_id === newValue);
                                        setProfileDataReview({...profileDataReview, profileAudio: audio.title});
                                        field.onChange(newValue);
                                    }}
                                    getOptionLabel={(o) => t(o.label)}
                                />
                            </div>
                        )}
                    />
                </div>
            </div>
            <div className={clsx(cls.field, cls.optionItemWrapper)}>
                <div className={cls.label}>{t('Media')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="media_value"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <SegmentedControl
                                    name={field.name}
                                    value={field.value}
                                    onChange={(newValue) => {
                                        setMediaOption(newValue);
                                        field.onChange(newValue);
                                    }}
                                    options={options.profileMediaOpt}
                                    getOptionLabel={(o) => t(o.label)}
                                />
                                {(field.value === 1) &&
                                <div className={cls.optionsForm}>
                                    <Controller
                                        control={control}
                                        name="media"
                                        render={({field}) => (
                                            <div className={cls.mediaSettingsWrapper}>
                                                <div className={cls.mediaSettings}>
                                                    <div className={cls.mediaSettingsLabel}>{t('Microphones')}</div>
                                                    <div className={cls.inputRangeWrapper}>
                                                        <input
                                                            type="range"
                                                            min='0'
                                                            max='3'
                                                            step='1'
                                                            value={media.microphone}
                                                            onChange={(e) => {
                                                                setProfileDataReview({
                                                                    ...profileDataReview,
                                                                    profileMedia: {
                                                                        ...profileDataReview.profileMedia,
                                                                        microphone: +e.target.value
                                                                    }
                                                                });
                                                                setMediaOption1({
                                                                    ...mediaOption1,
                                                                    microphone: +e.target.value
                                                                });
                                                                setMedia({...media, microphone: +e.target.value});
                                                            }}
                                                            className={cls.inputRange}/>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={media.microphone.toString()}
                                                        onChange={(e) => {
                                                            const value = Math.min(3, Math.max(0, parseInt(e.target.value, 10)));
                                                            setProfileDataReview({
                                                                ...profileDataReview,
                                                                profileMedia: {
                                                                    ...profileDataReview.profileMedia,
                                                                    microphone: value
                                                                }
                                                            });
                                                            setMediaOption1({...mediaOption1, microphone: value});
                                                            setMedia({...media, microphone: value});
                                                        }}
                                                        className={cls.inputNum}
                                                    />
                                                </div>
                                                <div className={cls.mediaSettings}>
                                                    <div className={cls.mediaSettingsLabel}>{t('Speakers')}</div>
                                                    <div className={cls.inputRangeWrapper}>
                                                        <input
                                                            type="range"
                                                            min='0'
                                                            max='3'
                                                            step='1'
                                                            value={media.speaker}
                                                            onChange={(e) => {
                                                                setProfileDataReview({
                                                                    ...profileDataReview,
                                                                    profileMedia: {
                                                                        ...profileDataReview.profileMedia,
                                                                        speaker: +e.target.value
                                                                    }
                                                                });
                                                                setMediaOption1({
                                                                    ...mediaOption1,
                                                                    speaker: +e.target.value
                                                                });
                                                                setMedia({...media, speaker: +e.target.value});
                                                            }}
                                                            className={cls.inputRange}/>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={media.speaker.toString()}
                                                        onChange={(e) => {
                                                            const value = Math.min(3, Math.max(0, parseInt(e.target.value, 10)));
                                                            setProfileDataReview({
                                                                ...profileDataReview,
                                                                profileMedia: {
                                                                    ...profileDataReview.profileMedia,
                                                                    speaker: value
                                                                }
                                                            });
                                                            setMediaOption1({...mediaOption1, speaker: value});
                                                            setMedia({...media, speaker: value});
                                                        }}
                                                        className={cls.inputNum}
                                                    />
                                                </div>
                                                <div className={cls.mediaSettings}>
                                                    <div className={cls.mediaSettingsLabel}>{t('Cameras')}</div>
                                                    <div className={cls.inputRangeWrapper}>
                                                        <input
                                                            type="range"
                                                            min='0'
                                                            max='3'
                                                            step='1'
                                                            value={media.camera}
                                                            onChange={(e) => {
                                                                setProfileDataReview({
                                                                    ...profileDataReview,
                                                                    profileMedia: {
                                                                        ...profileDataReview.profileMedia,
                                                                        camera: +e.target.value
                                                                    }
                                                                });
                                                                setMediaOption1({
                                                                    ...mediaOption1,
                                                                    camera: +e.target.value
                                                                });
                                                                setMedia({...media, camera: +e.target.value});
                                                            }}
                                                            className={cls.inputRange}/>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={media.camera.toString()}
                                                        onChange={(e) => {
                                                            const value = Math.min(3, Math.max(0, parseInt(e.target.value, 10)));
                                                            setProfileDataReview({
                                                                ...profileDataReview,
                                                                profileMedia: {
                                                                    ...profileDataReview.profileMedia,
                                                                    camera: value
                                                                }
                                                            });
                                                            setMediaOption1({...mediaOption1, camera: value});
                                                            setMedia({...media, camera: value});
                                                        }}
                                                        className={cls.inputNum}
                                                    />
                                                </div>
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
                <div className={cls.label}>{t('Ports')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="ports_value"
                        render={({field}) => (
                            <div className={cls.wrapperOptions}>
                                <SegmentedControl
                                    name={field.name}
                                    value={field.value}
                                    onChange={(newValue) => {
                                        setPortsOption(newValue);
                                        field.onChange(newValue);
                                    }}
                                    options={options.portsOpt}
                                    getOptionLabel={(o) => t(o.label)}
                                />
                                {(field.value === 1) &&
                                <div className={cls.optionsForm}>
                                    <Controller
                                        control={control}
                                        name="ports"
                                        render={({field}) => (
                                            <InputCustom
                                                {...field}
                                                title='Block ports'
                                                placeholder={'3389,5900,5800,7070,6568,5938'}
                                                inputType
                                                className={cls.inputGreenBorder}
                                                inputValue={portsValue}
                                                handleInput={(e) => {
                                                    setPortsValue(() => e.target.value);
                                                    setPortsOption1(e.target.value);
                                                    setProfileDataReview({...profileDataReview, profilePorts: e.target.value});
                                                    field.onChange(e.target.value.split(',').map(i => +i));
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                }
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className={clsx(cls.field, cls.mainHeader, cls.optionItemWrapper)} style={{paddingBottom: '69px'}}>
                <div className={cls.label}>{t('Do not track')}</div>
                <div className={cls.controls}>
                    <Controller
                        control={control}
                        name="is_do_not_track"
                        render={({field}) => <Switch {...field}
                                                     className={cls.switch} checked={field.value} onChange={(e) => {
                                                         const value = e?.target.checked;
                            setProfileDataReview({...profileDataReview, profileIsDoNotTrack: value ? 'Enable' : 'Disable'});
                            field.onChange(e?.target.checked);
                        }}/>}
                    />
                </div>
            </div>
        </div>
    );
};
