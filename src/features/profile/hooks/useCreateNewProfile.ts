export const useCreateNewProfileData = ({ newProfile, userAgent, paramsWhatHaveRandomOption, defaultValues, options, configData }: any) => {
    const getMedia = () => {
        if (paramsWhatHaveRandomOption.mediaOption == 0) {
            return  defaultValues.media;
        } else if (paramsWhatHaveRandomOption.mediaOption == 1) {
            return newProfile.media || null;
        } else if (paramsWhatHaveRandomOption.mediaOption == 2) {
            const getRandomNumber = () => Math.floor(Math.random() * 4);
            const mediaValues: any = {
                microphone: getRandomNumber(),
                speaker: getRandomNumber(),
                camera: getRandomNumber()
            };
            return mediaValues;
        }
    };

    const getScreen = () => {
        if (paramsWhatHaveRandomOption.screenOption == 0) {
            return defaultValues.screen_external_id;
        } else if (paramsWhatHaveRandomOption.screenOption == 1) {
            return newProfile.screen_external_id || null;
        } else if (paramsWhatHaveRandomOption.screenOption == 2) {
            if (options.profileScreenExternalOpt.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.profileScreenExternalOpt.length);
                return options.profileScreenExternalOpt[randomIndex].value;
            }
            return defaultValues.screen_external_id;
        }
    };

    const getRam = () => {
        if (paramsWhatHaveRandomOption.ramOption == 0) {
            return defaultValues.ram_external_id;
        } else if (paramsWhatHaveRandomOption.ramOption == 1) {
            return newProfile.ram_external_id || null;
        } else if (paramsWhatHaveRandomOption.ramOption == 2) {
            if (options.profileRamExternalOpt.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.profileRamExternalOpt.length);
                return options.profileRamExternalOpt[randomIndex].value;
            }
            return defaultValues.ram_external_id;
        }
    };

    const getProcessor = () => {
        if (paramsWhatHaveRandomOption.processorOption == 0) {
            return defaultValues.processor_external_id;
        } else if (paramsWhatHaveRandomOption.processorOption == 1) {
            return newProfile.processor_external_id || null;
        } else if (paramsWhatHaveRandomOption.processorOption == 2) {
            if (options.profileProcessorExternalOpt.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.profileProcessorExternalOpt.length);
                return options.profileProcessorExternalOpt[randomIndex].value;
            }
            return defaultValues.processor_external_id;
        }
    };

    const getWebglInfo = () => {
        if (paramsWhatHaveRandomOption.webglInfoOption == 0) {
            return defaultValues.webgl_info_external_id;
        } else if (paramsWhatHaveRandomOption.webglInfoOption == 1) {
            return newProfile.webgl_info_external_id || null;
        } else if (paramsWhatHaveRandomOption.webglInfoOption == 2) {
            if (options.profileWebglInfoChangingOpt.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.profileWebglInfoChangingOpt.length);
                return options.profileWebglInfoChangingOpt[randomIndex].value;
            }
            return defaultValues.webgl_info_external_id;
        }
    };

    const getGeo = () => {
        if (paramsWhatHaveRandomOption.geoOption == 0) {
            return defaultValues.geolocation;
        } else if (paramsWhatHaveRandomOption.geoOption == 1) {
            return newProfile.geolocation || defaultValues.geolocation;
        }
    };

    const profile = {
        title: '',
        profile_type: '',
        cookies: '',
        tags: [],
        user_agent: '',
        login: '',
        password: '',
        token: '',
        custom_flags: '',
        note: '',
        json: "{}",
        is_do_not_track: false,
        ports: [],
        profile_media: null,
        profile_geolocation: null,
        profile_platform_external_id: '',
        profile_proxy_external_id: null,
        profile_webrtc_external_id: '',
        profile_canvas_external_id: '',
        profile_webgl_external_id: '',
        profile_webgl_info_external_id: null,
        profile_clientrects_external_id: '',
        profile_audio_external_id: '',
        profile_timezone_external_id: '',
        profile_language_external_id: null,
        profile_processor_external_id: null,
        profile_ram_external_id: null,
        profile_screen_external_id: null,
        profile_status_external_id: '',
        folders: []
    };
    if (newProfile) {
        profile.profile_media = getMedia();
        profile.profile_screen_external_id = getScreen();
        profile.profile_ram_external_id = getRam();
        profile.profile_processor_external_id = getProcessor();
        profile.profile_webgl_info_external_id = getWebglInfo();
        profile.profile_geolocation = getGeo();

        profile.title = newProfile.title || '';
        profile.cookies = newProfile.cookies || '';
        profile.profile_type = newProfile.profile_type || '';
        profile.tags = newProfile.tags || [];
        profile.user_agent = userAgent;
        profile.login = newProfile.login || '';
        profile.password = newProfile.password || '';
        profile.token = newProfile.token || '';
        profile.custom_flags = newProfile.custom_flags || '';
        profile.note = newProfile.note || '';
        profile.json = newProfile.json || "{}";
        profile.is_do_not_track = newProfile.is_do_not_track;
        profile.ports = newProfile.ports || [];
        profile.profile_platform_external_id = newProfile.platform_external_id || '';
        profile.profile_proxy_external_id = newProfile.proxy_external_id || null;
        profile.profile_webrtc_external_id = newProfile.webrtc_external_id || '';
        profile.profile_canvas_external_id = newProfile.canvas_external_id || '';
        profile.profile_webgl_external_id = newProfile.webgl_external_id || '';
        profile.profile_clientrects_external_id = newProfile.clientrects_external_id || '';
        profile.profile_audio_external_id = newProfile.audio_external_id || '';
        profile.profile_timezone_external_id = newProfile.timezone_external_id || configData?.timezone?.find((i: any) => i.zone === 'Europe/Kiev').external_id;
        profile.profile_language_external_id = newProfile.language_external_id || null;
        profile.profile_status_external_id = newProfile.status_external_id || configData?.statuses?.find((i: any) => i.alias === 'without_status').external_id;
        profile.folders = newProfile.folders;
    };
    console.log('newProfile', profile);
    return profile;
};
