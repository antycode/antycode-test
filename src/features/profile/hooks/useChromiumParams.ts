import { useProfilesStore } from "../store";
import { Profile } from "../types";
import { useMemo } from "react";

export const useChromiumParams = (profile: Profile) => {

    const { configData } = useProfilesStore();

    const chromiumParams = useMemo(() => {
        if (configData && profile) {
            const args = [];

            profile?.user_agent && args.push(`--user-agent=${profile?.user_agent}`);

            const proxyProfile = profile?.profile_proxy_external_id &&
                configData?.proxies?.find((proxy: any) => proxy?.external_id === profile?.profile_proxy_external_id);
            const proxy = proxyProfile && `--proxy-server=${proxyProfile?.type}://localhost:${proxyProfile?.port}`;
            proxy && args.push(proxy);

            const platform = configData?.platforms?.find((platform: any) =>
                platform?.external_id === profile?.platform_external_id);
            (platform?.title === 'Windows') && args.push('--protected-platform=Win32');
            (platform?.title === 'MacOS') && args.push('--protected-platform=MacIntel');
            (platform?.title === 'Linux') && args.push('--protected-platform="Linux_x86_64');

            const processors = configData?.processors?.find((processor: any) =>
                processor?.external_id === profile?.profile_processor_external_id);
            processors && args.push(`--m-hardware-concurrency=${processors?.title}`);

            const languages = configData?.languages?.find((language: any) =>
                language?.external_id === profile?.profile_language_external_id);
            languages && args.push(`--m-language=${languages?.alias}`);

            const geolocation = profile?.profile_geolocation;
            geolocation?.latitude && args.push(`--m-geo-latitude=${geolocation?.latitude}`);
            geolocation?.longitude && args.push(`--m-geo-longitude=${geolocation?.longitude}`);
            geolocation?.precision && args.push(`--m-geo-accuracy=${geolocation?.precision}`);

            const screen = configData?.screens?.find((screen: any) =>
                screen?.external_id === profile?.profile_screen_external_id);
            screen && args.push(`--window-size=${screen?.alias}`);

            const flag = profile?.custom_flags;
            flag && args.push(flag);

            const webGlInfo = configData?.video_card?.find((webglInfo: any) =>
                webglInfo?.external_id === profile?.profile_webgl_info_external_id);
            webGlInfo && args.push(`--m-gl-render=${webGlInfo?.alias}`);

            const doNotTrack = profile?.is_do_not_track;
            doNotTrack && args.push('--m-donottrack=1');
            !doNotTrack && args.push('--m-donottrack=0');

            const timezone = configData?.timezone?.find((timezone: any) =>
                timezone?.external_id === profile?.profile_timezone_external_id);
            timezone && args.push(`--m-tz=${timezone?.utc}`);

            const clientRects = configData?.client_rects?.find((clientRects: any) =>
                clientRects?.external_id === profile?.profile_clientrects_external_id);
            clientRects && args.push(`--m-client-rect=${clientRects?.alias}`);

            const audioOptions = configData?.audio?.find((audioOption: any) =>
                audioOption?.external_id === profile?.profile_audio_external_id);
            audioOptions && args.push(`--m-audio-option=${audioOptions?.alias}`);

            const webrtc = configData?.webrtcs?.find((webrtc: any) =>
                webrtc?.external_id === profile?.profile_webrtc_external_id);
            (webrtc?.alias === 'off') && args.push('--m-mdv=0');
            (webrtc?.alias === 'off') && args.push('--m-mdao=0');
            (webrtc?.alias === 'off') && args.push('--m-mdai=0');
            (webrtc?.alias === 'real') && args.push('--m-webrtc=1');
            (webrtc?.alias === 'change') && args.push(`--m-webrtc-ip=${proxyProfile?.ip}`);

            const canvas = configData?.canvases?.find((canvas: any) =>
                canvas?.external_id === profile?.profile_canvas_external_id);
            (canvas?.alias === 'off') && args.push('--disable-accelerated-2d-canvas=true');
            (canvas?.alias === 'real') && args.push('--m-canvas=1');
            (canvas?.alias === 'noise') && args.push('--m-canvas=1');

            const media = profile?.profile_media;
            media?.microphone && args.push(`--m-mdai=${media?.microphone}`);
            media?.speaker && args.push(`--m-mdao=${media?.speaker}`);
            media?.camera && args.push(`--m-mdv=${media?.camera}`);

            args.push('--restore-last-session');
            args.push('--no-first-run');
            args.push('--hide-crash-restore-bubble');
            // args.push('--guest');
            return args;
        }
        return null;
    }, [configData, profile]);

    return chromiumParams;
}
