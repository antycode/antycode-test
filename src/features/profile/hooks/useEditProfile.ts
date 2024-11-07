export const useEditProfileData = ({ editProfile, userAgent, foundProfile, paramsWhatHaveRandomOption, defaultValuesForEditProfile, options }: any) => {
    const getMedia = () => {
        if (paramsWhatHaveRandomOption.mediaOption == 0) {
            return  defaultValuesForEditProfile.media;
        } else if (paramsWhatHaveRandomOption.mediaOption == 1) {
            return editProfile.media || defaultValuesForEditProfile.media;
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
            return defaultValuesForEditProfile.screen_external_id;
        } else if (paramsWhatHaveRandomOption.screenOption == 1) {
            return editProfile.screen_external_id || defaultValuesForEditProfile.screen_external_id;
        } else if (paramsWhatHaveRandomOption.screenOption == 2) {
            if (options.profileScreenExternalOpt.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.profileScreenExternalOpt.length);
                return options.profileScreenExternalOpt[randomIndex].value;
            }
            return defaultValuesForEditProfile.screen_external_id;
        }
    };

    const getRam = () => {
        if (paramsWhatHaveRandomOption.ramOption == 0) {
            return defaultValuesForEditProfile.ram_external_id;
        } else if (paramsWhatHaveRandomOption.ramOption == 1) {
            return editProfile.ram_external_id || defaultValuesForEditProfile.ram_external_id;
        } else if (paramsWhatHaveRandomOption.ramOption == 2) {
            if (options.profileRamExternalOpt.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.profileRamExternalOpt.length);
                return options.profileRamExternalOpt[randomIndex].value;
            }
            return defaultValuesForEditProfile.ram_external_id;
        }
    };

    const getProcessor = () => {
        if (paramsWhatHaveRandomOption.processorOption == 0) {
            return defaultValuesForEditProfile.processor_external_id;
        } else if (paramsWhatHaveRandomOption.processorOption == 1) {
            return editProfile.processor_external_id || defaultValuesForEditProfile.processor_external_id;
        } else if (paramsWhatHaveRandomOption.processorOption == 2) {
            if (options.profileProcessorExternalOpt.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.profileProcessorExternalOpt.length);
                return options.profileProcessorExternalOpt[randomIndex].value;
            }
            return defaultValuesForEditProfile.processor_external_id;
        }
    };

    const getWebglInfo = () => {
        if (paramsWhatHaveRandomOption.webglInfoOption == 0) {
            return defaultValuesForEditProfile.webgl_info_external_id;
        } else if (paramsWhatHaveRandomOption.webglInfoOption == 1) {
            return editProfile.webgl_info_external_id || defaultValuesForEditProfile.webgl_info_external_id;
        } else if (paramsWhatHaveRandomOption.webglInfoOption == 2) {
            if (options.profileWebglInfoChangingOpt.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.profileWebglInfoChangingOpt.length);
                return options.profileWebglInfoChangingOpt[randomIndex].value;
            }
            return defaultValuesForEditProfile.webgl_info_external_id;
        }
    };

    const getGeo = () => {
        if (paramsWhatHaveRandomOption.geoOption == 0) {
            return defaultValuesForEditProfile.geolocation;
        } else if (paramsWhatHaveRandomOption.geoOption == 1) {
            return editProfile.geolocation || defaultValuesForEditProfile.geolocation;
        }
    };

    const getTimezone = () => {
        if (paramsWhatHaveRandomOption.timezoneOption == 0) {
            return defaultValuesForEditProfile.timezone_external_id;
        } else if (paramsWhatHaveRandomOption.timezoneOption == 1) {
            return editProfile.timezone_external_id || defaultValuesForEditProfile.timezone_external_id;
        }
    };

    const profile = {
        title: '',
        cookies: '',
        profile_type:'',
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
        profile_webrtc_external_id: null,
        profile_canvas_external_id: null,
        profile_webgl_external_id: '',
        profile_webgl_info_external_id: null,
        profile_clientrects_external_id: '',
        profile_audio_external_id: '',
        profile_timezone_external_id: null,
        profile_language_external_id: null,
        profile_processor_external_id: null,
        profile_ram_external_id: null,
        profile_screen_external_id: null,
        profile_status_external_id: '',
        folders: []
    };
    if (editProfile) {
        profile.profile_media = getMedia();
        profile.profile_screen_external_id = getScreen();
        profile.profile_ram_external_id = getRam();
        profile.profile_processor_external_id = getProcessor();
        profile.profile_webgl_info_external_id = getWebglInfo();
        profile.profile_geolocation = getGeo();
        profile.profile_timezone_external_id = getTimezone();

        profile.title = editProfile.title || foundProfile.title;
        profile.profile_type = editProfile.profile_type || foundProfile.profile_type;
        profile.cookies = editProfile.cookies || foundProfile.cookies;
        profile.tags = editProfile.tags || foundProfile.tags;
        profile.user_agent = userAgent;
        profile.login = editProfile.login || foundProfile.login;
        profile.password = editProfile.password || foundProfile.password;
        profile.token = editProfile.token || foundProfile.token ? foundProfile.token : '';
        profile.custom_flags = editProfile.custom_flags || foundProfile.custom_flags;
        profile.note = editProfile.note || foundProfile.note;
        profile.json = editProfile.json || foundProfile.json;
        profile.is_do_not_track = editProfile.is_do_not_track || foundProfile.is_do_not_track;
        profile.ports = editProfile.ports || foundProfile.ports;
        profile.profile_platform_external_id = editProfile.platform_external_id || foundProfile.platform.value;
        profile.profile_proxy_external_id = editProfile.proxy_external_id && editProfile.proxy_external_id || null;
        profile.profile_webrtc_external_id = editProfile.webrtc_external_id || foundProfile.webrtc.value;
        profile.profile_canvas_external_id = editProfile.canvas_external_id || foundProfile.canvas.value;
        profile.profile_webgl_external_id = editProfile.webgl_external_id || foundProfile.webgl.value;
        profile.profile_clientrects_external_id = editProfile.clientrects_external_id || foundProfile.client_rect.value;
        profile.profile_audio_external_id = editProfile.audio_external_id || foundProfile.audio.value;
        profile.profile_language_external_id = editProfile.language_external_id || foundProfile.language.value;
        profile.profile_status_external_id = editProfile.status_external_id || foundProfile.status.value;
        profile.folders = editProfile.folders;

        console.log('editProfile', profile);
    };
    return profile;
};
