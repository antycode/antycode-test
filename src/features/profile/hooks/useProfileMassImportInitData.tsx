import {useMemo} from 'react';
import { IProfileProxySettings } from '../types';
import { useProfilesStore } from '../store';
import {useTranslation} from "react-i18next";
import { ReactComponent as FacebookIcon } from '@/shared/assets/icons/facebook.svg';
import { ReactComponent as InstagramIcon } from '@/shared/assets/icons/instagram.svg';
import { ReactComponent as TwitterIcon } from '@/shared/assets/icons/twitter.svg';
import { ReactComponent as YoutubeIcon } from '@/shared/assets/icons/youtube.svg';
import { ReactComponent as TiktokIcon } from '@/shared/assets/icons/tiktok.svg';
import { ReactComponent as WindowsIcon } from '@/shared/assets/icons/windows.svg';
import { ReactComponent as MacosIcon } from '@/shared/assets/icons/macos.svg';
import { ReactComponent as LinuxIcon } from '@/shared/assets/icons/linux.svg';
import userAgents from '@/user-agents'

export function useProfileMassImportInitData() {
    const { configData } = useProfilesStore();
    const {t} = useTranslation();

    const statusOptions = configData?.statuses?.map((status: any) => ({
        value: status.external_id,
        label: status.title,
        color: status.color,
    }));

    const emptyStatusOptions = [
        { value: null, label: 'No status', color: '#00B341' }
    ];

    const tagsOptions = configData?.tags?.map((tag: any) => ({
        value: tag.external_id,
        label: tag.title,
    }));

    const platformOptions = configData?.platforms?.map((platform: any) => ({
        value: platform.external_id,
        label: platform.title
    }));

    const appOptions = configData?.apps?.map((app: any) => ({
        value: app.external_id,
        label: app.title,
        // icon: app.icon
    }))

    const emptyAppOptions = [
        { value: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
        { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
        { value: 'twitter', label: 'Twitter', icon: <TwitterIcon /> },
        { value: 'youtube', label: 'YouTube', icon: <YoutubeIcon /> },
        { value: 'tiktok', label: 'Tik Tok', icon: <TiktokIcon /> }
    ];

    const emptyPlatformOptions = [
        { value: '0', label: 'Windows', icon: <WindowsIcon /> },
        { value: '1', label: 'Macos', icon: <MacosIcon />  },
        { value: '2', label: 'Linux', icon: <LinuxIcon /> }
    ];

    const emptyProtocols = [
        { value: 'https', label: 'HTTP(S)' },
        { value: 'socks5', label: 'SOCKS5' },
        { value: 'socks4', label: 'SOCKS4' },
        { value: 'ssh', label: 'SSH' }
    ];

    const webGlOptions = configData?.webgls?.map((webgl: any) => ({
        value: webgl.external_id,
        label: webgl.title,
    }));

    const emptyWebGlOptions = [
        { value: '0', label: 'Disable' },
        { value: '1', label: 'Real' },
        { value: '2', label: 'Noise' }
    ];

    const webRTCOptions = configData?.webrtcs?.map((webrtc: any) => ({
        value: webrtc.external_id,
        label: webrtc.title,
    }));

    const emptyWebRTCOptions = [
        { value: '0', label: 'Disable' },
        { value: '1', label: 'Real' },
        { value: '2', label: 'Substitute' },
        { value: '3', label: 'Manually' }
    ];



    const clientRectsOptions = configData?.client_rects?.map((clientRect: any) => ({
        value: clientRect.external_id,
        label: clientRect.title,
    }));

    const emptyClientRectsOptions = [
        { value: '0', label: 'Real' },
        { value: '1', label: 'Noise' }
    ];

    const audioOptions = configData?.audio?.map((audioOption: any) => ({
        value: audioOption.external_id,
        label: audioOption.title,
    }));

    const emptyAudioOptions = [
        { value: '0', label: 'Real' },
        { value: '1', label: 'Noise' }
    ];

    const screenOptions = configData?.screens?.map((screen: any) => ({
        value: screen.external_id,
        label: screen.title,
    }));

    const emptyOptions = [
        { value: null, label: 'No options' }
    ];

    const ramOptions = configData?.rams?.map((ram: any) => ({
        value: ram.external_id,
        label: ram.title,
    }));

    const processorOptions = configData?.processors?.map((processor: any) => ({
        value: processor.external_id,
        label: processor.title,
    }));

    const emptyRamProcessorOptions = [
        { value: '0', label: '2' },
        { value: '1', label: '4' }
    ];

    const languagesOptions = configData?.languages?.map((language: any) => ({
        value: language.external_id,
        label: language.title,
    }));

    const proxyExternalOptions = configData?.proxies?.map((proxy: any) => ({
        value: proxy.external_id,
        label: proxy.title ? proxy.title : `${proxy.host}:${proxy.port}`,
        host: proxy.host,
        port: proxy.port,
        link_rotate: proxy.link_rotate,
        login: proxy.login,
        password: proxy.password,
        type: proxy.type
    }));

    const proxyDefaultOptions: IProfileProxySettings[] = [{
        value: '0',
        label: 'No proxy',
        title: '',
        host: '',
        port: '',
        link_rotate: '',
        login: '',
        password: '',
        type: 'http'
    }];

    const timezoneOptions = configData?.timezone?.map((timezone: any) => ({
        value: timezone.external_id,
        label: timezone.zone,
        utc: timezone.utc
    }));

    const webglInfoOptions = configData?.video_card?.map((webglInfo: any) => ({
        value: webglInfo.external_id,
        label: webglInfo.title,
    }));

    const canvasOptions = configData?.canvases?.map((canvas: any) => ({
        value: canvas.external_id,
        label: canvas.title,
    }));

    const emptyCanvasOptions = [
        { value: '0', label: 'Disable' },
        { value: '1', label: 'Real' },
        { value: '2', label: 'Noise' }
    ];


    const proxyOptions = [
        { value: 1, label: 'Add proxy'},
        { value: 2, label: 'Choose proxy' },
        { value: 0, label: 'No proxy' },
        { value: 3, label: 'From file' }
    ];

    const useragentOptions = [
        { value: 0, label: 'Manually'},
        { value: 1, label: 'From file' },
        { value: 2, label: 'Random' }
    ];

    const realManuallyOptions = [
        { value: 0, label: 'Real' },
        { value: 1, label: 'Manually' },
        { value: 2, label: 'Random' }
    ];

    const autoManuallyOptions = [
        { value: 0, label: 'Auto' },
        { value: 1, label: 'Manually' }
    ];

    const portsProfileOptions = [
        { value: 0, label: 'Real' },
        { value: 1, label: 'Block' }
    ];

    const portsProfileArr = [1234,5678];

    const customFlagsOptions = [true, false];

    const profileMediaOptions = { microphone: 0, speaker: 2, camera: 3 }

    const geoLocation = { longitude: 49.11, latitude: 45.23, precision: 10 };

    const options = {
        appExternalOpt: appOptions ? appOptions : emptyAppOptions,
        profileStatusExternalOpt: statusOptions ? statusOptions : emptyStatusOptions,
        tagsOpt: tagsOptions ? tagsOptions : [],
        protocolExternalOpt: emptyProtocols,
        profilePlatformExternalOpt: platformOptions ? platformOptions : emptyPlatformOptions,
        profileProxyOpt: proxyOptions,
        profileUseragentOpt: useragentOptions,
        profileProxyExternalOpt: proxyExternalOptions ? proxyExternalOptions : proxyDefaultOptions,
        profileWebglExternalOpt: webGlOptions ? webGlOptions : emptyWebGlOptions,
        profileCanvasExternalOpt: canvasOptions ? canvasOptions : emptyCanvasOptions,
        profileWebrtcExternalOpt: webRTCOptions ? webRTCOptions : emptyWebRTCOptions,
        profileWebglInfoChangingOpt: webglInfoOptions ? webglInfoOptions : emptyOptions,
        profileWebglInfoOpt: realManuallyOptions,
        profileClientrectsOpt: clientRectsOptions ?
            clientRectsOptions : emptyClientRectsOptions,
        profileTimezoneOpt: autoManuallyOptions,
        profileTimezoneChangingOpt: timezoneOptions ? timezoneOptions : emptyOptions,
        profileLanguageOpt: autoManuallyOptions,
        profileLanguageExternalOpt: languagesOptions ? languagesOptions : emptyOptions,
        profileGeolocationExternalOpt: autoManuallyOptions,
        profileGeolocationOpt: geoLocation,
        profileProcessorExternalOpt: processorOptions ? processorOptions : emptyRamProcessorOptions,
        profileProcessorOpt: realManuallyOptions,
        profileAudioOpt: audioOptions ? audioOptions : emptyAudioOptions,
        profileRamOpt: realManuallyOptions,
        profileRamExternalOpt: ramOptions ? ramOptions : emptyRamProcessorOptions,
        profileScreenExternalOpt: screenOptions ? screenOptions : emptyOptions,
        profileScreenOpt: realManuallyOptions,
        profileMediaOpt: realManuallyOptions,
        profileMediaChangingOpt: profileMediaOptions,
        portsOpt: portsProfileOptions,
        portsProfileOpt: portsProfileArr,
        isDoNotTrackOpt: customFlagsOptions,
        customFlagsOpt: customFlagsOptions,
        user_agent_windows: [...userAgents.user_agent_windows],
        user_agent_macos: [...userAgents.user_agent_macos],
        user_agent_linux: [...userAgents.user_agent_linux]
    };

    const defaultValues = {
        app_external_id: emptyAppOptions[0].value,
        title: '',
        cookies: '',
        tags: tagsOptions ? tagsOptions : [],
        user_agent_windows: userAgents.user_agent_windows[0],
        user_agent_macos: userAgents.user_agent_macos[0],
        user_agent_linux: userAgents.user_agent_linux[0],
        login: '',
        password: '',
        token: '',
        custom_flags: '',
        custom_flags_value: true,
        note: '',
        json: null,
        is_do_not_track: customFlagsOptions[0],
        ports: portsProfileArr,
        ports_value: portsProfileOptions[0].value,
        ports_profile: portsProfileOptions[0].label,
        media_value: realManuallyOptions[0].value,
        media: profileMediaOptions,
        geolocation: geoLocation,
        geolocation_external_value: autoManuallyOptions[0].value,
        protocol_external_id: '',
        platform_external_id: platformOptions && platformOptions[0].value,
        proxy_external_value: proxyOptions[3].value,
        useragent_external_value: useragentOptions[1].value,
        proxy_external_options: proxyDefaultOptions[0],
        proxy_external_id: null,
        canvas_external_id: canvasOptions && canvasOptions[0].value,
        webgl_external_id: webGlOptions && webGlOptions[0].value,
        webrtc_external_id: webRTCOptions && webRTCOptions[2].value,
        webgl_info_external_id: webglInfoOptions ?
            webglInfoOptions[0].value : emptyOptions[0].value,
        webgl_info_external_value: realManuallyOptions[0].value,
        clientrects_external_id: clientRectsOptions &&
            clientRectsOptions[0].value,
        timezone_external_value: autoManuallyOptions[0].value,
        timezone_external_id: configData?.timezone?.find((i: any) => i.zone === 'Europe/Kiev').external_id,
        language_external_value: autoManuallyOptions[0].value,
        language_external_id: languagesOptions ?
            languagesOptions[25].value : emptyOptions,
        processor_external_value: realManuallyOptions[0].value,
        processor_external_id: processorOptions ?
            processorOptions[0].value : emptyRamProcessorOptions,
        audio_external_id: audioOptions && audioOptions[0].value,
        ram_external_value: realManuallyOptions[0].value,
        ram_external_id: ramOptions ? ramOptions[0].value : emptyRamProcessorOptions,
        screen_external_value: realManuallyOptions[0].value,
        screen_external_id: screenOptions ? screenOptions[2].value : emptyOptions[0].value,
        status_external_id: ''
    };

    const initData = useMemo(
        () => ({
            options,
            defaultValues
        }),
        [configData]
    );
    return initData;
};
