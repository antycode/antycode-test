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
import userAgents from '@/user-agents';

export function useEditProfileInitData(profileToEdit: any) {
    const { configData } = useProfilesStore();
    const {folders} = useProfilesStore();
    const {t} = useTranslation();

    const statusOptions = configData?.statuses?.map((status: any) => ({
        value: status.external_id,
        label: status.title,
        title: status.title,
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
        { value: 0, label: 'No proxy' }
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

    const foundProfile = {
        title: profileToEdit?.title,
        profile_type: profileToEdit?.profile_type,
        token: profileToEdit?.token,
        media: profileToEdit?.profile_media,
        cookies: profileToEdit?.cookies,
        geolocation: profileToEdit?.profile_geolocation,
        custom_flags: profileToEdit?.custom_flags,
        is_do_not_track: profileToEdit?.is_do_not_track,
        json: profileToEdit?.json,
        login: profileToEdit?.login,
        note: profileToEdit?.note,
        password: profileToEdit?.password,
        status: configData && statusOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_status_external_id),
        platform: configData && platformOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.platform_external_id),
        tags: profileToEdit?.tags,
        user_agent: profileToEdit?.user_agent,
        audio: configData && audioOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_audio_external_id),
        canvas: configData && canvasOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_canvas_external_id),
        client_rect: configData && clientRectsOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_clientrects_external_id),
        language: configData && languagesOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_language_external_id),
        processor: configData && processorOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_processor_external_id),
        proxy: configData && proxyExternalOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_proxy_external_id),
        ram: configData && ramOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_ram_external_id),
        screen: configData && screenOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_screen_external_id),
        timezone: configData && timezoneOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_timezone_external_id),
        webgl_info: configData && webglInfoOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_webgl_info_external_id),
        ports: profileToEdit?.ports,
        webgl: configData && webGlOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_webgl_external_id),
        webrtc: configData && webRTCOptions.find((item: {[key: string]: any}) => item.value === profileToEdit?.profile_webrtc_external_id),
        folders: folders.filter(f1 => profileToEdit.folders.some((f2Id: string) => f1.external_id === f2Id))
    };

    const options = {
        appExternalOpt: appOptions ? appOptions : emptyAppOptions,
        profileStatusExternalOpt: statusOptions ? statusOptions : emptyStatusOptions,
        tagsOpt: tagsOptions ? tagsOptions : [],
        protocolExternalOpt: emptyProtocols,
        profilePlatformExternalOpt: platformOptions ? platformOptions : emptyPlatformOptions,
        profileProxyOpt: proxyOptions,
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
        title: foundProfile.title,
        profile_type: foundProfile.profile_type,
        status: foundProfile.status,
        cookies: foundProfile.cookies,
        tags: foundProfile.tags,
        user_agent_windows: foundProfile.platform.title === 'Windows' ? foundProfile.user_agent : userAgents.user_agent_windows[0],
        user_agent_macos: foundProfile.platform.title === 'Macos' ? foundProfile.user_agent : userAgents.user_agent_macos[0],
        user_agent_linux: foundProfile.platform.title === 'Linux' ? foundProfile.user_agent : userAgents.user_agent_linux[0],
        login: foundProfile.login,
        password: foundProfile.password,
        token: foundProfile.token,
        custom_flags: foundProfile.custom_flags,
        custom_flags_value: true,
        note: foundProfile.note,
        json: foundProfile.json,
        is_do_not_track: foundProfile.is_do_not_track,
        ports: foundProfile.ports,
        ports_value: foundProfile.ports === portsProfileArr ? portsProfileOptions[0].value : portsProfileOptions[1].value,
        ports_profile: portsProfileOptions[0].label,
        media_value: foundProfile.media === profileMediaOptions ? realManuallyOptions[0].value : realManuallyOptions[1].value,
        media: foundProfile.media,
        geolocation: foundProfile.geolocation,
        geolocation_external_value: foundProfile.geolocation === geoLocation ? autoManuallyOptions[0].value :autoManuallyOptions[1].value,
        protocol_external_id: '',
        platform_external_id: foundProfile.platform.value,
        proxy_external_value: foundProfile.proxy ? proxyOptions[1].value : proxyOptions[2].value,
        proxy_external_options: proxyDefaultOptions[0],
        proxy_external_id: foundProfile.proxy ? foundProfile.proxy.value : null,
        canvas_external_id: foundProfile.canvas ? foundProfile.canvas.value : canvasOptions && canvasOptions[0].value,
        webgl_external_id: foundProfile.webgl ? foundProfile.webgl.value : null,
        webrtc_external_id: foundProfile.webrtc ? foundProfile.webrtc.value : null,
        webgl_info_external_value: foundProfile.webgl_info.value === webglInfoOptions[0].value ? realManuallyOptions[0].value : realManuallyOptions[1].value,
        webgl_info_external_id: foundProfile.webgl_info.value,
        clientrects_external_id: foundProfile.client_rect.value,
        timezone_external_value: foundProfile.timezone ? autoManuallyOptions[1].value : autoManuallyOptions[0].value,
        timezone_external_id: foundProfile.timezone ? foundProfile.timezone.value : null,
        language_external_value: foundProfile.language.value === languagesOptions[25].value ? autoManuallyOptions[0].value : autoManuallyOptions[1].value,
        language_external_id: languagesOptions ?
            foundProfile.language.value : emptyOptions,
        processor_external_value: foundProfile.processor.value === processorOptions[0].value ? realManuallyOptions[0].value : realManuallyOptions[1].value,
        processor_external_id: processorOptions ?
            foundProfile.processor.value : emptyRamProcessorOptions,
        audio_external_id: foundProfile.audio.value,
        ram_external_value: foundProfile.ram.value === ramOptions[0].value ? realManuallyOptions[0].value: realManuallyOptions[1].value,
        ram_external_id: ramOptions ? foundProfile.ram.value : emptyRamProcessorOptions,
        screen_external_value: foundProfile.screen.value === screenOptions[2].value ? realManuallyOptions[0].value : realManuallyOptions[1].value,
        screen_external_id: foundProfile.screen ? foundProfile.screen.value : emptyOptions[0].value,
        status_external_id: '',
        folders: foundProfile.folders
    };

    const initData = useMemo(
        () => ({
            options,
            defaultValues,
            foundProfile
        }),
        [configData]
    );
    return initData;
};
